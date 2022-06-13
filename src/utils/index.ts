import { baseUrl, initializeFetchUtil, makeHeaders } from './api'
import {
  makeDefaultAudioLayer,
  makeDefaultAudioLayerConfig,
  makeDefaultHtmlLayer,
  makeDefaultHtmlLayerConfig,
  makeDefaultImageLayer,
  makeDefaultImageLayerConfig,
  makeDefaultLottieLayer,
  makeDefaultLottieLayerConfig,
  makeDefaultSequenceLayer,
  makeDefaultSequenceLayerConfig,
  makeDefaultSize,
  makeDefaultSubtitlesLayer,
  makeDefaultSubtitlesLayerConfig,
  makeDefaultTextLayer,
  makeDefaultTextLayerConfig,
  makeDefaultVideoLayer,
  makeDefaultVideoLayerConfig,
  makeDefaultWaveformLayer,
  makeDefaultWaveformLayerConfig,
} from './defaults'
import { logError } from './errors'
import {
  createDirectory,
  createReadStream,
  createTemporaryDirectory,
  downloadFile,
  fileExists,
  getExtension,
  removeDirectory,
  saveFile,
} from './files'
import { prepareFormData, urlOrFile } from './forms'
import { deepClone, deepMerge } from './objects'
import { generatePath, withPaginationQueryParams, withQueryParams } from './paths'
import { exitProcess } from './process'
import { sanitizeHtml } from './sanitization'
import { uuid } from './strings'
import {
  assertType,
  filterUndefined,
  isValidUrl,
  validateLayer,
  validateOptions,
  validatePresenceOf,
  validateUrl,
  validateValueIsInList,
  validateValueIsOfType,
  validateValueIsOfTypes,
  withValidation,
  withValidationAsync,
} from './validation'
import { metadataValidatorsByType, validateApiData } from './validation/api'
import { isApplication, isApplications } from './validation/applications'
import { validateCompositionFile, validateCompositionOptions } from './validation/composition'
import {
  validateAudio,
  validateAudioMixin,
  validatePosition,
  validatePositionMixin,
  validateSize,
  validateSizeMixin,
  validateTimeline,
  validateTimelineMixin,
  validateTransitions,
  validateTransitionsMixin,
  validateTrim,
  validateTrimMixin,
  validateX,
  validateY,
} from './validation/layerConfigs'
import {
  validateAudioLayer,
  validateFilter,
  validateFilterLayer,
  validateFontStyle,
  validateFontWeight,
  validateHtml,
  validateHtmlLayer,
  validateImageLayer,
  validateLottie,
  validateLottieLayer,
  validateSequenceLayer,
  validateSubtitles,
  validateSubtitlesLayer,
  validateText,
  validateTextAlign,
  validateTextLayer,
  validateTextPosition,
  validateVideoLayer,
  validateWaveform,
  validateWaveformLayer,
} from './validation/layers'
import { isAudioExtension, isImageExtension, isVideoExtension } from './validation/media'
import { isPaginated } from './validation/pagination'
import {
  isApiAudioMetadata,
  isApiImageMetadata,
  isApiVideo,
  isApiVideoMetadata,
  isApiVideos,
  isEncodeResponse,
  validateNewVideo,
} from './validation/videos'
import { formDataKey, processCompositionFile, processCrossfades, setLayerDefaults } from './video/compositions'
import { preparePreview } from './video/preview'

export {
  assertType,
  baseUrl,
  createDirectory,
  createReadStream,
  createTemporaryDirectory,
  deepClone,
  deepMerge,
  downloadFile,
  exitProcess,
  fileExists,
  filterUndefined,
  formDataKey,
  generatePath,
  getExtension,
  initializeFetchUtil,
  isApiAudioMetadata,
  isApiImageMetadata,
  isApiVideo,
  isApiVideoMetadata,
  isApiVideos,
  isApplication,
  isApplications,
  isAudioExtension,
  isEncodeResponse,
  isImageExtension,
  isPaginated,
  isValidUrl,
  isVideoExtension,
  logError,
  makeDefaultAudioLayer,
  makeDefaultAudioLayerConfig,
  makeDefaultHtmlLayer,
  makeDefaultHtmlLayerConfig,
  makeDefaultImageLayer,
  makeDefaultImageLayerConfig,
  makeDefaultLottieLayer,
  makeDefaultLottieLayerConfig,
  makeDefaultSequenceLayer,
  makeDefaultSequenceLayerConfig,
  makeDefaultSubtitlesLayer,
  makeDefaultSubtitlesLayerConfig,
  makeDefaultSize,
  makeDefaultTextLayer,
  makeDefaultTextLayerConfig,
  makeDefaultVideoLayer,
  makeDefaultVideoLayerConfig,
  makeDefaultWaveformLayer,
  makeDefaultWaveformLayerConfig,
  makeHeaders,
  metadataValidatorsByType,
  prepareFormData,
  preparePreview,
  processCompositionFile,
  processCrossfades,
  removeDirectory,
  sanitizeHtml,
  saveFile,
  setLayerDefaults,
  urlOrFile,
  uuid,
  validateApiData,
  validateAudio,
  validateAudioMixin,
  validateAudioLayer,
  validateCompositionFile,
  validateCompositionOptions,
  validateFilter,
  validateFilterLayer,
  validateFontStyle,
  validateFontWeight,
  validateHtml,
  validateHtmlLayer,
  validateImageLayer,
  validateLayer,
  validateLottie,
  validateLottieLayer,
  validateNewVideo,
  validateOptions,
  validatePosition,
  validatePositionMixin,
  validatePresenceOf,
  validateSize,
  validateSizeMixin,
  validateSequenceLayer,
  validateSubtitles,
  validateSubtitlesLayer,
  validateText,
  validateTextAlign,
  validateTextLayer,
  validateTextPosition,
  validateTimeline,
  validateTimelineMixin,
  validateTransitions,
  validateTransitionsMixin,
  validateTrim,
  validateTrimMixin,
  validateUrl,
  validateValueIsInList,
  validateValueIsOfType,
  validateValueIsOfTypes,
  validateVideoLayer,
  validateWaveform,
  validateWaveformLayer,
  validateX,
  validateY,
  withPaginationQueryParams,
  withQueryParams,
  withValidation,
  withValidationAsync,
}
