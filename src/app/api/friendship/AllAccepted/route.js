import connectDB from '@/utils/connectDB/page'; // Import the MongoDB connection
import Friendship from '@/utils/models/friendship'; // Import the Friendship model

export async function GET(req) {
  try {
    // Ensure the database is connected
    await connectDB();

    // Query MongoDB for friendships with status 'accepted'
    const acceptedFriendships = await Friendship.find({ status: 'accepted' });

    // If friendships are found, return them as JSON
    if (acceptedFriendships.length > 0) {
      return new Response(JSON.stringify(acceptedFriendships), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // If no accepted friendships are found, send a 404 response
    return new Response(
      JSON.stringify({ message: 'No accepted friendships found' }),
      { status: 404, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    // Handle any errors that occur during the request
    console.error('Error fetching accepted friendships:', error);
    return new Response(
      JSON.stringify({ message: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
