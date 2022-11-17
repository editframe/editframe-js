import { LayerType } from 'constant/shared'

export enum PositionMethod {
  setAngle = 'setAngle',
  setAngleX = 'setAngleX',
  setAngleY = 'setAngleY',
  setIsRelative = 'setIsRelative',
  setOrigin = 'setOrigin',
  setX = 'setX',
  setY = 'setY',
}

export const PositionableLayers = [
  LayerType.html,
  LayerType.image,
  LayerType.lottie,
  LayerType.text,
  LayerType.video,
  LayerType.waveform,
]
