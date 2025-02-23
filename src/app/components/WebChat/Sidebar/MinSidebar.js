// 'use client';
// import Image from "next/image";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { FaBars, FaPhoneAlt, FaCommentDots, FaUserCircle, FaTimes } from "react-icons/fa";
// import { MdGroups } from "react-icons/md";
// import { useState } from "react";
// import "./minsidebar.css";

// export default function Sidebar() {
//     const router = useRouter();
//     const [isSidebarOpen, setIsSidebarOpen] = useState(false);

//     // Toggle sidebar open/close
//     const toggleSidebar = () => {
//         setIsSidebarOpen(!isSidebarOpen);
//     };

//     // Navigate to different pages without reload
//     const handleNavigation = (path) => {
//         router.push(path);
//         if (isSidebarOpen) setIsSidebarOpen(false); // Close sidebar after navigation
//     };

//     return (
//         <>
//             <div className={`chatsidebar ${isSidebarOpen ? "expanded" : ""}`}>
//                 <div className="chatsidebar-logo" onClick={() => router.push("/")}>
//                     {/* Click on logo to navigate to homepage without reloading */}
//                     <Link href={"/"}>
//                         <Image
//                             src={"/logo.png"}
//                             width={50}
//                             height={50}
//                             alt="Logo"
//                         />
//                     </Link>
//                 </div>

//                 <div className="chatsidebar-menu-items">
//                     {/* Use the handleNavigation function to handle the page navigation */}
//                     <div className="chatsidebar-menu-item" onClick={() => handleNavigation("/chats")}>
//                         <FaCommentDots size={24} />
//                         {isSidebarOpen && <span>Messages</span>}
//                     </div>
//                     <div className="chatsidebar-menu-item" onClick={() => handleNavigation("/chats/calls")}>
//                         <FaPhoneAlt size={24} />
//                         {isSidebarOpen && <span>Calls</span>}
//                     </div>
//                     <div className="chatsidebar-menu-item" onClick={() => handleNavigation("/chats/status")}>
//                         <MdGroups size={24} />
//                         {isSidebarOpen && <span>Groups</span>}
//                     </div>
//                 </div>

//                 {/* Profile Icon at the Bottom */}
//                 <div className="chatsidebar-profile" onClick={() => handleNavigation("/chats/profile")}>
//                     <FaUserCircle size={30} />
//                     {isSidebarOpen && <span>Profile</span>}
//                 </div>

//                 {/* Close Button for Sidebar */}
//                 {isSidebarOpen && (
//                     <div className="chatsidebar-close-button" onClick={toggleSidebar}>
//                         <FaTimes size={30} />
//                     </div>
//                 )}
//             </div>

//             {/* Menu Icon for Responsive Sidebar */}
//             {!isSidebarOpen && (
//                 <div className="chatsidebar-menu-icon" onClick={toggleSidebar}>
//                     <FaBars size={30} />
//                 </div>
//             )}
//         </>
//     );
// }

// 'use client';
// import Image from "next/image";
// import Link from "next/link";
// import { FaUserCircle } from "react-icons/fa";
// import { useRouter } from "next/navigation";
// import { FaBars, FaPhoneAlt, FaCommentDots, FaTimes } from "react-icons/fa";
// import { MdGroups } from "react-icons/md";
// import { useState, useEffect } from "react";
// import "./minsidebar.css";

// export default function Sidebar() {
//     const router = useRouter();
//     const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//     const [profileImage, setProfileImage] = useState(null);

//     // Toggle sidebar open/close
//     const toggleSidebar = () => {
//         setIsSidebarOpen(!isSidebarOpen);
//     };

//     // Navigate to different pages without reload
//     const handleNavigation = (path) => {
//         router.push(path);
//         if (isSidebarOpen) setIsSidebarOpen(false); // Close sidebar after navigation
//     };

//     // Fetch user data from API
//     useEffect(() => {
//         console.log("Fetching user profile...");
//         const fetchUserProfile = async () => {
//             try {
//                 const response = await fetch("/api/chat_user");
//                 if (!response.ok) {
//                     throw new Error("Failed to fetch user data");
//                 }
//                 const data = await response.json();
//                 console.log("User Data:", data);
//                 setProfileImage(data.user?.picture);
//             } catch (error) {
//                 console.error("Error fetching user profile:", error);
//             }
//         };
//         fetchUserProfile();
//     }, []);
    
//     return (
//         <>
//             <div className={`chatsidebar ${isSidebarOpen ? "expanded" : ""}`}>
//                 <div className="chatsidebar-logo" onClick={() => router.push("/")}>
//                     {/* Click on logo to navigate to homepage without reloading */}
//                     <Link href={"/"}>
//                         <Image
//                             src={"/logo.png"}
//                             width={50}
//                             height={50}
//                             alt="Logo"
//                         />
//                     </Link>
//                 </div>

//                 <div className="chatsidebar-menu-items">
//                     {/* Use the handleNavigation function to handle the page navigation */}
//                     <div className="chatsidebar-menu-item" onClick={() => handleNavigation("/app")}>
//                         <FaCommentDots size={24} />
//                         {isSidebarOpen && <span>Messages</span>}
//                     </div>
//                     <div className="chatsidebar-menu-item" onClick={() => handleNavigation("/app/calls")}>
//                         <FaPhoneAlt size={24} />
//                         {isSidebarOpen && <span>Calls</span>}
//                     </div>
//                     <div className="chatsidebar-menu-item" onClick={() => handleNavigation("/app/status")}>
//                         <MdGroups size={24} />
//                         {isSidebarOpen && <span>Groups</span>}
//                     </div>
//                 </div>

//                 {/* Profile Icon at the Bottom */}
//                 <div className="chatsidebar-profile" onClick={() => handleNavigation("/app/profile")}>
//                     {profileImage ? (
//                         <Image
//                             src={profileImage}
//                             width={30}
//                             height={30}
//                             alt="Profile"
//                             className="profile-image"
//                         />
//                     ) : (
//                         <FaUserCircle size={30} />
//                     )}
//                     {isSidebarOpen && <span>Profile</span>}
//                 </div>

//                 {/* Close Button for Sidebar */}
//                 {isSidebarOpen && (
//                     <div className="chatsidebar-close-button" onClick={toggleSidebar}>
//                         <FaTimes size={30} />
//                     </div>
//                 )}
//             </div>

//             {/* Menu Icon for Responsive Sidebar */}
//             {!isSidebarOpen && (
//                 <div className="chatsidebar-menu-icon" onClick={toggleSidebar}>
//                     <FaBars size={30} />
//                 </div>
//             )}
//         </>
//     );
// }

'use client';

import Image from "next/image";
import Link from "next/link";
import { FaUserCircle, FaBars, FaPhoneAlt, FaCommentDots, FaTimes } from "react-icons/fa";
import { MdGroups } from "react-icons/md";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import UserProfile from "../profile/page"; // Import UserProfile component
import "./minsidebar.css";

export default function Sidebar() {
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const [isUserProfileOpen, setIsUserProfileOpen] = useState(false);

    // Toggle sidebar open/close
    const toggleSidebar = () => {
        setIsSidebarOpen((prev) => !prev);

        // Add or remove "no-scroll" class to body
        if (!isSidebarOpen) {
            document.body.classList.add("no-scroll");
        } else {
            document.body.classList.remove("no-scroll");
        }
    };

    // Navigate to different pages without reload
    const handleNavigation = (path) => {
        router.push(path);
        if (isSidebarOpen) toggleSidebar(); // Close sidebar after navigation
    };

    // Fetch user data from API
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await fetch("/api/chat_user");
                if (!response.ok) throw new Error("Failed to fetch user data");
                const data = await response.json();
                setProfileImage(data.user?.picture);
            } catch (error) {
                console.error("Error fetching user profile:", error);
            }
        };
        fetchUserProfile();
    }, []);

    // Handle profile click to open UserProfile modal
    const handleProfileClick = () => {
        setIsUserProfileOpen(true);
        if (isSidebarOpen) toggleSidebar();
    };

    return (
        <>
            {/* Sidebar */}
            <div>
                {/* Backdrop */}
                {isSidebarOpen && (
                    <div
                        className={`chatsidebar-backdrop ${isSidebarOpen ? "active" : ""}`}
                        onClick={toggleSidebar} // Close sidebar when backdrop is clicked
                    ></div>
                )}

                <div className={`chatsidebar ${isSidebarOpen ? "expanded" : ""}`}>
                    <div className="chatsidebar-logo" onClick={() => router.push("/")}>
                        <Link href={"/"}>
                            <Image src={"/logo.png"} width={50} height={50} alt="Logo" />
                        </Link>
                    </div>

                    <div className="chatsidebar-menu-items">
                        <div className="chatsidebar-menu-item" onClick={() => handleNavigation("/app")}>
                            <FaCommentDots size={24} />
                            {isSidebarOpen && <span>Messages</span>}
                        </div>
                        <div className="chatsidebar-menu-item" onClick={() => handleNavigation("/app/calls")}>
                            <FaPhoneAlt size={24} />
                            {isSidebarOpen && <span>Calls</span>}
                        </div>
                        <div className="chatsidebar-menu-item" onClick={() => handleNavigation("/app/status")}>
                            <MdGroups size={24} />
                            {isSidebarOpen && <span>Groups</span>}
                        </div>
                    </div>

                    {/* Profile Icon at the Bottom */}
                    <div className="chatsidebar-profile" onClick={handleProfileClick}>
                        {profileImage ? (
                            <Image src={profileImage} width={30} height={30} alt="Profile" />
                        ) : (
                            <FaUserCircle size={30} />
                        )}
                        {isSidebarOpen && <span>Profile</span>}
                    </div>

                    {/* Close Button */}
                    {isSidebarOpen && (
                        <div className="chatsidebar-close-button" onClick={toggleSidebar}>
                            <FaTimes size={30} />
                        </div>
                    )}
                </div>
            </div>

            {/* Menu Icon for Responsive Sidebar */}
            {!isSidebarOpen && (
                <div className="chatsidebar-menu-icon" onClick={toggleSidebar}>
                    <FaBars size={30} />
                </div>
            )}

            {/* Conditionally render UserProfile component */}
            {isUserProfileOpen && (
                <div className="user-profile-modal">
                    <UserProfile closeProfile={() => setIsUserProfileOpen(false)} />
                </div>
            )}
        </>
    );
}


