import { ApiInterface, FormDataInterface, LayerAttribute, LayerHTML, LayerType, Routes } from 'constant'
import { Audio } from 'features/videos/audio'
import { Filter } from 'features/videos/filter'
import { HTML } from 'features/videos/html'
import { Lottie } from 'features/videos/lottie'
import { Text } from 'features/videos/text'
import { Video } from 'features/videos/video'
import { VisualMedia } from 'features/videos/visualMedia'
import {
  mockApi,
  mockAudioLayer,
  mockCompositionOptions,
  mockEncodeResponse,
  mockFilterLayer,
  mockHTMLLayer,
  mockImageLayer,
  mockLottieLayer,
  mockTextLayer,
  mockVideoLayer,
  mockWaveformLayer,
} from 'mocks'
import { CompositionErrorText, MediaErrorText } from 'strings'
import * as StringsUtilsModule from 'utils/strings'
import * as ValidationUtilsModule from 'utils/validation'
import * as CompositionUtilsModule from 'utils/video/compositions'
import * as HTMLUtilsModule from 'utils/video/html'

import { Composition } from './'

describe('Composition', () => {
  const filenames = {
    [LayerType.audio]: 'audio-filename',
    [LayerType.image]: 'image-filename',
    [LayerType.video]: 'video-filename',
  }
  let formDataMock: FormDataInterface
  const audioOptions = mockAudioLayer()
  const encodeResponse = mockEncodeResponse()
  const filterOptions = mockFilterLayer()
  const imageOptions = mockImageLayer()
  const lottieOptions = mockLottieLayer()
  const options = mockCompositionOptions()
  const textOptions = mockTextLayer()
  const videoOptions = mockVideoLayer()
  const waveformOptions = mockWaveformLayer()
  const uuidMock = '123456'
  let htmlOptions: LayerHTML
  let apiMock: ApiInterface
  let consoleErrorSpy: jest.SpyInstance
  let escapeHTMLSpy: jest.SpyInstance
  let postMock: jest.Mock
  let validateAddAudioSpy: jest.SpyInstance
  let validateAddFilterSpy: jest.SpyInstance
  let validateAddHTMLSpy: jest.SpyInstance
  let validateAddImageSpy: jest.SpyInstance
  let validateAddLottieSpy: jest.SpyInstance
  let validateAddTextSpy: jest.SpyInstance
  let validateAddVideoSpy: jest.SpyInstance
  let validateAddWaveformSpy: jest.SpyInstance
  let validateCompositionOptionsSpy: jest.SpyInstance
  let validatePresenceOfSpy: jest.SpyInstance
  let composition: Composition

  const makeComposition = () =>
    new Composition({
      api: apiMock,
      formData: formDataMock,
      options: { ...options },
    })

  afterEach(() => {
    jest.clearAllMocks()
  })

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    postMock = jest.fn()
    apiMock = mockApi({ get: jest.fn(), post: postMock, put: jest.fn() })

    escapeHTMLSpy = jest.spyOn(HTMLUtilsModule, 'escapeHTML')
    formDataMock = { append: jest.fn() }
    jest.spyOn(StringsUtilsModule, 'uuid').mockReturnValue(uuidMock)
    validateAddAudioSpy = jest.spyOn(CompositionUtilsModule, 'validateAddAudio')
    validateAddFilterSpy = jest.spyOn(CompositionUtilsModule, 'validateAddFilter')
    validateAddHTMLSpy = jest.spyOn(CompositionUtilsModule, 'validateAddHTML')
    validateAddImageSpy = jest.spyOn(CompositionUtilsModule, 'validateAddImage')
    validateAddLottieSpy = jest.spyOn(CompositionUtilsModule, 'validateAddLottie')
    validateAddTextSpy = jest.spyOn(CompositionUtilsModule, 'validateAddText')
    validateAddVideoSpy = jest.spyOn(CompositionUtilsModule, 'validateAddVideo')
    validateAddWaveformSpy = jest.spyOn(CompositionUtilsModule, 'validateAddWaveform')
    validateCompositionOptionsSpy = jest.spyOn(CompositionUtilsModule, 'validateCompositionOptions')
    validatePresenceOfSpy = jest.spyOn(ValidationUtilsModule, 'validatePresenceOf')
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

  describe('layer', () => {
    it('returns a layer given an id', () => {
      const composition = makeComposition()
      const text = 'text'
      const layer = composition.addText({ text })

      expect(composition.layer(layer?.id)).toEqual({ id: uuidMock, text, type: LayerType.text })
    })
  })

  describe('addAudio', () => {
    beforeEach(() => {
      composition = makeComposition()

      composition.addAudio(filenames.audio, audioOptions)
    })

    it('calls the `validatePresenceOf` function with the correct arguments', () => {
      expect(validatePresenceOfSpy).toHaveBeenCalledWith(filenames.audio, MediaErrorText.invalidFileSource)
      expect(validatePresenceOfSpy).toHaveBeenCalledWith(audioOptions, CompositionErrorText.optionsRequired)
    })

    it('calls the `validateAddAudio` function with the correct arguments', () => {
      expect(validateAddAudioSpy).toHaveBeenCalledWith(audioOptions)
    })

    it('adds an `audio` layer with the correct attributes', () => {
      expect(composition.layers[0]).toEqual({
        id: uuidMock,
        type: LayerType.audio,
        ...audioOptions,
      })
    })

    it('returns an `Audio` object', () => {
      const audio = composition.addAudio(filenames.audio, videoOptions)

      expect(audio instanceof Audio).toBe(true)
    })
  })

  describe('addFilter', () => {
    beforeEach(() => {
      composition = makeComposition()

      composition.addFilter(filterOptions)
    })

    it('calls `validatePresenceOf` with the correct arguments', () => {
      expect(validatePresenceOfSpy).toHaveBeenCalledWith(filterOptions, CompositionErrorText.optionsRequired)
      expect(validatePresenceOfSpy).toHaveBeenCalledWith(filterOptions.filter, CompositionErrorText.filterRequired)
    })

    it('calls `validateAddFilter` with the correct arguments', () => {
      expect(validateAddFilterSpy).toHaveBeenCalledWith(filterOptions)
    })

    it('adds a `filter` layer with the correct attributes', () => {
      expect(composition.layers[0]).toEqual({
        ...filterOptions,
        id: uuidMock,
        type: LayerType.filter,
      })
    })

    it('returns a `Filter` object', () => {
      const filter = composition.addFilter(filterOptions)

      expect(filter instanceof Filter).toBe(true)
    })
  })

  describe('addHTML', () => {
    describe('when a `url` is provided', () => {
      beforeEach(() => {
        htmlOptions = mockHTMLLayer({ withHTML: false, withURL: true })
        composition = makeComposition()

        composition.addHTML(htmlOptions)
      })

      it('does not escape html', () => {
        expect(escapeHTMLSpy).not.toHaveBeenCalled()
      })
    })

    describe('when an `htmlPage` is provided', () => {
      beforeEach(() => {
        htmlOptions = mockHTMLLayer()
        composition = makeComposition()

        composition.addHTML(htmlOptions)
      })

      it('escapes provided html', () => {
        expect(escapeHTMLSpy).toHaveBeenCalledWith(htmlOptions.html.htmlPage)
      })
    })

    describe('when no `height` or `width` is provided', () => {
      beforeEach(() => {
        htmlOptions = mockHTMLLayer()
        composition = makeComposition()

        composition.addHTML(htmlOptions)
      })

      it('uses the composition height and width', () => {
        expect(composition.layers[0]).toEqual({
          id: uuidMock,
          type: LayerType.html,
          ...{ ...htmlOptions, height: options.dimensions.height, width: options.dimensions.width },
        })
      })
    })

    describe('when no `withTransparentBackground` option is provided', () => {
      beforeEach(() => {
        htmlOptions = mockHTMLLayer({
          height: 10,
          width: 20,
          withHTML: true,
          withTransparentBackground: undefined,
          withURL: false,
        })
        composition = makeComposition()

        composition.addHTML(htmlOptions)
      })

      it('defaults `withTransparentBackground` to false', () => {
        expect(composition.layers[0]).toEqual({
          id: uuidMock,
          type: LayerType.html,
          ...htmlOptions,
          ...{ html: { ...htmlOptions.html, withTransparentBackground: false } },
        })
      })
    })

    describe('always', () => {
      const height = 50
      const width = 100

      beforeEach(() => {
        htmlOptions = mockHTMLLayer({ height, width, withHTML: true, withURL: false })
        composition = makeComposition()

        composition.addHTML({ ...htmlOptions, height, width })
      })

      it('calls the `validatePresenceOf` function with the correct arguments', () => {
        expect(validatePresenceOfSpy).toHaveBeenCalledWith(htmlOptions, CompositionErrorText.optionsRequired)
      })

      it('calls the `validateAddHTML` function with the correct arguments', () => {
        expect(validateAddHTMLSpy).toHaveBeenCalledWith(htmlOptions)
      })

      it('adds an `html` layer with the correct attributes', () => {
        expect(composition.layers[0]).toEqual({
          id: uuidMock,
          type: LayerType.html,
          ...{ height, width, ...htmlOptions },
        })
      })

      it('returns a `HTML` object', () => {
        const html = composition.addHTML(htmlOptions)

        expect(html instanceof HTML).toBe(true)
      })
    })
  })

  describe('addImage', () => {
    beforeEach(() => {
      composition = makeComposition()

      composition.addImage(filenames.image, imageOptions)
    })

    it('calls the `validatePresenceOf` function with the correct arguments', () => {
      expect(validatePresenceOfSpy).toHaveBeenCalledWith(filenames.image, MediaErrorText.invalidFileSource)
    })

    it('calls the `validateAddImage` function with the correct arguments', () => {
      expect(validateAddImageSpy).toHaveBeenCalledWith(imageOptions)
    })

    it('adds an `image` layer with the correct attributes', () => {
      expect(composition.layers[0]).toEqual({
        id: uuidMock,
        type: LayerType.image,
        ...imageOptions,
      })
    })

    it('returns a `Video` object', () => {
      const image = composition.addImage(filenames.image, imageOptions)

      expect(image instanceof Video).toBe(true)
    })
  })

  describe('addLottie', () => {
    beforeEach(() => {
      composition = makeComposition()

      composition.addLottie(lottieOptions)
    })

    it('calls the `validatePresenceOf` function with the correct arguments', () => {
      expect(validatePresenceOfSpy).toHaveBeenCalledWith(lottieOptions, CompositionErrorText.optionsRequired)
      expect(validatePresenceOfSpy).toHaveBeenCalledWith(lottieOptions.data, CompositionErrorText.dataRequired)
    })

    it('calls the `validateAddLottie` function with the correct arguments', () => {
      expect(validateAddLottieSpy).toHaveBeenCalledWith(lottieOptions)
    })

    it('adds a `lottie` layer with the correct attributes', () => {
      expect(composition.layers[0]).toEqual({
        id: uuidMock,
        type: LayerType.lottie,
        ...lottieOptions,
      })
    })

    it('returns a `Lottie` object', () => {
      const lottie = composition.addLottie(lottieOptions)

      expect(lottie instanceof Lottie).toBe(true)
    })
  })

  describe('addText', () => {
    beforeEach(() => {
      composition = makeComposition()

      composition.addText(textOptions)
    })

    it('calls the `validatePresenceOf` function with the correct arguments', () => {
      expect(validatePresenceOfSpy).toHaveBeenCalledWith(textOptions.text, CompositionErrorText.textRequired)
    })

    it('calls the `validateAddText` function with the correct arguments', () => {
      expect(validateAddTextSpy).toHaveBeenCalledWith(textOptions)
    })

    it('adds a `text` layer with the correct attributes', () => {
      expect(composition.layers[0]).toEqual({
        id: uuidMock,
        type: LayerType.text,
        ...textOptions,
      })
    })

    it('returns a `Text` object', () => {
      const text = composition.addText(textOptions)

      expect(text instanceof Text).toBe(true)
    })
  })

  describe('addVideo', () => {
    beforeEach(() => {
      composition = makeComposition()

      composition.addVideo(filenames.video, videoOptions)
    })

    it('calls the `validatePresenceOf` function with the correct arguments', () => {
      expect(validatePresenceOfSpy).toHaveBeenCalledWith(filenames.video, MediaErrorText.invalidFileSource)
      expect(validatePresenceOfSpy).toHaveBeenCalledWith(videoOptions, CompositionErrorText.optionsRequired)
    })

    it('calls the `validateAddVideo` function with the correct arguments', () => {
      expect(validateAddVideoSpy).toHaveBeenCalledWith(videoOptions)
    })

    it('adds a `video` layer with the correct attributes', () => {
      expect(composition.layers[0]).toEqual({
        id: uuidMock,
        type: LayerType.video,
        ...imageOptions,
      })
    })

    it('returns a `Video` object', () => {
      const video = composition.addVideo(filenames.video, videoOptions)

      expect(video instanceof Video).toBe(true)
    })
  })

  describe('addWaveform', () => {
    beforeEach(() => {
      composition = makeComposition()

      composition.addWaveform(waveformOptions)
    })

    it('calls the `validateAddWaveform` function with the correct arguments', () => {
      expect(validateAddWaveformSpy).toHaveBeenCalledWith(waveformOptions)
    })

    it('adds a `waveform` layer with the correct attributes', () => {
      expect(composition.layers[0]).toEqual({
        id: uuidMock,
        type: LayerType.waveform,
        ...waveformOptions,
      })
    })

    it('returns a `VisualMedia` object', () => {
      const waveform = composition.addWaveform(waveformOptions)

      expect(waveform instanceof VisualMedia).toBe(true)
    })
  })

  describe('encode', () => {
    describe('when the encode response is malformed', () => {
      beforeEach(() => {
        postMock.mockResolvedValue({})
        apiMock = mockApi({
          get: jest.fn(),
          post: postMock,
          put: jest.fn(),
        })
        composition = makeComposition()
      })

      it('logs the error to the console', async () => {
        composition.addAudio(filenames.audio, audioOptions)

        await composition.encode()

        expect(consoleErrorSpy).toHaveBeenCalledWith(
          CompositionErrorText.errorEncoding(CompositionErrorText.malformedEncodingResponse)
        )
      })
    })

    beforeEach(() => {
      postMock.mockResolvedValue(encodeResponse)
      apiMock = mockApi({
        get: jest.fn(),
        post: postMock,
        put: jest.fn(),
      })
      composition = makeComposition()

      composition.addAudio(filenames.audio, audioOptions)
      composition.addFilter(filterOptions)
      composition.addImage(filenames.image, imageOptions)
      composition.addText(textOptions)
      composition.addVideo(filenames.video, videoOptions)
      composition.addWaveform(waveformOptions, filenames.audio)
    })

    it('calls the `append` method on the private `formData` attribute with the correct arguments', async () => {
      await composition.encode()

      expect(formDataMock.append).toHaveBeenCalledTimes(5)

      expect(formDataMock.append).toHaveBeenCalledWith(
        CompositionUtilsModule.formDataKey(filenames.audio, uuidMock),
        filenames.audio
      )
      expect(formDataMock.append).toHaveBeenCalledWith(
        CompositionUtilsModule.formDataKey(filenames.image, uuidMock),
        filenames.image
      )
      expect(formDataMock.append).toHaveBeenCalledWith(
        CompositionUtilsModule.formDataKey(filenames.video, uuidMock),
        filenames.video
      )
      expect(formDataMock.append).toHaveBeenCalledWith(
        CompositionUtilsModule.formDataKey(filenames.audio, uuidMock),
        filenames.audio
      )

      expect(formDataMock.append).toHaveBeenCalledWith(
        'config',
        JSON.stringify({
          ...options,
          layers: composition.layers,
        })
      )
    })

    it('calls the `post` method on the api with the correct arguments', async () => {
      await composition.encode()

      const { isForm, url } = postMock.mock.calls[0][0]

      expect(isForm).toEqual(true)
      expect(url).toEqual(Routes.videos.create)
    })

    it('returns the correct response', async () => {
      const response = await composition.encode()

      expect(response).toEqual(encodeResponse)
    })
  })

  describe('updateLayerAttribute', () => {
    it('updates an attribute on a given layer', () => {
      const composition = makeComposition()

      const text = 'text'
      const layer = composition.addText({ text })
      const newText = 'new-text'

      composition.updateLayerAttribute(layer.id, LayerAttribute.text, newText)

      expect(composition.layer(layer.id)).toEqual({ id: uuidMock, text: newText, type: LayerType.text })
    })
  })
})
