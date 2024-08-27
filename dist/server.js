"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const ENV = dotenv_1.default.config().parsed;
class App {
    constructor() {
        this.app = (0, express_1.default)();
        this.http = http_1.default.createServer(this.app);
        this.io = new socket_io_1.Server(this.http);
        this.listenSocket();
        this.setupRoutes();
    }
    listenServer() {
        this.http.listen(ENV.PORT, () => console.log("Servidor Rodando => http://localhost:3000"));
    }
    listenSocket() {
        this.io.on("connection", (socket) => {
            console.log(socket.id);
            socket.on("register", (user) => {
                socket.userId = user;
                console.log(`Usuário Registrado: ${user}`);
            });
            socket.on("message", (msg) => {
                this.io.emit("message", `${socket.userId}: ${msg}`);
            });
        });
    }
    setupRoutes() {
        this.app.get("/", (_req, res) => {
            res.sendFile("index.html", { root: path_1.default.join("./", "src") });
        });
    }
}
const app = new App();
app.listenServer();
//# sourceMappingURL=server.js.map