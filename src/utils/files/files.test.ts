import fs from 'fs'

import { createDirectory, createReadStream, fileExists, getExtension, removeDirectory, saveFile } from './'

describe('createDirectory', () => {
  const directory = 'directory'
  let existsSyncSpy: jest.SpyInstance
  let mkdirSyncSpy: jest.SpyInstance

  beforeEach(() => {
    existsSyncSpy = jest.spyOn(fs, 'existsSync')
    mkdirSyncSpy = jest.spyOn(fs, 'mkdirSync').mockImplementation(() => 'path')
  })

  it('does nothing when the provided directory exists', () => {
    existsSyncSpy.mockReturnValue(true)

    createDirectory(directory)

    expect(mkdirSyncSpy).not.toHaveBeenCalled()
  })

  it('calls the `mkdirSync` function with the correct arguments when the provided directory does not exist', () => {
    existsSyncSpy.mockReturnValue(false)

    createDirectory(directory)

    expect(mkdirSyncSpy).toHaveBeenCalledWith(directory, { recursive: true })
  })
})

describe('createReadStream', () => {
  const path = 'path'
  let createReadStreamSpy: jest.SpyInstance

  beforeEach(() => {
    createReadStreamSpy = jest.spyOn(fs, 'createReadStream').mockReturnValue({} as any)
  })

  it('calls the `createReadStream` function with the correct arguments', () => {
    createReadStream(path)

    expect(createReadStreamSpy).toHaveBeenCalledWith(path)
  })
})

describe('fileExists', () => {
  const filepath = 'file-path'

  it('returns `true` when the file exists', () => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(true)

    expect(fileExists(filepath)).toEqual(true)
  })

  it('returns `false` when the file does not exist', () => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(false)

    expect(fileExists(filepath)).toEqual(false)
  })
})

describe('getExtension', () => {
  it('returns the extension of a provided name', () => {
    expect(getExtension('file.mp3')).toEqual('.mp3')
  })

  it('returns the extension of a provided filepath', () => {
    expect(getExtension('path/to/file.mp3')).toEqual('.mp3')
  })
})

describe('removeDirectory', () => {
  const directory = 'directory'
  let existsSyncSpy: jest.SpyInstance
  let rmSyncSpy: jest.SpyInstance

  beforeEach(() => {
    existsSyncSpy = jest.spyOn(fs, 'existsSync')
    rmSyncSpy = jest.spyOn(fs, 'rmSync').mockImplementation(() => 'path')
  })

  it('does nothing when the provided directory does not exist', () => {
    existsSyncSpy.mockReturnValue(false)

    removeDirectory(directory)

    expect(rmSyncSpy).not.toHaveBeenCalled()
  })

  it('calls the `mkdirSync` function with the correct arguments when the provided directory does not exist', () => {
    existsSyncSpy.mockReturnValue(true)

    removeDirectory(directory)

    expect(rmSyncSpy).toHaveBeenCalledWith(directory, { recursive: true })
  })
})

describe('saveFile', () => {
  const filepath = 'file-path'
  const data = 'data'
  let writeFileSyncSpy: jest.SpyInstance

  beforeEach(() => {
    writeFileSyncSpy = jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {})
  })

  it('calls the `writeFileSync` function w ith the correct arguments', () => {
    saveFile(filepath, data)

    expect(writeFileSyncSpy).toHaveBeenCalledWith(filepath, data)
  })
})
