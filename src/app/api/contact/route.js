import { NextResponse } from "next/server";
import Contact from "@/app/contact/page";
import connectDB from "@/utils/connectDB/page";

export async function POST(req) {
  try {
    await connectDB();
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const newContact = new Contact({ name, email, message });
    await newContact.save();

    return NextResponse.json({ success: true, message: "Message sent successfully" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
