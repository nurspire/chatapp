import connectDB from "@/utils/connectDB/page";
import ChatUser from "@/utils/models/chatuser";
import jwt from "jsonwebtoken"; // Import jsonwebtoken for JWT handling
import { NextResponse } from 'next/server';

export async function GET(req) {
    try {
      // Step 1: Check for a token in the cookies
      const cookies = req.headers.get("cookie");
      const token = cookies?.split(";").find(cookie => cookie.trim().startsWith("token="))?.split("=")[1];
  
      // Step 2: If token exists, verify the token and fetch a specific user
      if (token) {
        let decoded;
        try {
          decoded = jwt.verify(token, process.env.JWT_SECRET); // Use your JWT secret here
        } catch (error) {
          return new NextResponse(
            JSON.stringify({ user: null }), // Token is invalid or expired
            { status: 200 }
          );
        }
  
        // Step 3: Extract user_id from decoded token
        const user_id = decoded.id;
  
        // Step 4: Connect to the database
        await connectDB();
  
        // Step 5: Check if the user exists with this user_id
        const existingUser = await ChatUser.findOne({ user_id });
  
        if (existingUser) {
          // If user exists, return the user data
          return new NextResponse(
            JSON.stringify({ user: existingUser }), // User found
            { status: 200 }
          );
        } else {
          // If user does not exist, return null
          return new NextResponse(
            JSON.stringify({ user: null }), // User does not exist
            { status: 200 }
          );
        }
      } else {
        // Step 6: If no token exists, fetch all users
        await connectDB();
        const users = await ChatUser.find({});
  
        // Log the fetched users for debugging
        console.log("Fetched users:", users);
  
        // Return all users data
        return NextResponse.json({ message: "Users fetched successfully", users });
      }
    } catch (error) {
      // Step 7: Handle errors
      console.error("Error fetching users or user:", error);
      return new NextResponse(
        JSON.stringify({ error: error.message || "Internal Server Error" }),
        { status: 500 }
      );
    }
  }