import { Mixin } from 'ts-mixer'

import { CompositionInterface, GroupMethod, LayerKey, LayerType, PrimitiveType, TimelineKey } from 'constant'
import { Audio } from 'features/videos/layers/audio'
import { Html } from 'features/videos/layers/html'
import { Image } from 'features/videos/layers/image'
import { Lottie } from 'features/videos/layers/lottie'
import { Subtitles } from 'features/videos/layers/subtitles'
import { Text } from 'features/videos/layers/text'
import { Video } from 'features/videos/layers/video'
import { Waveform } from 'features/videos/layers/waveform'
import { PositionMixin } from 'features/videos/mixins/positionMixin'
import { SizeMixin } from 'features/videos/mixins/sizeMixin'
import { TimelineMixin } from 'features/videos/mixins/timelineMixin'
import { TransitionsMixin } from 'features/videos/mixins/transitionMixin'
import { TrimMixin } from 'features/videos/mixins/trimMixin'
import { validateValueIsOfType, withValidation } from 'utils'

export class Group extends Mixin(PositionMixin, SizeMixin, TimelineMixin, TransitionsMixin, TrimMixin) {
  public layers: (Audio | Html | Image | Lottie | Subtitles | Text | Video | Waveform)[]

  constructor({
    composition,
    id,
    layers,
  }: {
    composition: CompositionInterface
    id: string
    layers: (Audio | Html | Image | Lottie | Subtitles | Text | Video | Waveform)[]
  }) {
    super({ composition, id })
    this.layers = layers
  }

  get type(): LayerType {
    return LayerType.group
  }

  public [GroupMethod.setStart](start = 0): this {
    return withValidation<this>(
      () => validateValueIsOfType(GroupMethod.setStart, TimelineKey.start, start, PrimitiveType.number, true),
      () => {
        this.layers.forEach((layer) => {
          layer.setStart(start)
        })

        return this.setAttribute({ childKey: TimelineKey.start, layerKey: LayerKey.timeline, value: start })
      }
    )
  }
}
