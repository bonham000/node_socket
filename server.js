const express = require("express");
const http = require("http");
const SocketIO = require("socket.io");

const app = express();

// Initialize a simple http server
const server = http.createServer(app);

const io = SocketIO(server, {
    pingInterval: 15000,
    pingTimeout: 30000,
});

// Create a GET / route
app.get("/", (req, res, next) => {
  res.send("WebSocket server is running!");
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

// Run WebSocket connection
io.on("connection", (socket) => {
  console.log("Client connected!");

  socket.on("message", (message) => {
    console.log(`Received message => ${message}`);
    try {
      /**
       * Broadcast to all connected clients, if the format is correct
       */
      const data = JSON.parse(message);
      if (messageIsValid(data)) {
        console.log("Broadcasting message to all clients... 🚀");
        io.emit("message", message);
      } else {
        console.log("Message format was invalid...");
      }
    } catch (err) {
      console.log("Could not parse message!", err);
    }
  });  
});

const PORT = process.env.PORT || 9001;

// Start the server
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));