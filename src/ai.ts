import React, { useEffect, useRef } from 'react'

import * as tf from '@tensorflow/tfjs';
import { ready } from '@tensorflow/tfjs';

interface SignatureInputType {
  dtype: string
  shape: number[]
  name: string
}
interface Signature {
  doc_id: string
  doc_name: string
  doc_version: string
  format: string
  version: number
  inputs: {
    Image: SignatureInputType
  },
  outputs: {
    Confidences: SignatureInputType
  },
  classes: {
    Label: string[]
  },
  filename: string
}

export interface InferenceType {
  MoveToTheLeft?: number
  MoveLittleToTheLeft?: number
  Okay?: number
  MoveLittleToTheRight?: number
  MoveToTheRight?: number
}

export function PostureAI() {
  let signature: Signature
  let height: number
  let width: number
  let outputName: string = ''
  let classes: string[] = []
  let model: tf.GraphModel

  const load = async () => {
    const response = await fetch('model/signature.json')
    signature = await response.json() as Signature
    [width, height] = signature.inputs.Image.shape.slice(1,3)
    outputName = signature.outputs.Confidences.name;
    classes = signature.classes.Label
    model = await tf.loadGraphModel('model/model.json')
  }
  
  const dispose = () => {
    if (model) {
      model.dispose()
    }
  }

  const predict = (video: HTMLVideoElement): InferenceType => {
    const image = tf.browser.fromPixels(video)
    if(!model) {
      throw Error("Model not loaded, please load() first.")
    }

    const [imgHeight, imgWidth] = image.shape.slice(0, 2)

    // Convert image to 0-1 scale.
    const normalizedImage = tf.div(image, tf.scalar(255))

    // Make into a batch of 1 so it is shaped into a square [1, height, width, 3].
    const reshapedImage: tf.Tensor4D = normalizedImage.reshape([1, ...normalizedImage.shape])

    // Center crop and resize
    let top = 0
    let left = 0
    let bottom = 1
    let right = 1

    if (imgHeight != imgWidth) {
      // The crops are normalized 0-1 percentage of the image dimension.
      const size = Math.min(imgHeight, imgWidth)
      left = (imgWidth - size) / 2 / imgWidth
      top = (imgHeight - size) / 2 / imgHeight
      right = (imgWidth + size) / 2 / imgWidth
      bottom = (imgHeight + size) / 2 / imgHeight
    }

    const croppedImage = tf.image.cropAndResize(
      reshapedImage,
      [[top, left, bottom, right]],
      [0],
      [height, width])

    const results = model.execute({
      [signature.inputs.Image.name]: croppedImage
    }, outputName) as tf.Tensor

    const resultsArray = results.dataSync()
    return classes.reduce((previousValue, currentValue, index) => 
        ({[currentValue]: resultsArray[index], ...previousValue}), {}
    )
  }

  return {
    load,
    dispose,
    predict
  }
}