import connectDB from "@/utils/connectDB/page";
import User from "@/utils/models/UserSchema";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
import { error } from "console";

export async function POST(request) {
  try {
    await connectDB();
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Check if the email is already registered
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      if(existingUser.password) {
        // Email exists but is not verified
        return NextResponse.json({error:"Email already signed up and verified." },{status:400});
      }
       else if (existingUser.isVerified) {
        // Email exists and is already verified
        return NextResponse.json({ isVerified: true, message: "Email is already verified." });
      } 
       else {
        // Email exists but is not verified
        return NextResponse.json({ isVerified: false, message: "Verification email has already been sent. Please verify your email." });
      }
    }

    // Generate a unique verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // Create a new user object with only the email and verification token
    const newUser = new User({
      email,
      verificationToken,
      isVerified: false,
    });

    // Save the user with the token in the database
    await newUser.save();

    // Send the verification email
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Email Verification",
      text: `Please verify your email address by clicking on the following link:\n\n${process.env.BASE_URL}/verify-email?token=${verificationToken}`,
      html: `
        <p>To verify your email address, please click the link below:</p>
        <a href="${process.env.BASE_URL}/verify-email?token=${verificationToken}">
          Verify your email
        </a>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ isVerified: false, message: "Signup successful! Please check your email to verify your account." }, { status: 201 });

  } catch (error) {
    console.error("Signup Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
