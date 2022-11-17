import { GroupLayer } from 'constant'
import { validateLayer } from 'utils/validation'
import {
  validateAudio,
  validatePosition,
  validateSize,
  validateTimeline,
  validateTrim,
} from 'utils/validation/layerConfigs'

export const validateGroupLayer = (callerName: string, layer: GroupLayer): void =>
  validateLayer<GroupLayer>(
    [validatePosition, validateSize, validateTimeline, validateTrim, validateAudio],
    callerName,
    layer
  )
