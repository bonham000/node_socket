const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', ws => {
  console.log("Client connected");
  
  ws.on('message', message => {
    console.log(`Received message => ${message}`);

    try {
      const data = JSON.parse(message);
      if (data.message_type && data.message) {
        const messageData = data.message;
        if (messageData.id && messageData.author && messageData.message && messageData.uuid) {
          ws.send(message);
        }
      }
    } catch (err) {
      console.log("Could not parse message", err);
    }
  });
});