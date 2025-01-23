// 'use client'
// import { FaUserCircle } from "react-icons/fa";
// import { FiPhone, FiVideo } from "react-icons/fi";
// import { useState } from "react";
// import './userlogsection.css';

// export default function UserCallLogSection() {
//   // Dummy selected user
//   const selectedUser = {
//     id: 1,
//     name: "Ali",
//   };

//   // Sample call logs (replace with dynamic data)
//   const [callLogs] = useState([
//     { time: "12:30 PM", type: "incoming", duration: "5 min", status: "answered" },
//     { time: "1:45 PM", type: "outgoing", duration: "3 min", status: "missed" },
//     { time: "2:00 PM", type: "incoming", duration: "7 min", status: "answered" },
//   ]);

//   return (
//     <div className="user-call-log-section">
//       {/* User's Call Logs */}
//       <div className="log-top-bar">
//         <span className="section-title">{selectedUser.name}'s Call Logs</span>
//       </div>

//       {/* Call Logs */}
//       <div className="call-log-display">
//         {callLogs.map((call, index) => (
//           <div key={index} className="call-log-item">
//             <div className="call-info">
//               <span className="call-time">{call.time}</span>
//               <span className="call-duration">{call.duration}</span>
//               <span className={`call-status ${call.status}`}>{call.status}</span>
//             </div>
//             <div className="call-type">
//               {call.type === "incoming" ? (
//                 <FiPhone size={20} className="call-icon" />
//               ) : (
//                 <FiVideo size={20} className="call-icon" />
//               )}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

'use client'

import { FaUserCircle } from "react-icons/fa";
import { FiPhone, FiVideo } from "react-icons/fi";
import { useState, useEffect } from "react";
import io from "socket.io-client";
import './userlogsection.css';

let socket;

export default function UserCallLogSection({ userId }) {
  const [callLogs, setCallLogs] = useState([]);

  useEffect(() => {
    socket = io("http://localhost:3000");

    socket.emit("get call logs", userId);

    socket.on("call logs", (logs) => {
      setCallLogs(logs);
    });

    return () => {
      socket.off("call logs");
      socket.disconnect();
    };
  }, [userId]);

  const formatDuration = (seconds) => {
    if (!seconds) return "N/A";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="user-call-log-section">
      <div className="log-top-bar">
        <span className="section-title">Call Logs</span>
      </div>

      <div className="call-log-display">
        {callLogs.map((call) => (
          <div key={call._id} className="call-log-item">
            <div className="call-info">
              <span className="call-time">{formatTime(call.startTime)}</span>
              <span className="call-duration">{formatDuration(call.duration)}</span>
              <span className={`call-status ${call.status}`}>{call.status}</span>
            </div>
            <div className="call-type">
              {call.callType === "audio" ? (
                <FiPhone size={20} className="call-icon" />
              ) : (
                <FiVideo size={20} className="call-icon" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

