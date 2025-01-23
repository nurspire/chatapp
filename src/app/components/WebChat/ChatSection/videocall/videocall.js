import React, { useState, useEffect, useRef } from "react"
import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash } from "react-icons/fa"
import { MdCallEnd } from "react-icons/md"
import "./videcall.css"

const VideoCallInterface = ({ chatUser, onEndCall, localStream, remoteStream }) => {
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const localVideoRef = useRef(null)
  const remoteVideoRef = useRef(null)

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream
    }
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream
    }
  }, [localStream, remoteStream])

  const toggleMute = () => {
    setIsMuted(!isMuted)
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => (track.enabled = !isMuted))
    }
  }

  const toggleVideo = () => {
    setIsVideoOff(!isVideoOff)
    if (localStream) {
      localStream.getVideoTracks().forEach((track) => (track.enabled = !isVideoOff))
    }
  }

  return (
    <div className="video-call-overlay">
      <div className="video-call-interface">
        <div className="video-container">
          <div className="main-video-wrapper">
            <video ref={remoteVideoRef} autoPlay playsInline className="remote-video" />
            <div className="video-name-tag">{chatUser.user_name}</div>
          </div>
          <div className="local-video-wrapper">
            <video ref={localVideoRef} autoPlay playsInline muted className="local-video" />
            <div className="video-name-tag">You</div>
          </div>
        </div>
        <div className="video-call-controls">
          <button onClick={toggleMute} className={`control-button ${isMuted ? "muted" : ""}`}>
            {isMuted ? <FaMicrophoneSlash /> : <FaMicrophone />}
          </button>
          <button onClick={onEndCall} className="control-button end-call">
            <MdCallEnd />
          </button>
          <button onClick={toggleVideo} className={`control-button ${isVideoOff ? "video-off" : ""}`}>
            {isVideoOff ? <FaVideoSlash /> : <FaVideo />}
          </button>
        </div>
      </div>
    </div>
  )
}

export default VideoCallInterface

