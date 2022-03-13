import {
  CompositionInterface,
  FilterName,
  IdentifiedLayer,
  LayerAttribute,
  LayerFormatValue,
  PrimitiveType,
  VisualMediaMethod,
} from 'constant'
import { mockComposition } from 'mocks'
import { ValidationErrorText } from 'strings'
import * as ValidationUtilsModule from 'utils/validation'
import * as VideoUtilsModule from 'utils/video'
import * as FilterUtilsModule from 'utils/video/filters'

import { VisualMedia } from './'

describe('VisualMedia', () => {
  const id = 'id'
  const layers: IdentifiedLayer[] = []
  let compositionMock: CompositionInterface
  let visualMedia: VisualMedia
  let validateFilterSpy: jest.SpyInstance
  let validateLayerFormatSpy: jest.SpyInstance
  let validatePresenceOfSpy: jest.SpyInstance
  let validateValueIsOfTypeSpy: jest.SpyInstance

  afterEach(() => {
    jest.resetAllMocks()
  })

  beforeEach(() => {
    validateFilterSpy = jest.spyOn(FilterUtilsModule, 'validateFilter')
    validateLayerFormatSpy = jest.spyOn(VideoUtilsModule, 'validateLayerFormat')
    validatePresenceOfSpy = jest.spyOn(ValidationUtilsModule, 'validatePresenceOf')
    validateValueIsOfTypeSpy = jest.spyOn(ValidationUtilsModule, 'validateValueIsOfType')
    compositionMock = mockComposition({
      layer: jest.fn(),
      layers,
      updateLayerAttribute: jest.fn(),
    })

    visualMedia = new VisualMedia({ composition: compositionMock, id })
  })

  describe('setBackgroundColor', () => {
    const backgroundColor = 'background-color'

    beforeEach(() => {
      visualMedia.setBackgroundColor(backgroundColor)
    })

    it('calls the `validateValueIsOfType` function', () => {
      expect(validateValueIsOfTypeSpy).toHaveBeenCalledWith(
        VisualMediaMethod.setBackgroundColor,
        LayerAttribute.backgroundColor,
        backgroundColor,
        PrimitiveType.string,
        true
      )
    })

    it('calls the `updateLayerAttribute` method on the composition with the correct arguments', () => {
      expect(compositionMock.updateLayerAttribute).toHaveBeenCalledWith(
        id,
        LayerAttribute.backgroundColor,
        backgroundColor
      )
    })
  })

  describe('setColor', () => {
    const color = 'color'

    beforeEach(() => {
      visualMedia.setColor(color)
    })

    it('calls the `validateValueIsOfType` function', () => {
      expect(validateValueIsOfTypeSpy).toHaveBeenCalledWith(
        VisualMediaMethod.setColor,
        LayerAttribute.color,
        color,
        PrimitiveType.string,
        true
      )
    })

    it('calls the `updateLayerAttribute` method on the composition with the correct arguments', () => {
      visualMedia.setColor(color)

      expect(compositionMock.updateLayerAttribute).toHaveBeenCalledWith(id, LayerAttribute.color, color)
    })
  })

  describe('setDimensions', () => {
    const height = 10
    const width = 20

    beforeEach(() => {
      visualMedia.setDimensions({ height, width })
    })

    it('calls the `validatePresenceOf` function with the correct arguments', () => {
      expect(validatePresenceOfSpy).toHaveBeenCalledWith(
        height,
        ValidationErrorText.REQUIRED_FIELD(LayerAttribute.height)
      )
      expect(validatePresenceOfSpy).toHaveBeenCalledWith(
        width,
        ValidationErrorText.REQUIRED_FIELD(LayerAttribute.width)
      )
    })

    it('calls the `updateLayerAttribute` method on the composition with the correct arguments', () => {
      expect(compositionMock.updateLayerAttribute).toHaveBeenCalledWith(id, LayerAttribute.height, height)
      expect(compositionMock.updateLayerAttribute).toHaveBeenCalledWith(id, LayerAttribute.width, width)
    })
  })

  describe('setFilter', () => {
    const filterName = FilterName.brightness
    const options = { brightness: 10 }
    const filter = { filterName, options }

    beforeEach(() => {
      visualMedia.setFilter(filter)
    })

    it('calls the `validateFilter` function with the correct arguments', () => {
      expect(validateFilterSpy).toHaveBeenCalledWith(
        VisualMediaMethod.setFilter,
        LayerAttribute.filter,
        {
          filterName,
          options,
        },
        true
      )
    })

    it('calls the `updateLayerAttribute` method on the composition with the correct arguments', () => {
      expect(compositionMock.updateLayerAttribute).toHaveBeenCalledWith(id, LayerAttribute.filter, filter)
    })
  })

  describe('setFormat', () => {
    const format = LayerFormatValue.fill

    beforeEach(() => {
      visualMedia.setFormat(format)
    })

    it('calls the `validateLayerFormat` function with the correct arguments', () => {
      expect(validateLayerFormatSpy).toHaveBeenCalledWith(format)
    })

    it('calls the `updateLayerAttribute` method on the composition with the correct arguments', () => {
      expect(compositionMock.updateLayerAttribute).toHaveBeenCalledWith(id, LayerAttribute.format, format)
    })
  })

  describe('setHeight', () => {
    const height = 100

    beforeEach(() => {
      visualMedia.setHeight(height)
    })

    it('calls the `validateValueIsOfType` function', () => {
      expect(validateValueIsOfTypeSpy).toHaveBeenCalledWith(
        VisualMediaMethod.setHeight,
        LayerAttribute.height,
        height,
        PrimitiveType.number,
        true
      )
    })

    it('calls the `updateLayerAttribute` method on the composition with the correct arguments', () => {
      expect(compositionMock.updateLayerAttribute).toHaveBeenCalledWith(id, LayerAttribute.height, height)
    })
  })

  describe('setWidth', () => {
    const width = 200

    beforeEach(() => {
      visualMedia.setWidth(width)
    })

    it('calls the `validateValueIsOfType` function', () => {
      expect(validateValueIsOfTypeSpy).toHaveBeenCalledWith(
        VisualMediaMethod.setWidth,
        LayerAttribute.width,
        width,
        PrimitiveType.number,
        true
      )
    })

    it('calls the `updateLayerAttribute` method on the composition with the correct arguments', () => {
      expect(compositionMock.updateLayerAttribute).toHaveBeenCalledWith(id, LayerAttribute.width, width)
    })
  })

  describe('setX', () => {
    const x = 20

    beforeEach(() => {
      visualMedia.setX(x)
    })

    it('calls the `validateValueIsOfType` function', () => {
      expect(validateValueIsOfTypeSpy).toHaveBeenCalledWith(
        VisualMediaMethod.setX,
        LayerAttribute.x,
        x,
        PrimitiveType.number,
        true
      )
    })

    it('calls the `updateLayerAttribute` method on the composition with the correct arguments', () => {
      expect(compositionMock.updateLayerAttribute).toHaveBeenCalledWith(id, LayerAttribute.x, x)
    })
  })

  describe('setY', () => {
    const y = 20

    beforeEach(() => {
      visualMedia.setY(y)
    })

    it('calls the `validateValueIsOfType` function', () => {
      expect(validateValueIsOfTypeSpy).toHaveBeenCalledWith(
        VisualMediaMethod.setY,
        LayerAttribute.y,
        y,
        PrimitiveType.number,
        true
      )
    })

    it('calls the `updateLayerAttribute` method on the composition with the correct arguments', () => {
      expect(compositionMock.updateLayerAttribute).toHaveBeenCalledWith(id, LayerAttribute.y, y)
    })
  })
})
