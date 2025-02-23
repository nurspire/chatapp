// 'use client';

// import { useState } from 'react';
// import { FiEdit2, FiTrash2, FiX } from 'react-icons/fi';
// import './user-profile.css';

// export default function UserProfile() {
//   const [isEditing, setIsEditing] = useState(false);
//   const [userData, setUserData] = useState({
//     id: 'USER123',
//     username: 'JohnDoe',
//     email: 'john.doe@example.com',
//     avatarUrl: '/placeholder.svg?height=100&width=100',
//   });

//   const handleEdit = () => {
//     setIsEditing(true);
//   };

//   const handleSave = () => {
//     setIsEditing(false);
//     // Typically save the changes to backend here
//   };

//   const handleDelete = () => {
//     // Typically call an API to delete the user's profile
//     alert('Profile deletion functionality would be implemented here.');
//   };

//   const handleChange = (e) => {
//     setUserData({ ...userData, [e.target.name]: e.target.value });
//   };

//   return (
//     <div className="profile-container">
//       <div className="profile-card">
//         <button className="close-button">
//           <FiX className="h-6 w-6" />
//         </button>
//         <div className="profile-header">
//           <h2 className="profile-title">User Profile</h2>
//         </div>
//         <div className="profile-content">
//           <div className="avatar-container">
//             <div className="avatar">
//               <img src={userData.avatarUrl} alt={userData.username} />
//             </div>
//           </div>
//           <div className="form-group">
//             <label htmlFor="userId" className="form-label">User ID</label>
//             <input 
//               id="userId" 
//               value={userData.id} 
//               readOnly 
//               className="form-input"
//             />
//           </div>
//           <div className="form-group">
//             <label htmlFor="username" className="form-label">Username</label>
//             <input 
//               id="username" 
//               name="username"
//               value={userData.username} 
//               readOnly={!isEditing}
//               onChange={handleChange}
//               className="form-input"
//             />
//           </div>
//           <div className="form-group">
//             <label htmlFor="email" className="form-label">Email</label>
//             <input 
//               id="email" 
//               name="email"
//               value={userData.email} 
//               readOnly={!isEditing}
//               onChange={handleChange}
//               className="form-input"
//             />
//           </div>
//         </div>
//         <div className="profile-footer">
//           {isEditing ? (
//             <button 
//               onClick={handleSave} 
//               className="button button-primary"
//             >
//               Save Changes
//             </button>
//           ) : (
//             <button 
//               onClick={handleEdit} 
//               className="button button-primary"
//             >
//               <FiEdit2 className="button-icon" /> Edit Profile
//             </button>
//           )}
//           <button 
//             onClick={handleDelete} 
//             className="button button-danger"
//           >
//             <FiTrash2 className="button-icon" /> Delete Profile
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// 'use client'

// import { useEffect, useState } from 'react';
// import { FiEdit2, FiTrash2, FiX, FiCamera } from 'react-icons/fi';
// import { CldUploadWidget } from 'next-cloudinary';
// import './user-profile.css';
// import Link from 'next/link';

// export default function UserProfile() {
//     const [isEditing, setIsEditing] = useState(false);
//     const [userData, setUserData] = useState(null);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const fetchUserData = async () => {
//             try {
//                 const chatUserResponse = await fetch('/api/chat_user');
//                 const getUsersResponse = await fetch('/api/getusers');

//                 if (!chatUserResponse.ok || !getUsersResponse.ok) {
//                     throw new Error('Failed to fetch user data');
//                 }

//                 const chatUserData = await chatUserResponse.json();
//                 const getUsersData = await getUsersResponse.json();

//                 const matchedUser = chatUserData.users.find(chatUser =>
//                     getUsersData.users.some(user => user._id.toString() === chatUser.user_id)
//                 );

//                 if (matchedUser) {
//                     const user = getUsersData.users.find(user => user._id.toString() === matchedUser.user_id);
//                     setUserData({
//                         id: matchedUser.user_id,
//                         username: matchedUser.user_name,
//                         email: user.email,
//                         avatarUrl: matchedUser.picture,
//                     });
//                 } else {
//                     throw new Error('No matching user found');
//                 }
//             } catch (error) {
//                 console.error('Error fetching or processing user data:', error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchUserData();
//     }, []);

//     const handleEdit = () => {
//         setIsEditing(true);
//     };

//     const handleSave = async () => {
//         try {
//             const response = await fetch('/api/chat_user', {
//                 method: 'PUT',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     user_id: userData.id,
//                     user_name: userData.username,
//                     picture: userData.avatarUrl,
//                 }),
//             });

//             if (!response.ok) {
//                 throw new Error('Failed to update user data');
//             }

//             const updatedData = await response.json();
//             setUserData(prev => ({
//                 ...prev,
//                 username: updatedData.user_name,
//                 avatarUrl: updatedData.picture,
//             }));

//             setIsEditing(false);
//             alert('Profile updated successfully!');
//             window.location.reload(); // Refresh the page to show updated data
//         } catch (error) {
//             console.error('Error updating user data:', error);
//             alert('Failed to update profile. Please try again.');
//         }
//     };

//     const handleDelete = async () => {
//         try {
//             const response = await fetch('/api/chat_user', {
//                 method: 'DELETE',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({ user_id: userData.id }), // Pass user_id to be deleted
//             });

//             if (!response.ok) {
//                 throw new Error('Failed to delete user');
//             }

//             const result = await response.json();
//             alert(result.message); // Display success message from the backend

//             // Redirect user after deletion (or clear state)
//             window.location.href = '/'; // Redirect to home or login page, you can customize this
//         } catch (error) {
//             console.error('Error deleting user:', error);
//             alert('Failed to delete profile. Please try again.');
//         }
//     };

//     const handleChange = (e) => {
//         setUserData({ ...userData, [e.target.name]: e.target.value });
//     };

//     const handleUploadSuccess = (result) => {
//         const uploadedImageUrl = result.info.secure_url;
//         setUserData(prev => ({
//             ...prev,
//             avatarUrl: uploadedImageUrl,
//         }));
//     };

//     if (loading) {
//         return <div>Loading...</div>;
//     }

//     if (!userData) {
//         return <div>No user data available</div>;
//     }

//     return (
//         <div className="profile-container">
//             <div className="profile-card">
//                 <Link href={"/chats"}>
//                     <button className="close-button">
//                         <FiX className="h-6 w-6" />
//                     </button>
//                 </Link>
//                 <div className="profile-header">
//                     <h2 className="profile-title">User Profile</h2>
//                 </div>
//                 <div className="profile-content">
//                     <div className="avatar-container">
//                         <div className="avatar">
//                             <img src={userData.avatarUrl} alt={userData.username} className="avatar-image" />
//                             {isEditing && (
//                                 <div className="avatar-overlay">
//                                     <FiCamera className="camera-icon" />
//                                     <CldUploadWidget
//                                         uploadPreset="chat_app"
//                                         onSuccess={handleUploadSuccess}
//                                         options={{
//                                             maxFiles: 1,
//                                             resourceType: 'image',
//                                             folder: 'chatapp-users',
//                                         }}
//                                     >
//                                         {({ open }) => (
//                                             <button
//                                                 type="button"
//                                                 className="upload-button"
//                                                 onClick={() => open()}
//                                             />
//                                         )}
//                                     </CldUploadWidget>
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                     <div className="form-group">
//                         <label htmlFor="userId" className="form-label">User ID</label>
//                         <input
//                             id="userId"
//                             value={userData.id}
//                             readOnly
//                             className="form-input"
//                         />
//                     </div>
//                     <div className="form-group">
//                         <label htmlFor="username" className="form-label">Username</label>
//                         <input
//                             id="username"
//                             name="username"
//                             value={userData.username}
//                             readOnly={!isEditing}
//                             onChange={handleChange}
//                             className="form-input"
//                         />
//                     </div>
//                     <div className="form-group">
//                         <label htmlFor="email" className="form-label">Email</label>
//                         <input
//                             id="email"
//                             name="email"
//                             value={userData.email}
//                             readOnly
//                             className="form-input"
//                         />
//                     </div>
//                 </div>
//                 <div className="profile-footer">
//                     {isEditing ? (
//                         <button
//                             onClick={handleSave}
//                             className="button button-primary"
//                         >
//                             Save Changes
//                         </button>
//                     ) : (
//                         <button
//                             onClick={handleEdit}
//                             className="button button-primary"
//                         >
//                             <FiEdit2 className="button-icon" /> Edit Profile
//                         </button>
//                     )}
//                     <button
//                         onClick={handleDelete}
//                         className="button button-danger"
//                     >
//                         <FiTrash2 className="button-icon" /> Delete Profile
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// }


'use client'
import { useEffect, useState } from 'react';
import { FiEdit2, FiTrash2, FiX, FiCamera } from 'react-icons/fi';
import { CldUploadWidget } from 'next-cloudinary';
import Link from 'next/link';
import "./user-profile.css"

export default function UserProfile() {
    const [isEditing, setIsEditing] = useState(false);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Fetch data from both APIs
                const [chatUserResponse, getUsersResponse] = await Promise.all([
                    fetch('/api/chat_user'),
                    fetch('/api/getusers')
                ]);

                // Handle errors if any of the API calls fail
                if (!chatUserResponse.ok || !getUsersResponse.ok) {
                    throw new Error('Failed to fetch user data');
                }

                // Parse the JSON data from responses
                const chatUserData = await chatUserResponse.json();
                const getUsersData = await getUsersResponse.json();

                // Find the matching user from the list of users
                const matchedUser = getUsersData.users.find(user => user._id === chatUserData.user.user_id);

                // If a matching user is found, update the userData state with the relevant fields
                if (matchedUser) {
                    setUserData({
                        id: chatUserData.user.user_id,
                        username: chatUserData.user.user_name,
                        email: matchedUser.email,
                        avatarUrl: chatUserData.user.picture,
                    });
                } else {
                    throw new Error('No matching user found');
                }
            } catch (error) {
                console.error('Error fetching or processing user data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    // Edit profile button handler
    const handleEdit = () => {
        setIsEditing(true);
    };

    // Save profile changes handler
    const handleSave = async () => {
        if (!userData) return;

        try {
            const response = await fetch('/api/chat_user', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: userData.id,
                    user_name: userData.username,
                    picture: userData.avatarUrl,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update user data');
            }

            const updatedData = await response.json();
            setUserData(prev => ({
                ...prev,
                username: updatedData.user.user_name,
                avatarUrl: updatedData.user.picture,
            }));

            setIsEditing(false);
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating user data:', error);
            alert('Failed to update profile. Please try again.');
        }
    };

    // Delete profile handler
    const handleDelete = async () => {
        if (!userData) return;

        try {
            const response = await fetch('/api/chat_user', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user_id: userData.id }),
            });

            if (!response.ok) {
                throw new Error('Failed to delete user');
            }

            const result = await response.json();
            alert(result.message);
            window.location.href = '/';
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Failed to delete profile. Please try again.');
        }
    };

    // Handle form input changes
    const handleChange = (e) => {
        if (!userData) return;

        const { name, value } = e.target;

        if (name === "username") {
            const sanitizedValue = value.startsWith("@") ? value : "@" + value;
            const validUsername = sanitizedValue.replace(/[^@a-zA-Z0-9]/g, ""); // Allow only @, letters, and numbers
            setUserData({ ...userData, username: validUsername });
        } else {
            setUserData({ ...userData, [name]: value });
        }
    };

    // Handle image upload success
    const handleUploadSuccess = (result) => {
        const uploadedImageUrl = result.info.secure_url;
        setUserData(prev => prev ? ({
            ...prev,
            avatarUrl: uploadedImageUrl,
        }) : null);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!userData) {
        return <div>No user data available</div>;
    }

    return (
        <div className="profile-container">
            <div className="profile-card">
                <Link href="/app">
                    <button className="close-button">
                        <FiX className="h-6 w-6" />
                    </button>
                </Link>
                <div className="profile-header">
                    <h2 className="profile-title">User Profile</h2>
                </div>
                <div className="profile-content">
                    <div className="avatar-container">
                        <div className="avatar">
                            <img src={userData.avatarUrl} alt={userData.username} className="avatar-image" />
                            {isEditing && (
                                <div className="avatar-overlay">
                                    <FiCamera className="camera-icon" />
                                    <CldUploadWidget
                                        uploadPreset="chat_app"
                                        onSuccess={handleUploadSuccess}
                                        options={{
                                            maxFiles: 1,
                                            resourceType: 'image',
                                            folder: 'chatapp-users',
                                        }}
                                    >
                                        {({ open }) => (
                                            <button
                                                type="button"
                                                className="upload-button"
                                                onClick={() => open()}
                                            />
                                        )}
                                    </CldUploadWidget>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="userId" className="form-label">User ID</label>
                        <input
                            id="userId"
                            value={userData.id}
                            readOnly
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="username" className="form-label">Username</label>
                        <input
                            id="username"
                            name="username"
                            value={userData.username}
                            readOnly={!isEditing}
                            onChange={handleChange}
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                            id="email"
                            name="email"
                            value={userData.email}
                            readOnly
                            className="form-input"
                        />
                    </div>
                </div>
                <div className="profile-footer">
                    {isEditing ? (
                        <button
                            onClick={handleSave}
                            className="profile-button button-primary"
                        >
                            Save Changes
                        </button>
                    ) : (
                        <button
                            onClick={handleEdit}
                            className="profile-button button-primary"
                        >
                            <FiEdit2 className="button-icon" /> Edit Profile
                        </button>
                    )}
                    <button
                        onClick={handleDelete}
                        className="profile-button button-danger"
                    >
                        <FiTrash2 className="button-icon" /> Delete Profile
                    </button>
                </div>
            </div>
        </div>
    );
}





