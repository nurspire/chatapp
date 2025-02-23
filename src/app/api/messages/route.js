import connectDB from '@/utils/connectDB/page';
import { NextResponse } from 'next/server';
import Message from '@/utils/models/message';

export async function DELETE(request) {
  try {
    await connectDB();

    const { messageIds, userId, deleteForEveryone } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    if (!messageIds || !Array.isArray(messageIds)) {
      return NextResponse.json({ error: 'Invalid message IDs' }, { status: 400 });
    }

    if (deleteForEveryone) {
      // Delete messages for everyone (only sender can do this)
      await Message.deleteMany({ _id: { $in: messageIds }, sender: userId });
    } else {
      // Delete messages for the current user only
      const messages = await Message.find({ _id: { $in: messageIds } });

      for (const message of messages) {
        if (message.sender.toString() === userId) {
          message.deletedForSender = true;
        } else if (message.receiver.toString() === userId) {
          message.deletedForReceiver = true;
        }
        await message.save();
      }
    }

    return NextResponse.json({ message: 'Messages deleted successfully' });
  } catch (error) {
    console.error('Error deleting messages:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}