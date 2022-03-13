import { ValidationErrorText } from 'strings'
import { logError } from 'utils/errors'

export const isValidUrl = (url: string): boolean => {
  try {
    validateURL(url)

    return true
  } catch (error) {
    return false
  }
}

export const validateURL = (url: string): void => {
  try {
    new URL(url)
  } catch (error) {
    throw new TypeError(ValidationErrorText.INVALID_URL(url))
  }
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const validatePresenceOf = (value: any, errorMessage: string): void => {
  if (!value) {
    throw new Error(errorMessage)
  }
}

export const validateValueIsOfType = (
  caller: string,
  fieldName: string,
  value: boolean | number | string | Record<string, any> | undefined,
  type: string,
  shouldThrow = false
): string | undefined => {
  if (value && typeof value !== type) {
    const message = ValidationErrorText.MUST_BE_TYPE(caller, fieldName, value, type)

    if (shouldThrow) {
      throw new TypeError(message)
    } else {
      return message
    }
  }

  return undefined
}

export const validateValueIsOfTypes = (
  caller: string,
  fieldName: string,
  value: number | string | Record<string, any> | undefined,
  types: string[],
  shouldThrow = false
): string | undefined => {
  if (value && !types.includes(typeof value)) {
    const message = ValidationErrorText.MUST_BE_TYPE(caller, fieldName, value, ValidationErrorText.OR(types))

    if (shouldThrow) {
      throw new TypeError(message)
    } else {
      return message
    }
  }

  return undefined
}

export const withValidation = <T>(validate: () => void, callback?: () => T | undefined): T => {
  try {
    validate()

    if (callback) {
      return callback()
    }

    return undefined
  } catch ({ name, stack }) {
    logError(stack)

    process.exit(1)
  }
}
