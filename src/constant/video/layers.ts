import {
  FontWeight,
  HTMLAttribute,
  HTMLOptions,
  LayerAttribute,
  LayerHorizontalAlignment,
  LayerHorizontalAlignmentValue,
  LayerVerticalAlignment,
  LayerVerticalAlignmentValue,
  TextAlignment,
  TextAlignmentValue,
  WaveformStyle,
  WaveformStyleValue,
} from '@editframe/shared-types'

import { Filter } from 'constant/video/filters'
import { LottieAnimationData } from 'constant/video/lottie'

export type { FontWeight as FontWeight }
export { HTMLAttribute as HTMLAttribute }
export type { HTMLOptions as HTMLOptions }
export { LayerAttribute as LayerAttribute }
export type { LayerHorizontalAlignment as LayerHorizontalAlignment }
export { LayerHorizontalAlignmentValue as LayerHorizontalAlignmentValue }
export type { LayerVerticalAlignment as LayerVerticalAlignment }
export { LayerVerticalAlignmentValue as LayerVerticalAlignmentValue }
export { TextAlignment as TextAlignment }
export { TextAlignmentValue as TextAlignmentValue }
export type { WaveformStyle as WaveformStyle }
export { WaveformStyleValue as WaveformStyleValue }

export type Size = {
  [LayerAttribute.height]?: number
  [LayerAttribute.width]?: number
}
export enum LayerType {
  audio = 'audio',
  filter = 'filter',
  html = 'html',
  image = 'image',
  lottie = 'lottie',
  text = 'text',
  video = 'video',
  waveform = 'waveform',
}

export enum LayerFormatValue {
  fill = 'fill',
  fit = 'fit',
  stretch = 'stretch',
}
export type LayerFormat = LayerFormatValue.fill | LayerFormatValue.fit | LayerFormatValue.stretch

export type LayerBase = {
  [LayerAttribute.start]?: number
  [LayerAttribute.length]?: number
}

export type Trim = {
  [LayerAttribute.end]?: number
  [LayerAttribute.start]: number
}

export type LayerTrim = {
  [LayerAttribute.trim]?: Trim
}

export type LayerAlignment = {
  [LayerAttribute.horizontalAlignment]?: LayerHorizontalAlignment
  [LayerAttribute.verticalAlignment]?: LayerVerticalAlignment
}

export type LayerVisualMedia = Size & {
  [LayerAttribute.backgroundColor]?: string
  [LayerAttribute.color]?: string
  [LayerAttribute.format]?: LayerFormat
  [LayerAttribute.x]?: number
  [LayerAttribute.y]?: number
}

export type LayerHTML = {
  [LayerAttribute.html]: HTMLOptions
}

export type LayerText = {
  [LayerAttribute.fontFamily]?: string
  [LayerAttribute.fontSize]?: number
  [LayerAttribute.fontWeight]?: FontWeight
  [LayerAttribute.lineHeight]?: number
  [LayerAttribute.maxFontSize]?: number
  [LayerAttribute.maxHeight]?: number
  [LayerAttribute.maxWidth]?: number
  [LayerAttribute.text]: string
  [LayerAttribute.textAlign]?: TextAlignment
}

export type LayerAudio = {
  [LayerAttribute.volume]?: number
}

export type LayerFilter = {
  [LayerAttribute.filter]?: Filter
}

export type LayerLottie = {
  [LayerAttribute.data]?: LottieAnimationData
}

export type LayerWaveform = {
  [LayerAttribute.style]?: WaveformStyle
}

export type AudioLayer = LayerBase & LayerTrim & LayerAudio
export type FilterLayer = LayerBase & LayerFilter
export type HTMLLayer = LayerBase & LayerFilter & LayerVisualMedia & LayerHTML
export type ImageLayer = LayerBase & LayerVisualMedia & LayerFilter
export type LottieLayer = LayerBase & LayerLottie
export type TextLayer = LayerBase & LayerAlignment & LayerText & LayerVisualMedia
export type VideoLayer = LayerBase & LayerTrim & LayerAudio & LayerFilter & LayerVisualMedia

export type WaveformLayer = LayerBase & LayerVisualMedia & LayerWaveform

export type ComposableLayer =
  | AudioLayer
  | FilterLayer
  | HTMLLayer
  | ImageLayer
  | LottieLayer
  | TextLayer
  | VideoLayer
  | WaveformLayer
  | FilterLayer

export type TypedLayer = ComposableLayer & {
  type: LayerType
}

export type IdentifiedLayer = TypedLayer & {
  id: string
}
