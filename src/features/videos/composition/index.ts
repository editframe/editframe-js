import FormData from 'form-data'
import Echo from 'laravel-echo'
import { Readable } from 'node:stream'
import open from 'open'
import ora from 'ora'
import prettyMilliseconds from 'pretty-ms'
import Pusher from 'pusher-js'
;(global as any).Pusher = Pusher

import {
  ApiAudioMetadata,
  ApiImageMetadata,
  ApiInterface,
  ApiMetadataTypes,
  ApiVideo,
  ApiVideoMetadata,
  ApiVideoMetadataFormDataKey,
  ApiVideoMetadataKey,
  ApiVideoMetadataType,
  AudioKey,
  AudioLayer,
  AudioLayerConfig,
  AudioOptions,
  ChildKey,
  CompositionFile,
  CompositionInterface,
  CompositionMethod,
  CompositionOptions,
  Dimensions,
  EncodeOptions,
  EncodeResponse,
  FilterKey,
  FilterLayer,
  FilterOptionKey,
  Filters,
  FormDataInterface,
  HtmlKey,
  HtmlLayer,
  HtmlLayerConfig,
  HtmlOptions,
  IdentifiedFile,
  IdentifiedLayer,
  ImageLayer,
  ImageLayerConfig,
  LayerAttributeValue,
  LayerConfigs,
  LayerKey,
  LayerOptions,
  LayerType,
  LottieKey,
  LottieLayer,
  LottieLayerConfig,
  LottieOptions,
  Metadata,
  Routes,
  SequenceLayer,
  SequenceLayerConfig,
  SequenceableLayer,
  SubtitlesKey,
  SubtitlesLayer,
  SubtitlesLayerConfig,
  SubtitlesOptions,
  TextKey,
  TextLayer,
  TextLayerConfig,
  TextOptions,
  TypedLayer,
  VideoLayer,
  VideoLayerConfig,
  WaveformKey,
  WaveformLayer,
  WaveformLayerConfig,
  WaveformOptions,
} from 'constant'
import { Videos } from 'features'
import { Audio } from 'features/videos/layers/audio'
import { Filter } from 'features/videos/layers/filter'
import { Html } from 'features/videos/layers/html'
import { Image } from 'features/videos/layers/image'
import { Lottie } from 'features/videos/layers/lottie'
import { Sequence } from 'features/videos/layers/sequence'
import { Subtitles } from 'features/videos/layers/subtitles'
import { Text } from 'features/videos/layers/text'
import { Video } from 'features/videos/layers/video'
import { Waveform } from 'features/videos/layers/waveform'
import { CompositionErrorText } from 'strings'
import {
  createReadStream,
  createTemporaryDirectory,
  deepClone,
  deepMerge,
  formDataKey,
  getExtension,
  isAudioExtension,
  isEncodeResponse,
  isVideoExtension,
  metadataValidatorsByType,
  prepareFormData,
  preparePreview,
  processCompositionFile,
  processCrossfades,
  removeDirectory,
  sanitizeHtml,
  setLayerDefaults,
  translateColor,
  urlOrFile,
  uuid,
  validateApiData,
  validateAudioLayer,
  validateCompositionFile,
  validateCompositionOptions,
  validateFilterLayer,
  validateHtmlLayer,
  validateImageLayer,
  validateLottieLayer,
  validateOptions,
  validatePresenceOf,
  validateSequenceLayer,
  validateSubtitlesLayer,
  validateTextLayer,
  validateVideoLayer,
  validateWaveformLayer,
  withValidation,
  withValidationAsync,
} from 'utils'

export class Composition implements CompositionInterface {
  private _api: ApiInterface
  private _develop: boolean
  private _encodeOptions?: EncodeOptions
  private _files: IdentifiedFile[]
  private _formData: FormDataInterface
  private _host: string
  private _layers: IdentifiedLayer[] = []
  private _options: CompositionOptions
  private _temporaryDirectory: string
  private _videos: Videos

  constructor({
    api,
    develop = false,
    formData,
    host,
    options,
    temporaryDirectory,
    videos,
  }: {
    api: ApiInterface
    develop?: boolean
    formData: FormDataInterface
    host: string
    options: CompositionOptions
    temporaryDirectory?: string
    videos: Videos
  }) {
    this._api = api
    this._develop = develop
    this._files = []
    this._formData = formData
    this._host = host
    this._options = options
    this._temporaryDirectory = temporaryDirectory ?? createTemporaryDirectory()
    this._videos = videos

    withValidation<void>(() => validateCompositionOptions(this._options))
  }

  get [CompositionMethod.backgroundColor](): string {
    return this._options.backgroundColor
  }

  get [CompositionMethod.dimensions](): Dimensions {
    return this._options.dimensions
  }

  get [CompositionMethod.duration](): number {
    return this._options.duration
  }

  get [CompositionMethod.metadata](): Metadata {
    return this._options.metadata
  }

  get [CompositionMethod.layers](): IdentifiedLayer[] {
    return this._layers
  }

  public [CompositionMethod.layer](id: string): IdentifiedLayer {
    return this._layers.find((layer) => layer.id && layer.id === id)
  }

  public [CompositionMethod.getLayerAttribute]<AttributeValue>({
    childKey,
    id,
    layerKey,
  }: {
    childKey?: ChildKey
    id: string
    layerKey: LayerKey
  }): AttributeValue {
    const layerAttribute = this._layers.find((layer) => layer.id === id)[layerKey]

    return childKey ? layerAttribute[childKey] : layerAttribute
  }

  public [CompositionMethod.setLayerAttribute]({
    childKey,
    id,
    layerKey,
    value,
  }: {
    childKey?: ChildKey
    id: string
    layerKey: LayerKey
    value: LayerAttributeValue
  }): void {
    const newLayer = deepClone(this.layer(id))

    if (childKey) {
      newLayer[layerKey][childKey] = value
    } else {
      newLayer[layerKey] = value
    }

    this.setLayer(id, newLayer)
  }

  public async [CompositionMethod.addAudio](
    file: CompositionFile,
    options?: AudioOptions,
    layerConfig?: AudioLayerConfig
  ): Promise<Audio> {
    const audioLayer: AudioLayer = this._setLayerDefaults<AudioLayer>({
      layerConfig,
      layerType: LayerType.audio,
      options,
    })

    return withValidationAsync<Audio>(
      () => {
        validateCompositionFile(CompositionMethod.addAudio, file)
        validateOptions(CompositionMethod.addAudio, AudioKey, options)
        validateAudioLayer(CompositionMethod.addAudio, audioLayer)
      },
      async () => {
        const { id } = this._addLayer({ type: LayerType.audio, ...audioLayer })
        const { readStream } = await processCompositionFile(file, this._temporaryDirectory)

        this._files.push({ file: readStream, id })

        return new Audio({ composition: this, id })
      }
    )
  }

  public [CompositionMethod.addFilter]<FilterName extends keyof Filters>(options: {
    name: FilterName
    options?: Filters[FilterName]
  }): Filter | undefined {
    let filterLayer: FilterLayer = this._setLayerDefaults<FilterLayer>({
      layerType: LayerType.filter,
      options,
    })

    return withValidation<Filter>(
      () => {
        validatePresenceOf(options, CompositionErrorText.optionsRequired)
        validateOptions(CompositionMethod.addFilter, FilterKey, options)
        validateFilterLayer(CompositionMethod.addFilter, filterLayer)
      },
      () => {
        if (FilterOptionKey.color in options) {
          const transformedLayer: FilterLayer = deepClone(filterLayer)

          if (FilterOptionKey.color in transformedLayer.filter.options) {
            transformedLayer.filter.options.color = translateColor(transformedLayer.filter.options.color)
          }

          filterLayer = transformedLayer
        }

        const { id } = this._addLayer({ type: LayerType.filter, ...filterLayer })

        return new Filter({ composition: this, id })
      }
    )
  }

  public async [CompositionMethod.addHtml](options: HtmlOptions, layerConfig?: HtmlLayerConfig): Promise<Html> {
    const htmlLayer: HtmlLayer = this._setLayerDefaults<HtmlLayer>({
      layerConfig,
      layerType: LayerType.html,
      options,
    })

    return await withValidationAsync<Html>(
      () => {
        validatePresenceOf(options, CompositionErrorText.optionsRequired)
        validateOptions(CompositionMethod.addHtml, HtmlKey, options)
        validateHtmlLayer(CompositionMethod.addHtml, htmlLayer)
      },
      async () => {
        const {
          html: { page },
        } = htmlLayer
        const transformedLayer: HtmlLayer = deepClone(htmlLayer)

        if (page) {
          transformedLayer.html.page = await sanitizeHtml(page)
        }

        const { id } = this._addLayer({ type: LayerType.html, ...transformedLayer })

        return new Html({ composition: this, id })
      }
    )
  }

  public async [CompositionMethod.addImage](file: CompositionFile, layerConfig?: ImageLayerConfig): Promise<Image> {
    const imageLayer: ImageLayer = this._setLayerDefaults<ImageLayer>({ layerConfig, layerType: LayerType.image })

    return withValidationAsync<Image>(
      () => {
        validateCompositionFile(CompositionMethod.addImage, file)
        validateImageLayer(CompositionMethod.addImage, imageLayer)
      },
      async () => {
        const { id } = this._addLayer({ type: LayerType.image, ...imageLayer })
        const { readStream } = await processCompositionFile(file, this._temporaryDirectory)

        this._files.push({ file: readStream, id })

        return new Image({ composition: this, id })
      }
    )
  }

  public [CompositionMethod.addLottie](options: LottieOptions, layerConfig?: LottieLayerConfig): Lottie | undefined {
    const lottieLayer: LottieLayer = this._setLayerDefaults<LottieLayer>({
      layerConfig,
      layerType: LayerType.lottie,
      options,
    })

    return withValidation<Lottie>(
      () => {
        validatePresenceOf(options, CompositionErrorText.optionsRequired)
        validateOptions(CompositionMethod.addLottie, LottieKey, options)
        validateLottieLayer(CompositionMethod.addLottie, lottieLayer)
      },
      () => {
        const { id } = this._addLayer({ type: LayerType.lottie, ...lottieLayer })

        return new Lottie({ composition: this, id })
      }
    )
  }

  public async [CompositionMethod.addSequence](
    layers: SequenceableLayer[],
    layerConfig: SequenceLayerConfig = { timeline: { start: 0 } }
  ): Promise<Sequence> {
    const sequenceLayer: SequenceLayer = this._setLayerDefaults<SequenceLayer>({
      layerConfig,
      layerType: LayerType.sequence,
    })

    return await withValidationAsync<any>(
      () => {
        validateSequenceLayer(CompositionMethod.addSequence, sequenceLayer)
      },
      async () => {
        const layersWithDurationAndFilepath = await Promise.all(
          layers.map(async (layer) => {
            const layerFile = this._file(layer.id)
            let metadata: ApiAudioMetadata | ApiImageMetadata | ApiVideoMetadata
            let path: string

            if (layerFile) {
              const { filepath, readStream } = await processCompositionFile(layerFile.file, this._temporaryDirectory)
              const extension = getExtension(filepath)

              path = filepath

              if (isVideoExtension(extension)) {
                metadata = await this._getMetadata(readStream, ApiVideoMetadataType.video)
              } else if (isAudioExtension(extension)) {
                metadata = await this._getMetadata(readStream, ApiVideoMetadataType.audio)
              }
            }

            return {
              duration: metadata && ApiVideoMetadataKey.duration in metadata ? metadata.duration : undefined,
              filepath: path,
              layer,
            }
          })
        )

        let currentTime = sequenceLayer.timeline.start || 0

        layersWithDurationAndFilepath.map(({ duration, filepath, layer }, i) => {
          const { type } = layer
          const previousLayer = i > 0 ? layersWithDurationAndFilepath[i - 1].layer : undefined
          const nextLayer =
            i < layersWithDurationAndFilepath.length - 1 ? layersWithDurationAndFilepath[i + 1].layer : undefined

          currentTime = processCrossfades(currentTime, layer, previousLayer, nextLayer)

          if (filepath) {
            this._setFile(layer.id, createReadStream(filepath))
          }

          if (LayerKey.trim in layer) {
            const { end, start = 0 } = layer.trim

            if (end) {
              currentTime += end - start
            } else if (duration) {
              currentTime += duration - start
            } else {
              throw new Error(CompositionErrorText.trimEndRequired(type))
            }
          } else if (duration) {
            currentTime = duration
          } else {
            throw new Error(CompositionErrorText.trimEndRequired(type))
          }
        })

        this._setDuration(currentTime)

        const { id } = this._addLayer({ type: LayerType.sequence, ...sequenceLayer })

        return new Sequence({ composition: this, id, layers })
      }
    )
  }

  public async [CompositionMethod.addSubtitles](
    file: CompositionFile,
    options?: SubtitlesOptions,
    layerConfig?: SubtitlesLayerConfig
  ): Promise<Subtitles> {
    const subtitlesLayer: SubtitlesLayer = this._setLayerDefaults<SubtitlesLayer>({
      layerConfig,
      layerType: LayerType.subtitles,
      options,
    })

    return withValidationAsync<Subtitles>(
      () => {
        validateCompositionFile(CompositionMethod.addSubtitles, file)
        validateOptions(CompositionMethod.addSubtitles, SubtitlesKey, options)
        validateSubtitlesLayer(CompositionMethod.addSubtitles, subtitlesLayer)
      },
      async () => {
        const {
          subtitles: { backgroundColor, color },
        } = subtitlesLayer

        const transformedLayer: SubtitlesLayer = deepClone(subtitlesLayer)

        transformedLayer.subtitles.backgroundColor = translateColor(backgroundColor)
        transformedLayer.subtitles.color = translateColor(color)

        const { id } = this._addLayer({ type: LayerType.subtitles, ...transformedLayer })
        const { readStream } = await processCompositionFile(file, this._temporaryDirectory)

        this._files.push({ file: readStream, id })

        return new Subtitles({ composition: this, id })
      }
    )
  }

  public [CompositionMethod.addText](options: TextOptions, layerConfig?: TextLayerConfig): Text | undefined {
    const textLayer: TextLayer = this._setLayerDefaults<TextLayer>({
      layerConfig,
      layerType: LayerType.text,
      options,
    })

    return withValidation<Text>(
      () => {
        validatePresenceOf(options, CompositionErrorText.optionsRequired)
        validatePresenceOf(options.text, CompositionErrorText.textRequired)
        validateOptions(CompositionMethod.addText, TextKey, options)
        validateTextLayer(CompositionMethod.addText, textLayer)
      },
      () => {
        const {
          text: { backgroundColor, color },
        } = textLayer
        const transformedLayer: TextLayer = deepClone(textLayer)

        transformedLayer.text.backgroundColor = translateColor(backgroundColor)
        transformedLayer.text.color = translateColor(color)

        const { id } = this._addLayer({ type: LayerType.text, ...transformedLayer })

        return new Text({ composition: this, id })
      }
    )
  }

  public async [CompositionMethod.addVideo](file: CompositionFile, layerConfig?: VideoLayerConfig): Promise<Video> {
    const videoLayer: VideoLayer = this._setLayerDefaults<VideoLayer>({ layerConfig, layerType: LayerType.video })

    return withValidationAsync<Video>(
      () => {
        validateCompositionFile(CompositionMethod.addVideo, file)
        validateVideoLayer(CompositionMethod.addVideo, videoLayer)
      },
      async () => {
        const { id } = this._addLayer({ type: LayerType.video, ...videoLayer })
        const { readStream } = await processCompositionFile(file, this._temporaryDirectory)

        this._files.push({ file: readStream, id })

        return new Video({ composition: this, id })
      }
    )
  }

  public async [CompositionMethod.addWaveform](
    file?: CompositionFile,
    options?: WaveformOptions,
    layerConfig?: WaveformLayerConfig
  ): Promise<Waveform> {
    const waveformLayer: WaveformLayer = this._setLayerDefaults<WaveformLayer>({
      layerConfig,
      layerType: LayerType.waveform,
      options,
    })

    return withValidationAsync<Waveform>(
      () => {
        validateOptions(CompositionMethod.addWaveform, WaveformKey, options)
        validateWaveformLayer(CompositionMethod.addWaveform, waveformLayer)
        if (file) {
          validateCompositionFile(CompositionMethod.addWaveform, file)
        }
      },
      async () => {
        const {
          waveform: { backgroundColor, color },
        } = waveformLayer

        const transformedLayer: WaveformLayer = deepClone(waveformLayer)

        transformedLayer.waveform.backgroundColor = translateColor(backgroundColor)
        transformedLayer.waveform.color = translateColor(color)

        const { id } = this._addLayer({ type: LayerType.waveform, ...transformedLayer })

        if (file) {
          const { readStream } = await processCompositionFile(file, this._temporaryDirectory)

          this._files.push({ file: readStream, id })
        }

        return new Waveform({ composition: this, id })
      }
    )
  }

  public async [CompositionMethod.encode](encodeOptions?: EncodeOptions): Promise<EncodeResponse> {
    this._encodeOptions = encodeOptions

    try {
      if (!this.duration) {
        throw new Error(CompositionErrorText.durationRequired)
      }

      this._generateConfig()

      const data = await this._api.post({ data: this._formData, isForm: true, url: Routes.videos.create })

      return validateApiData<EncodeResponse>(data, {
        invalidDataError: CompositionErrorText.malformedEncodingResponse,
        validate: isEncodeResponse,
      })
    } catch (error) {
      console.error(CompositionErrorText.errorEncoding(error.message))

      return undefined
    } finally {
      removeDirectory(this._temporaryDirectory)
    }
  }

  public async [CompositionMethod.encodeSync](encodeOptions?: EncodeOptions): Promise<ApiVideo> {
    let encodeResponse: EncodeResponse
    let createSpinner: ora.Ora
    let encodingSpinner: ora.Ora

    const { wsUrl } = this

    const echo = new Echo({
      authorizer: (channel: any) => ({
        authorize: (socketId: string, callback: any) => {
          const authPayload = new FormData()
          const authUrl = new URL(this._host)

          authUrl.pathname = Routes.ws.auth

          authPayload.append('channel_name', channel.name)
          authPayload.append('socket_id', socketId)

          this._api
            .post({
              data: authPayload,
              isForm: true,
              url: authUrl.toString(),
            })
            .then((response: any) => {
              callback(false, response)
            })
            .catch((error) => {
              callback(true, error)
            })
        },
      }),
      broadcaster: 'pusher',
      disableStats: true,
      forceTLS: true,
      host: wsUrl.hostname,
      key: 'key',
      wsHost: wsUrl.hostname,
      wsPort: 6001,
      wssHost: wsUrl.hostname,
      wssPort: 6001,
    })

    if (this._develop) {
      createSpinner = ora('Uploading video configuration and assets')
    }

    try {
      const requestStart = new Date()

      encodeResponse = await this.encode(encodeOptions)

      const requestEnd = new Date()

      if (this._develop) {
        createSpinner.succeed(`Assets uploaded in ${prettyMilliseconds(requestEnd.getTime() - requestStart.getTime())}`)
      }
    } catch (error) {
      if (this._develop) {
        createSpinner.fail('Upload failed')
      }

      throw error
    }

    const encodeStartTime = new Date()

    if (this._develop) {
      encodingSpinner = ora('Encoding video').start()
    }

    await new Promise<void>((resolve, reject) => {
      echo.private(`App.Models.Video.${encodeResponse.id}`).notification(async (notification: any) => {
        echo.disconnect()

        if (notification.type === 'video.encoded') {
          if (this._develop) {
            const encodeEndTime = new Date(notification.timestamp * 1000)
            const encodeDuration = prettyMilliseconds(encodeEndTime.getTime() - encodeStartTime.getTime())

            encodingSpinner.succeed(`Video encoded in ${encodeDuration}`)
            await open(notification.stream_url)
          }

          resolve()
        } else if (notification.type === 'video.failed') {
          const errorMessage = 'Video encoding failed'

          if (this._develop) {
            encodingSpinner.fail(errorMessage)
          }

          reject(new Error(errorMessage))
        }
      })
    })

    return this._videos.get({ id: encodeResponse.id })
  }

  public async [CompositionMethod.preview](): Promise<void> {
    await preparePreview(
      JSON.stringify({
        ...this._options,
        files: this._files,
        layers: this._layers,
        ...(process.env.EDITFRAME_WATERMARK === 'false' ? { shouldWatermark: false } : undefined),
      })
    )
  }

  private _addLayer(options: TypedLayer): IdentifiedLayer {
    const newLayer: IdentifiedLayer = deepMerge({ id: uuid() }, options)

    this._layers.push(newLayer)

    return newLayer
  }

  private _generateConfig(): void {
    this._files.forEach(({ file, id }) => this._formData.append(formDataKey(file, id), file))
    this._formData.append(
      'config',
      JSON.stringify({
        ...this._options,
        layers: this._layers.filter((layer) => layer.type !== LayerType.sequence),
        ...(process.env.EDITFRAME_WATERMARK === 'false' ? { shouldWatermark: false } : undefined),
      })
    )

    if (process.env.EDITFRAME_WORKFLOW_JOB_ID) {
      this._formData.append('workflowJobId', process.env.EDITFRAME_WORKFLOW_JOB_ID)
    }

    if (this._encodeOptions?.experimental) {
      this._formData.append('experimental', JSON.stringify(this._encodeOptions.experimental))
    }
  }

  private get wsUrl(): URL {
    const host = new URL(this._host)

    host.hostname = host.hostname.replace('api', 'ws')
    host.pathname = '' // just in case

    return host
  }

  private async [CompositionMethod.getMetadata](file: Readable, type: ApiVideoMetadataType): Promise<ApiMetadataTypes> {
    const formData = prepareFormData([
      [urlOrFile(file), file],
      [ApiVideoMetadataFormDataKey.type, type],
    ])

    const data = await this._api.post({ data: formData, isForm: true, url: Routes.metadata })

    return metadataValidatorsByType[type](data)
  }

  private _file(id: string): IdentifiedFile {
    return this._files.find((file) => file.id && file.id === id)
  }

  private [CompositionMethod.setDuration](duration: number): void {
    this._options.duration = duration
  }

  private [CompositionMethod.setFile](id: string, file: Readable): void {
    this._files.find((file) => file.id === id).file = file
  }

  private [CompositionMethod.setLayer](id: string, newLayer: IdentifiedLayer): void {
    const newLayers = deepClone(this.layers)
    const layerIndex = newLayers.findIndex((layer) => layer.id === id)

    newLayers[layerIndex] = newLayer

    this._layers = newLayers
  }

  private _setLayerDefaults<Layer>({
    layerConfig,
    layerType,
    options,
  }: {
    layerConfig?: LayerConfigs
    layerType: LayerType
    options?: LayerOptions
  }): Layer {
    return setLayerDefaults<Layer>(this._options.dimensions, layerType, options, layerConfig)
  }
}
