import { GroupLayer, GroupLayerConfig } from 'constant'
import { deepMerge } from 'utils/objects'

export const makeDefaultGroupLayerConfig = (): GroupLayerConfig => {
  const defaults: GroupLayerConfig = {}

  deepMerge(
    defaults,
    { audio: { volume: undefined } },
    {
      position: {
        angle: undefined,
        angleX: undefined,
        angleY: undefined,
        isRelative: undefined,
        origin: undefined,
        x: undefined,
        y: undefined,
      },
    },
    {
      size: {
        format: undefined,
        height: undefined,
        scale: undefined,
        width: undefined,
      },
    },
    {
      timeline: {
        start: undefined,
      },
    },
    {
      transitions: [],
    },
    {
      trim: {
        end: undefined,
        start: undefined,
      },
    }
  )

  return defaults
}

export const makeDefaultGroupLayer = (): GroupLayer => {
  const defaults: GroupLayer = {}

  deepMerge(defaults, makeDefaultGroupLayerConfig())

  return defaults
}
