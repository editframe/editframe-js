import { LayerType } from 'constant/shared'

export enum TrimMethod {
  setTrim = 'setTrim',
}

export const TrimmableLayers = [
  LayerType.audio,
  LayerType.html,
  LayerType.image,
  LayerType.lottie,
  LayerType.text,
  LayerType.video,
  LayerType.waveform,
]
