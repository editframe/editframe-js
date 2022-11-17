import { LayerType } from 'constant/shared'

export enum SizeMethod {
  setDimensions = 'setDimensions',
  setFormat = 'setFormat',
  setHeight = 'setHeight',
  setScale = 'setScale',
  setWidth = 'setWidth',
}

export const SizeableLayers = [
  LayerType.html,
  LayerType.image,
  LayerType.lottie,
  LayerType.text,
  LayerType.video,
  LayerType.waveform,
]
