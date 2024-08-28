import dotenv from "dotenv";
import express, { Application } from "express";
import http from "http";
import path from "path";
import { Server } from "socket.io";

const ENV = dotenv.config().parsed;
const isProduction = ENV.NODE_ENV === "production";

// Define o caminho do index.html dependendo do ambiente
const filePath = isProduction
  ? path.join(__dirname, "../src", "index.html")
  : path.join(__dirname, "src", "index.html");

class App {
  private app: Application;
  private http: http.Server;
  private io: Server;

  constructor() {
    this.app = express();
    this.http = http.createServer(this.app);
    this.io = new Server(this.http);
    this.listenSocket();
    this.setupRoutes();
  }

  listenServer() {
    this.http.listen(ENV!.PORT, () =>
      console.log("Servidor Rodando => http://localhost:3000")
    );
  }

  listenSocket() {
    this.io.on("connection", (socket: any) => {
      console.log(socket.id);

      socket.on("register", (user: any) => {
        socket.userId = user;
        console.log(`Usuário Registrado: ${user}`);
      });

      socket.on("message", (msg: any) => {
        this.io.emit("message", `${socket.userId}: ${msg}`);
      });
    });
  }

  setupRoutes() {
    this.app.get("/chat", (_req, res) => {
      res.sendFile(filePath);
    });
    this.app.get("/", (_req, res) => {
      console.log("TESTE");
      res.send({ success: true });
    });
  }
}

const app = new App();

app.listenServer();
