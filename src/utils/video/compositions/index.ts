import { Readable } from 'stream'

import {
  AudibleLayers,
  ComposableLayer,
  CompositionFile,
  DefaultAudioOptions,
  DefaultHtmlOptions,
  DefaultSubtitlesOptions,
  DefaultTextOptions,
  DefaultWaveformOptions,
  Dimensions,
  GroupLayerConfig,
  GroupableLayer,
  LayerConfigs,
  LayerOptions,
  LayerType,
  PositionableLayers,
  SequenceableLayer,
  SizeableLayers,
  TimelineableLayers,
  TransitionFadeOptions,
  TransitionType,
  TransitionableLayers,
  TrimmableLayers,
  defaultFilterLayer,
  defaultFilterOptions,
} from 'constant'
import { AudioMixin } from 'features/videos/mixins/audioMixin'
import { PositionMixin } from 'features/videos/mixins/positionMixin'
import { SizeMixin } from 'features/videos/mixins/sizeMixin'
import { TransitionsMixin } from 'features/videos/mixins/transitionMixin'
import { ValidationErrorText } from 'strings'
import {
  makeDefaultAudioLayer,
  makeDefaultGroupLayer,
  makeDefaultHtmlLayer,
  makeDefaultImageLayer,
  makeDefaultLottieLayer,
  makeDefaultSequenceLayer,
  makeDefaultSubtitlesLayer,
  makeDefaultTextLayer,
  makeDefaultVideoLayer,
  makeDefaultWaveformLayer,
} from 'utils/defaults'
import { createReadStream, downloadFile, fileExists } from 'utils/files'
import { urlOrFile } from 'utils/forms'
import { deepClone, deepMerge } from 'utils/objects'
import { isValidUrl } from 'utils/validation'

export const formDataKey = (file: CompositionFile, id: string): string => `${urlOrFile(file)}${id}`

export const setLayerDefaults = <Layer>(
  dimensions: Dimensions,
  layerType: LayerType,
  layerOptions?: LayerOptions,
  layerConfig?: LayerConfigs
): Layer => {
  const defaultDimensions = { ...dimensions }

  const layerOptionsDefaults: Record<LayerType, LayerOptions> = {
    [LayerType.audio]: deepClone(DefaultAudioOptions),
    [LayerType.filter]: deepClone(defaultFilterOptions),
    [LayerType.group]: undefined,
    [LayerType.html]: deepClone(DefaultHtmlOptions),
    [LayerType.image]: undefined,
    [LayerType.lottie]: {},
    [LayerType.sequence]: undefined,
    [LayerType.subtitles]: deepClone(DefaultSubtitlesOptions),
    [LayerType.text]: deepClone(DefaultTextOptions),
    [LayerType.video]: undefined,
    [LayerType.waveform]: deepClone(DefaultWaveformOptions),
  }

  const layerDefaults: Record<LayerType, ComposableLayer> = {
    [LayerType.audio]: deepClone(makeDefaultAudioLayer()),
    [LayerType.filter]: deepClone(defaultFilterLayer),
    [LayerType.group]: deepClone(makeDefaultGroupLayer()),
    [LayerType.html]: deepClone(makeDefaultHtmlLayer()),
    [LayerType.image]: deepClone(makeDefaultImageLayer()),
    [LayerType.lottie]: deepClone(makeDefaultLottieLayer()),
    [LayerType.sequence]: deepClone(makeDefaultSequenceLayer()),
    [LayerType.subtitles]: deepClone(makeDefaultSubtitlesLayer()),
    [LayerType.text]: deepClone(makeDefaultTextLayer()),
    [LayerType.video]: deepClone(makeDefaultVideoLayer()),
    [LayerType.waveform]: deepClone(makeDefaultWaveformLayer(defaultDimensions)),
  }

  let layerWithDefaults = deepClone(layerDefaults)[layerType] as Layer

  if (layerOptions && Object.keys(layerOptions).length !== 0) {
    layerWithDefaults[layerType] = deepMerge(layerOptionsDefaults[layerType], layerOptions)
  }

  if (layerConfig) {
    layerWithDefaults = deepMerge(layerWithDefaults, layerConfig)
  }

  return layerWithDefaults
}

export const processCompositionFile = async (
  file: CompositionFile,
  temporaryDirectory: string
): Promise<{ filepath: string; readStream: Readable }> => {
  if (typeof file !== 'string') {
    const filepath = (file as any).path

    if (!fileExists(filepath)) {
      throw new Error(ValidationErrorText.FILE_DOES_NOT_EXIST(filepath))
    }

    return { filepath, readStream: file as Readable }
  }

  if (isValidUrl(file)) {
    const { temporaryFilePath } = await downloadFile(file, temporaryDirectory)

    return {
      filepath: temporaryFilePath,
      readStream: createReadStream(temporaryFilePath),
    }
  }

  if (!fileExists(file)) {
    throw new Error(ValidationErrorText.FILE_DOES_NOT_EXIST(file))
  }

  return { filepath: file, readStream: createReadStream(file) }
}

export const processCrossfades = (
  currentTime: number,
  currentLayer: SequenceableLayer,
  previousLayer?: SequenceableLayer,
  nextLayer?: SequenceableLayer
): number => {
  let newCurrentTime = currentTime
  const currentLayerCrossfadeIn = currentLayer.transitions.find(
    (transition) => transition.type === TransitionType.crossfadeIn
  )
  const previousLayerCrossfadeOut = previousLayer
    ? previousLayer.transitions.find((transition) => transition.type === TransitionType.crossfadeOut)
    : undefined
  const nextLayerCrossfadeIn = nextLayer
    ? nextLayer.transitions.find((transition) => transition.type === TransitionType.crossfadeIn)
    : undefined
  const currentLayerCrossfadeInOptions = currentLayerCrossfadeIn?.options as TransitionFadeOptions
  const previousLayerCrossfadeOutOptions = previousLayerCrossfadeOut?.options as TransitionFadeOptions
  const nextLayerCrossfadeInOptions = nextLayerCrossfadeIn?.options as TransitionFadeOptions

  if (previousLayer && previousLayerCrossfadeOut) {
    if (currentLayer.transitions.find(({ type }) => type === TransitionType.fadeIn) === undefined) {
      currentLayer.addTransition({
        options: { duration: previousLayerCrossfadeOutOptions?.duration },
        type: TransitionType.fadeIn,
      })
    }
    currentLayer.setStart(newCurrentTime - previousLayerCrossfadeOutOptions.duration)
    newCurrentTime = newCurrentTime - previousLayerCrossfadeOutOptions.duration
  } else if (nextLayer && nextLayerCrossfadeIn) {
    if (currentLayer.transitions.find(({ type }) => type === TransitionType.fadeOut) === undefined) {
      currentLayer.addTransition({
        options: { duration: nextLayerCrossfadeInOptions.duration },
        type: TransitionType.fadeOut,
      })
    }
    currentLayer.setStart(newCurrentTime)
    newCurrentTime = newCurrentTime - nextLayerCrossfadeInOptions.duration
  } else if (previousLayer && currentLayerCrossfadeIn) {
    if (previousLayer.transitions.find(({ type }) => type === TransitionType.fadeOut) === undefined) {
      previousLayer.addTransition({
        options: { duration: currentLayerCrossfadeInOptions.duration },
        type: TransitionType.fadeOut,
      })
    }
    currentLayer.setStart(newCurrentTime - currentLayerCrossfadeInOptions?.duration)
    newCurrentTime = newCurrentTime - currentLayerCrossfadeInOptions?.duration
  } else {
    currentLayer.setStart(newCurrentTime)
  }

  return newCurrentTime
}

export const processGroupedLayer = (layer: GroupableLayer, layerConfig: GroupLayerConfig): void => {
  if (layerConfig.audio && AudibleLayers.includes(layer.type)) {
    ;(layer as AudioMixin).setVolume(layerConfig.audio.volume)
  }

  if (layerConfig.position && PositionableLayers.includes(layer.type)) {
    if (layerConfig.position.angle) {
      ;(layer as PositionMixin).setAngle(layerConfig.position.angle)
    }
    if (layerConfig.position.angleX) {
      ;(layer as PositionMixin).setAngleX(layerConfig.position.angleX)
    }
    if (layerConfig.position.angleY) {
      ;(layer as PositionMixin).setAngleY(layerConfig.position.angleY)
    }
    if (layerConfig.position.origin) {
      ;(layer as PositionMixin).setOrigin(layerConfig.position.origin)
    }
    if (layerConfig.position.isRelative) {
      ;(layer as PositionMixin).setIsRelative(layerConfig.position.isRelative)
    }
    if (layerConfig.position.x) {
      ;(layer as PositionMixin).setX(layerConfig.position.x)
    }
    if (layerConfig.position.x) {
      ;(layer as PositionMixin).setY(layerConfig.position.y)
    }
  }

  if (layerConfig.size && SizeableLayers.includes(layer.type)) {
    if (layerConfig.size.format) {
      ;(layer as SizeMixin).setFormat(layerConfig.size.format)
    }
    if (layerConfig.size.height) {
      ;(layer as SizeMixin).setHeight(layerConfig.size.height)
    }
    if (layerConfig.size.scale) {
      ;(layer as SizeMixin).setScale(layerConfig.size.scale)
    }
    if (layerConfig.size.width) {
      ;(layer as SizeMixin).setWidth(layerConfig.size.width)
    }
  }

  if (layerConfig.timeline?.start && TimelineableLayers.includes(layer.type)) {
    layer.setStart(layerConfig.timeline.start)
  }

  if (layerConfig.transitions && TransitionableLayers.includes(layer.type)) {
    layerConfig.transitions.forEach((transition) => {
      ;(layer as TransitionsMixin).addTransition(transition)
    })
  }

  if (layerConfig.trim && TrimmableLayers.includes(layer.type)) {
    layer.setTrim(layerConfig.trim.start, layerConfig.trim.end)
  }
}

export const processKenBurns = ({
  end,
  layer,
  scale1,
  scale2,
  start,
  x1,
  x2,
  y1,
  y2,
}: {
  end: number
  layer: TransitionsMixin
  scale1: number
  scale2: number
  start: number
  x1: number
  x2: number
  y1: number
  y2: number
}): TransitionsMixin => {
  layer.addTransition({
    options: {
      time: start,
      value: scale1,
    },
    type: TransitionType.scale,
  })

  layer.addTransition({
    options: {
      time: end,
      value: scale2,
    },
    type: TransitionType.scale,
  })

  layer.addTransition({
    options: {
      time: start,
      value: x1,
    },
    type: TransitionType.x,
  })

  layer.addTransition({
    options: {
      time: end,
      value: x2,
    },
    type: TransitionType.x,
  })

  layer.addTransition({
    options: {
      time: start,
      value: y1,
    },
    type: TransitionType.y,
  })

  layer.addTransition({
    options: {
      time: end,
      value: y2,
    },
    type: TransitionType.y,
  })

  return layer
}
