// import connectDB from "@/utils/connectDB/page";
// import User from "@/utils/models/UserSchema";
// import jwt from "jsonwebtoken"; // Use jwt for creating tokens
// import bcrypt from "bcryptjs"; // Use bcryptjs for consistency with the signup process
// import { NextResponse } from "next/server";

// export async function POST(request) {
//   try {
//     await connectDB();

//     // Parse user credentials from the request body
//     const { email, password } = await request.json();

//     if (!email || !password) {
//       return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
//     }

//     // Find the user by email
//     const user = await User.findOne({ email });
//     if (!user) {
//       return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
//     }

//     // Compare the provided password with the hashed password in the database
//     const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(password, salt);
    
//     const isMatch = await bcrypt.compare(password, hashedPassword);
//     console.log("Entered password:", password);
//     console.log("Stored password hash:", user.password);

//     if (!isMatch) {
//       return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
//     }

//     // Generate a JWT token with the user's ID and email
//     const token = jwt.sign(
//       { id: user._id, email: user.email }, // Payload
//       process.env.JWT_SECRET,             // Secret key
//       { expiresIn: "7d" }                 // Token expiry
//     );

//     return NextResponse.json(
//       {
//         message: "Login successful!",
//         token, // Return the token to the user for authentication
//         user: {
//           id: user._id,
//           email: user.email,
//         }, // Optional: Include user details in the response
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Login Error:", error);
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//   }
// }

import connectDB from "@/utils/connectDB/page";
import User from "@/utils/models/UserSchema";
import jwt from "jsonwebtoken"; // JWT for creating tokens
import bcrypt from "bcryptjs"; // bcryptjs for password hashing
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await connectDB();  // Ensure DB connection

    // Parse user credentials from the request body
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    // Find the user by email in the database
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // Compare the provided password with the hashed password stored in the database
    const isMatch = await bcrypt.compare(password, user.password);  // Compare provided password with the stored hash

    if (!isMatch) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // Generate a JWT token with the user's ID and email
    const token = jwt.sign(
      { id: user._id, email: user.email }, // Payload with user ID and email
      process.env.JWT_SECRET,             // Secret key for signing the JWT
      { expiresIn: "7d" }                 // Token expiration time
    );

    // Respond with the token and user details
    return NextResponse.json(
      {
        message: "Login successful!",
        token, // Return the token for client-side authentication
        user: {
          id: user._id,
          email: user.email,
        }, // Return user details (optional)
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
