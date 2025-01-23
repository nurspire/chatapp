// // pages/api/users.js
// import connectDB from '@/utils/connectDB/page';
// import User from '@/utils/models/UserSchema';
// import { NextResponse } from 'next/server';

// export async function GET(request) {
//     // Connect to the database
//     await connectDB();
//     try {
//         const users = await User.find({});
//         console.log(users)
//         return NextResponse.json({message:"This is the data", users})
//     } catch (error) {
//         console.error('Error fetching users:', error);
//     }
// };

import connectDB from '@/utils/connectDB/page';
import User from '@/utils/models/UserSchema';
import { NextResponse } from 'next/server';

export async function GET(request) {
  // Connect to the database
  await connectDB();

  try {
    // Parse the query parameters from the request
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id'); // Extract 'id' from the query parameters

    if (userId) {
      // Fetch a single user by id
      const user = await User.findOne({ id: userId });
      console.log("Uset Found By Id :", user);
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      return NextResponse.json({ message: 'User found', user });
    }

    // If no 'id' query parameter is provided, fetch all users
    const users = await User.find({});
    console.log("All Fetched users:", users);
    
    
    return NextResponse.json({ message: 'All users fetched', users });
    
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users', details: error.message },
      { status: 500 }
    );
  }
}
