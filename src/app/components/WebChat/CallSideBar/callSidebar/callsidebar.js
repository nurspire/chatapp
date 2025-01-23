// 'use client'
// import { FaPhoneAlt, FaPhoneSlash, FaRegClock } from 'react-icons/fa'; // Phone icons for call actions
// import { useState } from "react";

// import "./callbar.css" // Assuming styles are already in userbar.css
// export default function CallSidebar() {
//   // Sample call log data (replace with database/API in future)
//   const [callLogs, setCallLogs] = useState([
//     { id: 1, name: "John Doe", type: "incoming", time: "12:30 PM", duration: "5 min", status: "answered" },
//     { id: 2, name: "Jane Smith", type: "outgoing", time: "2:45 PM", duration: "3 min", status: "missed" },
//     { id: 3, name: "David Miller", type: "incoming", time: "4:10 PM", duration: "10 min", status: "answered" },
//     { id: 4, name: "Alice Johnson", type: "outgoing", time: "6:00 PM", duration: "7 min", status: "answered" },
//     { id: 5, name: "Chris Evans", type: "incoming", time: "8:15 PM", duration: "2 min", status: "missed" },
//   ]);

//   return (
//     <div className="user-sidebar">
//       {/* Call Log List */}
//       <div className="user-list">
//         {callLogs.map((call) => (
//           <div key={call.id} className="user-item">
//             {/* Call Icon */}
//             {call.type === "incoming" ? (
//               <FaPhoneAlt size={24} className="call-icon" />
//             ) : (
//               <FaPhoneSlash size={24} className="call-icon" />
//             )}
            
//             {/* Call Details */}
//             <div className="call-details">
//               <span className="call-name">{call.name}</span>
//               <span className="call-time">{call.time}</span>
//             </div>

//             {/* Call Status */}
//             {/* <div className="call-status">
//               {call.status === "answered" ? (
//                 <span className="status-answered">Answered</span>
//               ) : (
//                 <span className="status-missed">Missed</span>
//               )}
//             </div> */}

//             {/* Call Duration */}
//             <div className="call-duration">
//               <span>{call.duration}</span>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

"use client";
import { FaPhoneAlt, FaVideo, FaPhoneSlash } from "react-icons/fa";
import { useState, useEffect } from "react";
import io from "socket.io-client";
import { useRouter } from "next/navigation";

import "./callbar.css";

let socket;

export default function CallSidebar({ userId }) {
  const [callLogs, setCallLogs] = useState([]);
  const [users, setUsers] = useState([]);
  const router = useRouter();

  useEffect(() => {
    console.log("Initializing socket connection...");
    socket = io("http://localhost:3000");

    // Fetch call logs
    console.log("Emitting get call logs with userId:", userId);
    socket.emit("get call logs", userId);

    socket.on("call logs", (logs) => {
      console.log("Received call logs:", logs);
      setCallLogs(logs);
    });

    // Fetch user details from API
    console.log("Fetching user data from /api/chat_user/getallusers...");
    fetch("/api/chat_user/getallusers")
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        console.log("User data fetch successful, parsing JSON...");
        return response.json();
      })
      .then((data) => {
        console.log("Fetched user data:", data);
        setUsers(data);
      })
      .catch((error) => console.error("Error fetching users:", error));

    // Cleanup socket
    return () => {
      console.log("Disconnecting socket...");
      socket.off("call logs");
      socket.disconnect();
    };
  }, [userId]);

  const formatDuration = (seconds) => {
    if (!seconds) return "N/A";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const getUserDetails = (userId) => {
    console.log("Looking for user with userId:", userId);
    const user = users.find((user) => user.user_id === userId);
    console.log("User found:", user);
    return user || {};
  };

  if (callLogs.length === 0) {
    console.log("No call logs available for userId:", userId);
  }

  return (
    <div className="user-sidebar">
      <div className="user-list">
        {callLogs.map((call) => {
          const isCaller = call.caller === userId;
          const otherUserId = isCaller ? call.receiver : call.caller;
          const otherUser = getUserDetails(otherUserId);

          console.log("Rendering call log item:", call);
          console.log("Other user details:", otherUser);

          return (
            <div
              key={call._id}
              className="user-item"
              onClick={() => {
                console.log("Navigating to /call/", otherUserId);
                router.push(`/call/${otherUserId}`);
              }}
            >
              {/* Icon based on call type */}
              {call.status === "answered" ? (
                call.callType === "audio" ? (
                  <FaPhoneAlt size={24} className="call-icon" />
                ) : (
                  <FaVideo size={24} className="call-icon" />
                )
              ) : (
                <FaPhoneSlash size={24} className="call-icon" />
              )}

              <div className="call-details">
                <img
                  src={otherUser.picture || "https://via.placeholder.com/40"}
                  alt="User Avatar"
                  className="user-avatar"
                />
                <span className="call-name">{otherUser.user_name || "Unknown User"}</span>
                <span className="call-time">{formatTime(call.startTime)}</span>
              </div>

              <div className="call-duration">
                <span>{formatDuration(call.duration)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
