// import { NextResponse } from 'next/server';
// import User from '@/utils/models/UserSchema'; // Your user model

// export async function GET(request) {
//   try {
//     // Get the token from the query parameters
//     const url = new URL(request.url);
//     const token = url.searchParams.get("token");

//     if (!token) {
//       return NextResponse.json({ error: "Token is missing" }, { status: 400 });
//     }

//     // Find the user in the database by the token
//     const user = await User.findOne({ verificationToken: token });

//     if (!user) {
//       return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
//     }

//     // Mark the user as verified
//     user.isVerified = true; // Assuming 'isVerified' is a boolean field in your schema
//     user.verificationToken = null; // Clear the token after verification

//     await user.save(); // Save the updated user

//     // Return success message
//     return NextResponse.json({ message: "Email successfully verified!" }, { status: 200 });
//   } catch (error) {
//     console.error("Verification Error:", error);
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//   }
// }

import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import User from '@/utils/models/UserSchema'; // Your user model

const JWT_SECRET = process.env.JWT_SECRET; // Ensure this is set in your .env file

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const token = url.searchParams.get("token");

    if (!token) {
      return NextResponse.json({ error: "Token is missing" }, { status: 400 });
    }

    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
    }

    // Mark the user as verified
    user.isVerified = true;
    user.verificationToken = token;

    await user.save();

    // Generate a JWT for the user
    const payload = { id: user._id, email: user.email, name: user.name };
    const jwtToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' }); // Token expires in 7 days

    // Set the token in a cookie
    const response = NextResponse.json({ message: "Email successfully verified!" });

    return response;
  } catch (error) {
    console.error("Verification Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
