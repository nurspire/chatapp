// // '''''''''''''''''Working 100% ===============================
// 'use client';

// import { useState, useEffect, useCallback } from "react";
// import { useParams } from "next/navigation";
// import { FaUserCircle, FaRegSmile } from "react-icons/fa";
// import { FiPhone, FiVideo } from "react-icons/fi";
// import { IoAttach, IoSend } from "react-icons/io5";
// import io from "socket.io-client";
// import jwt from "jsonwebtoken";
// import './chatsection.css';

// let socket;

// export default function ChatSection() {
//   const [messages, setMessages] = useState([]); 
//   const [input, setInput] = useState("");  
//   const [chatUser, setChatUser] = useState(null);  
//   const [error, setError] = useState(null);  
//   const [isImageModalOpen, setIsImageModalOpen] = useState(false); 
//   const [selectedImage, setSelectedImage] = useState(null); 
//   const [senderId, setSenderId] = useState(null); 

//   const params = useParams();
//   const slug = params?.slug;  

//   useEffect(() => {
//     const cookies = document.cookie;
//     const token = cookies.split(";").find(cookie => cookie.trim().startsWith("token="))?.split("=")[1];
//     if (token) {
//       try {
//         const decoded = jwt.decode(token);
//         setSenderId(decoded?.id); 
//         console.log("Sender ID from token:", decoded?.id); 
//       } catch (err) {
//         console.error("Token verification failed:", err);
//         setError("Invalid or expired token");
//       }
//     } else {
//       setError("No token provided");
//     }

//     // Initialize socket connection
//     socket = io("http://localhost:3000");

//     return () => {
//       socket.disconnect();
//     };
//   }, []);

//   useEffect(() => {
//     const fetchChatUser = async () => {
//       try {
//         const response = await fetch("/api/chat_user/getallusers");
//         const data = await response.json();

//         if (Array.isArray(data.users)) {
//           const matchedUser = data.users.find(user => user.user_id === slug);
//           if (matchedUser) {
//             setChatUser(matchedUser);
//           } else {
//             setError("No matched user found.");
//           }
//         } else {
//           setError("Failed to fetch users.");
//         }
//       } catch (err) {
//         setError("Failed to fetch user data.");
//       }
//     };

//     fetchChatUser();
//   }, [slug]);

//   useEffect(() => {
//     if (slug && senderId) {
//       socket.emit("set user", senderId);
//       socket.emit("get chat history", senderId, slug);

//       socket.on("chat history", (history) => {
//         setMessages(history);
//       });

//       socket.on("chat message", (msg) => {
//         setMessages((prevMessages) => {
//           const isMessageExist = prevMessages.some((m) => m._id === msg._id);
//           return isMessageExist ? prevMessages : [...prevMessages, msg];
//         });
//       });
//     }

//     return () => {
//       socket.off("chat history");
//       socket.off("chat message");
//     };
//   }, [slug, senderId]);

//   const sendMessage = useCallback(() => {
//     if (input.trim() === "" || !senderId) return;

//     const message = { text: input, sender: senderId, receiver: chatUser?.user_id };
//     socket.emit("chat message", message);

//     setInput("");
//   }, [input, senderId, chatUser]);

//   const openImageModal = (imageUrl) => {
//     setSelectedImage(imageUrl);
//     setIsImageModalOpen(true);
//   };

//   const closeImageModal = () => {
//     setIsImageModalOpen(false);
//     setSelectedImage(null);
//   };

//   if (error) {
//     return <div className="chat-section error">{error}</div>;
//   }

//   return (
//     <div className="chat-section">
//       {isImageModalOpen && (
//         <div className="image-modal" onClick={closeImageModal}>
//           <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//             <button className="close-btn" onClick={closeImageModal}>X</button>
//             <img src={selectedImage} alt="Selected" className="modal-image" />
//           </div>
//         </div>
//       )}

//       <div className="chat-top-bar">
//         <div className="user-info">
//           {chatUser && chatUser.picture ? (
//             <img
//               src={chatUser.picture}
//               alt={chatUser.user_name}
//               className="user-avatar"
//               onClick={() => openImageModal(chatUser.picture)}
//             />
//           ) : (
//             <FaUserCircle size={40} className="user-avatar" />
//           )}
//           <span className="user-name">{chatUser ? chatUser.user_name.replace(/^@/, "") : "Loading..."}</span>
//         </div>
//         <div className="call-options">
//           <FiPhone size={20} className="call-icon" />
//           <FiVideo size={20} className="call-icon" />
//         </div>
//       </div>

//       <div className="chat-display">
//         {messages.map((message) => (
//           <div
//             key={message._id}
//             className={`chat-message ${message.sender === senderId ? "my-message" : "user-message"}`}
//           >
//             {message.text}
//           </div>
//         ))}
//       </div>

//       <div className="reply-bar">
//         <button className="emoji-btn">
//           <FaRegSmile size={20} />
//         </button>
//         <button className="attach-btn">
//           <IoAttach size={20} />
//         </button>
//         <input
//           type="text"
//           placeholder="Type a message..."
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//         />
//         <button className="send-btn" onClick={sendMessage}>
//           <IoSend size={20} />
//         </button>
//       </div>
//     </div>
//   );
// }

// '''''''''''''''''Working 100% ===============================
// 'use client';

// import React, { useState, useEffect, useCallback, useRef } from "react";
// import { useParams } from "next/navigation";
// import { FaUserCircle } from "react-icons/fa";
// import { MdClose } from "react-icons/md";
// import { FaEllipsisV, FaThumbtack, FaTrash } from "react-icons/fa";
// import { FaCopy, FaCheck } from "react-icons/fa";
// import { FiPhone, FiVideo, FiMic, FiMicOff, FiVideoOff } from "react-icons/fi";
// import { IoAttach, IoSend } from "react-icons/io5";
// import io from "socket.io-client";
// import jwt from "jsonwebtoken";
// import './chatsection.css';

// let socket;

// export default function ChatSection() {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const [chatUser, setChatUser] = useState(null);
//   const [error, setError] = useState(null);
//   const [isImageModalOpen, setIsImageModalOpen] = useState(false);
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [senderId, setSenderId] = useState(null);
//   const [isCallActive, setIsCallActive] = useState(false);
//   const [isIncomingCall, setIsIncomingCall] = useState(false);
//   const [isVideo, setIsVideo] = useState(false);
//   const [isAudioMuted, setIsAudioMuted] = useState(false);
//   const [isVideoMuted, setIsVideoMuted] = useState(false);
//   const [peerConnection, setPeerConnection] = useState(null);
//   const [localStream, setLocalStream] = useState(null);
//   const [remoteStream, setRemoteStream] = useState(null);
//   const [selectedMessages, setSelectedMessages] = useState([]);
//   const [activeDropdown, setActiveDropdown] = useState(null);
//   const [pinnedMessages, setPinnedMessages] = useState([]);
//   const [isSelectionMode, setIsSelectionMode] = useState(false);
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [permissionError, setPermissionError] = useState(null);

//   const localVideoRef = useRef(null);
//   const remoteVideoRef = useRef(null);
//   const chatDisplayRef = useRef(null);
//   const dropdownRef = useRef(null);

//   const params = useParams();
//   const slug = params?.slug;

//   useEffect(() => {
//     const cookies = document.cookie;
//     const token = cookies.split(";").find(cookie => cookie.trim().startsWith("token="))?.split("=")[1];
//     if (token) {
//       try {
//         const decoded = jwt.decode(token);
//         setSenderId(decoded?.id);
//         console.log("Sender ID from token:", decoded?.id);
//       } catch (err) {
//         console.error("Token verification failed:", err);
//         setError("Invalid or expired token");
//       }
//     } else {
//       setError("No token provided");
//     }

//     socket = io("http://localhost:3000");

//     return () => {
//       socket.disconnect();
//     };
//   }, []);

//   useEffect(() => {
//     const fetchChatUser = async () => {
//       try {
//         const response = await fetch("/api/chat_user/getallusers");
//         const data = await response.json();

//         if (Array.isArray(data.users)) {
//           const matchedUser = data.users.find(user => user.user_id === slug);
//           if (matchedUser) {
//             setChatUser(matchedUser);
//           } else {
//             setError("No matched user found.");
//           }
//         } else {
//           setError("Failed to fetch users.");
//         }
//       } catch (err) {
//         console.error("Error fetching chat user:", err);
//         setError("Failed to fetch user data.");
//       }
//     };

//     fetchChatUser();
//   }, [slug]);

//   useEffect(() => {
//     if (slug && senderId) {
//       socket.emit("set user", senderId);
//       socket.emit("get chat history", senderId, slug);

//       socket.on("chat history", (history) => {
//         setMessages(history);
//       });

//       socket.on("chat message", (msg) => {
//         setMessages((prevMessages) => {
//           const isMessageExist = prevMessages.some((m) => m._id === msg._id);
//           return isMessageExist ? prevMessages : [...prevMessages, msg];
//         });
//       });

//       socket.on("incoming call", handleIncomingCall);
//       socket.on("receive offer", handleOffer);
//       socket.on("receive answer", handleAnswer);
//       socket.on("receive ice candidate", handleICECandidate);
//       socket.on("call ended", handleCallEnded);
//       socket.on("call rejected", handleCallRejected);
//     }

//     return () => {
//       socket.off("chat history");
//       socket.off("chat message");
//       socket.off("incoming call");
//       socket.off("receive offer");
//       socket.off("receive answer");
//       socket.off("receive ice candidate");
//       socket.off("call ended");
//       socket.off("call rejected");
//     };
//   }, [slug, senderId]);

//   const sendMessage = useCallback(() => {
//     if (input.trim() === "" || !senderId) return;

//     const message = { text: input, sender: senderId, receiver: chatUser?.user_id };
//     socket.emit("chat message", message);

//     setInput("");
//   }, [input, senderId, chatUser]);

//   const openImageModal = (imageUrl) => {
//     setSelectedImage(imageUrl);
//     setIsImageModalOpen(true);
//   };

//   const closeImageModal = () => {
//     setIsImageModalOpen(false);
//     setSelectedImage(null);
//   };

//   // const startCallHandler = async (callType) => {
//   //   try {
//   //     const stream = await navigator.mediaDevices.getUserMedia({ 
//   //       video: callType === 'video', 
//   //       audio: true 
//   //     });
//   //     setLocalStream(stream);
//   //     setIsCallActive(true);
//   //     setIsVideo(callType === 'video');

//   //     if (localVideoRef.current) {
//   //       localVideoRef.current.srcObject = stream;
//   //     }

//   //     const pc = new RTCPeerConnection();
//   //     setPeerConnection(pc);

//   //     stream.getTracks().forEach((track) => pc.addTrack(track, stream));

//   //     pc.onicecandidate = (event) => {
//   //       if (event.candidate) {
//   //         socket.emit("send ice candidate", { candidate: event.candidate, caller: senderId, receiver: chatUser?.user_id });
//   //       }
//   //     };

//   //     pc.ontrack = (event) => {
//   //       setRemoteStream(event.streams[0]);
//   //     };

//   //     const offer = await pc.createOffer();
//   //     await pc.setLocalDescription(offer);
//   //     socket.emit("send offer", { offer, caller: senderId, receiver: chatUser?.user_id, callType });
//   //     socket.emit("initiate call", { caller: senderId, receiver: chatUser?.user_id, callType });

//   //   } catch (err) {
//   //     console.error("Error starting call:", err);
//   //     setError("Failed to start call. Please check your camera and microphone permissions.");
//   //     setIsCallActive(false);
//   //   }
//   // };


//   const startCallHandler = async (callType) => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ 
//         video: callType === 'video', 
//         audio: true 
//       });
//       setLocalStream(stream);
//       setIsCallActive(true);
//       setIsVideo(callType === 'video');

//       if (localVideoRef.current) {
//         localVideoRef.current.srcObject = stream;
//       }

//       const pc = new RTCPeerConnection();
//       setPeerConnection(pc);

//       stream.getTracks().forEach((track) => pc.addTrack(track, stream));

//       pc.onicecandidate = (event) => {
//         if (event.candidate) {
//           socket.emit("send ice candidate", { candidate: event.candidate, caller: senderId, receiver: chatUser?.user_id });
//         }
//       };

//       pc.ontrack = (event) => {
//         setRemoteStream(event.streams[0]);
//       };

//       const offer = await pc.createOffer();
//       await pc.setLocalDescription(offer);
//       socket.emit("send offer", { offer, caller: senderId, receiver: chatUser?.user_id, callType });
//       socket.emit("initiate call", { caller: senderId, receiver: chatUser?.user_id, callType });

//     } catch (err) {
//       console.error("Error starting call:", err);
//       setPermissionError("Failed to access camera or microphone. Please check your permissions.");
//       setIsCallActive(false);
//     }
//   };

//   const handlePermissionError = () => {
//     setPermissionError(null);
//     if (navigator.permissions) {
//       Promise.all([
//         navigator.permissions.query({ name: 'camera' }),
//         navigator.permissions.query({ name: 'microphone' })
//       ]).then(([cameraResult, microphoneResult]) => {
//         if (cameraResult.state === 'granted' && microphoneResult.state === 'granted') {
//           startCallHandler(isVideo ? 'video' : 'audio');
//         } else {
//           window.open('chrome://settings/content/camera', '_blank');
//         }
//       });
//     } else {
//       window.open('chrome://settings/content/camera', '_blank');
//     }
//   };


//   const handleIncomingCall = (data) => {
//     setIsIncomingCall(true);
//     setIsVideo(data.callType === 'video');
//     if (window.confirm(`Incoming ${data.callType} call from ${data.caller}`)) {
//       acceptCall(data);
//     } else {
//       rejectCall(data);
//     }
//   };

//   const acceptCall = async (data) => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ 
//         video: data.callType === 'video', 
//         audio: true 
//       });
//       setLocalStream(stream);
//       setIsCallActive(true);
//       setIsIncomingCall(false);

//       if (localVideoRef.current) {
//         localVideoRef.current.srcObject = stream;
//       }

//       const pc = new RTCPeerConnection();
//       setPeerConnection(pc);
      
//       stream.getTracks().forEach((track) => pc.addTrack(track, stream));
      
//       pc.onicecandidate = (event) => {
//         if (event.candidate) {
//           socket.emit("send ice candidate", { candidate: event.candidate, caller: data.caller, receiver: senderId });
//         }
//       };

//       pc.ontrack = (event) => {
//         setRemoteStream(event.streams[0]);
//       };

//       socket.emit("accept call", { caller: data.caller, receiver: senderId, callType: data.callType });
//     } catch (err) {
//       console.error("Error accepting call:", err);
//       setError("Failed to accept call. Please check your camera and microphone permissions.");
//       setIsCallActive(false);
//       setIsIncomingCall(false);
//     }
//   };

//   const rejectCall = (data) => {
//     setIsIncomingCall(false);
//     socket.emit("reject call", { caller: data.caller, receiver: senderId });
//   };

//   const handleOffer = async (data) => {
//     try {
//       const pc = peerConnection || new RTCPeerConnection();
//       await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
//       const answer = await pc.createAnswer();
//       await pc.setLocalDescription(answer);
//       socket.emit("send answer", { answer, caller: data.caller, receiver: senderId });
//       setPeerConnection(pc);
//     } catch (err) {
//       console.error("Error handling offer:", err);
//       setError("Failed to process incoming call.");
//     }
//   };

//   const handleAnswer = async (data) => {
//     try {
//       const pc = peerConnection;
//       await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
//     } catch (err) {
//       console.error("Error handling answer:", err);
//       setError("Failed to establish connection.");
//     }
//   };

//   const handleICECandidate = (data) => {
//     const pc = peerConnection;
//     if (pc && data.candidate) {
//       pc.addIceCandidate(new RTCIceCandidate(data.candidate))
//         .catch(err => console.error("Error adding ICE candidate:", err));
//     }
//   };

//   const handleCallEnded = () => {
//     endCall();
//   };

//   const handleCallRejected = () => {
//     setIsCallActive(false);
//     setError("Call was rejected.");
//   };

//   const endCall = () => {
//     if (peerConnection) {
//       peerConnection.close();
//       setPeerConnection(null);
//     }
//     if (localStream) {
//       localStream.getTracks().forEach(track => track.stop());
//       setLocalStream(null);
//     }
//     setRemoteStream(null);
//     setIsCallActive(false);
//     setIsIncomingCall(false);
//     socket.emit("end call", { caller: senderId, receiver: chatUser?.user_id });
//   };

//   const toggleAudio = () => {
//     if (localStream) {
//       const audioTrack = localStream.getAudioTracks()[0];
//       if (audioTrack) {
//         audioTrack.enabled = !audioTrack.enabled;
//         setIsAudioMuted(!audioTrack.enabled);
//       }
//     }
//   };

//   const toggleVideo = () => {
//     if (localStream) {
//       const videoTrack = localStream.getVideoTracks()[0];
//       if (videoTrack) {
//         videoTrack.enabled = !videoTrack.enabled;
//         setIsVideoMuted(!videoTrack.enabled);
//       }
//     }
//   };

//   useEffect(() => {
//     if (remoteVideoRef.current && remoteStream) {
//       remoteVideoRef.current.srcObject = remoteStream;
//     }
//   }, [remoteStream]);

//   const formatTime = (timestamp) => {
//     const date = new Date(timestamp);
//     return date.toLocaleTimeString('en-US', { 
//       hour: '2-digit', 
//       minute: '2-digit',
//       hour12: true 
//     });
//   };

//   const handleMessageOptions = (messageId, event) => {
//     event.stopPropagation();
//     setActiveDropdown(activeDropdown === messageId ? null : messageId);
//     setIsMenuOpen(prev => !prev);
//   };

//   const copyMessage = (message) => {
//     navigator.clipboard.writeText(message.text);
//     setActiveDropdown(null);
//     setIsMenuOpen(false);
//   };

//   const pinMessage = (message) => {
//     const isAlreadyPinned = pinnedMessages.some(msg => msg._id === message._id);
//     if (!isAlreadyPinned) {
//       setPinnedMessages(prev => [...prev, message]);
//     }
//     setActiveDropdown(null);
//     setIsMenuOpen(false);
//   };

//   const unpinMessage = (messageId) => {
//     setPinnedMessages(prev => prev.filter(msg => msg._id !== messageId));
//   };
  
//   const deleteMessage = (messageId) => {
//     setMessages(prev => prev.filter(msg => msg._id !== messageId));
//     setActiveDropdown(null);
//     setIsMenuOpen(false);
//   };

//   const toggleMessageSelection = (messageId) => {
//     if (selectedMessages.includes(messageId)) {
//       setSelectedMessages(prev => prev.filter(id => id !== messageId));
//     } else {
//       setSelectedMessages(prev => [...prev, messageId]);
//     }
//   };

//   const enterSelectionMode = (messageId) => {
//     setIsSelectionMode(true);
//     setSelectedMessages([messageId]);
//     setActiveDropdown(null);
//     setIsMenuOpen(false);
//   };

//   const exitSelectionMode = () => {
//     setIsSelectionMode(false);
//     setSelectedMessages([]);
//   };

//   const handleBulkAction = (action) => {
//     switch (action) {
//       case 'copy':
//         const textToCopy = messages
//           .filter(msg => selectedMessages.includes(msg._id))
//           .map(msg => msg.text)
//           .join('\n');
//         navigator.clipboard.writeText(textToCopy);
//         break;
//       case 'delete':
//         setMessages(prev => prev.filter(msg => !selectedMessages.includes(msg._id)));
//         break;
//       case 'pin':
//         const messagesToPin = messages.filter(msg => selectedMessages.includes(msg._id));
//         setPinnedMessages(prev => [...prev, ...messagesToPin]);
//         break;
//     }
//     exitSelectionMode();
//   };

//   const handleClickOutside = useCallback((event) => {
//     if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//       setActiveDropdown(null);
//       setIsMenuOpen(false);
//     }
//   }, []);

//   useEffect(() => {
//     if (isMenuOpen) {
//       document.body.style.overflow = 'hidden';
//       document.addEventListener('click', handleClickOutside);
//     } else {
//       document.body.style.overflow = 'auto';
//       document.removeEventListener('click', handleClickOutside);
//     }

//     return () => {
//       document.body.style.overflow = 'auto';
//       document.removeEventListener('click', handleClickOutside);
//     };
//   }, [isMenuOpen]);

//   if (error) {
//     return <div className="chat-section error">{error}</div>;
//   }


//   return (
//     <div className="chat-section">
//         {permissionError && (
//         <div className="permission-error">
//           <p>{permissionError}</p>
//           <button onClick={handlePermissionError}>Give Permission</button>
//         </div>
//       )}
//       {isSelectionMode ? (
//         <div className="selection-top-bar">
//           <div className="selection-info">
//             <span>{selectedMessages.length} selected</span>
//           </div>
//           <div className="selection-actions">
//             <button onClick={() => handleBulkAction('pin')} className="action-btn">
//               <FaThumbtack />
//             </button>
//             <button onClick={() => handleBulkAction('copy')} className="action-btn">
//               <FaCopy />
//             </button>
//             <button onClick={() => handleBulkAction('delete')} className="action-btn">
//               <FaTrash />
//             </button>
//             <button onClick={exitSelectionMode} className="action-btn">
//               <MdClose />
//             </button>
//           </div>
//         </div>
//       ) : (
//         <div className="chat-top-bar">
//           <div className="user-info">
//             {chatUser && chatUser.picture ? (
//               <img
//                 src={chatUser.picture}
//                 alt={chatUser.user_name}
//                 className="user-avatar"
//                 onClick={() => openImageModal(chatUser.picture)}
//               />
//             ) : (
//               <FaUserCircle size={40} className="user-avatar" />
//             )}
//             <span className="user-name">{chatUser ? chatUser.user_name.replace(/^@/, "") : "Loading..."}</span>
//           </div>
//           <div className="call-options">
//             <FiPhone size={20} className="call-icon" onClick={() => startCallHandler("audio")} />
//             <FiVideo size={20} className="call-icon" onClick={() => startCallHandler("video")} />
//           </div>
//         </div>
//       )}
   
//       {(isCallActive || isIncomingCall) && (
//         <div className="call-ui-container">
//           <div className="call-header">
//             <h3>{isVideo ? 'Video' : 'Audio'} Call with {chatUser?.user_name || 'User'}</h3>
//             <button onClick={endCall} className="end-call-btn">End Call</button>
//           </div>

//           <div className={`call-content ${isVideo ? 'video-call' : 'audio-call'}`}>
//             {isVideo && (
//               <div className="video-container">
//                 <video ref={localVideoRef} autoPlay muted className="local-video" />
//                 <video ref={remoteVideoRef} autoPlay className="remote-video" />
//               </div>
//             )}
//             {!isVideo && (
//               <div className="audio-container">
//                 <div className="audio-avatar">
//                   {chatUser && chatUser.picture ? (
//                     <img src={chatUser.picture} alt={chatUser.user_name} className="call-avatar" />
//                   ) : (
//                     <FaUserCircle size={80} className="call-avatar" />
//                   )}
//                 </div>
//               </div>
//             )}

//             <div className="call-controls">
//               <button onClick={toggleAudio} className="control-btn">
//                 {isAudioMuted ? <FiMicOff /> : <FiMic />}
//               </button>
//               {isVideo && (
//                 <button onClick={toggleVideo} className="control-btn">
//                   {isVideoMuted ? <FiVideoOff /> : <FiVideo />}
//                 </button>
//               )}
//               <button onClick={endCall} className="end-call-btn">End</button>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="chat-display" ref={chatDisplayRef}>
//         {pinnedMessages.length > 0 && (
//           <div className="pinned-messages-container">
//             {pinnedMessages.map((message) => (
//               <div key={`pinned-${message._id}`} className="pinned-message">
//                 <div className="pinned-message-header">
//                   <FaThumbtack className="pin-icon" />
//                   <span className="pinned-label">Pinned Message</span>
//                   <button 
//                     className="unpin-button"
//                     onClick={() => unpinMessage(message._id)}
//                   >
//                     <MdClose />
//                   </button>
//                 </div>
//                 <div className="pinned-message-content">
//                   {message.text}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
        
//         <div className="messages-container">
//           {messages.map((message) => (
//             <div
//               key={message._id}
//               className={`chat-message-container ${message.sender === senderId ? "my-message" : "user-message"}`}
//             >
//               {isSelectionMode && (
//                 <div 
//                   className={`message-checkbox ${selectedMessages.includes(message._id) ? 'selected' : ''}`}
//                   onClick={() => toggleMessageSelection(message._id)}
//                 >
//                   <FaCheck />
//                 </div>
//               )}
//               <div className="chat-message">
//                 {message.text}
//                 <span className="message-time">{formatTime(message.timestamp)}</span>
//                 {!isSelectionMode && (
//                   <button 
//                     className="message-options-btn"
//                     onClick={(e) => handleMessageOptions(message._id, e)}
//                   >
//                     <FaEllipsisV />
//                   </button>
//                 )}
//                 {activeDropdown === message._id && (
//                   <div className="message-dropdown" ref={dropdownRef}>
//                     <button onClick={() => copyMessage(message)}>
//                       <FaCopy /> Copy
//                     </button>
//                     <button onClick={() => pinMessage(message)}>
//                       <FaThumbtack /> Pin
//                     </button>
//                     <button onClick={() => deleteMessage(message._id)}>
//                       <FaTrash /> Delete
//                     </button>
//                     <button onClick={() => enterSelectionMode(message._id)}>
//                       <FaCheck /> Select
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       <div className="reply-bar">
//         <button className="emoji-btn">
//           {/* Add Emoji icon if necessary */}
//         </button>
//         <button className="attach-btn">
//           <IoAttach size={20} />
//         </button>
//         <input
//           type="text"
//           placeholder="Type a message..."
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//         />
//         <button className="send-btn" onClick={sendMessage}>
//           <IoSend size={20} />
//         </button>
//       </div>

//       {isImageModalOpen && (
//         <div className="image-modal" onClick={closeImageModal}>
//           <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//             <img src={selectedImage} alt="User Avatar" className="modal-image" />
//             <button className="close-btn" onClick={closeImageModal}>&times;</button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// ==============================Final=========================================
// 'use client';

// import React, { useState, useEffect, useCallback, useRef } from "react";
// import { useParams } from "next/navigation";
// import Link from "next/link";
// import { FaUserCircle } from "react-icons/fa";
// import { MdClose } from "react-icons/md";
// import { FaEllipsisV, FaThumbtack, FaTrash } from "react-icons/fa";
// import { FaCopy, FaCheck } from "react-icons/fa";
// import { FiPhone, FiVideo } from "react-icons/fi";
// import { IoAttach, IoSend } from "react-icons/io5";
// import { ChevronDown, CheckSquare } from 'lucide-react';
// import io from "socket.io-client";
// import jwt from "jsonwebtoken";
// import './chatsection.css';

// let socket;

// export default function ChatSection() {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const [chatUser, setChatUser] = useState(null);
//   const [error, setError] = useState(null);
//   const [isImageModalOpen, setIsImageModalOpen] = useState(false);
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [senderId, setSenderId] = useState(null);
//   const [selectedMessages, setSelectedMessages] = useState([]);
//   const [activeDropdown, setActiveDropdown] = useState(null);
//   const [pinnedMessages, setPinnedMessages] = useState([]);
//   const [isSelectionMode, setIsSelectionMode] = useState(false);
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [newMessageCount, setNewMessageCount] = useState(0);
//   const [showScrollButton, setShowScrollButton] = useState(false);

//   const chatDisplayRef = useRef(null);
//   const dropdownRef = useRef(null);
//   const lastMessageRef = useRef(null);

//   const params = useParams();
//   const slug = params?.slug;

//   useEffect(() => {
//     const cookies = document.cookie;
//     const token = cookies.split(";").find(cookie => cookie.trim().startsWith("token="))?.split("=")[1];
//     if (token) {
//       try {
//         const decoded = jwt.decode(token);
//         setSenderId(decoded?.id);
//         console.log("Sender ID from token:", decoded?.id);
//       } catch (err) {
//         console.error("Token verification failed:", err);
//         setError("Invalid or expired token");
//       }
//     } else {
//       setError("No token provided");
//     }

//     socket = io("http://localhost:3000");

//     return () => {
//       socket.disconnect();
//     };
//   }, []);

//   useEffect(() => {
//     const fetchChatUser = async () => {
//       try {
//         const response = await fetch("/api/chat_user/getallusers");
//         const data = await response.json();

//         if (Array.isArray(data.users)) {
//           const matchedUser = data.users.find(user => user.user_id === slug);
//           if (matchedUser) {
//             setChatUser(matchedUser);
//           } else {
//             setError("No matched user found.");
//           }
//         } else {
//           setError("Failed to fetch users.");
//         }
//       } catch (err) {
//         console.error("Error fetching chat user:", err);
//         setError("Failed to fetch user data.");
//       }
//     };

//     fetchChatUser();
//   }, [slug]);

//   useEffect(() => {
//     if (slug && senderId) {
//       socket.emit("set user", senderId);
//       socket.emit("get chat history", senderId, slug);

//       socket.on("chat history", (history) => {
//         setMessages(history);
//       });

//       socket.on("chat message", (msg) => {
//         setMessages((prevMessages) => {
//           const isMessageExist = prevMessages.some((m) => m._id === msg._id);
//           if (!isMessageExist) {
//             const chatDisplay = chatDisplayRef.current;
//             const isNearBottom = chatDisplay && (chatDisplay.scrollHeight - chatDisplay.scrollTop - chatDisplay.clientHeight < 100);
            
//             if (!isNearBottom) {
//               setNewMessageCount((prevCount) => prevCount + 1);
//               setShowScrollButton(true);
//             }
            
//             return [...prevMessages, msg];
//           }
//           return prevMessages;
//         });
//       });
//     }

//     return () => {
//       socket.off("chat history");
//       socket.off("chat message");
//     };
//   }, [slug, senderId]);

//   useEffect(() => {
//     const chatDisplay = chatDisplayRef.current;
//     if (chatDisplay) {
//       const isNearBottom = chatDisplay.scrollHeight - chatDisplay.scrollTop - chatDisplay.clientHeight < 100;
//       if (isNearBottom) {
//         chatDisplay.scrollTop = chatDisplay.scrollHeight;
//         setNewMessageCount(0);
//         setShowScrollButton(false);
//       }
//     }
//   }, [messages]);

//   const sendMessage = useCallback(() => {
//     if (input.trim() === "" || !senderId) return;

//     const message = { text: input, sender: senderId, receiver: chatUser?.user_id };
//     socket.emit("chat message", message);

//     setInput("");
//   }, [input, senderId, chatUser]);

//   const openImageModal = (imageUrl) => {
//     setSelectedImage(imageUrl);
//     setIsImageModalOpen(true);
//   };

//   const closeImageModal = () => {
//     setIsImageModalOpen(false);
//     setSelectedImage(null);
//   };

//   const formatTime = (timestamp) => {
//     const date = new Date(timestamp);
//     return date.toLocaleTimeString('en-US', { 
//       hour: '2-digit', 
//       minute: '2-digit',
//       hour12: true 
//     });
//   };

//   const handleMessageOptions = (messageId, event) => {
//     event.stopPropagation();
//     setActiveDropdown(activeDropdown === messageId ? null : messageId);
//     setIsMenuOpen(prev => !prev);
//   };

//   const copyMessage = (message) => {
//     navigator.clipboard.writeText(message.text);
//     setActiveDropdown(null);
//     setIsMenuOpen(false);
//   };

//   const pinMessage = (message) => {
//     const isAlreadyPinned = pinnedMessages.some(msg => msg._id === message._id);
//     if (!isAlreadyPinned) {
//       setPinnedMessages(prev => [...prev, message]);
//     }
//     setActiveDropdown(null);
//     setIsMenuOpen(false);
//   };

//   const unpinMessage = (messageId) => {
//     setPinnedMessages(prev => prev.filter(msg => msg._id !== messageId));
//   };
  
//   const deleteMessage = (messageId) => {
//     setMessages(prev => prev.filter(msg => msg._id !== messageId));
//     setActiveDropdown(null);
//     setIsMenuOpen(false);
//   };

//   const toggleMessageSelection = (messageId) => {
//     if (selectedMessages.includes(messageId)) {
//       setSelectedMessages(prev => prev.filter(id => id !== messageId));
//     } else {
//       setSelectedMessages(prev => [...prev, messageId]);
//     }
//   };

//   const enterSelectionMode = (messageId) => {
//     setIsSelectionMode(true);
//     setSelectedMessages([messageId]);
//     setActiveDropdown(null);
//     setIsMenuOpen(false);
//   };

//   const exitSelectionMode = () => {
//     setIsSelectionMode(false);
//     setSelectedMessages([]);
//   };

//   const handleBulkAction = (action) => {
//     switch (action) {
//       case 'copy':
//         const textToCopy = messages
//           .filter(msg => selectedMessages.includes(msg._id))
//           .map(msg => msg.text)
//           .join('\n');
//         navigator.clipboard.writeText(textToCopy);
//         break;
//       case 'delete':
//         setMessages(prev => prev.filter(msg => !selectedMessages.includes(msg._id)));
//         break;
//       case 'pin':
//         const messagesToPin = messages.filter(msg => selectedMessages.includes(msg._id));
//         setPinnedMessages(prev => [...prev, ...messagesToPin]);
//         break;
//     }
//     exitSelectionMode();
//   };

//   const handleClickOutside = useCallback((event) => {
//     if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//       setActiveDropdown(null);
//       setIsMenuOpen(false);
//     }
//   }, []);

//   useEffect(() => {
//     if (isMenuOpen) {
//       document.body.style.overflow = 'hidden';
//       document.addEventListener('click', handleClickOutside);
//     } else {
//       document.body.style.overflow = 'auto';
//       document.removeEventListener('click', handleClickOutside);
//     }

//     return () => {
//       document.body.style.overflow = 'auto';
//       document.removeEventListener('click', handleClickOutside);
//     };
//   }, [isMenuOpen]);

//   const scrollToBottom = () => {
//     lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
//     setNewMessageCount(0);
//     setShowScrollButton(false);
//   };

//   const selectAllMessages = () => {
//     setSelectedMessages(messages.map(msg => msg._id));
//   };

//   const handleScroll = () => {
//     const chatDisplay = chatDisplayRef.current;
//     if (chatDisplay) {
//       const isNearBottom = chatDisplay.scrollHeight - chatDisplay.scrollTop - chatDisplay.clientHeight < 100;
//       if (isNearBottom) {
//         setNewMessageCount(0);
//         setShowScrollButton(false);
//       } else {
//         setShowScrollButton(true);
//       }
//     }
//   };

//   if (error) {
//     return <div className="chat-section error">{error}</div>;
//   }

//   return (
//     <div className="chat-section">
//       {isSelectionMode ? (
//         <div className="selection-top-bar">
//           <div className="selection-info">
//             <span>{selectedMessages.length} selected</span>
//           </div>
//           <div className="selection-actions">
//             <button onClick={selectAllMessages} className="action-btn">
//               <CheckSquare />
//             </button>
//             <button onClick={() => handleBulkAction('pin')} className="action-btn">
//               <FaThumbtack />
//             </button>
//             <button onClick={() => handleBulkAction('copy')} className="action-btn">
//               <FaCopy />
//             </button>
//             <button onClick={() => handleBulkAction('delete')} className="action-btn">
//               <FaTrash />
//             </button>
//             <button onClick={exitSelectionMode} className="action-btn">
//               <MdClose />
//             </button>
//           </div>
//         </div>
//       ) : (
//         <div className="chat-top-bar">
//           <div className="user-info">
//             {chatUser && chatUser.picture ? (
//               <img
//                 src={chatUser.picture}
//                 alt={chatUser.user_name}
//                 className="user-avatar"
//                 onClick={() => openImageModal(chatUser.picture)}
//               />
//             ) : (
//               <FaUserCircle size={40} className="user-avatar" />
//             )}
//             <span className="user-name">{chatUser ? chatUser.user_name.replace(/^@/, "") : "Loading..."}</span>
//           </div>
//           <div className="call-options">
//             <Link href={`/app/calls/${chatUser?.user_id}`}>
//               <FiPhone size={20} className="call-icon" />
//             </Link>
//             <Link href={`/app/calls/${chatUser?.user_id}`}>
//               <FiVideo size={20} className="call-icon" />
//             </Link>
//           </div>
//         </div>
//       )}

//       <div className="chat-display" ref={chatDisplayRef} onScroll={handleScroll}>
//         {pinnedMessages.length > 0 && (
//           <div className="pinned-messages-container">
//             {pinnedMessages.map((message) => (
//               <div key={`pinned-${message._id}`} className="pinned-message">
//                 <div className="pinned-message-header">
//                   <FaThumbtack className="pin-icon" />
//                   <span className="pinned-label">Pinned Message</span>
//                   <button 
//                     className="unpin-button"
//                     onClick={() => unpinMessage(message._id)}
//                   >
//                     <MdClose />
//                   </button>
//                 </div>
//                 <div className="pinned-message-content">
//                   {message.text}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
        
//         <div className="messages-container">
//           {messages.map((message, index) => (
//             <div
//               key={message._id}
//               className={`chat-message-container ${message.sender === senderId ? "my-message" : "user-message"}`}
//               ref={index === messages.length - 1 ? lastMessageRef : null}
//             >
//               {isSelectionMode && (
//                 <div 
//                   className={`message-checkbox ${selectedMessages.includes(message._id) ? 'selected' : ''}`}
//                   onClick={() => toggleMessageSelection(message._id)}
//                 >
//                   <FaCheck />
//                 </div>
//               )}
//               <div className="chat-message">
//                 {message.text}
//                 <span className="message-time">{formatTime(message.timestamp)}</span>
//                 {!isSelectionMode && (
//                   <button 
//                     className="message-options-btn"
//                     onClick={(e) => handleMessageOptions(message._id, e)}
//                   >
//                     <FaEllipsisV />
//                   </button>
//                 )}
//                 {activeDropdown === message._id && (
//                   <div className="message-dropdown" ref={dropdownRef}>
//                     <button onClick={() => copyMessage(message)}>
//                       <FaCopy /> Copy
//                     </button>
//                     <button onClick={() => pinMessage(message)}>
//                       <FaThumbtack /> Pin
//                     </button>
//                     <button onClick={() => deleteMessage(message._id)}>
//                       <FaTrash /> Delete
//                     </button>
//                     <button onClick={() => enterSelectionMode(message._id)}>
//                       <FaCheck /> Select
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {showScrollButton && (
//         <button className="scroll-to-bottom" onClick={scrollToBottom}>
//           <ChevronDown />
//           {newMessageCount > 0 && <span className="new-message-count">{newMessageCount}</span>}
//         </button>
//       )}

//       <div className="reply-bar">
//         <button className="emoji-btn">
//           {/* Add Emoji icon if necessary */}
//         </button>
//         <button className="attach-btn">
//           <IoAttach size={20} />
//         </button>
//         <input
//           type="text"
//           placeholder="Type a message..."
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//         />
//         <button className="send-btn" onClick={sendMessage}>
//           <IoSend size={20} />
//         </button>
//       </div>

//       {isImageModalOpen && (
//         <div className="image-modal" onClick={closeImageModal}>
//           <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//             <img src={selectedImage} alt="User Avatar" className="modal-image" />
//             <button className="close-btn" onClick={closeImageModal}>&times;</button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "next/navigation";
import { FaUserCircle, FaEllipsisV, FaThumbtack, FaTrash, FaCopy, FaCheck } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { FiPhone, FiVideo } from "react-icons/fi";
import { IoAttach, IoSend } from "react-icons/io5";
import { ChevronDown, CheckSquare } from 'lucide-react';
import io from "socket.io-client";
import jwt from "jsonwebtoken";
import "./ChatSection.css";
import CallInterface from "./audiocall/audiocall";
import VideoCallInterface from "./videocall/videocall";
import useWebRTC from "@/app/hooks/useWebRTC";

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

  const chatDisplayRef = useRef(null);
  const dropdownRef = useRef(null);
  const lastMessageRef = useRef(null);

  const params = useParams();
  const slug = params?.slug;

  const { initializeCall, acceptCall, endCall, localStream, remoteStream } = useWebRTC(
    socketReady ? socket : null,
    senderId
  );

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

    socket = io("http://localhost:3000");
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
        setMessages(history);
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
  }, [messages]);

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

  const deleteMessage = (messageId) => {
    setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
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

  const handleBulkAction = (action) => {
    switch (action) {
      case "copy":
        const textToCopy = messages
          .filter((msg) => selectedMessages.includes(msg._id))
          .map((msg) => msg.text)
          .join("\n");
        navigator.clipboard.writeText(textToCopy);
        break;
      case "delete":
        setMessages((prev) => prev.filter((msg) => !selectedMessages.includes(msg._id)));
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
            <button onClick={() => handleBulkAction("delete")} className="action-btn">
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
                {message.text}
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
                    <button onClick={() => deleteMessage(message._id)}>
                      <FaTrash /> Delete
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
        <button className="attach-btn">
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
