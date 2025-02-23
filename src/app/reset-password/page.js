"use client"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation" // Importing useSearchParams
import { Eye, EyeOff } from "lucide-react"
import "./ResetPassword.css"

export default function ResetPassword() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [token, setToken] = useState("")  // State for token
  const [email, setEmail] = useState("")  // State for email
  const router = useRouter()

  useEffect(() => {
    document.body.classList.add("dark-mode");
    return () => {
      document.body.classList.remove("dark-mode");
    };
  }, []);

  // Using useSearchParams to get token and email from URL query parameters
  const searchParams = useSearchParams()

  useEffect(() => {
    const tokenFromUrl = searchParams.get("token") // Extract token from URL
    const emailFromUrl = searchParams.get("email") // Extract email from URL
    if (tokenFromUrl) setToken(tokenFromUrl)  // Update token state
    if (emailFromUrl) setEmail(emailFromUrl)  // Update email state
  }, [searchParams])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setMessage("Passwords do not match")
      return
    }

    setIsLoading(true)
    setMessage("")

    try {
      const response = await fetch("/api/userAuth/resetPassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, email, password }),  // Sending token and email in the request
      })

      const data = await response.json()

      if (response.ok) {
        setMessage("Password reset successfully. You can now login with your new password.")
        setTimeout(() => {
          window.location.href = "/login"
        }, 3000)
      } else {
        setMessage(data.error || "An error occurred. Please try again.")
      }
    } catch (error) {
      setMessage("An error occurred. Please try again later.")
    }

    setIsLoading(false)
  }

  return (
    <div className="container">
      <div className="formContainer">
        <h1 className="title">Reset Password</h1>
        <form onSubmit={handleSubmit} className="form">
          <div className="password-input-container">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              required
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="password-toggle-btn">
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <div className="password-input-container">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="password-toggle-btn"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <button type="submit" className="submitButton" disabled={isLoading}>
            {isLoading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
        {message && <p className={message.includes("successfully") ? "success-message" : "error-message"}>{message}</p>}
      </div>
    </div>
  )
}
