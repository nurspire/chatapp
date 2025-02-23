// // SearchBar.js
// import { useState, useEffect, useRef } from 'react';
// import { FaUserPlus } from 'react-icons/fa';
// import { RiUserFill } from 'react-icons/ri';
// import './SearchBar.css';


// export default function SearchBar() {
//   const [showSearch, setShowSearch] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [searchResults, setSearchResults] = useState([]);
//   const [sentRequests, setSentRequests] = useState([]);
//   const searchRef = useRef(null);

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

//   // Handle outside clicks for search
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (searchRef.current && !searchRef.current.contains(event.target)) {
//         setShowSearch(false);
//         setSearchQuery('');
//         setSearchResults([]);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   // Handle sending a friend request
//   const handleAddFriend = async (receiverId) => {
//     try {
//       const token = document.cookie.split(';').find((cookie) => cookie.trim().startsWith('token='));
//       if (!token) return;

//       const jwtToken = token.split('=')[1];
//       const response = await fetch('/api/friendship', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${jwtToken}`,
//         },
//         body: JSON.stringify({ receiver_id: receiverId }),
//       });

//       if (response.ok) {
//         setSentRequests((prev) => [...prev, receiverId]);
//       }
//     } catch (error) {
//       console.error('Error sending friend request:', error);
//     }
//   };

//   return (
//     <div className="search-container" ref={searchRef}>
//       {showSearch ? (
//         <input
//           type="text"
//           placeholder="Search friends..."
//           value={searchQuery}
//           onChange={(e) => handleSearch(e.target.value)}
//           className="search-input"
//         />
//       ) : (
//         <button className="icon-button" onClick={() => setShowSearch(true)}>
//           <FaUserPlus style={{ height: '20px', width: '20px' }} />
//         </button>
//       )}
//       {showSearch && searchQuery && (
//         <div className="search-results">
//           {searchResults.length > 0 ? (
//             searchResults.map((user) => (
//               <div key={user._id} className="search-result-item">
//                 <div className="user-info">
//                   <div className="avatar">
//                     {user.picture ? (
//                       <img src={user.picture} alt={user.name} className="avatar" />
//                     ) : (
//                       <RiUserFill className="avatar" />
//                     )}
//                   </div>
//                   <span>{user.user_name}</span>
//                 </div>
//                 <button
//                   className="add-button"
//                   onClick={() => handleAddFriend(user.user_id)}
//                   disabled={sentRequests.includes(user.user_id)}
//                 >
//                   {sentRequests.includes(user.user_id) ? 'Request Sent' : 'Add'}
//                 </button>
//               </div>
//             ))
//           ) : (
//             <div>No results found</div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }
import { useState, useEffect, useRef } from "react";
import { FaUserPlus } from "react-icons/fa";
import { RiUserFill, RiCloseLine } from "react-icons/ri";
import "./SearchBar.css";

export default function SearchBar() {
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const searchRef = useRef(null);

  // Handle user search
  const handleSearch = async (query) => {
    setSearchQuery(query);

    if (query.trim().length === 0) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await fetch(`/api/chat_user/srchuser?username=${query}`);
      const data = await response.json();

      if (response.ok) {
        setSearchResults(data.user ? [data.user] : []);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Error searching for user:", error);
      setSearchResults([]);
    }
  };

  // Close search bar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        handleCloseSearch();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle sending a friend request
  const handleAddFriend = async (receiverId) => {
    try {
      const token = document.cookie
        .split(";")
        .find((cookie) => cookie.trim().startsWith("token="));
      if (!token) return;

      const jwtToken = token.split("=")[1];
      const response = await fetch("/api/friendship", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify({ receiver_id: receiverId }),
      });

      if (response.ok) {
        setSentRequests((prev) => [...prev, receiverId]);
      }
    } catch (error) {
      console.error("Error sending friend request:", error);
    }
  };

  const handleCloseSearch = () => {
    setShowSearch(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  return (
    <div className="new-search-container" ref={searchRef}>
      <button
        className={`new-icon-button ${showSearch ? "new-active" : ""}`}
        onClick={() => setShowSearch((prev) => !prev)}
      >
        <FaUserPlus className="new-icon" />
      </button>

      {showSearch && (
        <>
          <div
            className="new-search-overlay"
            onClick={handleCloseSearch} // Close search bar on overlay click
          />
          <div className="new-search-bar">
            <button className="new-close-button" onClick={handleCloseSearch}>
              <RiCloseLine />
            </button>
            <input
              type="text"
              placeholder="Search friends..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="new-search-input"
            />

            {searchQuery && (
              <div className="new-search-results">
                {searchResults.length > 0 ? (
                  searchResults.map((user) => (
                    <div key={user._id} className="new-search-result-item">
                      <div className="new-user-info">
                        <div className="new-avatar">
                          {user.picture ? (
                            <img
                              src={user.picture || "/placeholder.svg"}
                              alt={user.name}
                              className="new-avatar-img"
                            />
                          ) : (
                            <RiUserFill className="new-avatar-icon" />
                          )}
                        </div>
                        <span>{user.user_name}</span>
                      </div>
                      <button
                        className="new-add-button"
                        onClick={() => handleAddFriend(user.user_id)}
                        disabled={sentRequests.includes(user.user_id)}
                      >
                        {sentRequests.includes(user.user_id)
                          ? "Request Sent"
                          : "Add"}
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="new-no-results">No results found</div>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
