import connectDB from "@/utils/connectDB/page"
import User from "@/utils/models/UserSchema"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

export async function POST(request) {
  await connectDB()

  try {
    const { token, password, email } = await request.json()

    // Log the values to check if they are coming in correctly
    console.log("Received token:", token)
    console.log("Received email:", email)

    // Find the user by email and check if the verification token exists and has not expired
    const user = await User.findOne({
      email,  // Ensure that the email matches
      verificationToken: token,  // Token should match
      verificationTokenExpires: { $gt: Date.now() },  // Ensure token has not expired
      verificationTokenUsed: false,  // Ensure the token hasn't already been used
    })

    if (!user) {
      console.error("User not found or token expired/invalid")
      return NextResponse.json({ error: "Password reset token is invalid, expired, or the email is incorrect." }, { status: 400 })
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Update the user's password
    user.password = hashedPassword

    // Mark the verification token as used
    user.verificationTokenUsed = true

    // Clear the verification token and its expiration time to prevent further use
    user.verificationToken = undefined
    user.verificationTokenExpires = undefined

    // Save the updated user document
    await user.save()

    console.log("Password reset successful.")
    return NextResponse.json({ message: "Password has been reset successfully." })
  } catch (error) {
    console.error("Error in reset password:", error)
    return NextResponse.json({ error: "An error occurred. Please try again later." }, { status: 500 })
  }
}
