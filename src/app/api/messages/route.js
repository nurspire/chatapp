import connectDB from "@/utils/connectDB/page";
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  text: { type: String, required: true },
  sender: { type: String, required: true },
  receiver: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);

export async function GET() {
  try {
    await connectDB();
    const messages = await Message.find().sort({ timestamp: -1 });
    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

