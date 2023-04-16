import compression from 'compression';
import cors from 'cors';
import express, { Application } from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import { connect } from 'mongoose';
import morgan from 'morgan';
import { Server } from "socket.io";
import { createServer } from "http";
import path, { join } from 'path';

import env from './configs/env.config';
import errorMiddleware from './middlewares/error.middleware';
import Routes from './routes';
import { logger, stream } from './utils/logger';
import "./crons";
import { gameSocket } from './sockets/game.socket';

class App {
    public app: Application;
    public port: string | number;
    public NODE_ENV: string;
    public MONGO_URL: string;
    public httpServer;

    constructor() {
        this.app = express();
        this.port = env.PORT || 3000;
        this.NODE_ENV = env.NODE_ENV || 'development';
        this.MONGO_URL = env.MONGO_URL;
        this.httpServer = createServer(this.app);

        this.connectToDatabase();
        this.initializeSocket();
        this.initializeMiddlewares();
        this.initializeRoutes();
        this.initializeErrorHandling();
    }

    public listen() {
        this.httpServer.listen(this.port, () => {
            logger.info(`=================================`);
            logger.info(`======= ENV: ${this.NODE_ENV} ========`);
            logger.info(`🚀 App listening on the port ${this.port}`);
            logger.info(`=================================`);
        });
    }

    public getServer() {
        return this.app;
    }

    private initializeSocket() {
        const io: Server = new Server(this.httpServer, {
            path: '/socket.io',
            cors: {
                origin: "*"
            },
            pingTimeout: 60000
        })
        gameSocket(io);
    }

    private connectToDatabase() {
        connect(this.MONGO_URL, () => {
            logger.info(`=================================`);
            logger.info(`====== Database connected =======`);
            logger.info(`=================================`);
        });

    }

    private initializeMiddlewares() {
        if (this.NODE_ENV === 'production') {
            this.app.use(morgan('combined', { stream }));
            this.app.use(cors());
        } else {
            this.app.use(morgan('dev', { stream }));
            this.app.use(cors());
        }

        this.app.use(hpp());
        this.app.use(helmet());
        this.app.use(compression());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(express.static(join(__dirname, 'build')));
        this.app.use('/public', express.static(path.join(__dirname, '../upload')));
        this.app.use('/public', express.static(`upload`));
        // this.app.use(cookieParser());
    }

    private initializeRoutes() {
        this.app.use('/api', new Routes().router);

        this.app.get('/*', function (req, res) {
            res.sendFile(join(__dirname, 'build', 'index.html'));
        });
    }

    private initializeErrorHandling() {
        this.app.use(errorMiddleware);
    }
}

const app = new App();
app.listen();