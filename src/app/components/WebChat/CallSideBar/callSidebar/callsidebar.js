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

import React, { useState, useEffect, useRef } from "react";
import {
  FaPhoneAlt,
  FaPhoneSlash,
  FaRegClock,
  FaEllipsisV,
  FaTrash,
  FaFolder,
  FaUsers,
} from "react-icons/fa";
import jwt from "jsonwebtoken";
import { useRouter } from "next/navigation"; // For navigation
import "./callbar.css";

export default function CallSidebar() {
  const [callLogs, setCallLogs] = useState([]);
  const [chatUsers, setChatUsers] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1");
        if (token) {
          const decodedToken = jwt.decode(token);
          if (decodedToken) {
            setCurrentUserId(decodedToken.id);
          }
        }

        const callResponse = await fetch("/api/call");
        const callData = await callResponse.json();
        setCallLogs(callData.callLogs);

        const userResponse = await fetch("/api/chat_user/getallusers");
        const userData = await userResponse.json();
        setChatUsers(userData.users);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getChatUser = (userId) => {
    return chatUsers.find((u) => u.user_id === userId);
  };

  const formatDuration = (startTime, endTime) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const durationMs = end.getTime() - start.getTime();
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const formatTime = (time) => {
    return new Date(time).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  };

  const toggleDropdown = (callId) => {
    setActiveDropdown(activeDropdown === callId ? null : callId);
  };

  const handleDelete = async (callId) => {
    try {
      // Make an API request to delete the specific call log
      const response = await fetch("/api/call", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: callId }),
      });
  
      if (response.ok) {
        console.log(`Call log ${callId} deleted successfully`);
        // Update the local state to remove the deleted log
        setCallLogs((prevLogs) => prevLogs.filter((call) => call._id !== callId));
      } else {
        console.error("Failed to delete call log");
      }
    } catch (error) {
      console.error("Error deleting call log:", error);
    }
  
    // Close the dropdown menu
    setActiveDropdown(null);
  };
  
  const handleClearUsers = async () => {
    try {
      // Make an API request to delete all call logs
      const response = await fetch("/api/call", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}), // Send an empty object for deleting all
      });
  
      if (response.ok) {
        console.log("All call logs deleted successfully");
        // Clear call logs from the local state
        setCallLogs([]);
      } else {
        console.error("Failed to delete call logs");
      }
    } catch (error) {
      console.error("Error deleting call logs:", error);
    }
  };
  
  

  const handleOpen = (callId) => {
    console.log("Open call details:", callId);
    setActiveDropdown(null);
  };

  const handleNavigateToCall = (callId) => {
    router.push(`/app/calls/${callId}`);
  };
  

  const filteredCallLogs = callLogs.filter(
    (log) => log.caller === currentUserId || log.receiver === currentUserId
  );

  return (
    <div className="call-sidebar">
      <h2 className="sidebar-title">Call History</h2>
      <div className="actions-bar">
        <button onClick={handleClearUsers} className="clear-users-button">
          <FaUsers size={16} /> Clear Users
        </button>
      </div>
      <div className="call-list">
        {filteredCallLogs.map((call) => {
          const isOutgoing = call.caller === currentUserId;
          const otherPartyId = isOutgoing ? call.receiver : call.caller;
          const otherParty = getChatUser(otherPartyId);

          return (
            <div
            key={call._id}
            className="call-item"
            onClick={() => handleNavigateToCall(call._id)}
          >
          
              <div className="call-info">
                {otherParty && otherParty.picture ? (
                  <img
                    src={otherParty.picture || "/placeholder.svg"}
                    alt={otherParty.user_name}
                    className="user-avatar"
                  />
                ) : (
                  <div className="default-avatar">
                    {isOutgoing ? (
                      <FaPhoneSlash size={20} />
                    ) : (
                      <FaPhoneAlt size={20} />
                    )}
                  </div>
                )}
                <div className="call-details">
                  <div className="call-name">{otherParty ? otherParty.user_name : "Unknown User"}</div>
                  <div className="call-time">{formatTime(call.startTime)}</div>
                </div>
              </div>
              <div className="call-actions">
                <div className="call-duration">
                  <FaRegClock size={12} className="clock-icon" />
                  {formatDuration(call.startTime, call.endTime)}
                </div>
                <div className="dropdown-wrapper">
                  <FaEllipsisV
                    size={16}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleDropdown(call._id);
                    }}
                    className="dropdown-icon"
                  />
                  {activeDropdown === call._id && (
                    <div ref={dropdownRef} className="dropdown-menu slide-in">
                      <div onClick={() => handleDelete(call._id)} className="dropdown-item">
                        <FaTrash size={14} className="dropdown-icon" /> Delete
                      </div>
                      <div onClick={() => handleOpen(call._id)} className="dropdown-item">
                        <FaFolder size={14} className="dropdown-icon" /> Open
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
