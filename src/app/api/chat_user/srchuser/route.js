import connectDB from "@/utils/connectDB/page";
import ChatUser from "@/utils/models/chatuser";
// import jwt from "jsonwebtoken"; // Import jsonwebtoken for JWT handling
import { NextResponse } from 'next/server';

export async function GET(request) {
  // Connect to the database
  await connectDB();

  try {
    // Get the search query from the request URL
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");

    if (!username) {
      return NextResponse.json(
        { message: "Username query parameter is required" },
        { status: 400 }
      );
    }

    // Search for the user by username
    const user = await ChatUser.findOne({ user_name: username });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // Return the found user
    return NextResponse.json({
      message: "User found successfully",
      user,
    });
  } catch (error) {
    console.error("Error searching for user:", error);

    // Return a generic error response
    return NextResponse.json(
      { message: "Error searching for user", error: error.message },
      { status: 500 }
    );
  }
}
