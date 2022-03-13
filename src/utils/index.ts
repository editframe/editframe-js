import { baseURL, initializeFetchUtil, makeHeaders, validateApiData } from './api'
import { isApplication, isApplications } from './applications'
import { logError } from './errors'
import { createDirectory, createReadStream, downloadFile, removeDirectory } from './files'
import { prepareFormData, urlOrFile } from './forms'
import { generatePath } from './paths'
import { uuid } from './strings'
import {
  isValidUrl,
  validatePresenceOf,
  validateURL,
  validateValueIsOfType,
  validateValueIsOfTypes,
  withValidation,
} from './validation'
import { validateLayerFormat } from './video'
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
  validateLayerMethod,
  validateVideoOptions,
} from './video/compositions'
import { validateFilter } from './video/filters'
import { escapeHTML } from './video/html'
import {
  validateHorizontalAlignment,
  validateLayerAlignment,
  validateLayerAudio,
  validateLayerBase,
  validateLayerFilter,
  validateLayerHTML,
  validateLayerLottie,
  validateLayerText,
  validateLayerTrim,
  validateLayerVisualMedia,
  validateTextAlignment,
} from './video/layers'
import { isApiVideo, isApiVideoMetadata, isApiVideos, isEncodeResponse } from './videos'

export {
  baseURL,
  createDirectory,
  createReadStream,
  downloadFile,
  escapeHTML,
  formDataKey,
  generatePath,
  initializeFetchUtil,
  isApiVideo,
  isApiVideoMetadata,
  isApiVideos,
  isApplication,
  isApplications,
  isEncodeResponse,
  isValidUrl,
  logError,
  makeHeaders,
  prepareFormData,
  removeDirectory,
  urlOrFile,
  uuid,
  validateAddAudio,
  validateAddFilter,
  validateAddHTML,
  validateAddImage,
  validateAddLottie,
  validateAddText,
  validateAddVideo,
  validateAddWaveform,
  validateApiData,
  validateCompositionOptions,
  validateFilter,
  validateHorizontalAlignment,
  validateLayerAlignment,
  validateLayerAudio,
  validateLayerBase,
  validateLayerFilter,
  validateLayerHTML,
  validateLayerFormat,
  validateLayerLottie,
  validateLayerMethod,
  validateLayerText,
  validateLayerTrim,
  validateLayerVisualMedia,
  validatePresenceOf,
  validateTextAlignment,
  validateURL,
  validateValueIsOfType,
  validateValueIsOfTypes,
  validateVideoOptions,
  withValidation,
}
