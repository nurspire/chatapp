// api/friendship/pending.js

import connectDB from '@/utils/connectDB/page';
import Friendship from '@/utils/models/friendship';
import jwt from 'jsonwebtoken';

export async function GET(req) {
  await connectDB();

  try {
    // Extract token from cookies
    const cookies = req.headers.get('cookie');
    const token = cookies?.split(';').find(cookie => cookie.trim().startsWith('token='))?.split('=')[1];

    if (!token) {
      return new Response(JSON.stringify({ message: 'No token provided' }), { status: 401 });
    }

    // Verify and decode token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return new Response(JSON.stringify({ message: 'Invalid or expired token' }), { status: 401 });
    }

    const userId = decoded.id; // User ID from decoded JWT token

    // Find pending friend requests where the user is the receiver
    const pendingRequests = await Friendship.find({
      receiver_id: userId,
      status: 'pending',
    }).populate('requester_id receiver_id'); // Populate requester and receiver details

    if (pendingRequests.length === 0) {
      return new Response(JSON.stringify({ message: 'No pending friend requests' }), { status: 200 });
    }

    // Return the pending requests
    return new Response(JSON.stringify(pendingRequests), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), { status: 500 });
  }
}
