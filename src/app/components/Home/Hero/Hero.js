// "use client"; // Ensure this component works on the client side

// import Link from "next/link";
// import Image from "next/image";
// import "./Hero.css";

// export default function Hero() {
//   return (
//     <section className="hero">
//       <div className="hero-content animated-slide-in-left">
//         <h1 className="hero-title animated-fade-in">Connect instantly with customers</h1>
//         <p className="hero-description animated-fade-in">
//           Experience seamless, user-friendly messaging that brings people together effortlessly.
//         </p>
//         <Link href="/chats" style={{textDecoration:"none"}}>
//         <button className="btn startchatbtn btn-primary btn-large animated-pulse">
//           Start Chatting Now
//           <svg className="btn-icon" viewBox="0 0 24 24">
//             <path d="M9 5l7 7-7 7" />
//           </svg>
//         </button>
//         </Link>
//         <div className="hero-stats animated-slide-in-up">
//           <div className="stat">
//             <div className="stat-value">22,861</div>
//             <div className="stat-label">Happy Customers</div>
//           </div>
//           <div className="stat-divider"></div>
//           <div className="stat">
//             <div className="stat-value">24/7</div>
//             <div className="stat-label">Customer Support</div>
//           </div>
//         </div>
//       </div>
//       <div className="hero-image animated-floating">
//         <Image
//           src="/two-mobiles.png?height=400&width=200"
//           alt="Chat App Interface"
//           layout="responsive"
//           width={450}
//           height={500}
//           className="phone-mockup"
//         />
//       </div>
//     </section>
//   );
// }

'use client'; // Ensure this component works on the client side

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import "./Hero.css";

export default function Hero() {
  const [userExists, setUserExists] = useState(null); // null means still checking, true or false for user presence

  useEffect(() => {
    // Check if the user exists by making an API call to /api/chat_user
    const checkUserExists = async () => {
      try {
        const response = await fetch("/api/chat_user/forhomebtn");
        
        if (response.ok) {
          const data = await response.json();

          // Check if the response contains a valid user
          if (data && data.user) {
            setUserExists(true); // User exists
          } else {
            setUserExists(false); // User does not exist
          }
        } else {
          setUserExists(false); // If the response is not OK, assume no user exists
        }
      } catch (error) {
        console.error("Error checking user existence:", error);
        setUserExists(false); // If the request fails, assume no user exists
      }
    };

    checkUserExists();
  }, []);

  // Conditional URL based on user existence
  const buttonLink = userExists === null
    ? "#" // Loading state: do nothing or show a loader
    : userExists
      ? "/app" // Redirect to chats if user exists
      : "/app/chat-detail"; // Redirect to chat-detail if no user exists

  return (
    <section className="hero">
      <div className="hero-content animated-slide-in-left">
        <h1 className="hero-title animated-fade-in">Connect instantly with customers</h1>
        <p className="hero-description animated-fade-in">
          Experience seamless, user-friendly messaging that brings people together effortlessly.
        </p>
        
        {/* Conditional redirect button */}
        <Link href={buttonLink} style={{ textDecoration: "none" }}>
          <button
            className="btn startchatbtn btn-primary btn-large animated-pulse"
            disabled={userExists === null} // Disable button while checking
          >
            {userExists === null ? "Loading..." : "Start Chatting Now"}
            <svg className="btn-icon" viewBox="0 0 24 24">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </Link>
        
        <div className="hero-stats animated-slide-in-up">
          <div className="stat">
            <div className="stat-value">22,861</div>
            <div className="stat-label">Happy Customers</div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat">
            <div className="stat-value">24/7</div>
            <div className="stat-label">Customer Support</div>
          </div>
        </div>
      </div>
      <div className="hero-image animated-floating">
        <Image
          src="/two-mobiles.png?height=400&width=200"
          alt="Chat App Interface"
          layout="responsive"
          width={450}
          height={500}
          className="phone-mockup"
        />
      </div>
    </section>
  );
}


