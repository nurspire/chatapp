import connectDB from "@/utils/connectDB/page";
import CallLog from "@/utils/models/callLog";
import { NextResponse } from "next/server";

export async function GET() {
  // Connect to the database
  await connectDB();

  try {
    // Fetch all call logs
    const callLogs = await CallLog.find({});
    return NextResponse.json({ message: "Call logs fetched successfully", callLogs });
  } catch (error) {
    console.error("Error fetching call logs:", error);

    // Return a generic error response
    return NextResponse.json(
      { message: "Error fetching call logs", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  // Connect to the database
  await connectDB();

  try {
    const { id } = await req.json(); // Parse the request body for the ID

    if (id) {
      // Delete a specific call log by ID
      await CallLog.findByIdAndDelete(id);
      return NextResponse.json({ message: `Call log with ID ${id} deleted successfully` });
    } else {
      // Delete all call logs
      await CallLog.deleteMany({});
      return NextResponse.json({ message: "All call logs deleted successfully" });
    }
  } catch (error) {
    console.error("Error deleting call logs:", error);

    // Return a generic error response
    return NextResponse.json(
      { message: "Error deleting call logs", error: error.message },
      { status: 500 }
    );
  }
}
