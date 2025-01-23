import { Server } from "socket.io";

let io;

export function GET(req, res) {
    if (!io) {
        // Initialize Socket.IO server and attach to Next.js server
        io = new Server(res.socket.server, {
            cors: {
                origin: "*",  // Allow all origins for development (you should adjust this in production)
                methods: ["GET", "POST"]
            },
        });

        // Attach the Socket.IO server to the Next.js server
        res.socket.server.io = io;

        // Listen for socket connections
        io.on("connection", (socket) => {
            console.log("A user connected");

            // Broadcast chat messages to all clients
            socket.on("chat message", (msg) => {
                console.log("Received message:", msg);
                io.emit("chat message", msg); // Broadcast to all connected clients
            });

            // Handle disconnection
            socket.on("disconnect", () => {
                console.log("A user disconnected");
            });
        });
    }
    res.end();
}
