const express = require("express");
const http = require("http");
const SocketIO = require("socket.io");

// Constants
const CONNECTION = "connection";
const MESSAGE = "message";
const UPDATE = "update";
const PORT = process.env.PORT || 9001;

// Create Express app
const app = express();

// Initialize a simple http server
const server = http.createServer(app);

// Initialize SocketIO protocol
const io = SocketIO(server, {
    pingInterval: 15000,
    pingTimeout: 30000,
});

// Helper to validate messages
const messageIsValid = (data) => {
  return (
    data.message &&
    data.message_type &&
    data.message.id &&
    data.message.author &&
    data.message.message &&
    data.message.uuid
  );
};

// Socket handler
const socketHandler = (socket) => {
  console.log("Client connected!");
  socket.on(MESSAGE, (message) => {
    console.log(`Received message => ${message}`);
    try {
      /**
       * Broadcast to all connected clients, if the format is correct
       */
      const data = JSON.parse(message);
      if (messageIsValid(data)) {
        console.log("Broadcasting message to all clients... 🚀");
        io.emit(UPDATE, message);
      } else {
        console.log("Message format was invalid...");
      }
    } catch (err) {
      console.log("Could not parse message!", err);
    }
  });  
}

// Create a simple GET / route
app.get("/", (req, res, next) => {
  res.send("WebSocket server is running!");
});

// Run WebSocket connection
io.on(CONNECTION, socketHandler);

// Start the server
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));