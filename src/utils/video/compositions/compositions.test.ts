import { ApiVideoMethod, CompositionMethod, CompositionOptionAttribute, LayerAttribute, PrimitiveType } from 'constant'
import {
  mockAudioLayer,
  mockCompositionOptions,
  mockFilterLayer,
  mockHTMLLayer,
  mockImageLayer,
  mockLottieLayer,
  mockTextLayer,
  mockVideoLayer,
  mockWaveformLayer,
} from 'mocks'
import { CompositionErrorText, ValidationErrorText } from 'strings'
import * as ValidationUtilsModule from 'utils/validation'
import * as LayerUtilsModule from 'utils/video/layers'

import {
  formDataKey,
  validateAddAudio,
  validateAddFilter,
  validateAddHTML,
  validateAddImage,
  validateAddLottie,
  validateAddText,
  validateAddVideo,
  validateAddWaveform,
  validateCompositionOptions,
  validateVideoOptions,
} from './'

describe('formDataKey', () => {
  it('returns the correct string for strings', () => {
    const file = 'file'
    const id = 'id'

    expect(formDataKey(file, id)).toEqual(`url${id}`)
  })

  it('returns the correct string for Blobs', () => {
    const file = new Blob([])
    const id = 'id'

    expect(formDataKey(file, id)).toEqual(`file${id}`)
  })
})

describe('validations', () => {
  let validateLayerAlignmentSpy: jest.SpyInstance
  let validateLayerAudioSpy: jest.SpyInstance
  let validateLayerBaseSpy: jest.SpyInstance
  let validateLayerFilterSpy: jest.SpyInstance
  let validateLayerHTMLSpy: jest.SpyInstance
  let validateLayerLottieSpy: jest.SpyInstance
  let validateLayerTextSpy: jest.SpyInstance
  let validateLayerTrimSpy: jest.SpyInstance
  let validateLayerVisualMediaSpy: jest.SpyInstance
  let validatePresenceOfSpy: jest.SpyInstance
  let validateValueIsOfTypeSpy: jest.SpyInstance

  afterEach(() => {
    jest.clearAllMocks()
  })

  beforeEach(() => {
    validateLayerAlignmentSpy = jest.spyOn(LayerUtilsModule, 'validateLayerAlignment')
    validateLayerAudioSpy = jest.spyOn(LayerUtilsModule, 'validateLayerAudio')
    validateLayerBaseSpy = jest.spyOn(LayerUtilsModule, 'validateLayerBase')
    validateLayerFilterSpy = jest.spyOn(LayerUtilsModule, 'validateLayerFilter')
    validateLayerHTMLSpy = jest.spyOn(LayerUtilsModule, 'validateLayerHTML')
    validateLayerLottieSpy = jest.spyOn(LayerUtilsModule, 'validateLayerLottie')
    validateLayerTextSpy = jest.spyOn(LayerUtilsModule, 'validateLayerText')
    validateLayerTrimSpy = jest.spyOn(LayerUtilsModule, 'validateLayerTrim')
    validateLayerVisualMediaSpy = jest.spyOn(LayerUtilsModule, 'validateLayerVisualMedia')
    validatePresenceOfSpy = jest.spyOn(ValidationUtilsModule, 'validatePresenceOf')
    validateValueIsOfTypeSpy = jest.spyOn(ValidationUtilsModule, 'validateValueIsOfType')
  })

  describe('validateVideoOptions', () => {
    const compositionOptions = mockCompositionOptions()
    const { backgroundColor, dimensions, duration } = compositionOptions

    it('calls the `validateValueIsOfType` function with the correct arguments', () => {
      validateVideoOptions(compositionOptions)

      expect(validateValueIsOfTypeSpy).toHaveBeenCalledWith(
        ApiVideoMethod.new,
        ValidationErrorText.SUB_FIELD(CompositionOptionAttribute.dimensions, LayerAttribute.height),
        dimensions.height,
        PrimitiveType.number
      )
      expect(validateValueIsOfTypeSpy).toHaveBeenCalledWith(
        ApiVideoMethod.new,
        ValidationErrorText.SUB_FIELD(CompositionOptionAttribute.dimensions, LayerAttribute.width),
        dimensions.width,
        PrimitiveType.number
      )

      expect(validateValueIsOfTypeSpy).toHaveBeenCalledWith(
        ApiVideoMethod.new,
        CompositionOptionAttribute.duration,
        duration,
        PrimitiveType.number
      )

      expect(validateValueIsOfTypeSpy).toHaveBeenCalledWith(
        ApiVideoMethod.new,
        CompositionOptionAttribute.backgroundColor,
        backgroundColor,
        PrimitiveType.string
      )
    })

    describe('when any of the validator functions return an error message', () => {
      it('throws the error messages', () => {
        const invalidOptions = { backgroundColor: 123, dimensions: { height: '10', width: 20 }, duration: 'abc' }

        expect(() => validateVideoOptions(invalidOptions as any)).toThrow(
          new TypeError(
            `${ValidationErrorText.MUST_BE_TYPE(
              ApiVideoMethod.new,
              ValidationErrorText.SUB_FIELD(CompositionOptionAttribute.dimensions, LayerAttribute.height),
              invalidOptions.dimensions.height,
              PrimitiveType.number
            )}\n${ValidationErrorText.MUST_BE_TYPE(
              ApiVideoMethod.new,
              CompositionOptionAttribute.duration,
              invalidOptions.duration,
              PrimitiveType.number
            )}\n${ValidationErrorText.MUST_BE_TYPE(
              ApiVideoMethod.new,
              CompositionOptionAttribute.backgroundColor,
              invalidOptions.backgroundColor,
              PrimitiveType.string
            )}`
          )
        )
      })
    })
  })
  describe('validateCompositionOptions', () => {
    const compositionOptions = mockCompositionOptions()
    const { backgroundColor, dimensions, duration } = compositionOptions

    it('calls the `validatePresenceOf` function with the correct arguments', () => {
      validateCompositionOptions(compositionOptions)

      expect(validatePresenceOfSpy).toHaveBeenCalledWith(duration, CompositionErrorText.durationRequired)
    })

    it('calls the `validateValueIsOfType` function with the correct arguments', () => {
      validateCompositionOptions(compositionOptions)

      expect(validateValueIsOfTypeSpy).toHaveBeenCalledWith(
        ApiVideoMethod.new,
        ValidationErrorText.SUB_FIELD(CompositionOptionAttribute.dimensions, LayerAttribute.height),
        dimensions.height,
        PrimitiveType.number
      )

      expect(validateValueIsOfTypeSpy).toHaveBeenCalledWith(
        ApiVideoMethod.new,
        ValidationErrorText.SUB_FIELD(CompositionOptionAttribute.dimensions, LayerAttribute.width),
        dimensions.width,
        PrimitiveType.number
      )

      expect(validateValueIsOfTypeSpy).toHaveBeenCalledWith(
        ApiVideoMethod.new,
        CompositionOptionAttribute.backgroundColor,
        backgroundColor,
        PrimitiveType.string
      )
    })

    describe('when any of the validator functions return an error message', () => {
      it('throws the error messages', () => {
        const invalidOptions = { backgroundColor: 123, dimensions: { height: '10', width: 20 }, duration: 'abc' }

        expect(() => validateCompositionOptions(invalidOptions as any)).toThrow(
          new TypeError(
            `${ValidationErrorText.MUST_BE_TYPE(
              ApiVideoMethod.new,
              ValidationErrorText.SUB_FIELD(CompositionOptionAttribute.dimensions, LayerAttribute.height),
              invalidOptions.dimensions.height,
              PrimitiveType.number
            )}\n${ValidationErrorText.MUST_BE_TYPE(
              ApiVideoMethod.new,
              CompositionOptionAttribute.backgroundColor,
              invalidOptions.backgroundColor,
              PrimitiveType.string
            )}`
          )
        )
      })
    })
  })

  describe('validateAddAudio', () => {
    const audioOptions = mockAudioLayer()

    beforeEach(() => {
      validateAddAudio(audioOptions)
    })

    it('calls the `validateLayerBase` function with the correct arguments', () => {
      expect(validateLayerBaseSpy).toHaveBeenCalledWith(CompositionMethod.addAudio, audioOptions)
    })

    it('calls the `validateLayerTrim` function with the correct arguments', () => {
      expect(validateLayerTrimSpy).toHaveBeenCalledWith(CompositionMethod.addAudio, audioOptions)
    })

    it('calls the `validateLayerAudio` function with the correct arguments', () => {
      expect(validateLayerAudioSpy).toHaveBeenCalledWith(CompositionMethod.addAudio, audioOptions)
    })
  })

  describe('validateAddImage', () => {
    const imageOptions = mockImageLayer()

    beforeEach(() => {
      validateAddImage(imageOptions)
    })

    it('calls the `validateLayerBase` function with the correct arguments', () => {
      expect(validateLayerBaseSpy).toHaveBeenCalledWith(CompositionMethod.addImage, imageOptions)
    })

    it('calls the `validateLayerVisualMedia` function with the correct arguments', () => {
      expect(validateLayerVisualMediaSpy).toHaveBeenCalledWith(CompositionMethod.addImage, imageOptions)
    })

    it('calls the `validateLayerFilter` function with the correct arguments', () => {
      expect(validateLayerFilterSpy).toHaveBeenCalledWith(CompositionMethod.addImage, imageOptions)
    })
  })

  describe('validateAddLottie', () => {
    const lottieOptions = mockLottieLayer()

    beforeEach(() => {
      validateAddLottie(lottieOptions)
    })

    it('calls the `validateLayerBase` function with the correct arguments', () => {
      expect(validateLayerBaseSpy).toHaveBeenCalledWith(CompositionMethod.addLottie, lottieOptions)
    })

    it('calls the `validateLayerVisualMedia` function with the correct arguments', () => {
      expect(validateLayerVisualMediaSpy).toHaveBeenCalledWith(CompositionMethod.addLottie, lottieOptions)
    })

    it('calls the `validateLayerLottie` function with the correct arguments', () => {
      expect(validateLayerLottieSpy).toHaveBeenCalledWith(CompositionMethod.addLottie, lottieOptions)
    })
  })

  describe('validateAddText', () => {
    const textOptions = mockTextLayer()

    beforeEach(() => {
      validateAddText(textOptions)
    })

    it('calls the `validateLayerBase` function with the correct arguments', () => {
      expect(validateLayerBaseSpy).toHaveBeenCalledWith(CompositionMethod.addText, textOptions)
    })

    it('calls the `validateLayerVisualMedia` function with the correct arguments', () => {
      expect(validateLayerVisualMediaSpy).toHaveBeenCalledWith(CompositionMethod.addText, textOptions)
    })

    it('calls the `validateLayerAlignment` function with the correct arguments', () => {
      expect(validateLayerAlignmentSpy).toHaveBeenCalledWith(CompositionMethod.addText, textOptions)
    })

    it('calls the `validateLayerText` function with the correct arguments', () => {
      expect(validateLayerTextSpy).toHaveBeenCalledWith(CompositionMethod.addText, textOptions)
    })
  })

  describe('validateAddVideo', () => {
    const videoOptions = mockVideoLayer()

    beforeEach(() => {
      validateAddVideo(videoOptions)
    })

    it('calls the `validateLayerBase` function with the correct arguments', () => {
      expect(validateLayerBaseSpy).toHaveBeenCalledWith(CompositionMethod.addVideo, videoOptions)
    })

    it('calls the `validateLayerTrim` function with the correct arguments', () => {
      expect(validateLayerTrimSpy).toHaveBeenCalledWith(CompositionMethod.addVideo, videoOptions)
    })

    it('calls the `validateLayerAudio` function with the correct arguments', () => {
      expect(validateLayerAudioSpy).toHaveBeenCalledWith(CompositionMethod.addVideo, videoOptions)
    })

    it('calls the `validateLayerVisualMedia` function with the correct arguments', () => {
      expect(validateLayerVisualMediaSpy).toHaveBeenCalledWith(CompositionMethod.addVideo, videoOptions)
    })
  })

  describe('validateAddHTML', () => {
    const htmlLayer = mockHTMLLayer()

    beforeEach(() => {
      validateAddHTML(htmlLayer)
    })

    it('calls the `validateLayerBase` function with the correct arguments', () => {
      expect(validateLayerBaseSpy).toHaveBeenCalledWith(CompositionMethod.addHTML, htmlLayer)
    })

    it('calls the `validateLayerVisualMedia` function with the correct arguments', () => {
      expect(validateLayerVisualMediaSpy).toHaveBeenCalledWith(CompositionMethod.addHTML, htmlLayer)
    })

    it('calls the `validateFilter` function with the correct arguments', () => {
      expect(validateLayerFilterSpy).toHaveBeenCalledWith(CompositionMethod.addHTML, htmlLayer)
    })

    it('calls the `validateLayerHTML` function with the correct arguments', () => {
      expect(validateLayerHTMLSpy).toHaveBeenCalledWith(CompositionMethod.addHTML, htmlLayer)
    })
  })

  describe('validateAddFilter', () => {
    const filterOptions = mockFilterLayer()

    beforeEach(() => {
      validateAddFilter(filterOptions)
    })

    it('calls the `validateLayerBase` function with the correct arguments', () => {
      expect(validateLayerBaseSpy).toHaveBeenCalledWith(CompositionMethod.addFilter, filterOptions)
    })

    it('calls the `validateFilter` function with the correct arguments', () => {
      expect(validateLayerFilterSpy).toHaveBeenCalledWith(CompositionMethod.addFilter, filterOptions)
    })
  })

  describe('validateAddWaveform', () => {
    const waveformOptions = mockWaveformLayer()

    beforeEach(() => {
      validateAddWaveform(waveformOptions)
    })

    it('calls the `validateLayerBase` function with the correct arguments', () => {
      expect(validateLayerBaseSpy).toHaveBeenCalledWith(CompositionMethod.addWaveform, waveformOptions)
    })

    it('calls the `validateLayerVisualMedia` function with the correct arguments', () => {
      expect(validateLayerVisualMediaSpy).toHaveBeenCalledWith(CompositionMethod.addWaveform, waveformOptions)
    })

    it('calls the `validateValueIsOfType` funciton with the correct arguments', () => {
      expect(validateValueIsOfTypeSpy).toHaveBeenCalledWith(
        CompositionMethod.addWaveform,
        LayerAttribute.style,
        waveformOptions.style,
        PrimitiveType.string
      )
    })
  })
})
