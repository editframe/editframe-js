import { Readable } from 'node:stream'
import { JsonValue } from 'type-fest'

import {
  ChildKey,
  CompositionKey,
  Dimensions,
  FilterOptions,
  HtmlOptions,
  HtmlPage,
  IdentifiedLayer,
  LayerKey,
  SubtitlesOptions,
  TextPosition,
  TransitionOptions,
} from 'constant/shared'
import { LottieAnimationData } from 'constant/video/layers/lottie'

export type LayerAttributeValue =
  | boolean
  | number
  | string
  | FilterOptions
  | HtmlOptions
  | HtmlPage
  | LottieAnimationData
  | Readable
  | SubtitlesOptions
  | TransitionOptions[]
  | TextPosition

export enum CompositionMethod {
  addAudio = 'addAudio',
  addFilter = 'addFilter',
  addGroup = 'addGroup',
  addHtml = 'addHtml',
  addImage = 'addImage',
  addLottie = 'addLottie',
  addSequence = 'addSequence',
  addSubtitles = 'addSubtitles',
  addText = 'addText',
  addVideo = 'addVideo',
  addWaveform = 'addWaveform',
  aspectRatio = '_aspectRatio',
  backgroundColor = 'backgroundColor',
  dimensions = 'dimensions',
  duration = 'duration',
  encode = 'encode',
  encodeSync = 'encodeSync',
  getLayerAttribute = 'getLayerAttribute',
  getMetadata = '_getMetadata',
  identifiedLayers = 'identifiedLayers',
  layer = 'layer',
  metadata = 'metadata',
  preview = 'preview',
  setDuration = '_setDuration',
  setFile = '_setFile',
  setLayer = 'setLayer',
  setLayerAttribute = 'setLayerAttribute',
}

export interface CompositionInterface {
  readonly [CompositionMethod.duration]: number
  [CompositionMethod.layer]: (id: string) => IdentifiedLayer
  [CompositionMethod.identifiedLayers]: IdentifiedLayer[]
  [CompositionMethod.getLayerAttribute]: <LayerAttributeValue>({
    childKey,
    id,
    layerKey,
  }: {
    childKey?: ChildKey
    id: string
    layerKey: LayerKey
  }) => LayerAttributeValue
  [CompositionMethod.setLayerAttribute]: ({
    childKey,
    id,
    layerKey,
    value,
  }: {
    childKey?: ChildKey
    id: string
    layerKey: LayerKey
    value: LayerAttributeValue
  }) => void
}

export type Metadata = Record<string, JsonValue>

export type VideoOptions = {
  [CompositionKey.backgroundColor]?: string
  [CompositionKey.dimensions]?: Dimensions
  [CompositionKey.filename]?: string
  [CompositionKey.duration]?: number
  [CompositionKey.metadata]?: Metadata
}

export type CompositionOptions = {
  [CompositionKey.backgroundColor]?: string
  [CompositionKey.dimensions]: Dimensions
  [CompositionKey.duration]?: number
  [CompositionKey.filename]?: string
  [CompositionKey.metadata]?: Metadata
}

export type EncodeConfig = CompositionOptions & {
  dimensions: { height: number; width: number }
  layers: IdentifiedLayer[]
}

export enum EncodeResponseKey {
  id = 'id',
  status = 'status',
  timestamp = 'timestamp',
}

export type EncodeOptions = {
  experimental?: {
    renderingEngine: 'v2-beta'
  }
}

export type EncodeResponse = {
  [EncodeResponseKey.id]: string
  [EncodeResponseKey.status]: string
  [EncodeResponseKey.timestamp]: number
}
