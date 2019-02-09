const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();

// Initialize a simple http server
const server = http.createServer(app);

// Create a GET / route
app.get('/', function(req, res, next){
  res.send("Socket server is running...");
});

// Initialize the WebSocket server instance
const wss = new WebSocket.Server({ server });

// Run WebSocket connection
wss.on('connection', (ws) => {
  console.log("Client connected");
  
  ws.on('message', function(message) {
    console.log(`Received message => ${message}`);

    try {
      const data = JSON.parse(message);
      if (data.message_type && data.message) {
        const messageData = data.message;
        if (messageData.id && messageData.author && messageData.message && messageData.uuid) {
          /**
           * Broadcast to all connected clients
           */
          wss.clients.forEach(function each(client) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
              client.send(message);
            }
          });
        }
      }
    } catch (err) {
      console.log("Could not parse message", err);
    }
  });  
});

const PORT = process.env.PORT || 9001;

// Start the server
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));