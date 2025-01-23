
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  FaUserCircle,
  FaEllipsisV,
  FaUser,
  FaTrash,
  FaThumbtack,
  FaThumbtack as FaUnpin,
  FaSyncAlt, // Import refresh icon
} from "react-icons/fa";
import { RingLoader } from "react-spinners"; // Import RingLoader for more attractive spinner
import "./FriendsList.css";

export default function FriendsList() {
  const [friends, setFriends] = useState([]);
  const [pinnedFriends, setPinnedFriends] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeMenus, setActiveMenus] = useState([]);
  const menuRefs = useRef({});
  const router = useRouter();

  // Function to fetch friends data
  const fetchFriends = async () => {
    setIsLoading(true); // Show loading spinner during refresh
    try {
      const [senderResponse, receiverResponse] = await Promise.all([
        fetch("/api/friendship/senderReq"),
        fetch("/api/friendship/reciverReq"),
      ]);

      const senderData = await senderResponse.json();
      const receiverData = await receiverResponse.json();

      const senderFriends = Array.isArray(senderData) ? senderData : [];
      const receiverFriends = Array.isArray(receiverData) ? receiverData : [];

      const allFriends = [...senderFriends, ...receiverFriends];
      const uniqueFriends = Array.from(new Set(allFriends.map((f) => f.id))).map((id) =>
        allFriends.find((f) => f.id === id)
      );

      // Load pinned friends from localStorage
      const storedPinnedFriends = JSON.parse(localStorage.getItem("pinnedFriends")) || [];
      const pinnedIds = new Set(storedPinnedFriends.map((f) => f.id));

      const remainingFriends = uniqueFriends.filter((f) => !pinnedIds.has(f.id));

      setPinnedFriends(storedPinnedFriends);
      setFriends(remainingFriends);
    } catch (err) {
      console.error("Error fetching friends:", err);
      setError("Failed to load friends. Please try again later.");
    } finally {
      setIsLoading(false); // Hide loading spinner
    }
  };

  // Initial fetch of friends
  useEffect(() => {
    fetchFriends();
  }, []);

  const handleOutsideClick = (event) => {
    const openMenuIds = Object.keys(menuRefs.current).filter((id) => {
      const ref = menuRefs.current[id];
      return ref && !ref.contains(event.target);
    });

    if (openMenuIds.length > 0) {
      setActiveMenus((prev) =>
        prev.filter((menuId) => !openMenuIds.includes(menuId))
      );
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  const toggleMenu = (id) => {
    setActiveMenus((prev) =>
      prev.includes(id) ? prev.filter((menuId) => menuId !== id) : [...prev, id]
    );
  };

  const handleUserClick = (userId) => {
    router.push(`/app/${userId}`);
  };

  const handlePin = (friend) => {
    const updatedPinnedFriends = [...pinnedFriends, friend];
    setPinnedFriends(updatedPinnedFriends);
    setFriends((prev) => prev.filter((f) => f.id !== friend.id));
    localStorage.setItem("pinnedFriends", JSON.stringify(updatedPinnedFriends));
  };

  const handleUnpin = (friend) => {
    const updatedPinnedFriends = pinnedFriends.filter((f) => f.id !== friend.id);
    setPinnedFriends(updatedPinnedFriends);
    setFriends((prev) => [...prev, friend]);
    localStorage.setItem("pinnedFriends", JSON.stringify(updatedPinnedFriends));
  };

  const handleRemoveFriend = async (friendId) => {
    try {
      const response = await fetch(`/api/friendship/removefriend?id=${friendId}`, {
        method: "DELETE", // Ensure DELETE method is used
      });

      if (response.ok) {
        // Update the state to remove the friend
        setFriends((prev) => prev.filter((f) => f.id !== friendId));
        setPinnedFriends((prev) => prev.filter((f) => f.id !== friendId));

        console.log("Friend removed successfully.");

        // Redirect to the base URL after removing the friend
        router.push("/app");
      } else {
        const errorData = await response.json();
        console.error("Error removing friend:", errorData.message);
      }
    } catch (err) {
      console.error("Error removing friend:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="user-sidebar loading-spinner">
        {/* Centered and more beautiful RingLoader spinner */}
        <RingLoader color="#3498db" size={70} margin={10} loading={true} />
      </div>
    );
  }

  if (error) {
    return <div className="user-sidebar">{error}</div>;
  }

  return (
    <div className="user-sidebar">
      {/* Refresh Icon */}
      <div className="refresh-section" onClick={fetchFriends}>
        <p>All Friends</p>
        <FaSyncAlt size={24} className="refresh-icon" title="Refresh list" />
      </div>
      <div className="user-list">
        {[...pinnedFriends, ...friends].map((friend) => (
          <div
            key={friend.id}
            className={`user-item ${pinnedFriends.includes(friend) ? "pinned" : ""}`}
            onClick={() => handleUserClick(friend.id)}
          >
            {friend.picture ? (
              <img src={friend.picture} alt={friend.user_name} className="user-icon" />
            ) : (
              <FaUserCircle size={24} className="user-icon" />
            )}
            <span>
              {friend.user_name.replace(/^@/, "")}
              {pinnedFriends.includes(friend) && (
                <FaThumbtack size={14} style={{ marginLeft: 8 }} />
              )}
            </span>
            <div
              className="menu-wrapper"
              ref={(el) => (menuRefs.current[friend.id] = el)}
              onClick={(e) => e.stopPropagation()}
            >
              <FaEllipsisV
                className="menu-icon"
                onClick={() => toggleMenu(friend.id)}
              />
              {activeMenus.includes(friend.id) && (
                <div className="menu-dropdown">
                  <div className="menu-item">
                    <FaUser className="menu-icon-left" />
                    See Profile
                  </div>
                  {pinnedFriends.includes(friend) ? (
                    <div
                      className="menu-item"
                      onClick={() => handleUnpin(friend)}
                    >
                      <FaUnpin className="menu-icon-left" />
                      Unpin
                    </div>
                  ) : (
                    <div
                      className="menu-item"
                      onClick={() => handlePin(friend)}
                    >
                      <FaThumbtack className="menu-icon-left" />
                      Pin to Top
                    </div>
                  )}
                  <div
                    className="menu-item"
                    onClick={() => handleRemoveFriend(friend.id)}
                  >
                    <FaTrash className="menu-icon-left" />
                    Remove Friend
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
