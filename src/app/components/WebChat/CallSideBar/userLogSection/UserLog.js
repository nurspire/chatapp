'use client';

import { FiPhone, FiVideo, FiClock, FiCalendar } from "react-icons/fi";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import './userlogsection.css';

export default function UserCallLogSection() {
  const [callLogs, setCallLogs] = useState([]);
  const [error, setError] = useState(null);
  const [receiverInfo, setReceiverInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const pathname = usePathname();
  const router = useRouter(); // Use Next.js router for navigation
  const callId = pathname.split("/").pop();

  useEffect(() => {
    const fetchCallLogs = async () => {
      try {
        if (!callId) {
          throw new Error("Call ID not found in URL.");
        }

        const response = await fetch("/api/call");
        if (!response.ok) {
          throw new Error("Failed to fetch call logs.");
        }

        const data = await response.json();
        const filteredLogs = data.callLogs.filter((log) => log._id === callId);
        setCallLogs(filteredLogs);

        if (filteredLogs.length > 0) {
          const userResponse = await fetch("/api/chat_user/getallusers");
          if (!userResponse.ok) {
            throw new Error("Failed to fetch user details.");
          }

          const userData = await userResponse.json();
          const matchedUser = userData.users.find(
            (user) => user.user_id === filteredLogs[0].receiver
          );

          if (!matchedUser) {
            throw new Error("User not found.");
          }

          setReceiverInfo(matchedUser);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCallLogs();
  }, [callId]);

  const handleGoBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="userCallLogSection">
        <div className="loading">Loading call logs...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="userCallLogSection">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="userCallLogSection">
      <div className="logTopBar">
        <button className="goBackButton" onClick={handleGoBack}>
          Go Back
        </button>
        <h1 className="sectionTitle">Call History</h1>
      </div>

      <div className="callLogDisplay">
        {receiverInfo && callLogs.length > 0 && (
          <div className="callLogItem">
            <div className="receiverInfo">
              <img
                src={receiverInfo.picture || "/placeholder.svg"}
                alt={receiverInfo.user_name}
                className="receiverImage"
              />
              <span className="receiverName">{receiverInfo.user_name}</span>
            </div>

            {callLogs.map((call) => (
              <div key={call._id} className="callDetails">
                <div className="callInfo">
                  <span className="callTime">
                    <FiCalendar />
                    {new Date(call.startTime).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                  <span className="callTime">
                    <FiClock />
                    {new Date(call.startTime).toLocaleTimeString()}
                  </span>
                  <span className="callDuration">
                    <FiClock />
                    Duration: {Math.floor(
                      (new Date(call.endTime) - new Date(call.startTime)) / 1000
                    )} seconds
                  </span>
                  <span className={`callStatus ${call.status}`}>
                    {call.status}
                  </span>
                </div>
                <div className="callType">
                  {call.callType === "audio" ? (
                    <FiPhone size={24} />
                  ) : (
                    <FiVideo size={24} />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {callLogs.length === 0 && !loading && (
          <div className="loading">No call logs found for this call ID.</div>
        )}
      </div>
    </div>
  );
}
