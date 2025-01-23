// 'use client';

// import { useState, useEffect, useRef } from 'react';
// import { FaSearch, FaUserPlus, FaClock, FaCheck, FaTimes } from 'react-icons/fa';
// import { RiUserFill } from 'react-icons/ri';
// import './FilterSec.css';

// // Mock data for demonstration
// const mockSearchResults = [
//   { id: 1, name: 'John Doe', avatar: '/avatars/john.jpg' },
//   { id: 2, name: 'Jane Smith', avatar: '/avatars/jane.jpg' },
//   { id: 3, name: 'Alice Johnson', avatar: '/avatars/alice.jpg' },
// ];

// const mockPendingRequests = [
//   { id: 1, name: 'Bob Wilson', avatar: '/avatars/bob.jpg' },
//   { id: 2, name: 'Carol Brown', avatar: '/avatars/carol.jpg' },
// ];

// export default function ChatNavbar() {
//   const [showSearch, setShowSearch] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [searchResults, setSearchResults] = useState(mockSearchResults);
//   const [pendingRequests, setPendingRequests] = useState(mockPendingRequests);
//   const [showPendingRequests, setShowPendingRequests] = useState(false);
//   const [message, setMessage] = useState('');

//   const searchRef = useRef(null);
//   const pendingRequestsRef = useRef(null);

//   useEffect(() => {
//     function handleClickOutside(event) {
//       if (searchRef.current && !searchRef.current.contains(event.target)) {
//         setShowSearch(false);
//       }
//       if (pendingRequestsRef.current && !pendingRequestsRef.current.contains(event.target)) {
//         setShowPendingRequests(false);
//       }
//     }

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   const handleSearch = (query) => {
//     setSearchQuery(query);
//     setSearchResults(
//       mockSearchResults.filter((user) =>
//         user.name.toLowerCase().includes(query.toLowerCase())
//       )
//     );
//   };

//   const handleAddFriend = (userId) => {
//     console.log(`Friend request sent to user ${userId}`);
//     setMessage('Friend request sent!');
//     setTimeout(() => setMessage(''), 3000);
//   };

//   const handleAcceptRequest = (userId) => {
//     setPendingRequests(pendingRequests.filter((request) => request.id !== userId));
//     setMessage('Friend request accepted!');
//     setTimeout(() => setMessage(''), 3000);
//   };

//   const handleRejectRequest = (userId) => {
//     setPendingRequests(pendingRequests.filter((request) => request.id !== userId));
//     setMessage('Friend request rejected!');
//     setTimeout(() => setMessage(''), 3000);
//   };

//   return (
//     <nav className="navbar">
//       <div className="navbar-container">
//         <div className="app-title">ChatApp</div>
//         <div className="navbar-actions">
//           <div className="search-container" ref={searchRef}>
//             {showSearch ? (
//               <input
//                 type="text"
//                 placeholder="Search friends..."
//                 value={searchQuery}
//                 onChange={(e) => handleSearch(e.target.value)}
//                 className="search-input"
//               />
//             ) : (
//               <button className="icon-button" onClick={() => setShowSearch(true)}>
//                 <FaUserPlus style={{height:"20px", width:"20px"}}/>
//               </button>
//             )}
//             {showSearch && searchQuery && (
//               <div className="search-results">
//                 {searchResults.map((user) => (
//                   <div key={user.id} className="search-result-item">
//                     <div className="user-info">
//                       <div className="avatar">
//                         {user.avatar ? (
//                           <img src={user.avatar} alt={user.name} className="avatar" />
//                         ) : (
//                           <RiUserFill  />
//                         )}
//                       </div>
//                       <span>{user.name}</span>
//                     </div>
//                     <button className="add-button" onClick={() => handleAddFriend(user.id)}>
//                       Add
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//           <div className="pending-requests" ref={pendingRequestsRef}>
//             <button className="icon-button" onClick={() => setShowPendingRequests(!showPendingRequests)}>
//               <FaClock style={{height:"20px", width:"20px"}}/>
//             </button>
//             {showPendingRequests && pendingRequests.length > 0 && (
//               <div className="pending-requests-dropdown">
//                 {pendingRequests.map((request) => (
//                   <div key={request.id} className="pending-request-item">
//                     <div className="user-info">
//                       <div className="avatar">
//                         {request.avatar ? (
//                           <img src={request.avatar} alt={request.name} className="avatar" />
//                         ) : (
//                           <RiUserFill />
//                         )}
//                       </div>
//                       <span>{request.name}</span>
//                     </div>
//                     <div className="action-buttons">
//                       <button className="accept-button" onClick={() => handleAcceptRequest(request.id)}>
//                         <FaCheck />
//                       </button>
//                       <button className="reject-button" onClick={() => handleRejectRequest(request.id)}>
//                         <FaTimes />
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//       {message && <div className="message">{message}</div>}
//     </nav>
//   );
// }




// import { useState, useEffect, useRef } from 'react';
// import { FaSearch, FaUserPlus, FaClock, FaCheck, FaTimes } from 'react-icons/fa';
// import { RiUserFill } from 'react-icons/ri';
// import './FilterSec.css';

// export default function ChatNavbar() {
//   const [showSearch, setShowSearch] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [searchResults, setSearchResults] = useState([]);
//   const [pendingRequests, setPendingRequests] = useState([]);  // Track the pending friend requests
//   const [showPendingRequests, setShowPendingRequests] = useState(false);
//   const [message, setMessage] = useState('');
//   const [sentRequests, setSentRequests] = useState([]); // Track sent requests

//   const searchRef = useRef(null);
//   const pendingRequestsRef = useRef(null);

//   useEffect(() => {
//     // Function to fetch pending friend requests for the logged-in user
//     const fetchPendingRequests = async () => {
//       try {
//         const token = document.cookie.split(';').find(cookie => cookie.trim().startsWith('token='));
//         if (!token) {
//           setMessage('No authentication token found');
//           return;
//         }
    
//         const jwtToken = token.split('=')[1];
//         const response = await fetch('/api/friendship/pending', {
//           method: 'GET',
//           headers: {
//             'Authorization': `Bearer ${jwtToken}`,
//           },
//         });
    
//         const data = await response.json();
    
//         if (response.ok) {
//           setPendingRequests(data); // Set the pending requests if fetched successfully
//         } else {
//           setMessage(data.message || 'Failed to fetch pending requests');
//         }
//       } catch (error) {
//         console.error('Error fetching pending requests:', error);
//         setMessage('Error fetching pending requests');
//       }
//     };
    

//     fetchPendingRequests();

//   }, []);

//   useEffect(() => {
//     function handleClickOutside(event) {
//       if (searchRef.current && !searchRef.current.contains(event.target)) {
//         setShowSearch(false);
//         setSearchQuery(''); // Clear search input when closing the search bar
//         setSearchResults([]); // Clear search results
//       }
//       if (pendingRequestsRef.current && !pendingRequestsRef.current.contains(event.target)) {
//         setShowPendingRequests(false);
//       }
//     }

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   const handleSearch = async (query) => {
//     setSearchQuery(query);

//     if (query.length === 0) {
//       setSearchResults([]);
//       return;
//     }

//     try {
//       const response = await fetch(`/api/chat_user/srchuser?username=${query}`);
//       const data = await response.json();

//       if (response.ok) {
//         setSearchResults(data.user ? [data.user] : []); // If user is found, return them
//       } else {
//         setSearchResults([]); // If no user found
//       }
//     } catch (error) {
//       console.error("Error searching for user:", error);
//       setSearchResults([]);
//     }
//   };

//   const handleAddFriend = async (receiverId) => {
//     try {
//       const token = document.cookie.split(';').find(cookie => cookie.trim().startsWith('token='));
//       if (!token) {
//         setMessage('No authentication token found');
//         return;
//       }

//       const jwtToken = token.split('=')[1];
//       const response = await fetch('/api/friendship', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${jwtToken}`,
//         },
//         body: JSON.stringify({ receiver_id: receiverId }),
//       });

//       const data = await response.json();
//       if (response.ok) {
//         setMessage('Friend request sent!');
//         setSentRequests((prev) => [...prev, receiverId]); // Mark the request as sent
//       } else {
//         setMessage(data.message || 'Failed to send friend request');
//       }
//     } catch (error) {
//       console.error('Error sending friend request:', error);
//       setMessage('Error sending friend request');
//     } finally {
//       setTimeout(() => setMessage(''), 3000);
//     }
//   };

//   const handleAcceptRequest = (userId) => {
//     setPendingRequests(pendingRequests.filter((request) => request._id !== userId));
//     setMessage('Friend request accepted!');
//     setTimeout(() => setMessage(''), 3000);
//   };

//   const handleRejectRequest = (userId) => {
//     setPendingRequests(pendingRequests.filter((request) => request._id !== userId));
//     setMessage('Friend request rejected!');
//     setTimeout(() => setMessage(''), 3000);
//   };

//   return (
//     <nav className="navbar">
//       <div className="navbar-container">
//         <div className="app-title">ChatApp</div>
//         <div className="navbar-actions">
//           <div className="search-container" ref={searchRef}>
//             {showSearch ? (
//               <input
//                 type="text"
//                 placeholder="Search friends..."
//                 value={searchQuery}
//                 onChange={(e) => handleSearch(e.target.value)}
//                 className="search-input"
//               />
//             ) : (
//               <button className="icon-button" onClick={() => setShowSearch(true)}>
//                 <FaUserPlus style={{ height: '20px', width: '20px' }} />
//               </button>
//             )}
//             {showSearch && searchQuery && (
//               <div className="search-results">
//                 {searchResults.length > 0 ? (
//                   searchResults.map((user) => (
//                     <div key={user._id} className="search-result-item">
//                       <div className="user-info">
//                         <div className="avatar">
//                           {user.picture ? (
//                             <img src={user.picture} alt={user.name} className="avatar" />
//                           ) : (
//                             <RiUserFill />
                          
//                           )}
//                         </div>
//                         <span>{user.user_name}</span>
//                       </div>
//                       <button
//                         className="add-button"
//                         onClick={() => handleAddFriend(user.user_id)}
//                         disabled={sentRequests.includes(user.user_id)} // Disable button if request already sent
//                       >
//                         {sentRequests.includes(user.user_id) ? 'Request Sent' : 'Add'}
//                       </button>
//                     </div>
//                   ))
//                 ) : (
//                   <div>No results found</div>
//                 )}
//               </div>
//             )}
//           </div>
//           <div className="pending-requests" ref={pendingRequestsRef}>
//             <button className="icon-button" onClick={() => setShowPendingRequests(!showPendingRequests)}>
//               <FaClock style={{ height: '20px', width: '20px' }} />
//             </button>
//             {showPendingRequests && pendingRequests.length > 0 && (
//               <div className="pending-requests-dropdown">
//                 {pendingRequests.map((request) => (
//                   <div key={request._id} className="pending-request-item">
//                     <div className="user-info">
//                       <div className="avatar">
//                         {request.receiver_id.avatar ? (
//                           <img src={request.receiver_id.avatar} alt={request.receiver_id.name} className="avatar" />
//                         ) : (
//                           <RiUserFill />
                       
//                         )}
//                       </div>
//                       <span>{request.receiver_id.username}</span>
//                     </div>
//                     <div className="action-buttons">
//                       <button className="accept-button" onClick={() => handleAcceptRequest(request._id)}>
//                         <FaCheck />
//                       </button>
//                       <button className="reject-button" onClick={() => handleRejectRequest(request._id)}>
//                         <FaTimes />
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//       {message && <div className="message">{message}</div>}
//     </nav>
//   );
// }


// meaooooooooooooooooooo
// import { useState, useEffect, useRef } from 'react';
// import { FaSearch, FaUserPlus, FaClock, FaCheck, FaTimes } from 'react-icons/fa';
// import { RiUserFill } from 'react-icons/ri';
// import ThemeToggle from '../../Light/DarkToggle/ThemeToggle'; // Import the ThemeToggle component
// import './FilterSec.css';

// export default function ChatNavbar() {
//   const [showSearch, setShowSearch] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [searchResults, setSearchResults] = useState([]);
//   const [pendingRequests, setPendingRequests] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [showPendingRequests, setShowPendingRequests] = useState(false);
//   const [message, setMessage] = useState('');
//   const [sentRequests, setSentRequests] = useState([]);

//   const searchRef = useRef(null);
//   const pendingRequestsRef = useRef(null);

//   // Fetch all users
//   useEffect(() => {
//     const fetchAllUsers = async () => {
//       try {
//         const response = await fetch('/api/chat_user/getallusers');
//         const data = await response.json();
//         if (response.ok) {
//           setUsers(data.users);
//         } else {
//           console.error('Error fetching users:', data.message);
//         }
//       } catch (error) {
//         console.error('Error fetching all users:', error);
//       }
//     };
//     fetchAllUsers();
//   }, []);

//   // Fetch pending requests
//   useEffect(() => {
//     const fetchPendingRequests = async () => {
//       try {
//         const token = document.cookie.split(';').find((cookie) => cookie.trim().startsWith('token='));
//         if (!token) {
//           console.error('No authentication token found');
//           return;
//         }

//         const jwtToken = token.split('=')[1];
//         const response = await fetch('/api/friendship/pending', {
//           method: 'GET',
//           headers: {
//             Authorization: `Bearer ${jwtToken}`,
//           },
//         });

//         if (response.status === 204) {
//           // Handle no content response
//           setPendingRequests([]);
//           return;
//         }

//         if (!response.ok) {
//           const data = await response.json();
//           console.error('Error fetching pending requests:', data.message);
//           return;
//         }

//         const data = await response.json();
//         const enrichedRequests = data.map((request) => {
//           const sender = users.find((user) => user.user_id === request.requester_id);
//           return {
//             ...request,
//             sender,
//           };
//         });
//         setPendingRequests(enrichedRequests);
//       } catch (error) {
//         console.error('Error fetching pending requests:', error);
//       }
//     };

//     if (users.length > 0) {
//       fetchPendingRequests();
//     }
//   }, [users]);

//   // Handle outside clicks for search and pending requests dropdowns
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (searchRef.current && !searchRef.current.contains(event.target)) {
//         setShowSearch(false);
//         setSearchQuery('');
//         setSearchResults([]);
//       }
//       if (pendingRequestsRef.current && !pendingRequestsRef.current.contains(event.target)) {
//         setShowPendingRequests(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   // Handle user search
//   const handleSearch = async (query) => {
//     setSearchQuery(query);

//     if (query.length === 0) {
//       setSearchResults([]);
//       return;
//     }

//     try {
//       const response = await fetch(`/api/chat_user/srchuser?username=${query}`);
//       const data = await response.json();

//       if (response.ok) {
//         setSearchResults(data.user ? [data.user] : []);
//       } else {
//         setSearchResults([]);
//       }
//     } catch (error) {
//       console.error('Error searching for user:', error);
//       setSearchResults([]);
//     }
//   };

//   // Handle sending a friend request
//   const handleAddFriend = async (receiverId) => {
//     try {
//       const token = document.cookie.split(';').find((cookie) => cookie.trim().startsWith('token='));
//       if (!token) {
//         setMessage('No authentication token found');
//         return;
//       }

//       const jwtToken = token.split('=')[1];
//       const response = await fetch('/api/friendship', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${jwtToken}`,
//         },
//         body: JSON.stringify({ receiver_id: receiverId }),
//       });

//       const data = await response.json();
//       if (response.ok) {
//         setMessage('Friend request sent!');
//         setSentRequests((prev) => [...prev, receiverId]);
//       } else {
//         setMessage(data.message || 'Failed to send friend request');
//       }
//     } catch (error) {
//       console.error('Error sending friend request:', error);
//       setMessage('Error sending friend request');
//     } finally {
//       setTimeout(() => setMessage(''), 3000);
//     }
//   };

//   // Handle accepting a friend request
//   const handleAcceptRequest = async (requestId) => {
//     try {
//       const response = await fetch(`/api/friendship?id=${requestId}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ status: 'accepted' }),
//       });
      
//       const data = await response.json();
//       if (response.ok) {
//         setPendingRequests(pendingRequests.filter((request) => request._id !== requestId));
//         setMessage('Friend request accepted!');
//       } else {
//         setMessage(data.message || 'Failed to accept friend request');
//       }
//     } catch (error) {
//       console.error('Error accepting friend request:', error);
//       setMessage('Error accepting friend request');
//     } finally {
//       setTimeout(() => setMessage(''), 3000);
//     }
//   };
  
//   // Handle rejecting a friend request
//   const handleRejectRequest = async (requestId) => {
//     try {
//       const response = await fetch(`/api/friendship?id=${requestId}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ status: 'rejected' }),
//       });
      
//       const data = await response.json();
//       if (response.ok) {
//         setPendingRequests(pendingRequests.filter((request) => request._id !== requestId));
//         setMessage('Friend request rejected!');
//       } else {
//         setMessage(data.message || 'Failed to reject friend request');
//       }
//     } catch (error) {
//       console.error('Error rejecting friend request:', error);
//       setMessage('Error rejecting friend request');
//     } finally {
//       setTimeout(() => setMessage(''), 3000);
//     }
//   };
  
//   return (
//     <nav className="navbar">
//       <div className="navbar-container">
//         <div className="app-title">ChatApp</div>
//         <div className="navbar-actions">
//       <div className='themetoggle'>
//       <ThemeToggle />
//       </div>
//           <div className="search-container" ref={searchRef}>
//             {showSearch ? (
//               <input
//               type="text"
//               placeholder="Search friends..."
//                 value={searchQuery}
//                 onChange={(e) => handleSearch(e.target.value)}
//                 className="search-input"
//               />
//             ) : (
//               <button className="icon-button" onClick={() => setShowSearch(true)}>
//                 <FaUserPlus style={{ height: '20px', width: '20px' }} />
//               </button>
//             )}
//             {showSearch && searchQuery && (
//               <div className="search-results">
//                 {searchResults.length > 0 ? (
//                   searchResults.map((user) => (
//                     <div key={user._id} className="search-result-item">
//                       <div className="user-info">
//                         <div className="avatar">
//                           {user.picture ? (
//                             <img src={user.picture} alt={user.name} className="avatar" />
//                           ) : (
//                             <RiUserFill className="avatar" />
//                           )}
//                         </div>
//                         <span>{user.user_name}</span>
//                       </div>
//                       <button
//                         className="add-button"
//                         onClick={() => handleAddFriend(user.user_id)}
//                         disabled={sentRequests.includes(user.user_id)}
//                       >
//                         {sentRequests.includes(user.user_id) ? 'Request Sent' : 'Add'}
//                       </button>
//                     </div>
//                   ))
//                 ) : (
//                   <div>No results found</div>
//                 )}
//               </div>
//             )}
//           </div>
//           <div className="pending-requests" ref={pendingRequestsRef}>
//             <button className="icon-button" onClick={() => setShowPendingRequests(!showPendingRequests)}>
//               <FaClock style={{ height: '20px', width: '20px' }} />
//               {pendingRequests.length > 0 && (
//                 <span className="pending-count">{pendingRequests.length}</span>
//               )}
//             </button>
//             {showPendingRequests && (
//               <div className="pending-requests-dropdown">
//                 {pendingRequests.length > 0 ? (
//                   pendingRequests.map((request) => (
//                     <div key={request._id} className="pending-request-item">
//                       <div className="user-info">
//                         <div className="avatar">
//                           {request.sender?.picture ? (
//                             <img src={request.sender.picture} alt={request.sender.user_name} className="avatar" />
//                           ) : (
//                             <RiUserFill className="avatar" />
//                           )}
//                         </div>
//                         <span>{request.sender?.user_name || 'Unknown User'}</span>
//                       </div>
//                       <div className="action-buttons">
//                         <button className="accept-button" onClick={() => handleAcceptRequest(request._id)}>
//                           <FaCheck />
//                         </button>
//                         <button className="reject-button" onClick={() => handleRejectRequest(request._id)}>
//                           <FaTimes />
//                         </button>
//                       </div>
//                     </div>
//                   ))
//                 ) : (
//                   <div>No pending requests</div>
//                 )}
//               </div>
//             )}
//           </div>
          
//           {/* Add the theme toggle button here */}
//         </div>
//       </div>
//       {message && <div className="message">{message}</div>}
//     </nav>
//   );
// }

import { useState, useEffect } from 'react';
import ThemeToggle from '../../Light/DarkToggle/ThemeToggle';
import PendingRequests from './pendingrequests/pendingreq';
import SearchBar from './searchBar/searchbar';// Import the SearchBar component
import './FilterSec.css';

export default function ChatNavbar() {
  const [message, setMessage] = useState('');
  const [sentRequests, setSentRequests] = useState([]);

  useEffect(() => {
    // Fetch logic for sentRequests or any other data you'd like to use.
  }, []);

  const handleAddFriend = async (receiverId) => {
    try {
      const token = document.cookie.split(';').find((cookie) => cookie.trim().startsWith('token='));
      if (!token) {
        setMessage('No authentication token found');
        return;
      }

      const jwtToken = token.split('=')[1];
      const response = await fetch('/api/friendship', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify({ receiver_id: receiverId }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('Friend request sent!');
        setSentRequests((prev) => [...prev, receiverId]);
      } else {
        setMessage(data.message || 'Failed to send friend request');
      }
    } catch (error) {
      console.error('Error sending friend request:', error);
      setMessage('Error sending friend request');
    } finally {
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="app-title">ChatApp</div>
        <div className="navbar-actions">
          <div className="themetoggle">
            <ThemeToggle />
          </div>
          {/* Use the SearchBar component */}
          <SearchBar onAddFriend={handleAddFriend} sentRequests={sentRequests} />
          <PendingRequests />
        </div>
      </div>
      {message && <div className="message">{message}</div>}
    </nav>
  );
}





