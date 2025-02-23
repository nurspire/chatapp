import connectDB from "@/utils/connectDB/page"
import User from "@/utils/models/UserSchema"
import { NextResponse } from "next/server"
import crypto from "crypto"
import nodemailer from "nodemailer"

export async function POST(request) {
  await connectDB()

  try {
    const { email } = await request.json()

    const user = await User.findOne({ email })

    if (!user) {
      return NextResponse.json({ message: "If an account exists for this email, a password reset link has been sent." })
    }

    // Generate a verification token
    const verificationToken = crypto.randomBytes(20).toString("hex")
    const verificationTokenExpires = Date.now() + 3600000 // Token expires in 1 hour

    // Update the user's document with the verification token, expiration time, and email
    user.verificationToken = verificationToken
    user.verificationTokenExpires = verificationTokenExpires
    user.verificationTokenUsed = false // Token has not been used yet
    await user.save()

    // Create a nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    // Send the password reset email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset",
      html: `
        <p>You are receiving this because you (or someone else) have requested the reset of the password for your account.</p>
        <p>Please click on the following link, or paste this into your browser to complete the process:</p>
        <p><a href="${process.env.BASE_URL}/reset-password?token=${verificationToken}&email=${user.email}">${process.env.BASE_URL}/reset-password?token=${verificationToken}&email=${user.email}</a></p>
        <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
      `,
    }

    await transporter.sendMail(mailOptions)

    return NextResponse.json({ message: "If an account exists for this email, a password reset link has been sent." })
  } catch (error) {
    console.error("Error in forgot password:", error)
    return NextResponse.json({ error: "An error occurred. Please try again later." }, { status: 500 })
  }
}
