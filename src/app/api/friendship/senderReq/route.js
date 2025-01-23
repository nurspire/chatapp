// import connectDB from '@/utils/connectDB/page';
// import Friendship from '@/utils/models/friendship';
// import jwt from 'jsonwebtoken';
// import UserSchema from '@/utils/models/UserSchema';

// export async function GET(req) {
//   await connectDB();

//   try {
//     // Extract token from cookies
//     const cookies = req.headers.get('cookie');
//     const token = cookies?.split(';').find(cookie => cookie.trim().startsWith('token='))?.split('=')[1];

//     if (!token) {
//       return new Response(JSON.stringify({ message: 'No token provided' }), { status: 401 });
//     }

//     // Verify and decode token
//     let decoded;
//     try {
//       decoded = jwt.verify(token, process.env.JWT_SECRET);
//     } catch (error) {
//       return new Response(JSON.stringify({ message: 'Invalid or expired token' }), { status: 401 });
//     }

//     const userId = decoded.id; // User ID from decoded JWT token
//     console.log("Token that is deocded is",userId);

//     // Fetch accepted friendships
//     const acceptedResponse = await fetch('http://localhost/api/friendship/accepted');
//     const acceptedData = await acceptedResponse.json();

//     if (!acceptedResponse.ok || !Array.isArray(acceptedData)) {
//       return new Response(JSON.stringify({ message: 'Failed to fetch accepted friendships' }), { status: acceptedResponse.status });
//     }

//     // Filter accepted friendships where userId matches requester_id
//     const matchedFriendships = acceptedData.filter(friendship => friendship.requester_id === userId);
//     console.log("matchedFriendships that is matched is",matchedFriendships);
//     if (matchedFriendships.length === 0) {
//       return new Response(JSON.stringify({ message: 'No matched accepted friendships' }), { status: 200 });
//     }

//     // Fetch all users
//     const usersResponse = await fetch('http://localhost/api/chat_user/getallusers');
//     const usersData = await usersResponse.json();
//     console.log("All Users in get",usersData);
    
//     if (!usersResponse.ok || !Array.isArray(usersData)) {
//       return new Response(JSON.stringify({ message: 'Failed to fetch users' }), { status: usersResponse.status });
//     }

//     // Map matched users
//     const matchedUsers = matchedFriendships.map(friendship => {
//       const user = usersData.find(u => u.user_id === friendship.receiver_id);
//       console.log("User Whose Id is Matched",user);
      
//       if (!user) {
//         console.error(`No user found for receiver_id: ${friendship.receiver_id}`);
//       }
//       return user ? { id: user.user_id, user_name: user.user_name, picture: user.picture } : null;
//     }).filter(Boolean);

//     if (matchedUsers.length === 0) {
//       return new Response(JSON.stringify({ message: 'No matched users found' }), { status: 200 });
//     }

//     // Return matched users
//     return new Response(JSON.stringify(matchedUsers), { status: 200 });
//   } catch (error) {
//     return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), { status: 500 });
//   }
// }

import connectDB from '@/utils/connectDB/page';
import Friendship from '@/utils/models/friendship';
import jwt from 'jsonwebtoken';
import UserSchema from '@/utils/models/UserSchema';

export async function GET(req) {
  await connectDB();

  try {
    // console.log("Request received");

    // Extract token from cookies
    const cookies = req.headers.get('cookie');
    // console.log("Cookies extracted:", cookies);

    const token = cookies?.split(';').find(cookie => cookie.trim().startsWith('token='))?.split('=')[1];
    // console.log("Token extracted:", token);

    if (!token) {
      console.log("No token provided");
      return new Response(JSON.stringify({ message: 'No token provided' }), { status: 401 });
    }

    // Verify and decode token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      // console.log("Token decoded successfully:", decoded);
    } catch (error) {
      console.log("Token verification failed:", error.message);
      return new Response(JSON.stringify({ message: 'Invalid or expired token' }), { status: 401 });
    }

    const userId = decoded.id; // User ID from decoded JWT token
    // console.log("User ID from decoded token:", userId);

    // Fetch accepted friendships
    const acceptedResponse = await fetch(`${process.env.BASE_URL}/api/friendship/AllAccepted`);
    // console.log("Accepted friendships fetch response status:", acceptedResponse.status);

    const acceptedData = await acceptedResponse.json();
    // console.log("Accepted friendships data received:", acceptedData);

    if (!acceptedResponse.ok || !Array.isArray(acceptedData)) {
      console.log("Failed to fetch accepted friendships or invalid data format");
      return new Response(JSON.stringify({ message: 'Failed to fetch accepted friendships' }), { status: acceptedResponse.status });
    }

    // Filter accepted friendships where userId matches requester_id
    const matchedFriendships = acceptedData.filter(friendship => friendship.requester_id === userId);
    // console.log("Matched Friendships for user:", matchedFriendships);

    if (matchedFriendships.length === 0) {
      console.log("No matched accepted friendships found");
      return new Response(JSON.stringify({ message: 'No matched accepted friendships' }), { status: 200 });
    }

    // Fetch all users using BASE_URL
    const usersResponse = await fetch(`${process.env.BASE_URL}/api/chat_user/getallusers`);
    // console.log("All users fetch response status:", usersResponse.status);
    
    const usersData = await usersResponse.json();
    // console.log("Users data received:", usersData);
    
    // Check if the response is okay and usersData.users is an array
    if (!usersResponse.ok || !Array.isArray(usersData.users)) {
      console.log("Failed to fetch users or invalid data format");
      return new Response(JSON.stringify({ message: 'Failed to fetch users' }), { status: usersResponse.status });
    }
    
    // If the users array is valid, proceed
    // console.log("Users fetched successfully:", usersData.users);
    

    // Map matched users
// Map matched users
const matchedUsers = matchedFriendships.map(friendship => {
    // Access the users array from usersData
    const user = usersData.users.find(u => u.user_id === friendship.receiver_id);
    
    // console.log("User found for receiver_id:", friendship.receiver_id, user);
  
    if (!user) {
      console.error(`No user found for receiver_id: ${friendship.receiver_id}`);
    }
  
    // Return the matched user if found, otherwise null
    return user ? { id: user.user_id, user_name: user.user_name, picture: user.picture } : null;
  }).filter(Boolean); // Filter out null values
  
  // Log matched users
  // console.log("Matched users after filtering:", matchedUsers);
  
  if (matchedUsers.length === 0) {
    console.log("No matched users found");
    return new Response(JSON.stringify({ message: 'No matched users found' }), { status: 200 });
  }
  
  // Return matched users
  // console.log("Returning matched users:", matchedUsers);
  return new Response(JSON.stringify(matchedUsers), { status: 200 });
  
  } catch (error) {
    console.error("Error during the GET request:", error);
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), { status: 500 });
  }
}
