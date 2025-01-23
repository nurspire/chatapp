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

    // Find accepted friend requests where the user is either the requester or the receiver
    const acceptedRequests = await Friendship.find({
      $or: [{ requester_id: userId }, { receiver_id: userId }],
      status: 'accepted',
    })
      .populate('requester_id receiver_id'); // Populate requester and receiver details

    if (acceptedRequests.length === 0) {
      return new Response(JSON.stringify({ message: 'No accepted friend requests' }), { status: 200 });
    }

    // Format the response to match what the UI needs
    const formattedRequests = acceptedRequests.map(request => {
      // Match the current user (who's ID is from the token) with either the requester or receiver
      const matchedUser = request.requester_id._id.toString() === userId
        ? request.receiver_id
        : request.requester_id;

      return {
        user_id: matchedUser._id,
        user_name: matchedUser.user_name,
        picture: matchedUser.picture,
      };
    });

    // Return the formatted list of users
    return new Response(JSON.stringify(formattedRequests), { status: 200 });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), { status: 500 });
  }
}
