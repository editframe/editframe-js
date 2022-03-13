import { Mixin } from 'ts-mixer'

import { CompositionInterface } from 'constant'
import { Audio } from 'features/videos/audio'
import { VisualMedia } from 'features/videos/visualMedia'

export class Video extends Mixin(Audio, VisualMedia) {
  constructor({ composition, id }: { composition: CompositionInterface; id: string }) {
    super({ composition, id })
  }
}
