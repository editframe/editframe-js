import colors from 'colors/safe'

export const CompositionErrorText = {
  dataRequired: `\\${colors.white('data')}\\ must be provided`,
  dimensionsRequired: `\\${colors.white('dimensions')}\\ must be provided unless a \\${colors.white(
    'videoFile'
  )}\\ is provided`,
  durationRequired: `\\${colors.white('duration')}\\ must be provided unless a \\${colors.white(
    'videoFile'
  )}\\ is provided`,
  errorEncoding: (error: string): string => `Error encoding video: ${error}`,
  filterRequired: `\\${colors.white('filter')}\\ must be provided`,
  htmlPageOrURLRequired: `Either \\${colors.white('htmlPage')}\\ or \\${colors.white('url')}\\ must be provided`,
  malformedEncodingResponse: `malformed ${colors.white('encoding')}\\ response`,
  optionsRequired: `\\${colors.white('options')}\\ must be provided`,
  textRequired: `\\${colors.white('text')}\\ field required`,
  validationOptionsError: (errors: string): string => `Error: ${errors}`,
}
