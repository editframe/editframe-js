import camelCaseKeys from 'camelcase-keys'
import fetch from 'cross-fetch'

import { ApiHeaderKey, ApiHeaderValue, ApiHeaders, FetchFunction, Fetcher, MakeFetchFunction, MimeType } from 'constant'
import { ApiErrorText } from 'strings'

export const baseUrl = (host: string, version: number): string => `${host}/v${version}`

export const initializeFetchUtil = (baseUrl: string): FetchFunction => makeRequest(makeFetcher(baseUrl))

const makeFetcher =
  (baseUrl: string): Fetcher =>
  (options) =>
    options.url.startsWith('/') ? fetch(`${baseUrl}${options.url}`, options) : fetch(options.url, options)

export const makeRequest: MakeFetchFunction =
  (fetcher) =>
  async ({ data, headers, method, url }) => {
    const response = await fetcher({ body: data, headers, method, url })

    if (!response.ok) {
      throw new Error(ApiErrorText.requestUnsuccessful(response.url, response.statusText))
    }

    const json = await response.json()
    const camelCasedJson = camelCaseKeys(json, { deep: true })

    if (camelCasedJson.data && !camelCasedJson.links && !camelCasedJson.meta) {
      return camelCasedJson.data
    }

    return camelCasedJson
  }

export const makeHeaders = ({
  clientId,
  isForm = false,
  token,
}: {
  clientId: string
  isForm?: boolean
  token: string
}): ApiHeaders => {
  const headers: ApiHeaders = {
    [ApiHeaderKey.userAgent]: `${ApiHeaderValue.editframeJs}`,
    [ApiHeaderKey.editframeClientId]: clientId,
    [ApiHeaderKey.authorization]: `${ApiHeaderValue.bearer}${token}`,
  }

  if (isForm) {
    headers[ApiHeaderKey.accept] = MimeType.json
    headers[ApiHeaderKey.xRequestedWith] = ApiHeaderValue.xRequestedWithXML
  } else {
    headers[ApiHeaderKey.contentType] = MimeType.json
  }

  return headers
}
