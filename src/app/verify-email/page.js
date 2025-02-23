// 'use client';
// import { useEffect, useState } from 'react';
// import { useRouter, useSearchParams } from 'next/navigation';

// export default function VerifyEmail() {
//   const searchParams = useSearchParams();
//   const token = searchParams.get('token'); // Extract the token from URL
//   const [status, setStatus] = useState(null); // State to manage the message
//   const router = useRouter();

//   useEffect(() => {
//     if (token) {
//       fetch(`/api/userAuth/verify-email?token=${token}`)
//         .then((res) => res.json())
//         .then((data) => {
//           if (data.message) {
//             setStatus(data.message); // Set success message
//             // Redirect after a short delay (e.g., 3 seconds)
//             setTimeout(() => {
//               router.push('/signup'); // Redirect to signup page
//             }, 3000); // Adjust the delay as needed
//           } else if (data.error) {
//             setStatus(data.error); // Set error message
//           }
//         })
//         .catch((err) => {
//           console.error("Error verifying email:", err);
//           setStatus('An error occurred while verifying your email. Please try again later.');
//         });
//     } else {
//       setStatus('Token is missing. Please try again.');
//     }
//   }, [token, router]);

//   return (
//     <div style={styles.container}>
//       <div style={styles.messageContainer}>
//         {status ? (
//           <p style={styles.message}>{status}</p> // Show the appropriate message
//         ) : (
//           <p style={styles.message}>Verifying your email...</p> // Show this while waiting for the response
//         )}
//       </div>
//     </div>
//   );
// }

// const styles = {
//   container: {
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     height: '100vh',
//     backgroundColor: '#f4f7fa',
//   },
//   messageContainer: {
//     textAlign: 'center',
//     padding: '20px',
//     backgroundColor: 'white',
//     borderRadius: '8px',
//     boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
//   },
//   message: {
//     fontSize: '18px',
//     fontWeight: '500',
//     color: '#333',
//   }
// };

'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function VerifyEmail() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token'); // Extract the token from URL
  const [status, setStatus] = useState(null); // State to manage the message
  const router = useRouter();

  useEffect(() => {
    console.log("Frontend token:", token); // Log token to ensure it's extracted correctly

    if (token) {
      // Ensure this is a GET request, which is what your backend expects
fetch(`/api/userAuth/verify-email?token=${token}`, {
  method: 'GET', // Make sure it's a GET request
})
  .then((res) => res.json())
  .then((data) => {
    if (data.message) {
      setStatus(data.message);
      // Redirect after a short delay
      setTimeout(() => {
        router.push('/signup');
      }, 3000);
    } else if (data.error) {
      setStatus(data.error);
    }
  })
  .catch((err) => {
    console.error("Error verifying email:", err);
    setStatus('An error occurred while verifying your email. Please try again later.');
  });

    } else {
      setStatus('Token is missing. Please try again.');
    }
  }, [token, router]);

  return (
    <div style={styles.container}>
      <div style={styles.messageContainer}>
        {status ? (
          <p style={styles.message}>{status}</p> // Show the appropriate message
        ) : (
          <p style={styles.message}>Verifying your email...</p> // Show this while waiting for the response
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f4f7fa',
  },
  messageContainer: {
    textAlign: 'center',
    padding: '20px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  message: {
    fontSize: '18px',
    fontWeight: '500',
    color: '#333',
  }
};
