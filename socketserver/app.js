var createError = require('http-errors');
var express = require('express');
var path = require('path');
var http = require('http');
const WebSocket = require('ws');
//Create express app
var app = express();

var port = 8080;
app.set('port', port);

var server = http.createServer(app);

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {

    //connection is up, let's add a simple simple event
    ws.on('message', (message) => {
      message = JSON.parse(message);
      console.log(message);
      if (message.type === 'register'){
        message.avatar = Math.floor((Math.random() * 100) + 1);
        ws.send(JSON.stringify({type: 'assign', name: message.name, avatar: message.avatar}));
      }else if(message.type === 'message'){
        wss.clients.forEach(function each(client) {
            client.send(JSON.stringify(message));
        });
      }
    });

    //send immediatly a feedback to the incoming connection    
    ws.send(JSON.stringify({msg:'Hi there, I am a WebSocket server'}));
});

server.listen(port);

module.exports = app;
