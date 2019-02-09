const express = require('express');
const app = express();
const expressWs = require('express-ws')(app);
 
app.get('/', function(req, res, next){
  res.send("Socket server is running...");
});
 
app.ws('/', function(ws, req) {
  console.log("Client connected");
  
  ws.on('message', function(msg) {
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
 
const PORT = 9001;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));