import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import { Login } from '../components/auth/Login';
import { Register } from '../components/auth/Register';
import { VacationList } from '../components/vacations/VacationList';
import { VacationForm } from '../components/vacations/VacationForm';
import { VacationReports } from '../components/reports/VacationReports';

export const AppRoutes: React.FC = () => {
    const { isAuthenticated, user } = useAppSelector(state => state.auth);
    const isAdmin = user?.role === 'admin';

    return (
        <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/vacations" />} />
            <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/vacations" />} />

            {/* Protected Routes */}
            <Route path="/vacations" element={isAuthenticated ? <VacationList /> : <Navigate to="/login" />} />
            
            {/* Admin Routes */}
            <Route path="/vacations/add" element={isAuthenticated && isAdmin ? <VacationForm /> : <Navigate to="/vacations" />} />
            <Route path="/vacations/edit/:uuid" element={isAuthenticated && isAdmin ? <VacationForm /> : <Navigate to="/vacations" />} />
            <Route path="/reports" element={isAuthenticated && isAdmin ? <VacationReports /> : <Navigate to="/vacations" />} />

            <Route path="*" element={<Navigate to="/vacations" />} />
        </Routes>
    );
};