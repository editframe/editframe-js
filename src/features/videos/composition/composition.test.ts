import { PassThrough } from 'stream'

import {
  ApiInterface,
  AudioKey,
  CompositionMethod,
  CompositionOptions,
  FilterKey,
  FormDataInterface,
  FormatValue,
  HtmlKey,
  HtmlLayer,
  HtmlOptions,
  LayerKey,
  LayerType,
  LottieKey,
  Routes,
  SubtitlesKey,
  TextKey,
  TextLayer,
  TransitionType,
  WaveformKey,
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
import {
  mockApi,
  mockApiAudioMetadata,
  mockApiVideoMetadata,
  mockAudioLayerConfig,
  mockAudioOptions,
  mockCompositionOptions,
  mockEncodeResponse,
  mockFilterOptions,
  mockHtmlLayerConfig,
  mockHtmlOptions,
  mockImageLayerConfig,
  mockLottieLayerConfig,
  mockLottieOptions,
  mockSequenceLayerConfig,
  mockSubtitlesLayerConfig,
  mockSubtitlesOptions,
  mockTextLayerConfig,
  mockTextOptions,
  mockVideoLayerConfig,
  mockWaveformLayerConfig,
  mockWaveformOptions,
} from 'mocks'
import { CompositionErrorText } from 'strings'
import { deepMerge, makeDefaultTextLayer } from 'utils'
import * as FilesUtilsModule from 'utils/files'
import * as StringsUtilsModule from 'utils/strings'
import * as ValidationUtilsModule from 'utils/validation'
import * as CompositionValidationUtilsModule from 'utils/validation/composition'
import * as TransitionsValidationUtilsModule from 'utils/validation/layerConfigs/transitions'
import * as LayerValidationUtilsModule from 'utils/validation/layers'
import * as CompositionUtilsModule from 'utils/video/compositions'
import * as PreviewUtilsModule from 'utils/video/preview'

import { Composition } from './'

describe('Composition', () => {
  const host = 'host'
  const uuids = {
    [LayerType.audio]: '123456',
    [LayerType.group]: '678901',
    [LayerType.image]: '23456',
    [LayerType.video]: '345678',
    [LayerType.subtitles]: '456789',
    [LayerType.text]: '567890',
  }
  const filenames = {
    [LayerType.audio]: 'audio-filename.mp3',
    [LayerType.image]: 'image-filename.jpg',
    [LayerType.video]: 'video-filename.mp4',
    [LayerType.subtitles]: 'subtitles-filename.srt',
  }
  const readStreams = {
    [LayerType.audio]: new PassThrough(),
    [LayerType.image]: new PassThrough(),
    [LayerType.video]: new PassThrough(),
    [LayerType.subtitles]: new PassThrough(),
  }
  let formDataMock: FormDataInterface
  const temporaryDirectory = 'temporary-directory'
  const audioOptions = mockAudioOptions()
  const audioLayerConfig = mockAudioLayerConfig()
  const encodeResponse = mockEncodeResponse()
  const filterOptions = mockFilterOptions()
  const htmlLayerConfig = mockHtmlLayerConfig()
  const imageLayerConfig = mockImageLayerConfig()
  const lottieLayerConfig = mockLottieLayerConfig()
  const lottieOptions = mockLottieOptions()
  const options = mockCompositionOptions()
  const sequenceLayerConfig = mockSequenceLayerConfig()
  const subtitlesLayerConfig = mockSubtitlesLayerConfig()
  const subtitlesOptions = mockSubtitlesOptions()
  const textLayerConfig = mockTextLayerConfig()
  const textOptions = mockTextOptions()
  const videoLayerConfig = mockVideoLayerConfig()
  const waveformLayerConfig = mockWaveformLayerConfig()
  const waveformOptions = mockWaveformOptions()
  const uuidMock = '123456'
  const makeProcessedCompositionFile = (layerType: LayerType) => ({
    filepath: filenames[layerType],
    readStream: readStreams[layerType],
  })
  let htmlOptions: HtmlOptions
  let apiMock: ApiInterface
  let consoleErrorSpy: jest.SpyInstance
  let postMock: jest.Mock
  let preparePreviewSpy: jest.SpyInstance
  let processCompositionFileSpy: jest.SpyInstance
  let processCrossfadesSpy: jest.SpyInstance
  let processKenBurnsSpy: jest.SpyInstance
  let removeDirectorySpy: jest.SpyInstance
  let uuidSpy: jest.SpyInstance
  let validateAudioLayerSpy: jest.SpyInstance
  let validateFilterLayerSpy: jest.SpyInstance
  let validateGroupLayerSpy: jest.SpyInstance
  let validateHtmlLayerSpy: jest.SpyInstance
  let validateImageLayerSpy: jest.SpyInstance
  let validateLottieLayerSpy: jest.SpyInstance
  let validateOptionsSpy: jest.SpyInstance
  let validateSequenceLayerSpy: jest.SpyInstance
  let validateSubtitlesLayerSpy: jest.SpyInstance
  let validateTextLayerSpy: jest.SpyInstance
  let validateVideoLayerSpy: jest.SpyInstance
  let validateWaveformLayerSpy: jest.SpyInstance
  let validateCompositionFileSpy: jest.SpyInstance
  let validateCompositionOptionsSpy: jest.SpyInstance
  let validatePresenceOfSpy: jest.SpyInstance
  let validateTransitionsKeyframesSpy: jest.SpyInstance
  let composition: Composition

  const makeComposition = ({
    compositionOptions,
    customApiMock,
  }: { compositionOptions?: CompositionOptions; customApiMock?: ApiInterface } = {}) => {
    const api = customApiMock ?? apiMock

    return new Composition({
      api,
      formData: formDataMock,
      host,
      options: compositionOptions ? compositionOptions : { ...options },
      temporaryDirectory,
      videos: new Videos({ api, host }),
    })
  }

  afterEach(() => {
    jest.clearAllMocks()
  })

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    jest.spyOn(FilesUtilsModule, 'createReadStream').mockReturnValue(new PassThrough())
    postMock = jest.fn()
    apiMock = mockApi()
    formDataMock = { append: jest.fn() }
    uuidSpy = jest.spyOn(StringsUtilsModule, 'uuid').mockReturnValue(uuidMock)
    preparePreviewSpy = jest.spyOn(PreviewUtilsModule, 'preparePreview').mockResolvedValue(undefined)
    processCompositionFileSpy = jest.spyOn(CompositionUtilsModule, 'processCompositionFile')
    processCrossfadesSpy = jest.spyOn(CompositionUtilsModule, 'processCrossfades')
    processKenBurnsSpy = jest.spyOn(CompositionUtilsModule, 'processKenBurns')
    removeDirectorySpy = jest.spyOn(FilesUtilsModule, 'removeDirectory').mockReturnValue(undefined)
    validateAudioLayerSpy = jest.spyOn(LayerValidationUtilsModule, 'validateAudioLayer')
    validateFilterLayerSpy = jest.spyOn(LayerValidationUtilsModule, 'validateFilterLayer')
    validateGroupLayerSpy = jest.spyOn(LayerValidationUtilsModule, 'validateGroupLayer')
    validateHtmlLayerSpy = jest.spyOn(LayerValidationUtilsModule, 'validateHtmlLayer')
    validateImageLayerSpy = jest.spyOn(LayerValidationUtilsModule, 'validateImageLayer')
    validateLottieLayerSpy = jest.spyOn(LayerValidationUtilsModule, 'validateLottieLayer')
    validateOptionsSpy = jest.spyOn(ValidationUtilsModule, 'validateOptions')
    validateSequenceLayerSpy = jest.spyOn(LayerValidationUtilsModule, 'validateSequenceLayer')
    validateSubtitlesLayerSpy = jest.spyOn(LayerValidationUtilsModule, 'validateSubtitlesLayer')
    validateTextLayerSpy = jest.spyOn(LayerValidationUtilsModule, 'validateTextLayer')
    validateVideoLayerSpy = jest.spyOn(LayerValidationUtilsModule, 'validateVideoLayer')
    validateWaveformLayerSpy = jest.spyOn(LayerValidationUtilsModule, 'validateWaveformLayer')
    validateCompositionFileSpy = jest.spyOn(CompositionValidationUtilsModule, 'validateCompositionFile')
    validateCompositionOptionsSpy = jest.spyOn(CompositionValidationUtilsModule, 'validateCompositionOptions')
    validatePresenceOfSpy = jest.spyOn(ValidationUtilsModule, 'validatePresenceOf')
    validateTransitionsKeyframesSpy = jest.spyOn(TransitionsValidationUtilsModule, 'validateTransitionsKeyframes')
  })

  describe('initialization', () => {
    it('calls the `validateCompositionOptions` function with the correct arguments', () => {
      makeComposition()

      expect(validateCompositionOptionsSpy).toHaveBeenCalledWith(options)
    })
  })

  describe('backgroundColor', () => {
    it('returns the correct `backgroundColor`', () => {
      const composition = makeComposition()

      expect(composition.backgroundColor).toEqual(options.backgroundColor)
    })
  })

  describe('dimensions', () => {
    it('returns the correct `dimensions`', () => {
      const composition = makeComposition()

      expect(composition.dimensions).toEqual(options.dimensions)
    })
  })

  describe('duration', () => {
    it('returns the correct `duration`', () => {
      const composition = makeComposition()

      expect(composition.duration).toEqual(options.duration)
    })
  })

  describe('metadata', () => {
    it('returns the correct `metadata`', () => {
      const composition = makeComposition()

      expect(composition.metadata).toEqual(options.metadata)
    })
  })

  describe('layers', () => {
    it('returns all layers', () => {
      const composition = makeComposition()
      const text = 'text'

      composition.addText({ text })

      const layer = CompositionUtilsModule.setLayerDefaults(composition.dimensions, LayerType.text, {
        text,
      })
      const identifiedLayer = deepMerge(layer, { id: uuidMock, type: LayerType.text })

      expect(composition.identifiedLayers).toEqual([identifiedLayer])
    })
  })

  describe('layer', () => {
    it('returns a layer given an id', () => {
      const composition = makeComposition()
      const text = 'text'
      const layer = composition.addText({ text })

      const defaultTextLayer = makeDefaultTextLayer()

      expect(composition.layer(layer?.id)).toEqual(
        deepMerge(defaultTextLayer, { id: uuidMock, text: { text }, type: LayerType.text })
      )
    })
  })

  describe('getLayerAttribute', () => {
    it('returns a specific attribute from a given layer', () => {
      const composition = makeComposition()
      const text = 'text'
      const layer = composition.addText({ text })

      expect(composition.getLayerAttribute({ childKey: TextKey.text, id: layer?.id, layerKey: LayerKey.text })).toEqual(
        text
      )
    })
  })

  describe('setLayerAttribute', () => {
    it('sets an attribute on a given layer', () => {
      const composition = makeComposition()

      const text = 'text'
      const layer = composition.addText({ text })
      const newText = 'new-text'

      composition.setLayerAttribute({ id: layer.id, layerKey: LayerKey.text, value: newText })

      expect((composition.layer(layer.id) as TextLayer).text).toEqual(newText)
    })
  })

  describe('addAudio', () => {
    beforeEach(async () => {
      processCompositionFileSpy.mockResolvedValue(makeProcessedCompositionFile(LayerType.audio))

      composition = makeComposition()

      await composition.addAudio(filenames.audio, audioOptions, audioLayerConfig)
    })

    it('calls the `validateCompositionFile` function with the correct arguments', () => {
      expect(validateCompositionFileSpy).toHaveBeenCalledWith(CompositionMethod.addAudio, filenames.audio)
    })

    it('calls the `validateOptions` function with the correct arguments', () => {
      expect(validateOptionsSpy).toHaveBeenCalledWith(CompositionMethod.addAudio, AudioKey, audioOptions)
    })

    it('calls the `validateAudioLayer` function with the correct arguments', () => {
      expect(validateAudioLayerSpy).toHaveBeenCalledWith(CompositionMethod.addAudio, {
        audio: audioOptions,
        ...audioLayerConfig,
      })
    })

    it('adds an `audio` layer with the correct attributes', () => {
      expect(composition.identifiedLayers[0]).toEqual({
        audio: audioOptions,
        id: uuidMock,
        type: LayerType.audio,
        ...audioLayerConfig,
      })
    })

    it('returns an `Audio` object', async () => {
      const audio = await composition.addAudio(filenames.audio, audioOptions, audioLayerConfig)

      expect(audio).toBeInstanceOf(Audio)
    })
  })

  describe('addFilter', () => {
    beforeEach(() => {
      composition = makeComposition()

      composition.addFilter(filterOptions)
    })

    it('calls `validatePresenceOf` with the correct arguments', () => {
      expect(validatePresenceOfSpy).toHaveBeenCalledWith(filterOptions, CompositionErrorText.optionsRequired)
    })

    it('calls the `validateOptions` function with the correct arguments', () => {
      expect(validateOptionsSpy).toHaveBeenCalledWith(CompositionMethod.addFilter, FilterKey, filterOptions)
    })

    it('calls `validateFilterLayer` with the correct arguments', () => {
      expect(validateFilterLayerSpy).toHaveBeenCalledWith(CompositionMethod.addFilter, { filter: filterOptions })
    })

    it('adds a `filter` layer with the correct attributes', () => {
      expect(composition.identifiedLayers[0]).toEqual({
        filter: filterOptions,
        id: uuidMock,
        type: LayerType.filter,
      })
    })

    it('returns a `Filter` object', () => {
      const filter = composition.addFilter(filterOptions)

      expect(filter).toBeInstanceOf(Filter)
    })
  })

  describe('addGroup', () => {
    const volume = 0.2
    const position = {
      angle: 10,
      angleX: 20,
      angleY: 30,
      isRelative: true,
      origin: 'left',
      x: 0.5,
      y: 0.75,
    }
    const size = {
      format: FormatValue.fill,
      height: 100,
      scale: 3,
      width: 200,
    }
    const timeline = {
      start: 10,
    }
    const existingTransitions = [
      {
        options: {
          duration: 2,
        },
        type: TransitionType.fadeIn,
      },
    ]
    const transitions = [
      {
        options: {
          duration: 2,
        },
        type: TransitionType.fadeIn,
      },
    ]
    const trim = {
      end: 2,
      start: 1,
    }

    const groupLayerConfig = {
      audio: {
        volume,
      },
      position,
      size,
      timeline,
      transitions,
      trim,
    }
    let video1: Video
    let video2: Video

    beforeEach(async () => {
      const mockVideoMetadata = mockApiVideoMetadata()

      postMock = jest.fn().mockResolvedValueOnce(mockVideoMetadata).mockResolvedValueOnce(mockVideoMetadata)
      const apiMock = mockApi({ post: postMock })

      processCompositionFileSpy
        .mockResolvedValueOnce(makeProcessedCompositionFile(LayerType.video))
        .mockResolvedValueOnce(makeProcessedCompositionFile(LayerType.video))

      uuidSpy.mockReturnValueOnce(uuids[LayerType.video])
      uuidSpy.mockReturnValueOnce(uuids[LayerType.video])

      composition = makeComposition({ customApiMock: apiMock })
      video1 = await composition.addVideo(filenames.video, {
        transitions: existingTransitions,
      })
      video2 = await composition.addVideo(filenames.video)

      composition.addGroup([video1, video2], groupLayerConfig)
    })

    it('calls the `validateGroupLayer` function with the correct arguments', async () => {
      expect(validateGroupLayerSpy).toHaveBeenCalledWith(CompositionMethod.addGroup, groupLayerConfig)
    })

    it('sets the provided config values on each member of the group', () => {
      ;[video1, video2].map((video) => {
        expect(video.volume).toEqual(groupLayerConfig.audio.volume)
        expect(video.angle).toEqual(groupLayerConfig.position.angle)
        expect(video.angleX).toEqual(groupLayerConfig.position.angleX)
        expect(video.angleY).toEqual(groupLayerConfig.position.angleY)
        expect(video.isRelative).toEqual(groupLayerConfig.position.isRelative)
        expect(video.origin).toEqual(groupLayerConfig.position.origin)
        expect(video.x).toEqual(groupLayerConfig.position.x)
        expect(video.y).toEqual(groupLayerConfig.position.y)
        expect(video.format).toEqual(groupLayerConfig.size.format)
        expect(video.height).toEqual(groupLayerConfig.size.height)
        expect(video.scale).toEqual(groupLayerConfig.size.scale)
        expect(video.width).toEqual(groupLayerConfig.size.width)
        expect(video.start).toEqual(groupLayerConfig.timeline.start)
        expect(video.transitions[0]).toEqual(existingTransitions[0])
        expect(video.transitions[1]).toEqual(groupLayerConfig.transitions[0])
        expect(video.trim).toEqual(groupLayerConfig.trim)
      })
    })
  })

  describe('addHtml', () => {
    beforeEach(() => {
      processCompositionFileSpy.mockResolvedValue(makeProcessedCompositionFile(LayerType.html))
    })

    describe('always', () => {
      let layer: HtmlLayer

      beforeEach(async () => {
        htmlOptions = mockHtmlOptions({ withHtml: true, withUrl: false })
        composition = makeComposition()
        layer = CompositionUtilsModule.setLayerDefaults(
          composition.dimensions,
          LayerType.html,
          htmlOptions,
          htmlLayerConfig
        )

        await composition.addHtml({ ...htmlOptions }, htmlLayerConfig)
      })

      it('calls the `validatePresenceOf` function with the correct arguments', () => {
        expect(validatePresenceOfSpy).toHaveBeenCalledWith(htmlOptions, CompositionErrorText.optionsRequired)
      })

      it('calls the `validateOptions` function with the correct arguments', () => {
        expect(validateOptionsSpy).toHaveBeenCalledWith(CompositionMethod.addHtml, HtmlKey, htmlOptions)
      })

      it('calls the `validateHtmlLayer` function with the correct arguments', () => {
        expect(validateHtmlLayerSpy).toHaveBeenCalledWith(CompositionMethod.addHtml, layer)
      })

      it('adds an `html` layer with the correct attributes', () => {
        expect(composition.identifiedLayers[0]).toEqual(
          deepMerge(layer, {
            html: htmlOptions,
            id: uuidMock,
            type: LayerType.html,
          })
        )
      })

      it('returns a `Html` object', async () => {
        const html = await composition.addHtml(htmlOptions)

        expect(html).toBeInstanceOf(Html)
      })
    })
  })

  describe('addImage', () => {
    beforeEach(async () => {
      processCompositionFileSpy.mockResolvedValue(makeProcessedCompositionFile(LayerType.image))

      composition = makeComposition()

      await composition.addImage(filenames.image, imageLayerConfig)
    })

    it('calls the `validateCompositionFile` function with the correct arguments', () => {
      expect(validateCompositionFileSpy).toHaveBeenCalledWith(CompositionMethod.addImage, filenames.image)
    })

    it('calls the `validateImageLayer` function with the correct arguments', () => {
      expect(validateImageLayerSpy).toHaveBeenCalledWith(CompositionMethod.addImage, imageLayerConfig)
    })

    it('adds an `image` layer with the correct attributes', () => {
      expect(composition.identifiedLayers[0]).toEqual({
        id: uuidMock,
        type: LayerType.image,
        ...imageLayerConfig,
      })
    })

    it('returns an `Image` object', async () => {
      const image = await composition.addImage(filenames.image, imageLayerConfig)

      expect(image).toBeInstanceOf(Image)
    })
  })

  describe('addLottie', () => {
    beforeEach(() => {
      composition = makeComposition()

      composition.addLottie(lottieOptions, lottieLayerConfig)
    })

    it('calls the `validatePresenceOf` function with the correct arguments', () => {
      expect(validatePresenceOfSpy).toHaveBeenCalledWith(lottieOptions, CompositionErrorText.optionsRequired)
    })

    it('calls the `validateOptions` function with the correct arguments', () => {
      expect(validateOptionsSpy).toHaveBeenCalledWith(CompositionMethod.addLottie, LottieKey, lottieOptions)
    })

    it('calls the `validateLottieLayer` function with the correct arguments', () => {
      expect(validateLottieLayerSpy).toHaveBeenCalledWith(CompositionMethod.addLottie, {
        lottie: lottieOptions,
        ...lottieLayerConfig,
      })
    })

    it('adds a `lottie` layer with the correct attributes', () => {
      expect(composition.identifiedLayers[0]).toEqual({
        id: uuidMock,
        lottie: lottieOptions,
        type: LayerType.lottie,
        ...lottieLayerConfig,
      })
    })

    it('returns a `Lottie` object', () => {
      const lottie = composition.addLottie(lottieOptions)

      expect(lottie).toBeInstanceOf(Lottie)
    })
  })

  describe('addSequence', () => {
    it('calls the `validateSequenceLayer` function with the correct arguments', async () => {
      composition = makeComposition()
      const text = composition.addText({ text: 'text' }, { trim: { start: 5 } })

      await composition.addSequence([text])

      expect(validateSequenceLayerSpy).toHaveBeenCalledWith(CompositionMethod.addSequence, sequenceLayerConfig)
    })

    describe('when a provided layer has a `trim` `start` but no `trim` `end`, and has no file to determine duration from', () => {
      it('logs an error', async () => {
        composition = makeComposition()
        const text = composition.addText({ text: 'text' }, { trim: { start: 5 } })

        await composition.addSequence([text])

        expect(consoleErrorSpy).toHaveBeenCalledTimes(1)
      })
    })

    describe('when a provided layer has neither `trim` nor  a file to determine `duration` from', () => {
      it('logs an error', async () => {
        composition = makeComposition()
        const text = composition.addText({ text: 'text' })

        await composition.addSequence([text])

        expect(consoleErrorSpy).toHaveBeenCalledTimes(1)
      })
    })

    describe('when all provided layers have `trim` `end` or `duration`', () => {
      const mockVideoMetadata = mockApiVideoMetadata()

      beforeEach(async () => {
        postMock = jest.fn().mockResolvedValueOnce(mockApiAudioMetadata()).mockResolvedValueOnce(mockVideoMetadata)
        const apiMock = mockApi({ post: postMock })

        processCompositionFileSpy
          .mockResolvedValueOnce(makeProcessedCompositionFile(LayerType.audio))
          .mockResolvedValueOnce(makeProcessedCompositionFile(LayerType.video))
          .mockResolvedValueOnce(makeProcessedCompositionFile(LayerType.audio))
          .mockResolvedValueOnce(makeProcessedCompositionFile(LayerType.video))

        uuidSpy.mockReturnValueOnce(uuids[LayerType.audio])
        uuidSpy.mockReturnValueOnce(uuids[LayerType.text])
        uuidSpy.mockReturnValueOnce(uuids[LayerType.video])
        uuidSpy.mockReturnValueOnce('text2')
        uuidSpy.mockReturnValueOnce('text3')
        uuidSpy.mockReturnValueOnce(uuids[LayerType.group])

        composition = makeComposition({ customApiMock: apiMock })
      })

      it('sets the `start` attributes of the provided layers to the correct values', async () => {
        const audio = await composition.addAudio(filenames.audio, { volume: 1 }, { trim: { end: 5 } })
        const text = composition.addText({ text: 'text' }, { trim: { end: 5 } })
        const video = await composition.addVideo(filenames.video, { trim: { end: 5 } })
        const text2 = composition.addText({ text: 'text2' })
        const text3 = composition.addText({ text: 'text3' })
        const group = composition.addGroup([text2, text3], { trim: { end: 1 } })

        await composition.addSequence([audio, text, video, group])

        expect(audio.start).toEqual(0)
        expect(text.start).toEqual(audio.trim.end - audio.trim.start)
        expect(video.start).toEqual(text.start + text.trim.end)
        expect(text2.start).toEqual(video.start + video.trim.end)
        expect(text3.start).toEqual(video.start + video.trim.end)
      })
    })

    describe('when layers have `crossfade` transitions', () => {
      const processCrossfadeResults = [1, 2, 3]
      const layer1Duration = 3
      const layer2Duration = 4
      const layer3Duration = 5
      const layer1TransitionDuration = 1
      const layer3TransitionDuration = 2
      let layer1: Text
      let layer2: Text
      let layer3: Text

      beforeEach(async () => {
        composition = makeComposition({
          compositionOptions: {
            dimensions: options.dimensions,
          },
        })
        layer1 = composition.addText({ text: 'layer1' }, { trim: { end: layer1Duration } })
        layer2 = composition.addText({ text: 'layer2' }, { trim: { end: layer2Duration } })
        layer3 = composition.addText({ text: 'layer3' }, { trim: { end: layer3Duration } })

        layer1.addTransition({ options: { duration: layer1TransitionDuration }, type: TransitionType.crossfadeOut })
        layer3.addTransition({ options: { duration: layer3TransitionDuration }, type: TransitionType.crossfadeIn })

        processCrossfadesSpy.mockReturnValueOnce(processCrossfadeResults[0])
        processCrossfadesSpy.mockReturnValueOnce(processCrossfadeResults[1])
        processCrossfadesSpy.mockReturnValueOnce(processCrossfadeResults[2])

        await composition.addSequence([layer1, layer2, layer3])
      })

      it('sets the duration to the result of the call to processCrossfades', () => {
        expect(composition.duration).toEqual(
          processCrossfadeResults[0] + processCrossfadeResults[1] + processCrossfadeResults[2]
        )
      })
    })

    describe('when layers have `kenBurns` transitions', () => {
      let layer: Text
      const end = 1
      const scale1 = 1
      const scale2 = 2
      const start = 0
      const x1 = 0
      const x2 = 10
      const y1 = 0
      const y2 = 10

      beforeEach(async () => {
        const composition = makeComposition({
          compositionOptions: {
            dimensions: options.dimensions,
            duration: options.duration,
          },
        })

        layer = composition.addText({ text: 'layer' }, { trim: { end } })
        layer.addTransition({
          options: {
            end,
            scale1,
            scale2,
            start,
            x1,
            x2,
            y1,
            y2,
          },
          type: TransitionType.kenBurns,
        })

        await composition.encode()
      })

      it('calls the `processKenBurns` function with the correct arguments', () => {
        expect(processKenBurnsSpy).toHaveBeenCalledWith({ end, layer, scale1, scale2, start, x1, x2, y1, y2 })
      })

      it("removes the `kenBurns` transition from the layer's transitions", () => {
        expect(layer.transitions.find((transition) => transition.type === TransitionType.kenBurns)).toBeUndefined()
      })
    })

    describe('always', () => {
      let sequence: Sequence
      let text: Text

      beforeEach(async () => {
        composition = makeComposition()
        text = composition.addText({ text: 'text' }, { trim: { end: 3, start: 0 } })

        sequence = await composition.addSequence([text])
      })

      it('adds a `sequence` layer with the correct attributes', () => {
        expect(composition.identifiedLayers[1]).toEqual({
          id: uuidMock,
          type: LayerType.sequence,
          ...sequenceLayerConfig,
        })
      })

      it('returns a `Sequence` object', () => {
        expect(sequence).toBeInstanceOf(Sequence)
      })

      it('sets the `duration` of the `composition`', () => {
        expect(composition.duration).toEqual(3)
      })
    })
  })

  describe('addSubtitles', () => {
    beforeEach(async () => {
      processCompositionFileSpy.mockResolvedValue(makeProcessedCompositionFile(LayerType.subtitles))

      composition = makeComposition()

      await composition.addSubtitles(filenames.subtitles, subtitlesOptions, subtitlesLayerConfig)
    })

    it('calls the `validateCompositionFile` function with the correct arguments', () => {
      expect(validateCompositionFileSpy).toHaveBeenCalledWith(CompositionMethod.addSubtitles, filenames.subtitles)
    })

    it('calls the `validateOptions` function with the correct arguments', () => {
      expect(validateOptionsSpy).toHaveBeenCalledWith(CompositionMethod.addSubtitles, SubtitlesKey, subtitlesOptions)
    })

    it('calls the `validateSubtitlesLayer` function with the correct arguments', () => {
      expect(validateSubtitlesLayerSpy).toHaveBeenCalledWith(CompositionMethod.addSubtitles, {
        subtitles: subtitlesOptions,
        ...subtitlesLayerConfig,
      })
    })

    it('adds a `subtitles` layer with the correct attributes', () => {
      expect(composition.identifiedLayers[0]).toEqual({
        id: uuidMock,
        subtitles: subtitlesOptions,
        type: LayerType.subtitles,
        ...subtitlesLayerConfig,
      })
    })

    it('returns a `Subtitles` object', async () => {
      const subtitles = await composition.addSubtitles(filenames.subtitles, subtitlesOptions)

      expect(subtitles).toBeInstanceOf(Subtitles)
    })
  })

  describe('addText', () => {
    beforeEach(() => {
      composition = makeComposition()

      composition.addText(textOptions, textLayerConfig)
    })

    it('calls the `validatePresenceOf` function with the correct arguments', () => {
      expect(validatePresenceOfSpy).toHaveBeenCalledWith(textOptions, CompositionErrorText.optionsRequired)
      expect(validatePresenceOfSpy).toHaveBeenCalledWith(textOptions.text, CompositionErrorText.textRequired)
    })

    it('calls the `validateOptions` function with the correct arguments', () => {
      expect(validateOptionsSpy).toHaveBeenCalledWith(CompositionMethod.addText, TextKey, textOptions)
    })

    it('calls the `validateTextLayer` function with the correct arguments', () => {
      expect(validateTextLayerSpy).toHaveBeenCalledWith(CompositionMethod.addText, {
        text: textOptions,
        ...textLayerConfig,
      })
    })

    it('adds a `text` layer with the correct attributes', () => {
      expect(composition.identifiedLayers[0]).toEqual({
        id: uuidMock,
        text: textOptions,
        type: LayerType.text,
        ...textLayerConfig,
      })
    })

    it('returns a `Text` object', () => {
      const text = composition.addText(textOptions, textLayerConfig)

      expect(text).toBeInstanceOf(Text)
    })
  })

  describe('addVideo', () => {
    beforeEach(async () => {
      processCompositionFileSpy.mockResolvedValue(makeProcessedCompositionFile(LayerType.video))

      composition = makeComposition()

      await composition.addVideo(filenames.video, videoLayerConfig)
    })

    it('calls the `validateCompositionFile` function with the correct arguments', () => {
      expect(validateCompositionFileSpy).toHaveBeenCalledWith(CompositionMethod.addVideo, filenames.video)
    })

    it('calls the `validateVideoLayer` function with the correct arguments', () => {
      expect(validateVideoLayerSpy).toHaveBeenCalledWith(CompositionMethod.addVideo, videoLayerConfig)
    })

    it('adds a `video` layer with the correct attributes', () => {
      expect(composition.identifiedLayers[0]).toEqual({
        id: uuidMock,
        type: LayerType.video,
        ...videoLayerConfig,
      })
    })

    it('returns a `Video` object', async () => {
      const video = await composition.addVideo(filenames.video, videoLayerConfig)

      expect(video).toBeInstanceOf(Video)
    })
  })

  describe('addWaveform', () => {
    describe('when a file is provided', () => {
      beforeEach(async () => {
        processCompositionFileSpy.mockResolvedValue(makeProcessedCompositionFile(LayerType.waveform))

        composition = makeComposition()

        await composition.addWaveform(filenames.audio, waveformOptions, waveformLayerConfig)
      })

      it('calls the `validateCompositionFile` function with the correct arguments', () => {
        expect(validateCompositionFileSpy).toHaveBeenCalledWith(CompositionMethod.addWaveform, filenames.audio)
      })
    })

    describe('when no file is provided', () => {
      beforeEach(async () => {
        composition = makeComposition()

        await composition.addWaveform(undefined, waveformOptions, waveformLayerConfig)
      })

      it('does not call the `validateCompositionFile` function', () => {
        expect(validateCompositionFileSpy).not.toHaveBeenCalled()
      })
    })

    describe('always', () => {
      beforeEach(async () => {
        composition = makeComposition()

        await composition.addWaveform(undefined, waveformOptions, waveformLayerConfig)
      })

      it('calls the `validateOptions` function with the correct arguments', () => {
        expect(validateOptionsSpy).toHaveBeenCalledWith(CompositionMethod.addWaveform, WaveformKey, waveformOptions)
      })

      it('calls the `validateWaveformLayer` function with the correct arguments', () => {
        expect(validateWaveformLayerSpy).toHaveBeenCalledWith(CompositionMethod.addWaveform, {
          waveform: waveformOptions,
          ...waveformLayerConfig,
        })
      })

      it('adds a `waveform` layer with the correct attributes', () => {
        expect(composition.identifiedLayers[0]).toEqual({
          id: uuidMock,
          type: LayerType.waveform,
          waveform: waveformOptions,
          ...waveformLayerConfig,
        })
      })

      it('returns a `Waveform` object', async () => {
        const waveform = await composition.addWaveform(undefined, waveformOptions)

        expect(waveform).toBeInstanceOf(Waveform)
      })
    })
  })

  describe('preview', () => {
    it('calls the `preparePreview` function with the correct arguments', async () => {
      processCompositionFileSpy.mockResolvedValue(makeProcessedCompositionFile(LayerType.video))
      composition = makeComposition()
      await composition.addVideo(filenames.video, videoLayerConfig)

      await composition.preview()

      // eslint-disable-next-line jest/prefer-called-with
      expect(preparePreviewSpy).toHaveBeenCalled()
    })
  })

  describe('encode', () => {
    it('calls the `validatePresenceOf` function with the correct arguments', async () => {
      composition = new Composition({
        api: apiMock,
        formData: formDataMock,
        host,
        options,
        temporaryDirectory,
        videos: new Videos({ api: apiMock, host }),
      })

      await composition.encode()

      expect(validatePresenceOfSpy).toHaveBeenCalledWith(options.duration, CompositionErrorText.durationRequired)
    })

    it('calls the `validateTransitionsKeyframes` function with the correct arguments', async () => {
      composition = new Composition({
        api: apiMock,
        formData: formDataMock,
        host,
        options,
        temporaryDirectory,
        videos: new Videos({ api: apiMock, host }),
      })

      await composition.encode()

      expect(validateTransitionsKeyframesSpy).toHaveBeenCalledWith(composition.identifiedLayers)
    })

    describe('when the encode response is malformed', () => {
      beforeEach(() => {
        postMock.mockResolvedValue({})
        apiMock = mockApi({ post: postMock })

        processCompositionFileSpy.mockResolvedValue(makeProcessedCompositionFile(LayerType.audio))
        composition = makeComposition()
      })

      it('logs the error to the console', async () => {
        await composition.addAudio(filenames.audio, audioOptions, audioLayerConfig)

        await composition.encode()

        expect(consoleErrorSpy).toHaveBeenCalledTimes(1)
      })
    })

    beforeEach(async () => {
      postMock.mockResolvedValue(encodeResponse)
      apiMock = mockApi({ post: postMock })
      processCompositionFileSpy.mockResolvedValueOnce(makeProcessedCompositionFile(LayerType.audio))
      processCompositionFileSpy.mockResolvedValueOnce(makeProcessedCompositionFile(LayerType.image))
      processCompositionFileSpy.mockResolvedValueOnce(makeProcessedCompositionFile(LayerType.subtitles))
      processCompositionFileSpy.mockResolvedValueOnce(makeProcessedCompositionFile(LayerType.video))
      processCompositionFileSpy.mockResolvedValueOnce(makeProcessedCompositionFile(LayerType.waveform))
      composition = makeComposition()

      await composition.addAudio(filenames.audio, audioOptions, audioLayerConfig)
      composition.addFilter(filterOptions)
      await composition.addImage(filenames.image, imageLayerConfig)
      composition.addText(textOptions, textLayerConfig)
      await composition.addSubtitles(filenames.subtitles, subtitlesOptions, subtitlesLayerConfig)
      await composition.addVideo(filenames.video, videoLayerConfig)
      await composition.addWaveform(filenames.audio, waveformOptions, waveformLayerConfig)
    })

    it('calls the `append` method on the private `formData` attribute with the correct arguments', async () => {
      await composition.encode()

      expect(formDataMock.append).toHaveBeenCalledTimes(6)

      expect(formDataMock.append).toHaveBeenCalledWith(
        CompositionUtilsModule.formDataKey(readStreams[LayerType.audio], uuidMock),
        readStreams[LayerType.audio]
      )
      expect(formDataMock.append).toHaveBeenCalledWith(
        CompositionUtilsModule.formDataKey(readStreams[LayerType.image], uuidMock),
        readStreams[LayerType.image]
      )
      expect(formDataMock.append).toHaveBeenCalledWith(
        CompositionUtilsModule.formDataKey(readStreams[LayerType.subtitles], uuidMock),
        readStreams[LayerType.subtitles]
      )
      expect(formDataMock.append).toHaveBeenCalledWith(
        CompositionUtilsModule.formDataKey(readStreams[LayerType.video], uuidMock),
        readStreams[LayerType.video]
      )
      expect(formDataMock.append).toHaveBeenCalledWith(
        CompositionUtilsModule.formDataKey(readStreams[LayerType.waveform], uuidMock),
        readStreams[LayerType.waveform]
      )

      expect(formDataMock.append).toHaveBeenCalledWith(
        'config',
        JSON.stringify({
          ...options,
          layers: composition.identifiedLayers,
        })
      )
    })

    it('calls the `post` method on the api with the correct arguments', async () => {
      await composition.encode()

      const { isForm, url } = postMock.mock.calls[0][0]

      expect(isForm).toEqual(true)
      expect(url).toEqual(Routes.videos.create)
    })

    it('removes the temporary directory', async () => {
      await composition.encode()

      expect(removeDirectorySpy).toHaveBeenCalledWith(temporaryDirectory)
    })

    it('returns the correct response', async () => {
      const response = await composition.encode()

      expect(response).toEqual(encodeResponse)
    })
  })
})
