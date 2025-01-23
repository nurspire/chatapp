import connectDB from "@/utils/connectDB/page";
import ChatUser from "@/utils/models/chatuser";
import { NextResponse } from 'next/server';

export async function GET() {
  // Connect to the database
  await connectDB();

  try {
    // Fetch all users
    const users = await ChatUser.find({});

    // Log the fetched users for debugging
    // console.log("Fetched users:", users);

    // Return the users data
    return NextResponse.json({ message: "Users fetched successfully", users });
  } catch (error) {
    console.error("Error fetching users:", error);

    // Return a generic error response
    return NextResponse.json(
      { message: "Error fetching users", error: error.message },
      { status: 500 }
    );
  }
}
