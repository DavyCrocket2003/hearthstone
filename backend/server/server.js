import dotenv from "dotenv";
dotenv.config();

import morgan from 'morgan';
import express from 'express';
import ViteExpress from 'vite-express';
import http from 'http';
import { Server } from 'socket.io';
import setupSocket from './socket-handlers.js';
import { connectDB } from "../database/db.js";
import authController from './controllers/authController.js';
import cookieParser from 'cookie-parser';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.VITE_API_BASE_URL || "http://localhost:3000",
    credentials: true,
  },
});

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

// test api
app.get('/api/test', (req, res) => res.json({message: "Hi from the Server!"}))

// auth routes
app.post('/api/register', authController.register)
app.post('/api/loginUsername', authController.loginUsername)
app.post('/api/refresh', authController.refresh)
app.post('/api/logout', authController.logout)

// 



// initialize socket handlers
setupSocket(io);

const port = process.env.PORT || 3000;
const startServer = async () => {
  await connectDB();
  server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
    ViteExpress.bind(app, server);
  });
};

startServer().catch((err) => console.error("Failed to start server", err));