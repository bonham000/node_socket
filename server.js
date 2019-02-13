const express = require('express');
const http = require('http');
// const WebSocket = require('ws');

const app = express();

// Initialize a simple http server
const server = http.createServer(app);

const SocketIO = require('socket.io');
const wss = SocketIO(server, {
    pingInterval: 15000,
    pingTimeout: 30000,
});


// Create a GET / route
app.get('/', (req, res, next) => {
  res.send("WebSocket server is running!");
});

// Initialize the WebSocket server instance
// const wss = new WebSocket.Server({ server }, {
//   pingInterval: 15000,
//   pingTimeout: 30000,
// });

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

// function noop() {}
 
// function heartbeat() {
//   this.isAlive = true;
// }

// Run WebSocket connection
wss.on('connection', (ws) => {

  // ws.isAlive = true;
  // ws.on('pong', heartbeat);

  console.log("Client connected");

  ws.on('message', (message) => {
    console.log(`Received message => ${message}`);
    try {
      const data = JSON.parse(message);
      if (messageIsValid(data)) {
        /**
         * Broadcast to all connected clients
         */
        ws.emit(message);
        // wss.clients.forEach((client) => {
        //   if (client !== ws && client.readyState === WebSocket.OPEN) {
        //     console.log("Broadcast message to connected client...");
        //     client.send(message);
        //   }
        // });
      } else {
        console.log("Message was invalid");
      }
    } catch (err) {
      console.log("Could not parse message!", err);
    }
  });  
});

// const interval = setInterval(function ping() {
//   wss.clients.forEach(function each(ws) {
//     if (ws.isAlive === false) return ws.terminate();
 
//     ws.isAlive = false;
//     ws.ping(noop);
//   });
// }, 30000);

const PORT = process.env.PORT || 9001;

// Start the server
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));