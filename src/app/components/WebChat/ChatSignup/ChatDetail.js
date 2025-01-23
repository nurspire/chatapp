// "use client"; // Enables client-side interactivity

// import { CldUploadWidget } from 'next-cloudinary';
// import Link from 'next/link';
// import './SignupForm.css';

// const SignupForm = () => {
  

//   return (
//     <div className='chat-detail'>
//       <div className="signup-card">
//         <header className="signup-header">
//           {/* Close button with Link for navigation */}
//           <Link href="/chats" className="close-button">&times;</Link>
//           <h2 className="signup-title">Welcome to ChatApp</h2>
//           <p className="signup-description">Enter your details to get started</p>
//         </header>
//         <div className="signup-content">
//           <form>
//             <div className="form-group">
//               <label htmlFor="username" className="form-label">Username</label>
//               <input
//                 type="text"
//                 id="username"
//                 className="form-input"
//                 placeholder="Enter your username"
//                 required
//               />
//             </div>
//             <div className="form-group">
//               <label className="form-label">Profile Picture (Optional)</label>
//               <div className="avatar-container">
//                 <div className="avatar">
//                   {/* Static avatar */}
//                   📷
//                 </div>
//                 <label htmlFor="image" className="file-label">
//                   Choose Image
//                 </label>
//                 <input
//                   type="file"
//                   id="image"
//                   className="file-input"
//                   accept="image/*"
//                   disabled // Disable the file input if you don't want to interact with it
//                 />
//               </div>
//             </div>
//             <button type="submit" className="submit-button" disabled>
//               Start Chatting
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SignupForm;
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation"; // Import router for navigation
import { CldUploadWidget } from "next-cloudinary";
import Link from "next/link";
import "./SignupForm.css";

const SignupForm = () => {
  const router = useRouter(); // Initialize router
  const [username, setUsername] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [usernameError, setUsernameError] = useState(""); // For username-specific error
  const [formMessage, setFormMessage] = useState(""); // For form-wide errors

  const handleUploadSuccess = (result) => {
    const uploadedImageUrl = result.info.secure_url;
    setImageUrl(uploadedImageUrl);
  };

  const handleRemoveImage = () => {
    setImageUrl("");
  };

  const handleUsernameChange = (e) => {
    setUsernameError(""); // Clear username error on input change
    setFormMessage(""); // Clear form-wide errors
    const value = e.target.value;
    if (value === "" || value.startsWith("@")) {
      setUsername(value);
    } else {
      setUsername("@" + value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setUsernameError(""); // Clear previous errors
    setFormMessage("");

    // Validate username
    if (!/^@[a-zA-Z0-9]+$/.test(username)) {
      setUsernameError("Username must start with '@' and contain only letters and numbers.");
      setLoading(false);
      return;
    }

    const userData = {
      user_name: username,
      picture: imageUrl,
    };

    try {
      const response = await fetch("/api/chat_user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("User created:", data);

        // Clear form fields
        setUsername("");
        setImageUrl("");

        // Redirect to /chats
        router.push("/app");
      } else {
        const errorData = await response.json();
        setFormMessage(errorData.error || "Failed to create user");
      }
    } catch (error) {
      console.error("Error:", error);
      setFormMessage("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-detail">
      <div className="signup-card">
        <header className="signup-header">
          <Link href="/app" className="close-button">
            &times;
          </Link>
          <h2 className="signup-title">Welcome to ChatApp</h2>
          <p className="signup-description">Enter your details to get started</p>
        </header>
        <div className="signup-content">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <input
                type="text"
                id="username"
                className={`form-input ${usernameError ? "error-border" : ""}`}
                placeholder="Enter your username"
                value={username}
                onChange={handleUsernameChange}
                required
              />
              {usernameError && <span className="error-message">{usernameError}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Profile Picture (Optional)</label>
              <div className="avatar-container">
                <CldUploadWidget
                  uploadPreset="chat_app"
                  onSuccess={handleUploadSuccess}
                  options={{
                    maxFiles: 1,
                    resourceType: "image",
                    folder: "chatapp-users",
                  }}
                >
                  {({ open }) => (
                    <button type="button" className="file-label" onClick={() => open()}>
                      Upload Image
                    </button>
                  )}
                </CldUploadWidget>

                {imageUrl && (
                  <div className="image-preview-wrapper">
                    <img
                      src={imageUrl}
                      alt="Uploaded profile"
                      className="preview-image"
                    />
                    <button
                      type="button"
                      className="remove-image-button"
                      onClick={handleRemoveImage}
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
            </div>
            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? "Submitting..." : "Start Chatting"}
            </button>
          </form>
        </div>
      </div>
      {formMessage && <div className="form-message error">{formMessage}</div>}
    </div>
  );
};

export default SignupForm;
