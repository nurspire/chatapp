import connectDB from '@/utils/connectDB/page';
import Friendship from '@/utils/models/friendship';
import jwt from 'jsonwebtoken'; // For decoding JWT tokens
import { NextResponse } from 'next/server';

export async function POST(req) {
  await connectDB();

  try {
    // Extract the token from the Authorization header
    const token = req.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      console.error('No token provided');
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    // Decode the token to extract requester_id
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      console.error('Token verification failed:', err.message);
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const requester_id = decodedToken.id; // Use `id` from token
    if (!requester_id) {
      console.error('Requester ID not found in token');
      return NextResponse.json({ error: 'Invalid token: Missing requester ID' }, { status: 401 });
    }

    // Get the receiver_id from the request body
    const { receiver_id } = await req.json();
    if (!receiver_id) {
      console.error('Receiver ID missing in request');
      return NextResponse.json({ error: 'Receiver ID is required' }, { status: 400 });
    }

    console.log('Requester ID:', requester_id, 'Receiver ID:', receiver_id);

    // Check if the requester is sending a request to themselves
    if (requester_id === receiver_id) {
      return NextResponse.json({ error: 'You cannot send a friend request to yourself' }, { status: 400 });
    }

    // Check if the friendship already exists
    const existingFriendship = await Friendship.findOne({ requester_id, receiver_id });
    if (existingFriendship) {
      return NextResponse.json({ message: 'Friendship already exists.' }, { status: 400 });
    }

    // Create a new friendship record
    const friendship = await Friendship.create({ requester_id, receiver_id });
    return NextResponse.json(friendship, { status: 201 });
  } catch (error) {
    console.error('Error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}



// export async function GET(req) {
//   await connectDB();

//   try {
//     const url = new URL(req.url);
//     const userId = url.searchParams.get('userId');

//     const friendships = await Friendship.find({
//       $or: [{ requester_id: userId }, { receiver_id: userId }],
//     }).populate('requester_id receiver_id');

//     return new Response(JSON.stringify(friendships), { status: 200 });
//   } catch (error) {
//     return new Response(JSON.stringify({ error: error.message }), { status: 500 });
//   }
// }

export async function GET(req) {
  try {
    // Extract token from cookies
    const cookies = req.headers.get("cookie");
    const token = cookies?.split(";").find(cookie => cookie.trim().startsWith("token="))?.split("=")[1];

    if (!token) {
      return new Response(JSON.stringify({ error: "Authorization token is required" }), { status: 401 });
    }

    // Verify and decode the JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return new Response(JSON.stringify({ error: "Invalid or expired token" }), { status: 401 });
    }

    const user_id = decoded.id;

    if (!user_id) {
      return new Response(JSON.stringify({ error: "User ID not found in token" }), { status: 400 });
    }

    // Connect to the database
    await connectDB();

    // Extract query parameters
    const url = new URL(req.url);
    const username = url.searchParams.get("username");

    if (username) {
      // Search for user by username
      const user = await ChatUser.findOne({ username });

      if (!user) {
        return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
      }

      return new Response(JSON.stringify({ message: "User fetched successfully", user }), { status: 200 });
    }

    // Fetch user data by user_id (original functionality)
    const user = await ChatUser.findOne({ user_id });

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: "User fetched successfully", user }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message || "Internal Server Error" }), { status: 500 });
  }
}


export async function PUT(req) {
  await connectDB();

  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    const { status } = await req.json();

    if (!['pending', 'accepted', 'rejected', 'blocked'].includes(status)) {
      return new Response(JSON.stringify({ message: 'Invalid status.' }), {
        status: 400,
      });
    }

    const updatedFriendship = await Friendship.findByIdAndUpdate(
      id,
      { status, updated_at: Date.now() },
      { new: true }
    );

    if (!updatedFriendship) {
      return new Response(JSON.stringify({ message: 'Friendship not found.' }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(updatedFriendship), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function DELETE(req) {
  await connectDB();

  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    const deletedFriendship = await Friendship.findByIdAndDelete(id);

    if (!deletedFriendship) {
      return new Response(JSON.stringify({ message: 'Friendship not found.' }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify({ message: 'Friendship deleted successfully.' }), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
