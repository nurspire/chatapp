import { useState, useEffect, useRef } from 'react';
import { FaClock, FaCheck, FaTimes } from 'react-icons/fa';
import { RiUserFill } from 'react-icons/ri';
import { FiRefreshCw } from 'react-icons/fi'; // Import the refresh icon
import '../FilterSec.css';

export default function PendingSection() {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [showPendingRequests, setShowPendingRequests] = useState(false);
  const [message, setMessage] = useState('');
  const [users, setUsers] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false); // To track if refreshing
  const pendingRequestsRef = useRef(null);

  // Fetch all users
  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response = await fetch('/api/chat_user/getallusers');
        const data = await response.json();
        if (response.ok) {
          setUsers(data.users);
        } else {
          console.error('Error fetching users:', data.message);
        }
      } catch (error) {
        console.error('Error fetching all users:', error);
      }
    };
    fetchAllUsers();
  }, []);

  // Fetch pending requests
  const fetchPendingRequests = async () => {
    try {
      setIsRefreshing(true); // Set refreshing state
      const token = document.cookie.split(';').find((cookie) => cookie.trim().startsWith('token='));
      if (!token) {
        console.error('No authentication token found');
        return;
      }

      const jwtToken = token.split('=')[1];
      const response = await fetch('/api/friendship/pending', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      if (response.status === 204) {
        // Handle no content response
        setPendingRequests([]);
        return;
      }

      if (!response.ok) {
        const data = await response.json();
        console.error('Error fetching pending requests:', data.message);
        return;
      }

      const data = await response.json();
      const enrichedRequests = data.map((request) => {
        const sender = users.find((user) => user.user_id === request.requester_id);
        return {
          ...request,
          sender,
        };
      });
      setPendingRequests(enrichedRequests);
    } catch (error) {
      console.error('Error fetching pending requests:', error);
    } finally {
      setIsRefreshing(false); // Reset refreshing state
    }
  };

  useEffect(() => {
    if (users.length > 0) {
      fetchPendingRequests();
    }
  }, [users]);

  // Handle outside clicks for pending requests dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pendingRequestsRef.current && !pendingRequestsRef.current.contains(event.target)) {
        setShowPendingRequests(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle accepting a friend request
  const handleAcceptRequest = async (requestId) => {
    try {
      const response = await fetch(`/api/friendship?id=${requestId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'accepted' }),
      });

      const data = await response.json();
      if (response.ok) {
        setPendingRequests(pendingRequests.filter((request) => request._id !== requestId));
        setMessage('Friend request accepted!');
      } else {
        setMessage(data.message || 'Failed to accept friend request');
      }
    } catch (error) {
      console.error('Error accepting friend request:', error);
      setMessage('Error accepting friend request');
    } finally {
      setTimeout(() => setMessage(''), 3000);
    }
  };

  // Handle rejecting a friend request
  const handleRejectRequest = async (requestId) => {
    try {
      const response = await fetch(`/api/friendship?id=${requestId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected' }),
      });

      const data = await response.json();
      if (response.ok) {
        setPendingRequests(pendingRequests.filter((request) => request._id !== requestId));
        setMessage('Friend request rejected!');
      } else {
        setMessage(data.message || 'Failed to reject friend request');
      }
    } catch (error) {
      console.error('Error rejecting friend request:', error);
      setMessage('Error rejecting friend request');
    } finally {
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className="pending-section" ref={pendingRequestsRef}>
      <button className="icon-button" onClick={() => setShowPendingRequests(!showPendingRequests)}>
        <FaClock style={{ height: '20px', width: '20px' }} />
        {pendingRequests.length > 0 && (
          <span className="pending-count">{pendingRequests.length}</span>
        )}
      </button>
      {showPendingRequests && (
        <div className="pending-requests-dropdown">
          {/* Refresh button inside the dropdown */}
          <button
            className={`refresh-button ${isRefreshing ? 'spinning' : ''}`}
            onClick={fetchPendingRequests}
            title="Refresh Pending Requests"
          >
            <FiRefreshCw style={{ height: '20px', width: '20px' }} />
          </button>

          {pendingRequests.length > 0 ? (
            pendingRequests.map((request) => (
              <div key={request._id} className="pending-request-item">
                <div className="user-info">
                  <div className="avatar">
                    {request.sender?.picture ? (
                      <img src={request.sender.picture} alt={request.sender.user_name} className="avatar" />
                    ) : (
                      <RiUserFill className="avatar" />
                    )}
                  </div>
                  <span>{request.sender?.user_name || 'Unknown User'}</span>
                </div>
                <div className="action-buttons">
                  <button className="accept-button" onClick={() => handleAcceptRequest(request._id)}>
                    <FaCheck />
                  </button>
                  <button className="reject-button" onClick={() => handleRejectRequest(request._id)}>
                    <FaTimes />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div>No pending requests</div>
          )}
        </div>
      )}
      {message && <div className="message">{message}</div>}
    </div>
  );
}
