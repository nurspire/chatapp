// import connectDB from "@/utils/connectDB/page"
// import User from "@/utils/models/UserSchema"
// import { NextResponse } from "next/server"
// import bcrypt from "bcryptjs"

// export async function POST(request) {
//   await connectDB()

//   try {
//     // Use the nextUrl object to access query parameters from the URL
//     const { token, email } = request.nextUrl.searchParams

//     console.log("Received token:", token)
//     console.log("Received email:", email)

//     // Ensure token and email are provided
//     if (!token || !email) {
//       return NextResponse.json({ error: "Token or email is missing." }, { status: 400 })
//     }

//     // Find the user by email and verify the token
//     const user = await User.findOne({
//       email,  // Ensure that the email matches
//       verificationToken: token,  // Token should match
//       verificationTokenExpires: { $gt: Date.now() },  // Ensure token has not expired
//       verificationTokenUsed: false  // Ensure the token has not been used yet
//     })

//     if (!user) {
//       return NextResponse.json({ error: "Password reset token is invalid, expired, or the email is incorrect." }, { status: 400 })
//     }

//     // Hash the new password from the body of the request
//     const { password } = await request.json(); // Extract password from request body

//     const salt = await bcrypt.genSalt(10)
//     const hashedPassword = await bcrypt.hash(password, salt)

//     // Update the user's password and clear the token fields
//     user.password = hashedPassword
//     user.verificationTokenUsed = true // Mark the token as used
//     user.verificationToken = undefined // Clear the token
//     user.verificationTokenExpires = undefined // Clear the expiration
//     await user.save()

//     return NextResponse.json({ message: "Password has been reset successfully." })
//   } catch (error) {
//     console.error("Error in reset password:", error)
//     return NextResponse.json({ error: "An error occurred. Please try again later." }, { status: 500 })
//   }
// }

import connectDB from "@/utils/connectDB/page";
import User from "@/utils/models/UserSchema";
import { NextResponse } from "next/server";

export async function GET(request) {
  await connectDB();

  try {
    // Manually parse the token from the query string
    const url = new URL(request.url, `http://${request.headers.get("host")}`);
    const token = url.searchParams.get("token");

    console.log("Api Received token:", token);

    // Ensure token is provided
    if (!token) {
      return NextResponse.json({ error: "Token is missing." }, { status: 400 });
    }

    // Find the user by verification token, checking for expiry and usage
    const user = await User.findOne({
      verificationToken: token,  // Token should match
      verificationTokenExpires: { $gt: Date.now() },  // Ensure token has not expired
      verificationTokenUsed: false  // Ensure the token has not been used yet
    });

    if (!user) {
      return NextResponse.json({
        error: "Token is invalid, expired, or already used.",
      }, { status: 400 });
    }

    // Mark the user as verified and clear the token fields
    user.isVerified = true; // Mark the email as verified
    user.verificationTokenUsed = true; // Mark the token as used
    // user.verificationToken = undefined; // Clear the token
    user.verificationTokenExpires = undefined; // Clear the expiration
    await user.save();

    return NextResponse.json({ message: "Email successfully verified!" });

  } catch (error) {
    console.error("Error in email verification:", error);
    return NextResponse.json({ error: "An error occurred. Please try again later." }, { status: 500 });
  }
}
