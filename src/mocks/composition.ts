import { Color, FilterName } from '@editframe/shared-types'

import {
  AudioLayer,
  CompositionInterface,
  CompositionOptions,
  EncodeResponse,
  FilterLayer,
  HTMLLayer,
  ImageLayer,
  LayerFormatValue,
  LottieLayer,
  TextAlignmentValue,
  TextLayer,
  VideoLayer,
  WaveformLayer,
} from 'constant'

export const mockComposition = ({
  layer,
  layers,
  updateLayerAttribute,
}: {
  layer: any
  layers: any
  updateLayerAttribute: any
}): CompositionInterface => ({
  layer,
  layers,
  updateLayerAttribute,
})

export const mockCompositionOptions = (
  { backgroundColor, dimensions, duration, metadata }: CompositionOptions = {
    backgroundColor: Color.white,
    dimensions: { height: 100, width: 200 },
    duration: 10,
    metadata: { key: 'value' },
  }
): CompositionOptions => ({
  backgroundColor,
  dimensions,
  duration,
  metadata,
})

export const mockAudioLayer = (
  { length, start, trim, volume }: AudioLayer = { length: 10, start: 0, trim: { end: 5, start: 1 }, volume: 1 }
): AudioLayer => ({ length, start, trim, volume })

export const mockEncodeResponse = (
  { id, status, timestamp }: EncodeResponse = { id: 'id', status: 'status', timestamp: 1646242134 }
): EncodeResponse => ({
  id,
  status,
  timestamp,
})

export const mockFilterLayer = (
  { filter, length, start }: FilterLayer = {
    filter: { filterName: FilterName.brightness, options: { brightness: 10 } },
    length: 10,
    start: 0,
  }
): FilterLayer => ({
  filter,
  length,
  start,
})

export const mockHTMLLayer = (
  {
    height,
    width,
    withHTML,
    withTransparentBackground,
    withURL,
  }: { height?: number; width?: number; withHTML: boolean; withTransparentBackground?: boolean; withURL: boolean } = {
    withHTML: true,
    withURL: false,
  }
): HTMLLayer => ({
  height,
  html: {
    htmlPage: withHTML ? 'html' : undefined,
    url: withURL ? 'url' : undefined,
    withTransparentBackground,
  },
  width,
})

export const mockImageLayer = ({ withFilter }: { withFilter: boolean } = { withFilter: false }): ImageLayer => ({
  filter: withFilter
    ? {
        filterName: FilterName.brightness,
        options: { brightness: 10 },
      }
    : undefined,
  format: LayerFormatValue.fill,
  height: 100,
  length: 20,
  start: 10,
  width: 200,
  x: 10,
  y: 20,
})

export const mockLottieLayer = (
  { data, length, start }: LottieLayer = {
    data: { assets: [], ddd: 10, fr: 20, h: 30, ip: 40, layers: [], nm: 'nm', op: 50, v: 'v', w: 60 },
    length: 20,
    start: 10,
  }
): LottieLayer => ({
  data,
  length,
  start,
})

export const mockTextLayer = (
  {
    fontFamily,
    fontSize,
    format,
    height,
    length,
    maxFontSize,
    maxHeight,
    maxWidth,
    start,
    text,
    textAlign,
    width,
    x,
    y,
  }: TextLayer = {
    fontFamily: 'Arial',
    fontSize: 20,
    format: LayerFormatValue.fill,
    height: 100,
    length: 20,
    maxFontSize: 25,
    maxHeight: 400,
    maxWidth: 800,
    start: 10,
    text: 'text',
    textAlign: TextAlignmentValue.center,
    width: 200,
    x: 10,
    y: 20,
  }
): TextLayer => ({
  fontFamily,
  fontSize,
  format,
  height,
  length,
  maxFontSize,
  maxHeight,
  maxWidth,
  start,
  text,
  textAlign,
  width,
  x,
  y,
})

export const mockVideoLayer = (
  { format, height, length, start, width, x, y }: VideoLayer = {
    format: LayerFormatValue.fill,
    height: 100,
    length: 20,
    start: 10,
    width: 200,
    x: 10,
    y: 20,
  }
): VideoLayer => ({
  format,
  height,
  length,
  start,
  width,
  x,
  y,
})

export const mockWaveformLayer = (
  { backgroundColor, color, format, x, y }: WaveformLayer = {
    backgroundColor: Color.white,
    color: Color.black,
    format: LayerFormatValue.fill,
    x: 10,
    y: 20,
  }
): WaveformLayer => ({
  backgroundColor,
  color,
  format,
  x,
  y,
})
