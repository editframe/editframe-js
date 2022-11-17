import { Audio } from 'features/videos/layers/audio'
import { Html } from 'features/videos/layers/html'
import { Image } from 'features/videos/layers/image'
import { Lottie } from 'features/videos/layers/lottie'
import { Subtitles } from 'features/videos/layers/subtitles'
import { Text } from 'features/videos/layers/text'
import { Video } from 'features/videos/layers/video'
import { Waveform } from 'features/videos/layers/waveform'

export enum GroupMethod {
  setStart = 'setStart',
}

export type GroupableLayer = Audio | Html | Image | Lottie | Subtitles | Text | Video | Waveform
