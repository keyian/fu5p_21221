const WebSocket = require("ws");

const websocketServer = (expressServer) => {
  console.log("in websockets");
  const websocketServer = new WebSocket.Server({
    noServer: true
  });

  expressServer.on("upgrade", (request, socket, head) => {
    websocketServer.handleUpgrade(request, socket, head, socket => {
        websocketServer.emit("connection", socket, request);
    }); 
  });

  websocketServer.on("connection", socket => {
      socket.on('message', message => console.log(message));
    }  
  );

  return websocketServer;
};

module.exports = websocketServer;