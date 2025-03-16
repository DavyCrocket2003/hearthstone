import morgan from 'morgan';
import express from 'express';
import ViteExpress from 'vite-express';
import http from 'http';
import { Server } from 'socket.io';
import setupSocket from './socket-handlers.js';
import authController from './controllers/authController.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(morgan('dev'));
app.use(express.json());

// auth routes
app.post('/api/register', authController.register)

app.post('/api/login', authController.login)

app.post('/api/logout', authController.logout)



// initialize socket handlers
setupSocket(io);

const port = 3000;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
  ViteExpress.bind(app, server);
});