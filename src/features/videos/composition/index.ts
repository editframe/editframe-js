import {
  ApiInterface,
  AudioLayer,
  CompositionFile,
  CompositionInterface,
  CompositionMethod,
  CompositionOptions,
  EncodeResponse,
  FilterLayer,
  FormDataInterface,
  HTMLLayer,
  IdentifiedLayer,
  ImageLayer,
  LayerAttribute,
  LayerAttributeValue,
  LayerType,
  LottieLayer,
  Metadata,
  Routes,
  Size,
  TextLayer,
  TypedLayer,
  VideoLayer,
  WaveformLayer,
} from 'constant'
import { Audio } from 'features/videos/audio'
import { Filter } from 'features/videos/filter'
import { HTML } from 'features/videos/html'
import { Lottie } from 'features/videos/lottie'
import { Text } from 'features/videos/text'
import { Video } from 'features/videos/video'
import { VisualMedia } from 'features/videos/visualMedia'
import { CompositionErrorText, MediaErrorText } from 'strings'
import {
  escapeHTML,
  formDataKey,
  isEncodeResponse,
  uuid,
  validateAddAudio,
  validateAddFilter,
  validateAddHTML,
  validateAddImage,
  validateAddLottie,
  validateAddText,
  validateAddVideo,
  validateAddWaveform,
  validateApiData,
  validateCompositionOptions,
  validatePresenceOf,
  withValidation,
} from 'utils'

export class Composition implements CompositionInterface {
  private _api: ApiInterface
  private _files: {
    file: CompositionFile
    id: string
  }[]
  private _formData: FormDataInterface
  private _layers: IdentifiedLayer[] = []
  private _options: CompositionOptions

  constructor({
    api,
    formData,
    options,
  }: {
    api: ApiInterface
    formData: FormDataInterface
    options: CompositionOptions
  }) {
    this._api = api
    this._files = []
    this._formData = formData
    this._options = options

    withValidation<void>(() => validateCompositionOptions(this._options))
  }

  get [CompositionMethod.backgroundColor](): string {
    return this._options.backgroundColor
  }

  get [CompositionMethod.dimensions](): Size {
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

  public [CompositionMethod.addAudio](file: CompositionFile, options: AudioLayer = {}): Audio | undefined {
    return withValidation<Audio>(
      () => {
        validatePresenceOf(file, MediaErrorText.invalidFileSource)
        validatePresenceOf(options, CompositionErrorText.optionsRequired)
        validateAddAudio(options)
      },
      () => {
        const { id } = this._addLayer({ type: LayerType.audio, ...options })

        this._files.push({ file, id })

        return new Audio({ composition: this, id })
      }
    )
  }

  public [CompositionMethod.addFilter](options: FilterLayer): Filter | undefined {
    return withValidation<Filter>(
      () => {
        validatePresenceOf(options, CompositionErrorText.optionsRequired)
        validatePresenceOf(options.filter, CompositionErrorText.filterRequired)
        validateAddFilter(options)
      },
      () => {
        const { id } = this._addLayer({ ...options, type: LayerType.filter })

        return new Filter({ composition: this, id })
      }
    )
  }

  public [CompositionMethod.addHTML](options: HTMLLayer): HTML | undefined {
    return withValidation<HTML>(
      () => {
        validatePresenceOf(options, CompositionErrorText.optionsRequired)
        validateAddHTML(options)
      },
      () => {
        const {
          height,
          html: { htmlPage, withTransparentBackground },
          width,
        } = options
        const transformedOptions: HTMLLayer = { ...options }

        if (htmlPage) {
          transformedOptions.html.htmlPage = escapeHTML(htmlPage)
        }

        if (!height) {
          transformedOptions.height = this._options.dimensions.height
        }

        if (!width) {
          transformedOptions.width = this._options.dimensions.width
        }

        if (withTransparentBackground === undefined) {
          transformedOptions.html.withTransparentBackground = false
        }

        const { id } = this._addLayer({ ...transformedOptions, type: LayerType.html })

        return new HTML({ composition: this, id })
      }
    )
  }

  public [CompositionMethod.addImage](file: CompositionFile, options: ImageLayer): Video | undefined {
    return withValidation<Video>(
      () => {
        validatePresenceOf(file, MediaErrorText.invalidFileSource)
        validatePresenceOf(options, CompositionErrorText.optionsRequired)
        validateAddImage(options)
      },
      () => {
        const { id } = this._addLayer({ type: LayerType.image, ...options })

        this._files.push({ file, id })

        return new Video({ composition: this, id })
      }
    )
  }

  public [CompositionMethod.addLottie](options: LottieLayer): Lottie | undefined {
    return withValidation<Lottie>(
      () => {
        validatePresenceOf(options, CompositionErrorText.optionsRequired)
        validatePresenceOf(options.data, CompositionErrorText.dataRequired)
        validateAddLottie(options)
      },
      () => {
        const { id } = this._addLayer({ type: LayerType.lottie, ...options })

        return new Lottie({ composition: this, id })
      }
    )
  }

  public [CompositionMethod.addText](options: TextLayer): Text | undefined {
    return withValidation<Text>(
      () => {
        validatePresenceOf(options, CompositionErrorText.optionsRequired)
        validatePresenceOf(options.text, CompositionErrorText.textRequired)
        validateAddText(options)
      },
      () => {
        const { id } = this._addLayer({ type: LayerType.text, ...options })

        return new Text({ composition: this, id })
      }
    )
  }

  public [CompositionMethod.addVideo](file: CompositionFile, options: VideoLayer = {}): Video | undefined {
    return withValidation<Video>(
      () => {
        validatePresenceOf(file, MediaErrorText.invalidFileSource)
        validatePresenceOf(options, CompositionErrorText.optionsRequired)
        validateAddVideo(options)
      },
      () => {
        const { id } = this._addLayer({ type: LayerType.video, ...options })

        this._files.push({ file, id })

        return new Video({ composition: this, id })
      }
    )
  }

  public [CompositionMethod.addWaveform](options: WaveformLayer = {}, file?: CompositionFile): VisualMedia | undefined {
    return withValidation<VisualMedia>(
      () => {
        validatePresenceOf(options, CompositionErrorText.optionsRequired)
        validateAddWaveform(options)
      },
      () => {
        const { id } = this._addLayer({ type: LayerType.waveform, ...options })

        if (file) {
          this._files.push({ file, id })
        }

        return new VisualMedia({ composition: this, id })
      }
    )
  }

  public async [CompositionMethod.encode](): Promise<EncodeResponse> {
    this._generateConfig()

    try {
      const data = await this._api.post({ data: this._formData, isForm: true, url: Routes.videos.create })

      return validateApiData<EncodeResponse>(data, {
        invalidDataError: CompositionErrorText.malformedEncodingResponse,
        validate: isEncodeResponse,
      })
    } catch (error) {
      console.error(CompositionErrorText.errorEncoding(error.message))

      return undefined
    }
  }

  private _generateConfig(): void {
    this._files.forEach(({ file, id }) => this._formData.append(formDataKey(file, id), file))
    this._formData.append(
      'config',
      JSON.stringify({
        ...this._options,
        layers: this._layers,
      })
    )
  }

  private _addLayer(options: TypedLayer): IdentifiedLayer {
    const newLayer: IdentifiedLayer = { id: uuid(), ...options }

    this._layers.push(newLayer)

    return newLayer
  }

  [CompositionMethod.updateLayerAttribute](
    id: string,
    layerAttribute: LayerAttribute,
    value: LayerAttributeValue
  ): void {
    const newLayer = { ...this.layer(id) }

    newLayer[layerAttribute] = value

    this.setLayer(id, newLayer)
  }

  private [CompositionMethod.setLayer](id: string, newLayer: IdentifiedLayer): void {
    const newLayers = [...this.layers]
    const layerIndex = newLayers.findIndex((layer) => layer.id === id)

    newLayers[layerIndex] = newLayer

    this._layers = newLayers
  }
}
