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
    const postureAsync = PostureAI()
    const userMediaAsync = navigator.mediaDevices.getUserMedia({ video: true })

    // Initialize posture promise so that first page load will be quicker. This will run in parallel of
    // getting the user agent and not blocking.
    postureAsync.then(() => {})

    // Wait till all the promises for webcam and ai api are fetched.
    Promise.allSettled([postureAsync, userMediaAsync]).then(settledResult => {
      const [postureResponse, userMediaResponse] = settledResult

      if (postureResponse.status == 'fulfilled' && userMediaResponse.status == 'fulfilled') {

        // Webcam ready.
        const predictWebcam = async () => {
          // Check the frame every second.
          const updatePrediction = () => props.onFrameChange(postureResponse.value.predict(videoRef.current!))
          cameraInterval = window.setInterval(() => updatePrediction(), 1000)
          updatePrediction()

          // Update UI to inform everything is loaded.
          props.onLoaded()
          setLoading(false)
        }

        if (videoRef.current) {
          videoRef.current.srcObject = userMediaResponse.value
          videoRef.current.addEventListener('loadeddata', predictWebcam)
        }
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
