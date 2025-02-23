// 'use client';
// import { useState } from 'react';
// import './LoginPage.css'; // separate CSS file for login page

// export default function LoginPage() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [errorMessage, setErrorMessage] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');

//   const handleLoginSubmit = async (e) => {
//     e.preventDefault();
//     const payload = { email, password };

//     try {
//       const response = await fetch(`/api/userAuth/Login`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(payload),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         localStorage.setItem('token', data.token);
//         localStorage.setItem('user', JSON.stringify(data.user));
//         window.location.href = '/';
//       } else {
//         setErrorMessage(data.error || 'Something went wrong');
//         setSuccessMessage('');
//       }
//     } catch (error) {
//       console.error('Error during login request:', error);
//       setErrorMessage('An error occurred. Please try again later.');
//       setSuccessMessage('');
//     }
//   };

//   return (
//     <div className="container">
//       <div className="formContainer">
//         <h1 className="title">Login</h1>

//         <form onSubmit={handleLoginSubmit} className="form">
//           <input
//             type="email"
//             placeholder="Enter your email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="input"
//             required
//           />
//           <input
//             type="password"
//             placeholder="Enter your password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="input"
//             required
//           />
//           <button type="submit" className="submitButton">
//             Login
//           </button>

//           {successMessage && <p className="success-message">{successMessage}</p>}
//           {errorMessage && <p className="error-message">{errorMessage}</p>}
//         </form>

//         <p className="toggle-text">
//           Don't have an account?{' '}
//           <button onClick={() => window.location.href = '/signup'} className="toggleButton">
//             Sign Up
//           </button>
//         </p>
//       </div>
//     </div>
//   );
// }

// 'use client';
// import { useEffect, useState } from 'react';
// import './LoginPage.css';

// export default function LoginPage() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [errorMessage, setErrorMessage] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');

//   // Ensure dark mode is applied by default
//   useEffect(() => {
//     document.body.classList.add('dark-mode');
//     return () => {
//       document.body.classList.remove('dark-mode'); // Cleanup on component unmount
//     };
//   }, []);

//   const decodeJWT = (token) => {
//     try {
//       const base64Payload = token.split('.')[1];
//       const decodedPayload = atob(base64Payload);
//       return JSON.parse(decodedPayload);
//     } catch (error) {
//       console.error("Failed to decode JWT:", error);
//       return null;
//     }
//   };

//   const handleLoginSubmit = async (e) => {
//     e.preventDefault();
//     const payload = { email, password };

//     try {
//       const response = await fetch(`/api/userAuth/Login`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(payload),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         document.cookie = `token=${data.token}; path=/; max-age=${60 * 60 * 24}`;
//         const decoded = decodeJWT(data.token);
//         console.log("Decoded Token: ", decoded);

//         window.location.href = '/'; // Redirect to dashboard
//       } else {
//         setErrorMessage(data.error || 'Something went wrong');
//         setSuccessMessage('');
//       }
//     } catch (error) {
//       console.error('Error during login request:', error);
//       setErrorMessage('An error occurred. Please try again later.');
//       setSuccessMessage('');
//     }
//   };

//   return (
//     <div className="container">
//       <div className="formContainer">
//         <h1 className="title">Login</h1>

//         <form onSubmit={handleLoginSubmit} className="form">
//           <input
//             type="email"
//             placeholder="Enter your email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="input"
//             required
//           />
//           <input
//             type="password"
//             placeholder="Enter your password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="input"
//             required
//           />
//           <button type="submit" className="submitButton">
//             Login
//           </button>

//           {successMessage && <p className="success-message">{successMessage}</p>}
//           {errorMessage && <p className="error-message">{errorMessage}</p>}
//         </form>

//         <p className="toggle-text">
//           Don't have an account?{' '}
//           <button onClick={() => (window.location.href = '/signup')} className="toggleButton">
//             Sign Up
//           </button>
//         </p>
//       </div>
//     </div>
//   );
// }

"use client";
import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import "./LoginPage.css";
import ForgotPassword from "../LoginComp/ForgetPage/Forgetpage"; // Import the ForgotPassword component

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false); // State for toggling Forgot Password

  useEffect(() => {
    document.body.classList.add("dark-mode");
    return () => {
      document.body.classList.remove("dark-mode");
    };
  }, []);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const payload = { email, password };

    try {
      const response = await fetch(`/api/userAuth/Login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        document.cookie = `token=${data.token}; path=/; max-age=${60 * 60 * 24}`;
        setSuccessMessage("Login successful!");
        setErrorMessage("");
        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
      } else {
        setErrorMessage(data.error || "Something went wrong");
        setSuccessMessage("");
      }
    } catch (error) {
      setErrorMessage("An error occurred. Please try again later.");
      setSuccessMessage("");
    }
  };

  return (
    <div className="container">
      <div className="formContainer">
        {showForgotPassword ? (
          <ForgotPassword />
        ) : (
          <>
            <h1 className="title">Login</h1>
            <form onSubmit={handleLoginSubmit} className="form">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                required
              />
              <div className="password-input-container">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle-btn"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <button type="submit" className="submitButton">
                Login
              </button>

              {successMessage && <p className="success-message">{successMessage}</p>}
              {errorMessage && <p className="error-message">{errorMessage}</p>}
            </form>
            <p className="toggle-text">
              Don't have an account?{" "}
              <button
                onClick={() => (window.location.href = "/signup")}
                className="toggleButton"
              >
                Sign Up
              </button>
            </p>
            <p className="toggle-text">
              <button
                onClick={() => setShowForgotPassword(true)} // Show the Forgot Password form
                className="toggleButton"
              >
                Forgot Password?
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
