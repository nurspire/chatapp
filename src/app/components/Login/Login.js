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

'use client';
import { useState } from 'react';
import './LoginPage.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const decodeJWT = (token) => {
    try {
      // Split the JWT into its parts
      const base64Payload = token.split('.')[1]; // Get the payload part
      const decodedPayload = atob(base64Payload); // Decode Base64
      return JSON.parse(decodedPayload); // Parse JSON
    } catch (error) {
      console.error("Failed to decode JWT:", error);
      return null;
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const payload = { email, password };

    try {
      const response = await fetch(`/api/userAuth/Login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        // Save the token in cookies
        document.cookie = `token=${data.token}; path=/; max-age=${60 * 60 * 24}`;

        // Decode the token client-side
        const decoded = decodeJWT(data.token);
        console.log("Decoded Token: ", decoded);

        window.location.href = '/'; // Redirect to dashboard
      } else {
        setErrorMessage(data.error || 'Something went wrong');
        setSuccessMessage('');
      }
    } catch (error) {
      console.error('Error during login request:', error);
      setErrorMessage('An error occurred. Please try again later.');
      setSuccessMessage('');
    }
  };

  return (
    <div className="container">
      <div className="formContainer">
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
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
            required
          />
          <button type="submit" className="submitButton">
            Login
          </button>

          {successMessage && <p className="success-message">{successMessage}</p>}
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </form>

        <p className="toggle-text">
          Don't have an account?{' '}
          <button onClick={() => window.location.href = '/signup'} className="toggleButton">
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
}
