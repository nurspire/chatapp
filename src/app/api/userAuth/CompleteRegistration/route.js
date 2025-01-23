import connectDB from "@/utils/connectDB/page";
import User from "@/utils/models/UserSchema";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";  // Import the JWT library
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await connectDB();

    // Parse user data from the request body
    const { name, password } = await request.json(); // User provides only name and password

    if (!name || !password) {
      return NextResponse.json({ error: "Name and password are required" }, { status: 400 });
    }

    // Find the user by the verification token stored in the database
    const user = await User.findOne({ verificationToken: { $ne: null } }); // Find the user with a valid token
    if (!user) {
      return NextResponse.json({ error: "User with a valid verification token not found" }, { status: 404 });
    }

    // Optional: Check if the token has expired
    const now = new Date();
    if (user.verificationTokenExpires && user.verificationTokenExpires < now) {
      return NextResponse.json({ error: "Verification token has expired" }, { status: 400 });
    }

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update the user's information
    user.name = name;
    user.password = hashedPassword;
    user.isVerified = true; // Mark user as verified
    user.verificationToken = null; 
    user.verificationTokenExpires = null; // Clear token expiry if used

    // Save the updated user data to the database
    await user.save();

    // Generate a JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },  // Payload (data you want to encode into the token)
      process.env.JWT_SECRET,  // Your secret key (should be kept in environment variables)
      { expiresIn: '1d' }  // Set expiration time (1 day here)
    );

    // Send the JWT token in the response
    return NextResponse.json({ message: "Registration completed successfully! Your account is now verified.", token }, { status: 200 });

  } catch (error) {
    console.error("Error in CompleteRegistration:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}