import React, { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import { Header } from './components/layout/header/Header.tsx';
import { AppRoutes } from './routes/AppRoutes.tsx';
import { useAppSelector, useAppDispatch } from './store/hooks.ts';
import { connectSocket, disconnectSocket } from './services/socketService.ts';
import { login, logout } from './store/authSlice.ts';

const App: React.FC = () => {
    const { isAuthenticated } = useAppSelector(state => state.auth);
    const dispatch = useAppDispatch();

    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'token' || e.key === 'user') {
                const token = localStorage.getItem('token');
                const userStr = localStorage.getItem('user');

                if (token && userStr) {
                    dispatch(login({ token, user: JSON.parse(userStr) }));
                } else {
                    dispatch(logout());
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [dispatch]);

    useEffect(() => {
        if (isAuthenticated) {
            connectSocket();
        } else {
            disconnectSocket();
        }

        return () => {
            disconnectSocket();
        };
    }, [isAuthenticated]);

    return (
        <div className="app-container d-flex flex-column min-vh-100">
            <Header />
            
            <main className="flex-grow-1">
                <AppRoutes />
            </main>

            {/* Global Notification Container */}
            <ToastContainer 
                position="bottom-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
        </div>
    );
};

export default App;