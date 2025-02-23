import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { FaUserCircle, FaEllipsisV, FaThumbtack, FaTrash, FaCopy, FaCheck } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { FiPhone, FiVideo } from "react-icons/fi";
import { IoAttach, IoSend, IoArrowBack } from "react-icons/io5";
import { ChevronDown, CheckSquare } from 'lucide-react';
import io from "socket.io-client";
import jwt from "jsonwebtoken";
import "./ChatSection.css";
import CallInterface from "./audiocall/audiocall";
import VideoCallInterface from "./videocall/videocall";
import useWebRTC from "@/app/hooks/useWebRTC";
import AttachmentMenu from "./attachment-menu/attachmenu";

let socket;

export default function ChatSection() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [chatUser, setChatUser] = useState(null);
  const [error, setError] = useState(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [senderId, setSenderId] = useState(null);
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [pinnedMessages, setPinnedMessages] = useState([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [newMessageCount, setNewMessageCount] = useState(0);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isInCall, setIsInCall] = useState(false);
  const [isInVideoCall, setIsInVideoCall] = useState(false);
  const [incomingCall, setIncomingCall] = useState(null);
  const [socketReady, setSocketReady] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isAttachmentMenuOpen, setIsAttachmentMenuOpen] = useState(false);

  const chatDisplayRef = useRef(null);
  const dropdownRef = useRef(null);
  const lastMessageRef = useRef(null);
  const attachRef = useRef(null);

  const params = useParams();
  const router = useRouter();
  const slug = params?.slug;

  const { initializeCall, acceptCall, endCall, localStream, remoteStream } = useWebRTC(
    socketReady ? socket : null,
    senderId
  );

  // Handle file selection from the attachment menu
  const handleFileSelect = (fileUrl, type) => {
    if (!fileUrl || !type || !senderId || !chatUser?.user_id) return;

    const message = {
      sender: senderId,
      receiver: chatUser.user_id,
      type: type, // 'image', 'video', or 'document'
      content: fileUrl, // URL of the uploaded file
    };

    // Emit the file message to the server
    socket.emit("chat message", message);

    // Close the attachment menu
    setIsAttachmentMenuOpen(false);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const cookies = document.cookie;
    const token = cookies
      .split(";")
      .find((cookie) => cookie.trim().startsWith("token="))
      ?.split("=")[1];
    if (token) {
      try {
        const decoded = jwt.decode(token);
        setSenderId(decoded?.id);
        console.log("Sender ID from token:", decoded?.id);
      } catch (err) {
        console.error("Token verification failed:", err);
        setError("Invalid or expired token");
      }
    } else {
      setError("No token provided");
    }

    // socket = io("http://localhost:3000");
    // setSocketReady(true);

  socket = io(process.env.BASE_URL);
  setSocketReady(true);


    socket.on("incoming call", ({ caller, callType }) => {
      setIncomingCall({ caller, callType });
    });

    socket.on("call ended", () => {
      setIsInCall(false);
      setIsInVideoCall(false);
      setIncomingCall(null);
      setCallDuration(0);
    });

    return () => {
      socket.disconnect();
      setSocketReady(false);
      socket.off("incoming call");
      socket.off("call ended");
    };
  }, []);

  useEffect(() => {
    const fetchChatUser = async () => {
      try {
        const response = await fetch("/api/chat_user/getallusers");
        const data = await response.json();

        if (Array.isArray(data.users)) {
          const matchedUser = data.users.find((user) => user.user_id === slug);
          if (matchedUser) {
            setChatUser(matchedUser);
          } else {
            setError("No matched user found.");
          }
        } else {
          setError("Failed to fetch users.");
        }
      } catch (err) {
        console.error("Error fetching chat user:", err);
        setError("Failed to fetch user data.");
      }
    };

    fetchChatUser();
  }, [slug]);

  useEffect(() => {
    if (slug && senderId) {
      socket.emit("set user", senderId);
      socket.emit("get chat history", senderId, slug);

      socket.on("chat history", (history) => {
        // Filter out messages deleted for the current user
        const filteredHistory = history.filter(
          (msg) =>
            !(msg.deletedForSender && msg.sender === senderId) &&
            !(msg.deletedForReceiver && msg.receiver === senderId)
        );
        setMessages(filteredHistory);
      });

      socket.on("chat message", (msg) => {
        setMessages((prevMessages) => {
          const isMessageExist = prevMessages.some((m) => m._id === msg._id);
          if (!isMessageExist) {
            const chatDisplay = chatDisplayRef.current;
            const isNearBottom =
              chatDisplay && chatDisplay.scrollHeight - chatDisplay.scrollTop - chatDisplay.clientHeight < 100;

            if (!isNearBottom) {
              setNewMessageCount((prevCount) => prevCount + 1);
              setShowScrollButton(true);
            }

            return [...prevMessages, msg];
          }
          return prevMessages;
        });
      });
    }

    return () => {
      socket.off("chat history");
      socket.off("chat message");
    };
  }, [slug, senderId]);

  useEffect(() => {
    const chatDisplay = chatDisplayRef.current;
    if (chatDisplay) {
      const isNearBottom = chatDisplay.scrollHeight - chatDisplay.scrollTop - chatDisplay.clientHeight < 100;
      if (isNearBottom) {
        chatDisplay.scrollTop = chatDisplay.scrollHeight;
        setNewMessageCount(0);
        setShowScrollButton(false);
      }
    }
  }, [chatDisplayRef]);

  const sendMessage = useCallback(() => {
    if (input.trim() === "" || !senderId) return;

    const message = { text: input, sender: senderId, receiver: chatUser?.user_id };
    socket.emit("chat message", message);

    setInput("");
  }, [input, senderId, chatUser]);

  const openImageModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setIsImageModalOpen(true);
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
    setSelectedImage(null);
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleMessageOptions = (messageId, event) => {
    event.stopPropagation();
    setActiveDropdown(activeDropdown === messageId ? null : messageId);
    setIsMenuOpen((prev) => !prev);
  };

  const copyMessage = (message) => {
    navigator.clipboard.writeText(message.text);
    setActiveDropdown(null);
    setIsMenuOpen(false);
  };

  const pinMessage = (message) => {
    const isAlreadyPinned = pinnedMessages.some((msg) => msg._id === message._id);
    if (!isAlreadyPinned) {
      setPinnedMessages((prev) => [...prev, message]);
    }
    setActiveDropdown(null);
    setIsMenuOpen(false);
  };

  const unpinMessage = (messageId) => {
    setPinnedMessages((prev) => prev.filter((msg) => msg._id !== messageId));
  };

  const deleteMessage = async (messageId, deleteForEveryone = false) => {
    try {
      const response = await fetch("/api/messages", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messageIds: [messageId], userId: senderId, deleteForEveryone }),
      });
  
      if (response.ok) {
        if (deleteForEveryone) {
          // Remove the message from the UI for everyone
          setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
        } else {
          // Remove the message from the UI for the current user
          setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
        }
      } else {
        console.error("Failed to delete message");
      }
    } catch (err) {
      console.error("Error deleting message:", err);
    }
    setActiveDropdown(null);
    setIsMenuOpen(false);
  };

  const toggleMessageSelection = (messageId) => {
    if (selectedMessages.includes(messageId)) {
      setSelectedMessages((prev) => prev.filter((id) => id !== messageId));
    } else {
      setSelectedMessages((prev) => [...prev, messageId]);
    }
  };

  const enterSelectionMode = (messageId) => {
    setIsSelectionMode(true);
    setSelectedMessages([messageId]);
    setActiveDropdown(null);
    setIsMenuOpen(false);
  };

  const exitSelectionMode = () => {
    setIsSelectionMode(false);
    setSelectedMessages([]);
  };

  const handleBulkAction = async (action, deleteForEveryone = false) => {
    switch (action) {
      case "copy":
        const textToCopy = messages
          .filter((msg) => selectedMessages.includes(msg._id))
          .map((msg) => msg.text)
          .join("\n");
        navigator.clipboard.writeText(textToCopy);
        break;
      case "delete":
        try {
          const response = await fetch("/api/messages", {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ messageIds: selectedMessages, userId: senderId, deleteForEveryone }),
          });
  
          if (response.ok) {
            if (deleteForEveryone) {
              // Remove the messages from the UI for everyone
              setMessages((prev) => prev.filter((msg) => !selectedMessages.includes(msg._id)));
            } else {
              // Remove the messages from the UI for the current user
              setMessages((prev) => prev.filter((msg) => !selectedMessages.includes(msg._id)));
            }
          } else {
            console.error("Failed to delete messages");
          }
        } catch (err) {
          console.error("Error deleting messages:", err);
        }
        break;
      case "pin":
        const messagesToPin = messages.filter((msg) => selectedMessages.includes(msg._id));
        setPinnedMessages((prev) => [...prev, ...messagesToPin]);
        break;
    }
    exitSelectionMode();
  };

  const handleClickOutside = useCallback((event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setActiveDropdown(null);
      setIsMenuOpen(false);
    }
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
      document.addEventListener("click", handleClickOutside);
    } else {
      document.body.style.overflow = "auto";
      document.removeEventListener("click", handleClickOutside);
    }

    return () => {
      document.body.style.overflow = "auto";
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isMenuOpen, handleClickOutside]);

  const scrollToBottom = () => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    setNewMessageCount(0);
    setShowScrollButton(false);
  };

  const selectAllMessages = () => {
    setSelectedMessages(messages.map((msg) => msg._id));
  };

  const handleScroll = () => {
    const chatDisplay = chatDisplayRef.current;
    if (chatDisplay) {
      const isNearBottom = chatDisplay.scrollHeight - chatDisplay.scrollTop - chatDisplay.clientHeight < 100;
      if (isNearBottom) {
        setNewMessageCount(0);
        setShowScrollButton(false);
      } else {
        setShowScrollButton(true);
      }
    }
  };

  const handleInitiateCall = (isVideo) => {
    initializeCall(chatUser.user_id, isVideo);
    socket.emit("initiate call", { caller: senderId, receiver: chatUser.user_id, callType: isVideo ? "video" : "audio" });
    if (isVideo) {
      setIsInVideoCall(true);
    } else {
      setIsInCall(true);
    }
  };

  const handleAcceptCall = () => {
    acceptCall(incomingCall.caller, incomingCall.callType === "video");
    if (incomingCall.callType === "video") {
      setIsInVideoCall(true);
    } else {
      setIsInCall(true);
    }
    setIncomingCall(null);
    socket.emit("accept call", { caller: incomingCall.caller, receiver: senderId });
  };

  const handleRejectCall = () => {
    socket.emit("reject call", { caller: incomingCall.caller, receiver: senderId });
    setIncomingCall(null);
  };

  const handleEndCall = () => {
    endCall();
    setIsInCall(false);
    setIsInVideoCall(false);
    setCallDuration(0);
    socket.emit("end call", { caller: senderId, receiver: chatUser.user_id });
  };

  const handleBackButton = () => {
    router.back();
  };

  useEffect(() => {
    let interval;
    if (isInCall) {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isInCall]);

  if (error) {
    return <div className="chat-section error">{error}</div>;
  }

  return (
    <div className="chat-section">
      {isMobile && (
        <button className="back-button" onClick={handleBackButton}>
          <IoArrowBack />
        </button>
      )}
      {isSelectionMode ? (
        <div className="selection-top-bar">
          <div className="selection-info">
            <span>{selectedMessages.length} selected</span>
          </div>
          <div className="selection-actions">
            <button onClick={selectAllMessages} className="action-btn">
              <CheckSquare />
            </button>
            <button onClick={() => handleBulkAction("pin")} className="action-btn">
              <FaThumbtack />
            </button>
            <button onClick={() => handleBulkAction("copy")} className="action-btn">
              <FaCopy />
            </button>
            <button onClick={() => handleBulkAction("delete", false)} className="action-btn">
              <FaTrash />
            </button>
            <button onClick={exitSelectionMode} className="action-btn">
              <MdClose />
            </button>
          </div>
        </div>
      ) : (
        <div className="chat-top-bar">
          <div className="user-info">
            {chatUser && chatUser.picture ? (
              <img
                src={chatUser.picture || "/placeholder.svg"}
                alt={chatUser.user_name}
                className="user-avatar"
                onClick={() => openImageModal(chatUser.picture)}
              />
            ) : (
              <FaUserCircle size={40} className="user-avatar" />
            )}
            <span className="user-name">{chatUser ? chatUser.user_name.replace(/^@/, "") : "Loading..."}</span>
          </div>
          <div className="call-options">
            <button onClick={() => handleInitiateCall(false)}>
              <FiPhone size={20} className="call-icon" />
            </button>
            <button onClick={() => handleInitiateCall(true)}>
              <FiVideo size={20} className="call-icon" />
            </button>
          </div>
        </div>
      )}

      <div className="chat-display" ref={chatDisplayRef} onScroll={handleScroll}>
        {pinnedMessages.length > 0 && (
          <div className="pinned-messages-container">
            {pinnedMessages.map((message) => (
              <div key={`pinned-${message._id}`} className="pinned-message">
                <div className="pinned-message-header">
                  <FaThumbtack className="pin-icon" />
                  <span className="pinned-label">Pinned Message</span>
                  <button className="unpin-button" onClick={() => unpinMessage(message._id)}>
                    <MdClose />
                  </button>
                </div>
                <div className="pinned-message-content">{message.text}</div>
              </div>
            ))}
          </div>
        )}

        <div className="messages-container">
          {messages.map((message, index) => (
            <div
              key={message._id}
              className={`chat-message-container ${message.sender === senderId ? "my-message" : "user-message"}`}
              ref={index === messages.length - 1 ? lastMessageRef : null}
            >
              {isSelectionMode && (
                <div
                  className={`message-checkbox ${selectedMessages.includes(message._id) ? "selected" : ""}`}
                  onClick={() => toggleMessageSelection(message._id)}
                >
                  <FaCheck />
                </div>
              )}
              <div className="chat-message">
                {message.type === "text" && message.text}
                {message.type === "image" && (
                  <img
                    src={message.content}
                    alt="Sent image"
                    className="chat-image"
                    onClick={() => openImageModal(message.content)}
                  />
                )}
                {message.type === "video" && (
                  <video controls className="chat-video">
                    <source src={message.content} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
                {message.type === "document" && (
                  <a href={message.content} target="_blank" rel="noopener noreferrer" className="chat-document">
                    Download Document
                  </a>
                )}
                <span className="message-time">{formatTime(message.timestamp)}</span>
                {!isSelectionMode && (
                  <button className="message-options-btn" onClick={(e) => handleMessageOptions(message._id, e)}>
                    <FaEllipsisV />
                  </button>
                )}
                {activeDropdown === message._id && (
                  <div className="message-dropdown" ref={dropdownRef}>
                    <button onClick={() => copyMessage(message)}>
                      <FaCopy /> Copy
                    </button>
                    <button onClick={() => pinMessage(message)}>
                      <FaThumbtack /> Pin
                    </button>
                    {message.sender === senderId && (
                      <button onClick={() => deleteMessage(message._id, true)}>
                        <FaTrash /> Delete for Everyone
                      </button>
                    )}
                    <button onClick={() => deleteMessage(message._id, false)}>
                      <FaTrash /> Delete for Me
                    </button>
                    <button onClick={() => enterSelectionMode(message._id)}>
                      <FaCheck /> Select
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {showScrollButton && (
        <button className="scroll-to-bottom" onClick={scrollToBottom}>
          <ChevronDown />
          {newMessageCount > 0 && <span className="new-message-count">{newMessageCount}</span>}
        </button>
      )}

      <div className="reply-bar">
        <button className="emoji-btn">{/* Add Emoji icon if necessary */}</button>
        <button className="attach-btn" ref={attachRef} onClick={() => setIsAttachmentMenuOpen(!isAttachmentMenuOpen)}>
          <IoAttach size={20} />
        </button>
        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button className="send-btn" onClick={sendMessage}>
          <IoSend size={20} />
        </button>
      </div>

      {/* Render the AttachmentMenu component */}
      <AttachmentMenu
        isOpen={isAttachmentMenuOpen}
        onClose={() => setIsAttachmentMenuOpen(false)}
        onFileSelect={handleFileSelect}
        attachRef={attachRef}
      />

      {(isInCall || incomingCall) && (
        <CallInterface
          chatUser={incomingCall ? { user_id: incomingCall.caller, user_name: incomingCall.caller } : chatUser}
          onEndCall={handleEndCall}
          callDuration={callDuration}
          isIncoming={!!incomingCall}
          onAccept={handleAcceptCall}
          onReject={handleRejectCall}
        />
      )}

      {isInVideoCall && (
        <VideoCallInterface
          chatUser={chatUser}
          onEndCall={handleEndCall}
          localStream={localStream}
          remoteStream={remoteStream}
        />
      )}

      {isImageModalOpen && (
        <div className="image-modal" onClick={closeImageModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={selectedImage || "/placeholder.svg"} alt="User Avatar" className="modal-image" />
            <button className="close-btn" onClick={closeImageModal}>
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

