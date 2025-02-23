"use client";
import { useState } from "react";
import "./ForgotPassword.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/userAuth/forgotPassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(
          "If an account exists for this email, a password reset link has been sent."
        );
      } else {
        setMessage(data.error || "An error occurred. Please try again.");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again later.");
    }

    setIsLoading(false);
  };

  return (
    <div className="forgot-container">
      <div className="forgot-form-container">
        <h1 className="forgot-title">Forgot Password</h1>
        <form onSubmit={handleSubmit} className="forgot-form">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="forgot-input"
            required
          />
          <button
            type="submit"
            className="forgot-submit-button"
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
        {message && (
          <p
            className={
              message.includes("error")
                ? "forgot-error-message"
                : "forgot-success-message"
            }
          >
            {message}
          </p>
        )}
        <p className="forgot-toggle-text">
          <button
            onClick={() => (window.location.href = "/login")}
            className="forgot-toggle-button"
          >
            Back to Login
          </button>
        </p>
      </div>
    </div>
  );
}
