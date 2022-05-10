import express from 'express';
import serveIndex from 'serve-index';
import path from 'path';
import http from "http";
import cors from 'cors';
import { createServer } from 'http';
import _config from "./Config/settings";
import { Server, LobbyRoom, RelayRoom } from 'colyseus';
import bodyParser from "body-parser";
import { routes } from "./Routes";
import { SocketRoom } from "./rooms/GameRoom";
import { monitor } from "@colyseus/monitor";
import { responsePayment } from "./Controllers/Paytm/service";
import { PaytmController } from "./Controllers/Paytm/Paytm.Controller";
import Config from './Config/settings';
import * as basicAuth from "express-basic-auth";
// Import demo room handlers
// import { ChatRoom } from "./rooms/01-chat-room";
// import { StateHandlerRoom } from "./rooms/02-state-handler";
// import { AuthRoom } from "./rooms/03-auth";
// import { ReconnectionRoom } from './rooms/04-reconnection';
// import { CustomLobbyRoom } from './rooms/07-custom-lobby-room';
// const monitor = require("@colyseus/monitor");
const port = Number(process.env.PORT || 8000) + Number(process.env.NODE_APP_INSTANCE || 0);
const app = express();

app.use(cors());
app.use(express.json());


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/paywithpaytmresponse", (req, res) => {
    responsePayment(req.body).then(

      success => {
        PaytmController.paymentStatus(success, res);
      },

      error => {
        res.send(error);
      }
    );
  });

  app.use('/api/v1', routes());

const frontendDirectory = path.resolve(__dirname, "static");
const server = http.createServer(app);

// Attach WebSocket Server on HTTP Server.
const gameServer = new Server({
  server: createServer(app),
  express: app,
  pingInterval:1000,
  pingMaxRetries:2000
});

// register your room handlers
gameServer.define('5', SocketRoom).filterBy(['maxClients']);
gameServer.define('10', SocketRoom).filterBy(['maxClients']);
gameServer.define('20', SocketRoom).filterBy(['maxClients']);
gameServer.define('30', SocketRoom).filterBy(['maxClients']);
gameServer.define('50', SocketRoom).filterBy(['maxClients']);
gameServer.define('100', SocketRoom).filterBy(['maxClients']);
gameServer.define('150', SocketRoom).filterBy(['maxClients']);
gameServer.define('200', SocketRoom).filterBy(['maxClients']);
gameServer.define('250', SocketRoom).filterBy(['maxClients']);
gameServer.define('300', SocketRoom).filterBy(['maxClients']);
gameServer.define('350', SocketRoom).filterBy(['maxClients']);
gameServer.define('400', SocketRoom).filterBy(['maxClients']);
gameServer.define('450', SocketRoom).filterBy(['maxClients']);
gameServer.define('500', SocketRoom).filterBy(['maxClients']);
gameServer.define('1000', SocketRoom).filterBy(['maxClients']);
gameServer.define('1500', SocketRoom).filterBy(['maxClients']);
gameServer.define('2000', SocketRoom).filterBy(['maxClients']);
gameServer.define('2500', SocketRoom).filterBy(['maxClients']);
gameServer.define('3000', SocketRoom).filterBy(['maxClients']);
gameServer.define('3500', SocketRoom).filterBy(['maxClients']);
gameServer.define('4000', SocketRoom).filterBy(['maxClients']);
gameServer.define('4500', SocketRoom).filterBy(['maxClients']);
gameServer.define('5000', SocketRoom).filterBy(['maxClients']);
// Define "lobby" room
gameServer.define("lobby", LobbyRoom);

// Define "relay" room
// gameServer.define("relay", RelayRoom, { maxClients: 4 })
//     .enableRealtimeListing();

// Define "chat" room
// gameServer.define("chat", ChatRoom)
//     .enableRealtimeListing();

// Register ChatRoom with initial options, as "chat_with_options"
// onInit(options) will receive client join options + options registered here.
// gameServer.define("chat_with_options", ChatRoom, {
//     custom_options: "you can use me on Room#onCreate"
// });

// Define "state_handler" room
// gameServer.define("state_handler", StateHandlerRoom)
//     .enableRealtimeListing();

// Define "auth" room
// gameServer.define("auth", AuthRoom)
//     .enableRealtimeListing();

// Define "reconnection" room
// gameServer.define("reconnection", ReconnectionRoom)
//     .enableRealtimeListing();

// Define "custom_lobby" room
// gameServer.define("custom_lobby", CustomLobbyRoom);

// (optional) attach web monitoring panel

app.post("/paywithpaytmresponse", (req, res) => {
    responsePayment(req.body).then(

      success => {
        PaytmController.paymentStatus(success, res);
      },

      error => {
        res.send(error);
      }
    );
  });

app.use("/colyseus" + _config.superSecret , monitor());
// app.use('/colyseus', monitor());

gameServer.onShutdown(function(){
  console.log(`game server is going down.`);
});

app.use('/', serveIndex(path.join(__dirname, "static"), {'icons': true}))
app.use('/', express.static(path.join(__dirname, "static")));

gameServer.listen(port);

// process.on("uncaughtException", (e) => {
//   console.log(e.stack);
//   process.exit(1);
// });

console.log(`Listening on http://localhost:${ port }`);
