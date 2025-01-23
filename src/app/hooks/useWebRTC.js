import { useState, useEffect, useCallback } from "react"

const useWebRTC = (socket, userId) => {
  const [peerConnection, setPeerConnection] = useState(null)
  const [localStream, setLocalStream] = useState(null)
  const [remoteStream, setRemoteStream] = useState(null)
  const [callStatus, setCallStatus] = useState("idle") // idle, calling, connected
  const [callDuration, setCallDuration] = useState(0)
  const [timerInterval, setTimerInterval] = useState(null)

  const createPeerConnection = useCallback(() => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    })

    pc.onicecandidate = (event) => {
      if (event.candidate && socket) {
        socket.emit("ice-candidate", { candidate: event.candidate, to: userId })
      }
    }

    pc.ontrack = (event) => {
      setRemoteStream(event.streams[0])
      setCallStatus("connected")
      // Start call duration timer
      const interval = setInterval(() => {
        setCallDuration((prev) => prev + 1)
      }, 1000)
      setTimerInterval(interval)
    }

    setPeerConnection(pc)
    return pc
  }, [socket, userId])

  const initializeCall = useCallback(
    async (receiverId, isVideo) => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: isVideo,
        })
        setLocalStream(stream)
        setCallStatus("calling")

        const pc = createPeerConnection()
        stream.getTracks().forEach((track) => pc.addTrack(track, stream))

        const offer = await pc.createOffer()
        await pc.setLocalDescription(offer)
        socket?.emit("offer", { offer, to: receiverId })
      } catch (error) {
        console.error("Error initializing call:", error)
        setCallStatus("idle")
      }
    },
    [createPeerConnection, socket],
  )

  const acceptCall = useCallback(
    async (callerId, isVideo) => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: isVideo,
        })
        setLocalStream(stream)

        const pc = createPeerConnection()
        stream.getTracks().forEach((track) => pc.addTrack(track, stream))

        if (socket) {
          socket.on("offer", async (offer) => {
            await pc.setRemoteDescription(new RTCSessionDescription(offer))
            const answer = await pc.createAnswer()
            await pc.setLocalDescription(answer)
            socket.emit("answer", { answer, to: callerId })
          })
        }
      } catch (error) {
        console.error("Error accepting call:", error)
        setCallStatus("idle")
      }
    },
    [createPeerConnection, socket],
  )

  const endCall = useCallback(() => {
    if (peerConnection) {
      peerConnection.close()
    }
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop())
    }
    if (timerInterval) {
      clearInterval(timerInterval)
    }
    setLocalStream(null)
    setRemoteStream(null)
    setPeerConnection(null)
    setCallStatus("idle")
    setCallDuration(0)
  }, [peerConnection, localStream, timerInterval])

  useEffect(() => {
    if (socket) {
      const handleIceCandidate = async (candidate) => {
        if (peerConnection) {
          await peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
        }
      }

      const handleAnswer = async (answer) => {
        if (peerConnection) {
          await peerConnection.setRemoteDescription(new RTCSessionDescription(answer))
          setCallStatus("connected")
        }
      }

      socket.on("ice-candidate", handleIceCandidate)
      socket.on("answer", handleAnswer)

      return () => {
        socket.off("ice-candidate", handleIceCandidate)
        socket.off("answer", handleAnswer)
      }
    }
  }, [socket, peerConnection])

  return {
    initializeCall,
    acceptCall,
    endCall,
    localStream,
    remoteStream,
    callStatus,
    callDuration,
  }
}

export default useWebRTC

