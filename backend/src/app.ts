import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { initDB } from './db/sequelize';
import { ensureInitialData } from './utils/setup';

import authRoutes from './routers/authRouter'; 
import vacationRoutes from './routers/vacationRouter';
import followRoutes from './routers/followRouter';

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: { origin: "*", methods: ["GET", "POST"] }
});

io.on('connection', (socket) => {
    console.log('🟢 Socket.IO client connected:', socket.id);

    socket.on('disconnect', (reason) => {
        console.log('🔴 Socket.IO client disconnected:', socket.id, reason);
    });
});

app.use(cors());
app.use(express.json());

const uploadsPath = path.join(__dirname, '..', 'uploads');
app.use('/uploads', express.static(uploadsPath));

app.set('io', io);

app.use((req: any, res, next) => {
    req.io = io;
    next();
});

app.use('/api/auth', authRoutes);
app.use('/api/vacations', vacationRoutes);
app.use('/api/follows', followRoutes);

const PORT = process.env.PORT || 3001;

const startServer = async () => {
    await initDB();
    
    await ensureInitialData(); 

    httpServer.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
    });
};

startServer();