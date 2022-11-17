import { LayerType } from 'constant/shared'

export enum TransitionsMethod {
  addTransition = 'addTransition',
  setTransitions = 'setTransitions',
}

export const TransitionableLayers = [
  LayerType.audio,
  LayerType.html,
  LayerType.image,
  LayerType.lottie,
  LayerType.text,
  LayerType.video,
  LayerType.waveform,
]
