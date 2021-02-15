import React, { memo, useEffect, useRef, useState } from 'react'
import { InferenceType, PostureAI } from './ai'

interface CameraProps {
  onFrameChange: (inference: InferenceType) => void
  onLoaded: () => void;
}

export default memo(function Camera(props: CameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    let cameraInterval = 0

    const predictWebcam = async () => {
      const postureAi = PostureAI()
      await postureAi.load()
      const updatePrediction = () =>
          props.onFrameChange(postureAi.predict(videoRef.current!))
      cameraInterval = window.setInterval(() => updatePrediction(), 1000)
      updatePrediction()
      props.onLoaded()
      setLoading(false)
    }
    
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.addEventListener('loadeddata', predictWebcam)
      }
    })

    return () => {
      clearInterval(cameraInterval)
      if (videoRef.current)
        videoRef.current.removeEventListener('loadeddata', predictWebcam)
    }
  }, [])

  return (
    <video className="camera" ref={videoRef} autoPlay loop muted playsInline style={{
      display: loading ? 'none' : 'block'
    }} />
  )
})
