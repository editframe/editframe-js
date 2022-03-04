import { ApiInterface, FormDataInterface, LayerAttribute, LayerType, Routes } from 'constant'
import { Audio } from 'features/videos/audio'
import { Filter } from 'features/videos/filter'
import { Text } from 'features/videos/text'
import { Video } from 'features/videos/video'
import { VisualMedia } from 'features/videos/visualMedia'
import {
  mockApi,
  mockAudioLayer,
  mockCompositionOptions,
  mockEncodeResponse,
  mockFilterLayer,
  mockImageLayer,
  mockTextLayer,
  mockVideoLayer,
  mockWaveformLayer,
} from 'mocks'
import { CompositionErrorText, MediaErrorText } from 'strings'
import * as StringsUtilsModule from 'utils/strings'
import * as ValidationUtilsModule from 'utils/validation'
import * as CompositionUtilsModule from 'utils/video/compositions'

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
  const options = mockCompositionOptions()
  const textOptions = mockTextLayer()
  const videoOptions = mockVideoLayer()
  const waveformOptions = mockWaveformLayer()
  const uuidMock = '123456'
  let apiMock: ApiInterface
  let consoleErrorSpy: jest.SpyInstance
  let postMock: jest.Mock
  let validateAddAudioSpy: jest.SpyInstance
  let validateAddFilterSpy: jest.SpyInstance
  let validateAddImageSpy: jest.SpyInstance
  let validateAddTextSpy: jest.SpyInstance
  let validateAddVideoSpy: jest.SpyInstance
  let validateAddWaveformSpy: jest.SpyInstance
  let validateCompositionOptionsSpy: jest.SpyInstance
  let validatePresenceOfSpy: jest.SpyInstance
  let composition: Composition

  const makeComposition = ({ withVideo }: { withVideo: boolean } = { withVideo: false }) =>
    new Composition({
      api: apiMock,
      formData: formDataMock,
      options: { ...options, videoFile: withVideo ? filenames[LayerType.video] : undefined },
    })

  afterEach(() => {
    jest.resetAllMocks()
  })

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    postMock = jest.fn()
    apiMock = mockApi({ get: jest.fn(), post: postMock, put: jest.fn() })
    formDataMock = { append: jest.fn() }
    jest.spyOn(StringsUtilsModule, 'uuid').mockReturnValue(uuidMock)
    validateAddAudioSpy = jest.spyOn(CompositionUtilsModule, 'validateAddAudio')
    validateAddFilterSpy = jest.spyOn(CompositionUtilsModule, 'validateAddFilter')
    validateAddImageSpy = jest.spyOn(CompositionUtilsModule, 'validateAddImage')
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

    describe('when a `videoFile` is provided in the options', () => {
      it('creates a video layer from the provided `videoFile`', () => {
        const composition = makeComposition({ withVideo: true })

        expect(composition.layers).toEqual([{ id: uuidMock, type: LayerType.video }])
      })
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
      composition.addWaveform(waveformOptions)
    })

    it('calls the `append` method on the private `formData` attribute with the correct arguments', async () => {
      await composition.encode()

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