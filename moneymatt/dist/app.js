"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const hpp_1 = __importDefault(require("hpp"));
const mongoose_1 = require("mongoose");
const morgan_1 = __importDefault(require("morgan"));
const socket_io_1 = require("socket.io");
const http_1 = require("http");
const path_1 = __importStar(require("path"));
const env_config_1 = __importDefault(require("./configs/env.config"));
const error_middleware_1 = __importDefault(require("./middlewares/error.middleware"));
const routes_1 = __importDefault(require("./routes"));
const logger_1 = require("./utils/logger");
require("./crons");
const game_socket_1 = require("./sockets/game.socket");
class App {
    constructor() {
        this.app = (0, express_1.default)();
        this.port = env_config_1.default.PORT || 3000;
        this.NODE_ENV = env_config_1.default.NODE_ENV || 'development';
        this.MONGO_URL = env_config_1.default.MONGO_URL;
        this.httpServer = (0, http_1.createServer)(this.app);
        this.connectToDatabase();
        this.initializeSocket();
        this.initializeMiddlewares();
        this.initializeRoutes();
        this.initializeErrorHandling();
    }
    listen() {
        this.httpServer.listen(this.port, () => {
            logger_1.logger.info(`=================================`);
            logger_1.logger.info(`======= ENV: ${this.NODE_ENV} ========`);
            logger_1.logger.info(`🚀 App listening on the port ${this.port}`);
            logger_1.logger.info(`=================================`);
        });
    }
    getServer() {
        return this.app;
    }
    initializeSocket() {
        const io = new socket_io_1.Server(this.httpServer, {
            path: '/socket.io',
            cors: {
                origin: "*"
            },
            pingTimeout: 60000
        });
        (0, game_socket_1.gameSocket)(io);
    }
    connectToDatabase() {
        (0, mongoose_1.connect)(this.MONGO_URL, () => {
            logger_1.logger.info(`=================================`);
            logger_1.logger.info(`====== Database connected =======`);
            logger_1.logger.info(`=================================`);
        });
    }
    initializeMiddlewares() {
        if (this.NODE_ENV === 'production') {
            this.app.use((0, morgan_1.default)('combined', { stream: logger_1.stream }));
            this.app.use((0, cors_1.default)());
        }
        else {
            this.app.use((0, morgan_1.default)('dev', { stream: logger_1.stream }));
            this.app.use((0, cors_1.default)());
        }
        this.app.use((0, hpp_1.default)());
        this.app.use((0, helmet_1.default)());
        this.app.use((0, compression_1.default)());
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: true }));
        this.app.use(express_1.default.static((0, path_1.join)(__dirname, 'build')));
        this.app.use('/public', express_1.default.static(path_1.default.join(__dirname, '../upload')));
        this.app.use('/public', express_1.default.static(`upload`));
    }
    initializeRoutes() {
        this.app.use('/api', new routes_1.default().router);
        this.app.get('/*', function (req, res) {
            res.sendFile((0, path_1.join)(__dirname, 'build', 'index.html'));
        });
    }
    initializeErrorHandling() {
        this.app.use(error_middleware_1.default);
    }
}
const app = new App();
app.listen();
//# sourceMappingURL=app.js.map