import { io, Socket } from 'socket.io-client';
import { store } from '../store/store.ts';
import { fetchVacations } from '../store/vacationSlice.ts';
import { appConfig } from './config.ts';

let socket: Socket | null = null;

export const connectSocket = () => {
    const token = localStorage.getItem('token');
    if (!token) {
        console.log('⚠️ No token found, skipping Socket.IO connection');
        return;
    }

    if (socket && socket.connected) {
        console.log('✓ Socket.IO already connected');
        return;
    }

    console.log('🔌 Attempting to connect to Socket.IO:', appConfig.SOCKET_URL);

    socket = io(appConfig.SOCKET_URL, {
        query: { token },
        transports: ['websocket', 'polling']
    });

    socket.on('connect', () => {
        console.log('🟢 Connected to Socket.IO, ID:', socket?.id);
    });

    socket.on('connect_error', (error) => {
        console.error('❌ Socket.IO connection error:', error.message);
    });

    socket.on('vacationUpdated', () => {
        console.log('📡 Vacation update received via socket, fetching fresh data.');
        store.dispatch(fetchVacations());
    });

    socket.on('disconnect', (reason) => {
        console.log('🔴 Disconnected from Socket.IO:', reason);
    });
};

export const disconnectSocket = () => {
    if (socket) socket.disconnect();
    socket = null;
};