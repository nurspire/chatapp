import React from "react";
import "./LandingCall.css";

const LandingPage = () => {
  return (
    <div className="LandingCall-landing-page">
      <div className="LandingCall-center-content">
        <img
          src="/logo.png"
          alt="Logo"
          className="LandingCall-transparent-logo"
        />
        <h1 className="LandingCall-title">Welcome</h1>
        <p className="LandingCall-subtitle">
          This is your platform to discover new possibilities. Let’s get started!
        </p>
        <button className="LandingCall-cta-button">Get Started</button>
      </div>
    </div>
  );
};

export default LandingPage;
