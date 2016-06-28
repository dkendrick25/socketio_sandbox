var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

// connection event is triggered when the io() is called
// on the client side
io.on('connection', function(clientSocket){
  console.log('a user connected');

  clientSocket.on('client-join', function(username) {
    clientSocket.username = username;
    clientSocket.broadcast.emit('join', username);
  });
  // disconnect event is triggered when the user closes
  // the browser tab, for example
  clientSocket.on('disconnect', function() {
    io.emit('leave', clientSocket.username);
  });

  // listen for chat messages
  clientSocket.on('message-to-server', function(msg){
    clientSocket.broadcast.emit('message-to-client', msg);
  });

  clientSocket.on('start-type', function(username) {
    clientSocket.broadcast.emit('start-type', username);
  });

  clientSocket.on('end-type', function(username) {
    clientSocket.broadcast.emit('end-type', username);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
