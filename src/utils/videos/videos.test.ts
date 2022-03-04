import { mockVideo } from 'mocks'

import { isVideo, isVideos } from './'

describe('isVideo', () => {
  it('returns `false` when the provided `video` does not adhere to the `ApiVideo` interface', () => {
    expect(isVideo({})).toEqual(false)
  })

  it('returns `true` when the provided `video` adheres to the `ApiVideo` interface', () => {
    expect(isVideo(mockVideo())).toEqual(true)
  })
})

describe('isVideos', () => {
  it('returns `false` when one of the provided `videos` does not adhere to the `ApiVideo` interface', () => {
    expect(isVideos([{}])).toEqual(false)
  })

  it('returns `true` when the provided `videos` adheres to the `ApiVideo` interface', () => {
    expect(isVideos([mockVideo()])).toEqual(true)
  })
})