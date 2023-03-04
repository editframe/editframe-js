import FormData from 'form-data'

import {
  ApiInterface,
  ApiVideo,
  ApiVideoMetadata,
  ApiVideoMetadataFormDataKey,
  ApiVideoMetadataType,
  ApiVideoMethod,
  Color,
  CompositionFile,
  Paginated,
  Routes,
  VideoOptions,
} from 'constant'
import { VideoErrorText } from 'strings'
import {
  createReadStream,
  createTemporaryDirectory,
  deepClone,
  generatePath,
  isApiVideo,
  isApiVideoMetadata,
  isApiVideos,
  prepareFormData,
  processCompositionFile,
  translateColor,
  urlOrFile,
  validateApiData,
  validateCompositionFile,
  validateNewVideo,
  withPaginationQueryParams,
  withValidationAsync,
} from 'utils'

import { Composition } from './composition'

export class Videos {
  private _api: ApiInterface
  private _develop: boolean
  private _host: string

  constructor({ api, develop = false, host }: { api: ApiInterface; develop?: boolean; host: string }) {
    this._api = api
    this._develop = develop
    this._host = host
  }

  public async [ApiVideoMethod.all](page?: number, perPage?: number): Promise<ApiVideo[]> {
    try {
      const data = await this._api.get({
        url: withPaginationQueryParams(Routes.videos.all, page, perPage),
      })

      return validateApiData<Paginated<ApiVideo>>(data, {
        invalidDataError: VideoErrorText.malformedResponse,
        validate: isApiVideos,
      }).data
    } catch (error) {
      console.error(VideoErrorText.all(error.message))
    }

    return []
  }

  public async [ApiVideoMethod.get]({ id }: { id: string }): Promise<ApiVideo | undefined> {
    try {
      const data = await this._api.get({ url: generatePath(Routes.videos.get, { id }) })

      return validateApiData<ApiVideo>(data, {
        invalidDataError: VideoErrorText.malformedResponse,
        validate: isApiVideo,
      })
    } catch (error) {
      console.error(VideoErrorText.get(error.message))
    }

    return undefined
  }

  public async [ApiVideoMethod.new](
    options: VideoOptions = { backgroundColor: Color.black, fps: 30 },
    videoFile?: CompositionFile
  ): Promise<Composition> {
    return withValidationAsync<Composition>(
      () => {
        validateNewVideo(options)
        if (videoFile) {
          validateCompositionFile(ApiVideoMethod.new, videoFile)
        }
      },
      async () => {
        let composition: Composition

        if (videoFile) {
          const temporaryDirectory = createTemporaryDirectory()
          const { filepath, readStream } = await processCompositionFile(videoFile, temporaryDirectory)
          const { duration, fps, height, width } = await this._getMetadata(readStream)

          const transformedOptions = deepClone(options)

          transformedOptions.backgroundColor = translateColor(options.backgroundColor || Color.black)

          composition = new Composition({
            api: this._api,
            develop: this._develop,
            formData: new FormData(),
            host: this._host,
            options: { ...transformedOptions, dimensions: { height, width }, duration, fps },
            temporaryDirectory,
            videos: this,
          })

          await composition.addVideo(createReadStream(filepath))
        } else {
          const { backgroundColor, dimensions, duration, filename, fps, metadata
          } = options

          composition = new Composition({
            api: this._api,
            develop: this._develop,
            formData: new FormData(),
            host: this._host,
            options: {
              backgroundColor: translateColor(backgroundColor || Color.black),
              dimensions,
              duration,
              filename,
              fps: fps || 29.97,
              metadata,
            },
            videos: this,
          })
        }

        return composition
      }
    )
  }

  private async[ApiVideoMethod.getMetadata](videoFile: CompositionFile): Promise<ApiVideoMetadata> {
    const formData = prepareFormData([
      [urlOrFile(videoFile), videoFile],
      [ApiVideoMetadataFormDataKey.type, ApiVideoMetadataType.video],
    ])

    const data = await this._api.post({ data: formData, isForm: true, url: Routes.metadata })

    return validateApiData<ApiVideoMetadata>(data, {
      invalidDataError: VideoErrorText.malformedResponse,
      validate: isApiVideoMetadata,
    })
  }
}
