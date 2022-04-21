import {
  LayerHorizontalAlignmentValue,
  SubtitlesLayer,
  SubtitlesLayerConfig,
  defaultSubtitlesOptions,
  defaultTimeline,
  defaultTrim,
} from 'constant'
import { deepMerge } from 'utils/objects'

export const makeDefaultSubtitlesLayerConfig = (): SubtitlesLayerConfig => {
  const defaults = {}

  deepMerge(
    defaults,
    { position: { isRelative: true, x: LayerHorizontalAlignmentValue.center, y: 0.85 } },
    defaultTimeline,
    defaultTrim
  )

  return defaults
}

export const makeDefaultSubtitlesLayer = (): SubtitlesLayer => {
  const defaults = { subtitles: defaultSubtitlesOptions }

  deepMerge(defaults, makeDefaultSubtitlesLayerConfig())

  return defaults
}
