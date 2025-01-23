// 'use client';

// import { useState } from 'react';
// import './SignupPage.css'; // Add your styling here

// export default function SignupPage() {
//   const [email, setEmail] = useState('');
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [errorMessage, setErrorMessage] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');
//   const [step, setStep] = useState(1); // Step for signup: 1 (email) or 2 (name/password)
//   const [isVerified, setIsVerified] = useState(false); // Email verification status

//   const handleEmailSubmit = async (e) => {
//     e.preventDefault();
//     setErrorMessage('');
//     setSuccessMessage('');

//     try {
//       const response = await fetch('/api/userAuth/Signup', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         if (data.isVerified) {
//           // Email is already verified, move to name/password step
//           setIsVerified(true);
//           setStep(2);
//         } else if (data.message.includes('verification email has been sent')) {
//           // Email is not verified, show success message
//           setSuccessMessage(data.message);
//         } else {
//           setErrorMessage('Your email is not verified. Please check your email to verify.');
//         }
//       } else {
//         setErrorMessage(data.error || 'Something went wrong.');
//       }
//     } catch (error) {
//       console.error('Error during email submission:', error);
//       setErrorMessage('An error occurred. Please try again.');
//     }
//   };

//   const handleRegistrationSubmit = async (e) => {
//     e.preventDefault();
//     setErrorMessage('');
//     setSuccessMessage('');

//     // Validate username
//     if (username.length < 3) {
//       setErrorMessage('Name must be greater than 3 characters.');
//       return;
//     } else if (username.length > 30) {
//       setErrorMessage('Name must be less than 30 characters.');
//       return;
//     } else if (!/^[a-zA-Z0-9 ]+$/.test(username)) {
//       setErrorMessage('Name can only contain letters, numbers, and spaces.');
//       return;
//     }

//     // Validate password
//     if (password.length < 8) {
//       setErrorMessage('Password must be at least 8 characters long.');
//       return;
//     }

//     try {
//       const response = await fetch('/api/userAuth/CompleteRegistration', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ name: username, password }),
//       });

//       const data = await response.json();
//       if (response.ok) {
//         alert('Registration complete! You are now logged in.');
//         localStorage.setItem('token', data.token); // Save the JWT token
//         window.location.href = '/'; // Redirect to home or dashboard
//       } else {
//         setErrorMessage(data.error || 'Something went wrong. Please try again.');
//       }
//     } catch (error) {
//       console.error('Error during registration:', error);
//       setErrorMessage('An error occurred. Please try again.');
//     }
//   };

//   return (
//     <div className="container">
//       <div className="formContainer">
//         <h1 className="title">Sign Up</h1>

//         <form onSubmit={step === 1 ? handleEmailSubmit : handleRegistrationSubmit} className="form">
//           {step === 1 && (
//             <>
//               <input
//                 type="email"
//                 placeholder="Enter your email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="input"
//                 required
//               />
//               <button type="submit" className="submitButton">
//                 Next
//               </button>
//               {errorMessage && <p className="error-message">{errorMessage}</p>}
//               {successMessage && <p className="success-message">{successMessage}</p>}
//             </>
//           )}

//           {step === 2 && isVerified && (
//             <>
//               <input
//                 type="text"
//                 placeholder="Enter your name"
//                 value={username}
//                 onChange={(e) => setUsername(e.target.value)}
//                 className="input"
//                 required
//               />
//               <input
//                 type="password"
//                 placeholder="Enter your password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="input"
//                 required
//               />
//               <button type="submit" className="submitButton">
//                 Complete Signup
//               </button>
//               {/* Render error message for name and password validation */}
//               {errorMessage && <p className="error-message">{errorMessage}</p>}
//             </>
//           )}
//         </form>
//       </div>
//     </div>
//   );
// }

'use client';

import { useState } from 'react';
import './SignupPage.css'; // Add your styling here

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [step, setStep] = useState(1); // Step for signup: 1 (email) or 2 (name/password)
  const [isVerified, setIsVerified] = useState(false); // Email verification status

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await fetch('/api/userAuth/Signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.isVerified) {
          // Email is already verified, move to name/password step
          setIsVerified(true);
          setStep(2);
        } else if (data.message.includes('verification email has been sent')) {
          // Email is not verified, show success message
          setSuccessMessage(data.message);
        } else {
          setErrorMessage('Your email is not verified. Please check your email to verify.');
        }
      } else {
        setErrorMessage(data.error || 'Something went wrong.');
      }
    } catch (error) {
      console.error('Error during email submission:', error);
      setErrorMessage('An error occurred. Please try again.');
    }
  };

  const handleRegistrationSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    // Validate username
    if (username.length < 3) {
      setErrorMessage('Name must be greater than 3 characters.');
      return;
    } else if (username.length > 30) {
      setErrorMessage('Name must be less than 30 characters.');
      return;
    } else if (!/^[a-zA-Z0-9 ]+$/.test(username)) {
      setErrorMessage('Name can only contain letters, numbers, and spaces.');
      return;
    }

    // Validate password
    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    try {
      const response = await fetch('/api/userAuth/CompleteRegistration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: username, password }),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Registration complete! You are now logged in.');

        // Save the JWT token in cookies instead of localStorage
        document.cookie = `token=${data.token}; path=/; max-age=${60 * 60 * 24}`; // Cookie expires in 1 day

        window.location.href = '/'; // Redirect to home or dashboard
      } else {
        setErrorMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Error during registration:', error);
      setErrorMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div className="container">
      <div className="formContainer">
        <h1 className="title">Sign Up</h1>

        <form onSubmit={step === 1 ? handleEmailSubmit : handleRegistrationSubmit} className="form">
          {step === 1 && (
            <>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                required
              />
              <button type="submit" className="submitButton">
                Next
              </button>
              {errorMessage && <p className="error-message">{errorMessage}</p>}
              {successMessage && <p className="success-message">{successMessage}</p>}
            </>
          )}

          {step === 2 && isVerified && (
            <>
              <input
                type="text"
                placeholder="Enter your name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
                Complete Signup
              </button>
              {/* Render error message for name and password validation */}
              {errorMessage && <p className="error-message">{errorMessage}</p>}
            </>
          )}
        </form>
      </div>
    </div>
  );
}
