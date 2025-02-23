import React, { useState, useEffect } from "react";
import { Phone, PhoneOff, Mic, MicOff } from "lucide-react";
import "./audiocall.css";

function CallInterface({
  chatUser,
  onEndCall,
  callDuration,
  isIncoming,
  onAccept,
  onReject,
  callStatus = "calling",
}) {
  const [isMuted, setIsMuted] = useState(false);
  const [dots, setDots] = useState(".");

  // Animate dots for calling status
  useEffect(() => {
    if (callStatus === "calling") {
      const interval = setInterval(() => {
        setDots((prev) => (prev.length >= 3 ? "." : prev + "."));
      }, 500);
      return () => clearInterval(interval);
    }
  }, [callStatus]);

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
  };

  return (
    <div className="call_interface">
      <div className="call_container">
        <div className="call_avatar_container">
          <div className="call_avatar">
            {chatUser.picture ? (
              <img
                src={chatUser.picture || "/placeholder.svg"}
                alt={chatUser.user_name}
                className="call_avatar_image"
              />
            ) : (
              <span className="call_avatar_initial">{chatUser.user_name[0]}</span>
            )}
          </div>
          <div className="call_pulsing_ring" />
        </div>

        <div className="call_info">
          <h2 className="call_user_name">{chatUser.user_name}</h2>
          <p className="call_status">
            {callStatus === "calling" ? (
              <span className="calling">Calling{dots}</span>
            ) : callStatus === "connected" ? (
              formatDuration(callDuration)
            ) : (
              "Call Ended"
            )}
          </p>
        </div>

        <div className="call_controls">
          {isIncoming ? (
            <>
              <button className="call_button call_accept_button" onClick={onAccept}>
                <Phone className="call_icon" />
              </button>
              <button className="call_button call_reject_button" onClick={onReject}>
                <PhoneOff className="call_icon" />
              </button>
            </>
          ) : (
            <>
              <button
                className={`call_button call_mute_button ${isMuted ? "call_muted" : ""}`}
                onClick={() => setIsMuted(!isMuted)}
              >
                {isMuted ? <MicOff className="call_icon" /> : <Mic className="call_icon" />}
              </button>
              <button className="call_button call_end_button" onClick={onEndCall}>
                <PhoneOff className="call_icon" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default CallInterface;
