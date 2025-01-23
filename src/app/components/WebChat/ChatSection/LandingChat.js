'use client';
import "./LandingChat.css"
// import './chatsection.css';
export default function LandingChat() {
  return (
    <div className="landing-page">
      <div className="center-content">
      <img
  src="/logo.png" /* Remove "./public" and use a relative path from the root */
  alt="VersaNex Logo"
  className="transparent-logo"
/>
        <h1 className="title">VersaNex</h1>
        <p className="subtitle">
          Connecting You Seamlessly<br />
          Experience the best communication platform today.
        </p>
      </div>
    </div>
  );
}
