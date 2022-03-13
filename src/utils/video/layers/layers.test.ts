import {
  HTMLAttribute,
  LayerAttribute,
  LayerHorizontalAlignmentValue,
  LayerVerticalAlignmentValue,
  PrimitiveType,
  TextAlignmentValue,
} from 'constant'
import { mockHTMLLayer, mockLottieLayer } from 'mocks'
import { CompositionErrorText, ValidationErrorText } from 'strings'
import * as ValidationUtilsModule from 'utils/validation'

import {
  validateHorizontalAlignment,
  validateLayerAlignment,
  validateLayerBase,
  validateLayerHTML,
  validateLayerLottie,
  validateLayerText,
  validateLayerTrim,
  validateLayerVisualMedia,
  validateTextAlignment,
} from './'

describe('validations', () => {
  const callerName = 'callerName'
  const { data } = mockLottieLayer()
  let validateValueIsOfTypeSpy: jest.SpyInstance

  afterEach(() => {
    jest.resetAllMocks()
  })

  beforeEach(() => {
    validateValueIsOfTypeSpy = jest.spyOn(ValidationUtilsModule, 'validateValueIsOfType')
  })

  describe('validateLayerBase', () => {
    const length = 10
    const start = 5

    it('calls the `validateValueIsOfType` function with the correct arguments', () => {
      const finalErrors = validateLayerBase(callerName, { length, start })

      expect(validateValueIsOfTypeSpy).toHaveBeenCalledTimes(2)

      expect(validateValueIsOfTypeSpy).toHaveBeenCalledWith(
        callerName,
        LayerAttribute.start,
        start,
        PrimitiveType.number
      )

      expect(validateValueIsOfTypeSpy).toHaveBeenCalledWith(
        callerName,
        LayerAttribute.length,
        length,
        PrimitiveType.number
      )

      expect(finalErrors).toEqual([])
    })
  })

  describe('validateLayerHTML', () => {
    it('adds the `htmlPageOrURLRequired` error when neither `htmlPage` or `url` is provided', () => {
      const htmlLayer = mockHTMLLayer({ withHTML: false, withURL: false })
      const finalErrors = validateLayerHTML(callerName, htmlLayer)

      expect(finalErrors).toEqual([CompositionErrorText.htmlPageOrURLRequired])
    })

    it('calls the `validateValueIsOfType` function with the correct arguments', () => {
      const htmlLayer = mockHTMLLayer()
      const finalErrors = validateLayerHTML(callerName, htmlLayer)
      const {
        html: { htmlPage, url, withTransparentBackground },
      } = htmlLayer

      expect(validateValueIsOfTypeSpy).toHaveBeenCalledTimes(3)

      expect(validateValueIsOfTypeSpy).toHaveBeenCalledWith(
        callerName,
        ValidationErrorText.SUB_FIELD(LayerAttribute.html, HTMLAttribute.htmlPage),
        htmlPage,
        PrimitiveType.string
      )

      expect(validateValueIsOfTypeSpy).toHaveBeenCalledWith(
        callerName,
        ValidationErrorText.SUB_FIELD(LayerAttribute.html, HTMLAttribute.withTransparentBackground),
        withTransparentBackground,
        PrimitiveType.boolean
      )

      expect(validateValueIsOfTypeSpy).toHaveBeenCalledWith(
        callerName,
        ValidationErrorText.SUB_FIELD(LayerAttribute.html, HTMLAttribute.url),
        url,
        PrimitiveType.string
      )

      expect(finalErrors).toEqual([])
    })
  })

  describe('validateLayerLottie', () => {
    it('calls the `validateValueIsOfType` function with the correct arguments', () => {
      const finalErrors = validateLayerLottie(callerName, { data })

      expect(validateValueIsOfTypeSpy).toHaveBeenCalledTimes(1)

      expect(validateValueIsOfTypeSpy).toHaveBeenCalledWith(callerName, LayerAttribute.data, data, PrimitiveType.object)

      expect(finalErrors).toEqual([])
    })
  })

  describe('validateLayerTrim', () => {
    const end = 10
    const start = 5

    it('calls the `validateValueIsOfType` function with the correct arguments', () => {
      validateLayerTrim(callerName, { trim: { end, start } })

      expect(validateValueIsOfTypeSpy).toHaveBeenCalledTimes(2)

      expect(validateValueIsOfTypeSpy).toHaveBeenCalledWith(
        callerName,
        ValidationErrorText.SUB_FIELD(LayerAttribute.trim, LayerAttribute.start),
        start,
        PrimitiveType.number
      )

      expect(validateValueIsOfTypeSpy).toHaveBeenCalledWith(
        callerName,
        ValidationErrorText.SUB_FIELD(LayerAttribute.trim, LayerAttribute.end),
        end,
        PrimitiveType.number
      )
    })
  })

  describe('validateLayerVisualMedia', () => {
    const backgroundColor = 'background-color'
    const color = 'color'
    const x = 5
    const y = 10

    it('calls the `validateValueIsOfType` function with the correct arguments', () => {
      validateLayerVisualMedia(callerName, { backgroundColor, color, x, y })

      expect(validateValueIsOfTypeSpy).toHaveBeenCalledTimes(4)

      expect(validateValueIsOfTypeSpy).toHaveBeenCalledWith(
        callerName,
        LayerAttribute.backgroundColor,
        backgroundColor,
        PrimitiveType.string
      )

      expect(validateValueIsOfTypeSpy).toHaveBeenCalledWith(
        callerName,
        LayerAttribute.color,
        color,
        PrimitiveType.string
      )

      expect(validateValueIsOfTypeSpy).toHaveBeenCalledWith(callerName, LayerAttribute.x, x, PrimitiveType.number)

      expect(validateValueIsOfTypeSpy).toHaveBeenCalledWith(callerName, LayerAttribute.y, y, PrimitiveType.number)
    })
  })

  describe('validateHorizontalAlignment', () => {
    const horizontalAlignment = 'invalid-horizontal-alignment'

    it('returns an error if the provided `horizontalAlignment` is invalid', () => {
      expect(
        validateHorizontalAlignment(callerName, LayerAttribute.horizontalAlignment, horizontalAlignment as any)
      ).toEqual(
        ValidationErrorText.MUST_BE_TYPE(
          callerName,
          LayerAttribute.horizontalAlignment,
          horizontalAlignment,
          Object.values(LayerHorizontalAlignmentValue).join(', ')
        )
      )
    })
  })

  describe('validateTextAlignment', () => {
    const textAlign = 'invalid-text-alignment'

    it('returns an error if the provided `textAlign` is invalid', () => {
      expect(validateTextAlignment(callerName, textAlign as any)).toEqual(
        ValidationErrorText.MUST_BE_TYPE(
          callerName,
          LayerAttribute.textAlign,
          textAlign,
          Object.values(TextAlignmentValue).join(', ')
        )
      )
    })
  })

  describe('validateLayerAlignment', () => {
    const invalidHorizontalAlignment = 'invalid-horizontal-alignment'
    const invalidVerticalAlignment = 'invalid-vertical-alignment'

    it('returns an error if the provided `horizontalAlignment` is invalid', () => {
      expect(validateLayerAlignment(callerName, { horizontalAlignment: invalidHorizontalAlignment as any })).toEqual([
        ValidationErrorText.MUST_BE_TYPE(
          callerName,
          LayerAttribute.horizontalAlignment,
          invalidHorizontalAlignment,
          Object.values(LayerHorizontalAlignmentValue).join(', ')
        ),
      ])
    })

    it('returns an error if the provided `verticalAlignment` is invalid', () => {
      expect(
        validateLayerAlignment(callerName, {
          horizontalAlignment: LayerHorizontalAlignmentValue.center,
          verticalAlignment: invalidVerticalAlignment as any,
        })
      ).toEqual([
        ValidationErrorText.MUST_BE_TYPE(
          callerName,
          LayerAttribute.verticalAlignment,
          invalidVerticalAlignment,
          Object.values(LayerVerticalAlignmentValue).join(', ')
        ),
      ])
    })
  })

  describe('validateLayerText', () => {
    const fontFamily = 'font-family'
    const fontSize = 10
    const maxFontSize = 20
    const maxHeight = 30
    const maxWidth = 40
    const text = 'text'
    const textAlign = 'invalid-text-alignment'

    it('calls the `validateValueIsOfType` function with the correct arguments', () => {
      validateLayerText(callerName, {
        fontFamily,
        fontSize,
        maxFontSize,
        maxHeight,
        maxWidth,
        text,
        textAlign: TextAlignmentValue.center,
      })

      expect(validateValueIsOfTypeSpy).toHaveBeenCalledTimes(6)

      expect(validateValueIsOfTypeSpy).toHaveBeenCalledWith(
        callerName,
        LayerAttribute.fontFamily,
        fontFamily,
        PrimitiveType.string
      )

      expect(validateValueIsOfTypeSpy).toHaveBeenCalledWith(
        callerName,
        LayerAttribute.fontSize,
        fontSize,
        PrimitiveType.number
      )

      expect(validateValueIsOfTypeSpy).toHaveBeenCalledWith(
        callerName,
        LayerAttribute.maxFontSize,
        maxFontSize,
        PrimitiveType.number
      )

      expect(validateValueIsOfTypeSpy).toHaveBeenCalledWith(
        callerName,
        LayerAttribute.maxHeight,
        maxHeight,
        PrimitiveType.number
      )

      expect(validateValueIsOfTypeSpy).toHaveBeenCalledWith(
        callerName,
        LayerAttribute.maxWidth,
        maxWidth,
        PrimitiveType.number
      )

      expect(validateValueIsOfTypeSpy).toHaveBeenCalledWith(callerName, LayerAttribute.text, text, PrimitiveType.string)
    })

    it('returns an error if the provided `textAlign` is invalid', () => {
      expect(
        validateLayerText(callerName, {
          fontFamily,
          fontSize,
          maxFontSize,
          maxHeight,
          maxWidth,
          text,
          textAlign: textAlign as any,
        })
      ).toEqual([
        ValidationErrorText.MUST_BE_TYPE(
          callerName,
          LayerAttribute.textAlign,
          textAlign,
          Object.values(TextAlignmentValue).join(', ')
        ),
      ])
    })
  })
})
