import { LayerType } from 'constant/shared'

export enum TimelineMethod {
  setStart = 'setStart',
}

export const TimelineableLayers = [
  LayerType.audio,
  LayerType.html,
  LayerType.image,
  LayerType.lottie,
  LayerType.text,
  LayerType.video,
  LayerType.waveform,
]
