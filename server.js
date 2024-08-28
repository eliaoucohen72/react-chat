import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// Disable CORS protection by allowing all origins
app.use(cors());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "dist")));

app.get("/ping", (req, res) => {
  res.json({ message: "Pong" });
});

// Handle all other routes and serve the React app
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Create an HTTP server using the Express app
const server = http.createServer(app);

// Configure CORS for Socket.io
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins
    methods: ["GET", "POST"], // Allow these methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allow these headers
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  },
});

// Handle client connections
io.on("connection", (socket) => {
  console.log(`Nouvelle connexion: ${socket.id}`);

  // Listen for messages from the client
  socket.on("CLIENT_MSG", (data) => {
    console.log(`Message reçu de ${socket.id}:`, data);
    // Emit the message to all connected clients
    io.emit("SERVER_MSG", data);
  });

  // Handle client disconnection
  socket.on("disconnect", () => {
    console.log(`Déconnexion: ${socket.id}`);
  });
});

// Start the server and listen on the defined port
server.listen(PORT, () => {
  console.log(`Le serveur tourne sur le port ${PORT}`);
});
