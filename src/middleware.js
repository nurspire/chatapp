// import { NextResponse } from 'next/server';

// export async function middleware(req) {
//   const url = req.nextUrl;
//   const path = url.pathname;

//   // Get the token from the cookies
//   const token = req.cookies.get('token');

//   // Check if the request is for /app or its sub-routes
//   if (path.startsWith('/app')) {
//     // If there's no token, redirect to the login page
//     if (!token) {
//       return NextResponse.redirect(new URL('/login', req.url)); // Redirect to login or any desired page
//     }

//     // Avoid making repeated calls for assets or already authenticated API routes
//     if (path.startsWith('/app/_next') || path.startsWith('/api')) {
//       return NextResponse.next(); // Skip for static files and API routes
//     }

//     try {
//       // Make a single API call to check user existence if necessary
//       const response = await fetch(`${process.env.BASE_URL}/api/chat_user/forhomebtn`, {
//         headers: {
//           'Cookie': req.headers.get('cookie'), // Pass cookies if needed
//         },
//       });

//       if (!response.ok) {
//         // Redirect if the user does not exist
//         return NextResponse.redirect(new URL('/app/chat-detail', req.url));
//       }

//       const data = await response.json();

//       // If no user exists, redirect them to /app/chat-detail
//       if (!data.user) {
//         return NextResponse.redirect(new URL('/app/chat-detail', req.url));
//       }
//     } catch (error) {
//       console.error('Error checking user existence:', error);
//       return NextResponse.redirect(new URL('/app/chat-detail', req.url));
//     }
//   }

//   // If the user is not trying to access /app, proceed as normal
//   return NextResponse.next();
// }

// export const config = {
//   matcher: ['/app/:path*'], // Apply this middleware to /app and its sub-routes
// };


import { NextResponse } from 'next/server';

export async function middleware(req) {
  const url = req.url;

  // Check if the user is trying to access the /app route
  if (url.includes('/app')) {
    try {
      // Make an API call to check if the user exists
      const response = await fetch(`${process.env.BASE_URL}/api/chat_user/forhomebtn`, {
        headers: {
          'Cookie': req.headers.get('cookie'), // Pass cookies if needed
        },
      });

      if (!response.ok) {
        // If the response is not okay, the user does not exist
        return NextResponse.redirect(new URL('/app/chat-detail', req.url));
      }

      const data = await response.json();

      // If no user exists, redirect them to /app/chat-detail
      if (!data.user) {
        return NextResponse.redirect(new URL('/app/chat-detail', req.url));
      }
    } catch (error) {
      console.error('Error checking user existence:', error);
      return NextResponse.redirect(new URL('/app/chat-detail', req.url));
    }
  }

  // If the user is not trying to access /app, proceed as normal
  return NextResponse.next();
}

export const config = {
  matcher: ['/app'], // Apply this middleware to the /app route and its sub-routes
};
