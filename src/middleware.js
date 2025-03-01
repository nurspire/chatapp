// import { NextResponse } from "next/server"

// export async function middleware(req) {
//   const url = req.nextUrl
//   const path = url.pathname

//   // Check if the request is for /app or its sub-routes
//   if (path.startsWith("/app")) {
//     // Get the token from the cookies
//     const token = req.cookies.get("token")

//     // If there's no token, redirect to the login page
//     if (!token) {
//       return NextResponse.redirect(new URL("/login", req.url))
//     }

//     // Avoid making repeated calls for assets, API routes, or chat-detail page
//     if (path.startsWith("/app/_next") || path.startsWith("/api") || path === "/app/chat-detail") {
//       return NextResponse.next()
//     }

//     try {
//       // Use the absolute URL for the API call
//       const apiUrl = new URL("/api/chat_user/forhomebtn", req.url)

//       // Make an API call to check if the user exists
//       const response = await fetch(apiUrl, {
//         headers: {
//           Cookie: req.headers.get("cookie") || "",
//         },
//       })

//       if (!response.ok) {
//         throw new Error("API response was not ok")
//       }

//       const data = await response.json()

//       // If no user exists, redirect them to /app/chat-detail
//       if (!data.user) {
//         return NextResponse.redirect(new URL("/app/chat-detail", req.url))
//       }

//       // If user exists, allow access to the requested page
//       return NextResponse.next()
//     } catch (error) {
//       console.error("Error checking user existence:", error)
//       // In case of any error, redirect to chat-detail as a fallback
//       return NextResponse.redirect(new URL("/app/chat-detail", req.url))
//     }
//   }

//   // If the user is not trying to access /app, proceed as normal
//   return NextResponse.next()
// }

// // Define the matcher configuration
// export const config = {
//   matcher: ["/app/:path*"],
// }

import { NextResponse } from "next/server";

export async function middleware(req) {
  const url = req.nextUrl;
  const path = url.pathname;

  // Check if the request is for /app or its sub-routes
  if (path.startsWith("/app")) {
    // Get the token from the cookies
    const token = req.cookies.get("token");

    // If there's no token, redirect to the login page
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // Allow access to the requested page if logged in
    return NextResponse.next();
  }

  // If the user is not trying to access /app, proceed as normal
  return NextResponse.next();
}

// Define the matcher configuration
export const config = {
  matcher: ["/app/:path*"],
};