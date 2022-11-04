import { LayerKey, PositionKey, PositionMethod, PrimitiveType } from 'constant'
import { mockPositionOptions } from 'mocks'
import { ValidationErrorText } from 'strings'
import * as ValidationUtilsModule from 'utils/validation'

import {
  validateHorizontalAlignment,
  validatePosition,
  validatePositionMixin,
  validateVerticalAlignment,
  validateX,
  validateY,
} from './'
import * as PositionValidationModule from './'

describe('validateX', () => {
  const callerName = 'caller-name'
  const layerKey = 'layer-key'

  it('returns an error if the provided `x` is an invalid string', () => {
    const x = 'invalid-x'

    expect(validateX(callerName, layerKey, x as any)).toEqual(
      validateHorizontalAlignment(callerName, layerKey, x as any)
    )
  })

  it('returns an error if the provided `x` is an invalid non-string', () => {
    const x = true

    expect(validateX(callerName, layerKey, x as any)).toEqual(
      ValidationUtilsModule.validateValueIsOfType(callerName, layerKey, x, PrimitiveType.number)
    )
  })
})

describe('validateY', () => {
  const callerName = 'caller-name'
  const layerKey = 'layer-key'

  it('returns an error if the provided `y` is an invalid string', () => {
    const y = 'invalid-y'

    expect(validateY(callerName, layerKey, y as any)).toEqual(validateVerticalAlignment(callerName, layerKey, y as any))
  })

  it('returns an error if the provided `y` is an invalid non-string', () => {
    const y = true

    expect(validateY(callerName, layerKey, y as any)).toEqual(
      ValidationUtilsModule.validateValueIsOfType(callerName, layerKey, y, PrimitiveType.number)
    )
  })
})

describe('validatePosition', () => {
  const callerName = 'caller-name'
  const angle = 20
  const angleX = 40
  const angleY = 60
  const isRelative = false
  const origin = 'left'
  const x = 5
  const y = 10
  const layer = { position: { angle, angleX, angleY, isRelative, origin, x, y } }
  let validateValueIsOfTypeSpy: jest.SpyInstance
  let validateXSpy: jest.SpyInstance
  let validateYSpy: jest.SpyInstance

  beforeEach(() => {
    validateValueIsOfTypeSpy = jest.spyOn(ValidationUtilsModule, 'validateValueIsOfType')
    validateXSpy = jest.spyOn(PositionValidationModule, 'validateX')
    validateYSpy = jest.spyOn(PositionValidationModule, 'validateY')

    validatePosition({ callerName, layer })
  })

  it('calls the `validateValueIsOfType` function with the correct arguments', () => {
    expect(validateValueIsOfTypeSpy).toHaveBeenCalledTimes(7) // twice via validateX/Y

    expect(validateValueIsOfTypeSpy).toHaveBeenCalledWith(
      callerName,
      ValidationErrorText.SUB_FIELD(LayerKey.position, PositionKey.angle),
      angle,
      PrimitiveType.number
    )

    expect(validateValueIsOfTypeSpy).toHaveBeenCalledWith(
      callerName,
      ValidationErrorText.SUB_FIELD(LayerKey.position, PositionKey.angleX),
      angleX,
      PrimitiveType.number
    )

    expect(validateValueIsOfTypeSpy).toHaveBeenCalledWith(
      callerName,
      ValidationErrorText.SUB_FIELD(LayerKey.position, PositionKey.angleY),
      angleY,
      PrimitiveType.number
    )

    expect(validateValueIsOfTypeSpy).toHaveBeenCalledWith(
      callerName,
      ValidationErrorText.SUB_FIELD(LayerKey.position, PositionKey.isRelative),
      isRelative,
      PrimitiveType.boolean
    )

    expect(validateValueIsOfTypeSpy).toHaveBeenCalledWith(
      callerName,
      ValidationErrorText.SUB_FIELD(LayerKey.position, PositionKey.origin),
      origin,
      PrimitiveType.string
    )
  })

  it('calls the `validateX` function with the correct arguments', () => {
    expect(validateXSpy).toHaveBeenCalledWith(
      callerName,
      ValidationErrorText.SUB_FIELD(LayerKey.position, PositionKey.x),
      x
    )
  })

  it('calls the `validateY` function with the correct arguments', () => {
    expect(validateYSpy).toHaveBeenCalledWith(
      callerName,
      ValidationErrorText.SUB_FIELD(LayerKey.position, PositionKey.y),
      y
    )
  })
})

describe('validatePositionMixin', () => {
  const callerName = PositionMethod.setX
  const position = mockPositionOptions()
  const layer = { position }
  let validateLayerSpy: jest.SpyInstance

  beforeEach(() => {
    validateLayerSpy = jest.spyOn(ValidationUtilsModule, 'validateLayer')
  })

  it('calls the `validateLayer` function with the correct arguments', () => {
    validatePositionMixin(callerName, layer)

    expect(validateLayerSpy).toHaveBeenCalledWith([validatePosition], callerName, layer)
  })
})
