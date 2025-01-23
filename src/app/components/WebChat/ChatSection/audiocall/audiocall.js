import React, { useState, useEffect } from "react";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import { MdCallEnd } from "react-icons/md";
import "./audiocall.css";

const CallInterface = ({ chatUser, onEndCall, callDuration, isIncoming, onAccept, onReject }) => {
  const [isMuted, setIsMuted] = useState(false);

  const toggleMute = () => {
    setIsMuted(!isMuted);
    // TODO: Implement actual mute functionality
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
  };

  return (
    <div className="call-overlay">
      <div className="call-interface">
        <div className="user-info">
          {chatUser.picture ? (
            <img
              src={chatUser.picture || "/placeholder.svg"}
              alt={chatUser.user_name}
              className="user-avatar"
            />
          ) : (
            <div className="user-avatar-placeholder">
              {chatUser.user_name[0]}
            </div>
          )}
          <h2 className="user-name">{chatUser.user_name}</h2>
          {isIncoming ? (
            <p className="call-status">Incoming Call</p>
          ) : (
            <p className="call-duration">{formatDuration(callDuration)}</p>
          )}
        </div>
        <div className="call-controls">
          {isIncoming ? (
            <>
              <button onClick={onAccept} className="control-button accept-call">
                Accept
              </button>
              <button onClick={onReject} className="control-button reject-call">
                Reject
              </button>
            </>
          ) : (
            <>
              <button
                onClick={toggleMute}
                className={`control-button ${isMuted ? "muted" : ""}`}
              >
                {isMuted ? <FaMicrophoneSlash /> : <FaMicrophone />}
              </button>
              <button
                onClick={onEndCall}
                className="control-button end-call"
              >
                <MdCallEnd />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CallInterface;
