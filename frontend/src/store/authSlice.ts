import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User } from '../models/VacationModel';

const initialToken = localStorage.getItem('token');
const initialUser = localStorage.getItem('user');

const initialState: AuthState = {
    token: initialToken || null,
    user: initialUser ? JSON.parse(initialUser) : null,
    isAuthenticated: !!initialToken && !!initialUser,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login(state, action: PayloadAction<{ token: string, user: User }>) {
            state.token = action.payload.token;
            state.user = action.payload.user;
            state.isAuthenticated = true;

            localStorage.setItem('token', action.payload.token);
            localStorage.setItem('user', JSON.stringify(action.payload.user));
        },
        logout(state) {
            state.token = null;
            state.user = null;
            state.isAuthenticated = false;

            localStorage.removeItem('token');
            localStorage.removeItem('user');
        },
    },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;