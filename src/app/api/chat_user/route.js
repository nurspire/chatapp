// import connectDB from "@/utils/connectDB/page";
// import ChatUser from "@/utils/models/chatuser";

// export const POST = async (req) => {
//   try {
//     const { user_name, picture } = await req.json();
//     console.log("Payload received:", { user_name, picture }); // Log payload

//     if (!user_name || !picture) {
//       return new Response(
//         JSON.stringify({ error: "Username and picture are required" }),
//         { status: 400 }
//       );
//     }

//     await connectDB();
//     const newUser = await ChatUser.create({ user_name, picture });
//     console.log("User created:", newUser); // Log saved user

//     return new Response(
//       JSON.stringify({ message: "User created successfully", user: newUser }),
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("Error creating user:", error);
//     return new Response(
//       JSON.stringify({ error: error.message || "Internal Server Error" }),
//       { status: 500 }
//     );
//   }
// };

import connectDB from "@/utils/connectDB/page";
import ChatUser from "@/utils/models/chatuser";
import jwt from "jsonwebtoken"; // Import jsonwebtoken for JWT handling
import { NextResponse } from 'next/server';

export const POST = async (req) => {
  try {
    const { user_name, picture } = await req.json();
    console.log("Payload received:", { user_name, picture }); // Log payload

    // Check if the necessary data exists
    if (!user_name || !picture) {
      return new Response(
        JSON.stringify({ error: "Username and picture are required" }),
        { status: 400 }
      );
    }

    // Extract token from cookies
    const cookies = req.headers.get("cookie");
    // console.log("Cookies received:", cookies); // Log cookies to inspect them

    const token = cookies?.split(";").find(cookie => cookie.trim().startsWith("token="))?.split("=")[1];
    console.log("Extracted Token:", token); // Log the extracted token

    if (!token) {
      return new Response(
        JSON.stringify({ error: "Authorization token is required" }),
        { status: 401 }
      );
    }

    // Verify and decode the JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET); // Use your JWT secret here
      console.log("Decoded Token:", decoded); // Log the decoded token
    } catch (error) {
      return new Response(
        JSON.stringify({ error: "Invalid or expired token" }),
        { status: 401 }
      );
    }

    // Get user_id (which is actually 'id' in the decoded token)
    const user_id = decoded.id; // Use 'id' instead of 'user_id'
    // console.log("Extracted user_id from token:", user_id); // Log the user_id

    if (!user_id) {
      return new Response(
        JSON.stringify({ error: "User ID not found in token" }),
        { status: 400 }
      );
    }

    // Connect to the database
    await connectDB();

    // Check if the user_id already exists in the database
    const existingUser = await ChatUser.findOne({ user_id });
    if (existingUser) {
      return new Response(
        JSON.stringify({ error: "User ID already exists" }),
        { status: 400 }
      );
    }

    // Create a new user with the user_id from the token
    const newUser = await ChatUser.create({ user_name, picture, user_id });
    console.log("User created:", newUser); // Log saved user

    return new Response(
      JSON.stringify({ message: "User created successfully", user: newUser }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal Server Error" }),
      { status: 500 }
    );
  }
};


// Comparing token id and get all users id and compare them and return matched results
export async function GET(req) {
  // Extract token from cookies
  const cookies = req.headers.get("cookie");
  // console.log("Cookies received:", cookies); // Log cookies to inspect them

  const token = cookies?.split(";").find(cookie => cookie.trim().startsWith("token="))?.split("=")[1];
  // console.log("Extracted Token:", token); // Log the extracted token

  if (!token) {
    return new Response(
      JSON.stringify({ error: "Authorization token is required" }),
      { status: 401 }
    );
  }

  // Verify and decode the JWT token
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET); // Use your JWT secret here
    // console.log("Decoded Token:", decoded); // Log the decoded token
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Invalid or expired token" }),
      { status: 401 }
    );
  }

  // Get user_id from the decoded token
  const user_id = decoded.id; // 'id' is used here, adjust if your token structure is different
  // console.log("Extracted user_id from token:", user_id); // Log the user_id

  if (!user_id) {
    return new Response(
      JSON.stringify({ error: "User ID not found in token" }),
      { status: 400 }
    );
  }

  try {
    // Connect to the database
    await connectDB();

    // Fetch all users from the database
    const users = await ChatUser.find({});
    
    // console.log("Fetched users:", users); // Log all users for debugging

    // Find the user that matches the user_id from the token
    const user = users.find(u => u.user_id === user_id);

    if (!user) {
      return new Response(
        JSON.stringify({ error: "User not found" }),
        { status: 404 }
      );
    }

    // console.log("Matched user:", user);

    // Return the matched user's data
    return new Response(
      JSON.stringify({ message: "User fetched successfully", user }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching user:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal Server Error" }),
      { status: 500 }
    );
  }
}



export const PUT = async (req) => {
  try {
    // Get the data sent in the request body
    const { user_id, user_name, picture } = await req.json();
    console.log("Payload received:", { user_id, user_name, picture });

    // Validate if the necessary fields exist
    if (!user_id || !user_name || !picture) {
      return new NextResponse(
        JSON.stringify({ error: "User ID, username, and picture are required" }),
        { status: 400 }
      );
    }

    // Connect to the database
    await connectDB();

    // Find the existing user by user_id
    const existingUser = await ChatUser.findOne({ user_id });
    if (!existingUser) {
      return new NextResponse(
        JSON.stringify({ error: "User not found" }),
        { status: 404 }
      );
    }

    // Update the user with the new data
    existingUser.user_name = user_name;
    existingUser.picture = picture;

    // Save the updated user to the database
    await existingUser.save();
    console.log("User updated:", existingUser);

    // Return the updated user data
    return new NextResponse(
      JSON.stringify({ message: "User updated successfully", user: existingUser }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user:", error);
    return new NextResponse(
      JSON.stringify({ error: error.message || "Internal Server Error" }),
      { status: 500 }
    );
  }
};


export async function DELETE(req) {
    try {
        const { user_id } = await req.json();  // Assuming the user ID is passed in the request body
        
        // Connect to the database
        await connectDB();

        // Delete the user from the database
        const deletedUser = await ChatUser.findOneAndDelete({ user_id });

        if (!deletedUser) {
            return new NextResponse(
                JSON.stringify({ message: 'User not found or already deleted' }),
                { status: 404 }
            );
        }

        // Return success response
        return new NextResponse(
            JSON.stringify({ message: 'User deleted successfully' }),
            { status: 200 }
        );
    } catch (error) {
        console.error('Error deleting user:', error);
        return new NextResponse(
            JSON.stringify({ error: 'Internal Server Error' }),
            { status: 500 }
        );
    }
}
