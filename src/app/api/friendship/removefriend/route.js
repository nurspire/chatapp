import mongoose from 'mongoose';
import connectDB from '@/utils/connectDB/page';
import Friendship from '@/utils/models/friendship';

export async function DELETE(req) {
  await connectDB();

  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id'); // Friend ID (receiver or requester)

    // Validate the ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return new Response(JSON.stringify({ message: 'Invalid ID format.' }), {
        status: 400,
      });
    }

    // Find and delete the friendship where requester_id or receiver_id matches the ID
    const deletedFriendship = await Friendship.findOneAndDelete({
      $or: [
        { requester_id: id }, // Match the requester
        { receiver_id: id },  // Match the receiver
      ],
    });

    // If no friendship is found, return 404
    if (!deletedFriendship) {
      return new Response(JSON.stringify({ message: 'Friendship not found.' }), {
        status: 404,
      });
    }

    // Return a success response
    return new Response(JSON.stringify({ message: 'Friendship removed successfully.' }), {
      status: 200,
    });
  } catch (error) {
    console.error('Error deleting friendship:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
