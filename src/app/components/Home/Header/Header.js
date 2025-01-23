// // /components/Header.js
// "use client";
// import Link from "next/link";
// import { useState, useEffect } from "react";
// import ThemeToggle from "../../Light/DarkToggle/ThemeToggle";
// import "./Header.css";

// export default function Header() {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   // Toggle menu open/close
//   const toggleMenu = () => {
//     setMenuOpen(!menuOpen);
//   };

//   // Close menu if user clicks outside of the navbar
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (menuOpen && !event.target.closest('.nav') && !event.target.closest('.menu-toggle')) {
//         setMenuOpen(false); // Close the menu
//       }
//     };
//     document.addEventListener('click', handleClickOutside);
//     return () => {
//       document.removeEventListener('click', handleClickOutside);
//     };
//   }, [menuOpen]);

//   // Disable body scroll when menu is open
//   useEffect(() => {
//     if (menuOpen) {
//       document.body.style.overflow = "hidden";
//     } else {
//       document.body.style.overflow = "auto";
//     }
//   }, [menuOpen]);

//   // Check if the user is logged in by checking for token
//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     setIsLoggedIn(!!token); // If token exists, user is logged in
//   }, []);

//   // Handle Logout
//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     setIsLoggedIn(false); // Update login status
//   };

//   return (
//     <header className="header">
//       {/* Overlay for background blur */}
//       {menuOpen && <div className="overlay" onClick={toggleMenu}></div>}

//       <div className="menu-toggle" onClick={toggleMenu}>
//         <div className={`hamburger ${menuOpen ? "open" : ""}`}></div>
//       </div>
//       <Link href={"/"} className="logo" style={{ textDecoration: "none" }}>
//         <div className="logo-icon"></div>
//         <span className="logo-text">
//           Versa <span>N</span>ex
//         </span>
//       </Link>

//       <nav className={`nav ${menuOpen ? "nav-open" : ""}`}>
//         <ul className="nav-list">
//           <li className="nav-item">
//             <Link href="/" className="nav-link">Home</Link>
//           </li>
//           <li className="nav-item">
//             <Link href="/about" className="nav-link">About</Link>
//           </li>
//           <li className="nav-item">
//             <Link href="pricing" className="nav-link">Pricing</Link>
//           </li>
//           <li className="nav-item">
//             <Link href="/contact" className="nav-link">Contact</Link>
//           </li>
//         </ul>

//         <div className="auth-buttons">
//           {!isLoggedIn ? (
//             <>
//               <Link href="/login">
//                 <button className="head-btn">Login</button>
//               </Link>
//               <Link href="/signup">
//               <button className="head-btn sign-up">Sign Up</button>
//               </Link>
//             </>
//           ) : (
//             <div className="user-info">
//               {/* ThemeToggle Button for logged-in users */}
//               <ThemeToggle />

//               {/* Logout Button */}
//               <button onClick={handleLogout} className="head-btn logout-btn">Logout</button>
//             </div>
//           )}
//         </div>
//       </nav>
//     </header>
//   );
// }

"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import ThemeToggle from "../../Light/DarkToggle/ThemeToggle";
import "./Header.css";
import { FaBars } from "react-icons/fa6";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Utility function to get cookie value by name
  const getCookie = (name) => {
    const cookies = document.cookie.split("; ");
    const cookie = cookies.find((row) => row.startsWith(`${name}=`));
    return cookie ? cookie.split("=")[1] : null;
  };

  // Toggle menu open/close
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Close menu if user clicks outside of the navbar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuOpen && !event.target.closest(".nav") && !event.target.closest(".menu-toggle")) {
        setMenuOpen(false); // Close the menu
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [menuOpen]);

  // Disable body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [menuOpen]);

  // Check if the user is logged in by checking for token in cookies
  useEffect(() => {
    const token = getCookie("token");
    setIsLoggedIn(!!token); // If token exists, user is logged in
  }, []);

  // Handle Logout
  const handleLogout = () => {
    // Clear the token cookie
    document.cookie = "token=; path=/; max-age=0";
    setIsLoggedIn(false); // Update login status
  };

  return (
    <header className="header">
      {/* Overlay for background blur */}
      {menuOpen && <div className="overlay" onClick={toggleMenu}></div>}

      <div className="menu-toggle" onClick={toggleMenu}>
  <div className={`hamburger-wrapper ${menuOpen ? "open" : ""}`}>
    <div className={`hamburger ${menuOpen ? "open" : ""}`}></div>
  </div>
</div>

      <Link href={"/"} className="logo" style={{ textDecoration: "none" }}>
        <div className="logo-icon"></div>
        <span className="logo-text">
          Versa <span>N</span>ex
        </span>
      </Link>

      <nav className={`nav ${menuOpen ? "nav-open" : ""}`}>
        <ul className="nav-list">
          <li className="nav-item">
            <Link href="/" className="nav-link">Home</Link>
          </li>
          <li className="nav-item">
            <Link href="/about" className="nav-link">About</Link>
          </li>
          <li className="nav-item" style={{cursor:"not-allowed"}}>
            <Link href="/" className="nav-link">Support</Link>
          </li>
          {/* <li className="nav-item" style={{cursor:"not-allowed"}}>
            <Link href="pricing" className="nav-link">Pricing</Link>
          </li> */}
          <li className="nav-item">
            <Link href="/contact" className="nav-link">Contact</Link>
          </li>
        </ul>

        <div className="auth-buttons">
          {!isLoggedIn ? (
            <>
              <Link href="/login">
                <button className="head-btn">Login</button>
              </Link>
              <Link href="/signup">
                <button className="head-btn sign-up">Sign Up</button>
              </Link>
            </>
          ) : (
            <div className="user-info">
              {/* ThemeToggle Button for logged-in users */}
              <ThemeToggle />

              {/* Logout Button */}
              <button onClick={handleLogout} className="head-btn logout-btn">Logout</button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
