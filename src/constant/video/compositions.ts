import { Blob } from 'node:buffer'
import { Readable } from 'stream'

import { Filter } from 'constant/video/filters'
import { HTMLOptions, IdentifiedLayer, LayerAttribute, Size } from 'constant/video/layers'
import { LottieAnimationData } from 'constant/video/lottie'

export type LayerAttributeValue = number | string | Filter | LottieAnimationData | HTMLOptions

export enum CompositionMethod {
  addAudio = 'addAudio',
  addFilter = 'addFilter',
  addHTML = 'addHTML',
  addImage = 'addImage',
  addLottie = 'addLottie',
  addText = 'addText',
  addVideo = 'addVideo',
  addWaveform = 'addWaveform',
  backgroundColor = 'backgroundColor',
  dimensions = 'dimensions',
  duration = 'duration',
  encode = 'encode',
  layer = 'layer',
  layers = 'layers',
  metadata = 'metadata',
  setLayer = 'setLayer',
  updateLayerAttribute = 'updateLayerAttribute',
}

export interface CompositionInterface {
  [CompositionMethod.layer]: (id: string) => IdentifiedLayer
  [CompositionMethod.layers]: IdentifiedLayer[]
  [CompositionMethod.updateLayerAttribute]: (
    id: string,
    layerAttribute: LayerAttribute,
    value: LayerAttributeValue
  ) => void
}

export type CompositionFile = Readable | Blob | string

export enum CompositionOptionAttribute {
  backgroundColor = 'backgroundColor',
  dimensions = 'dimensions',
  duration = 'duration',
  metadata = 'metadata',
}

export type Metadata = Record<string, string>

export type VideoOptions = {
  [CompositionOptionAttribute.backgroundColor]?: string
  [CompositionOptionAttribute.dimensions]?: Size
  [CompositionOptionAttribute.duration]?: number
  [CompositionOptionAttribute.metadata]?: Metadata
}

export type CompositionOptions = {
  [CompositionOptionAttribute.backgroundColor]?: string
  [CompositionOptionAttribute.dimensions]: Size
  [CompositionOptionAttribute.duration]: number
  [CompositionOptionAttribute.metadata]?: Metadata
}

export type EncodeConfig = CompositionOptions & {
  dimensions: { height: number; width: number }
  layers: IdentifiedLayer[]
}

export enum EncodeResponseAttribute {
  id = 'id',
  status = 'status',
  timestamp = 'timestamp',
}

export type EncodeResponse = {
  [EncodeResponseAttribute.id]: string
  [EncodeResponseAttribute.status]: string
  [EncodeResponseAttribute.timestamp]: number
}
