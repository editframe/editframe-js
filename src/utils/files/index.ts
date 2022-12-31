import { fetch } from 'cross-fetch'
import mime from 'mime'
import fs, { createWriteStream, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { parse } from 'path'
import { Readable } from 'stream'
import tempDirectory from 'temp-dir'

import { FetchResponse } from 'constant'
import { stripQueryParams } from 'utils/paths'
import { uuid } from 'utils/strings'

export const createDirectory = (directory: string): void => {
  if (!existsSync(directory)) {
    mkdirSync(directory, { recursive: true })
  }
}

export const createReadStream = (path: string): Readable => fs.createReadStream(path)

export const createTemporaryDirectory = (): string => {
  const directory = `${tempDirectory}/${uuid()}`

  createDirectory(directory)

  return directory
}

export const downloadFile = async (url: string, directory: string): Promise<{ temporaryFilePath: string }> => {
  const res = (await fetch(url)) as FetchResponse
  const contentType = res.headers.get('Content-Type')
  const temporaryFilePath = `${directory}/${uuid()}${getExtension(stripQueryParams(url), contentType)}`

  const fileStream = createWriteStream(temporaryFilePath)

  // handle redirects
  if (res.status > 300 && res.status < 400 && !!res.headers?.get('location')) {
    return downloadFile(res.headers.get('location'), directory)
  }

  await new Promise((resolve, reject) => {
    res.body.pipe(fileStream)
    res.body.on('error', reject)
    fileStream.on('finish', resolve)
  })

  return { temporaryFilePath }
}

export const fileExists = (filepath: string): boolean => existsSync(filepath)

export const getExtension = (filepath: string, contentType?: string): string => {
  const urlExtension = parse(filepath).ext

  return urlExtension ? urlExtension : `.${mime.getExtension(contentType)}`
}

export const removeDirectory = (directory: string): void => {
  if (fileExists(directory)) {
    rmSync(directory, { recursive: true })
  }
}

export const saveFile = (filepath: string, data: string): void => writeFileSync(filepath, data)
