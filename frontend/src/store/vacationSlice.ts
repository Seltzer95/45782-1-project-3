import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Vacation } from '../models/VacationModel.ts';
import api from '../services/apiService.ts';

interface VacationState {
    items: Vacation[];
    loading: 'idle' | 'pending' | 'succeeded' | 'failed';
}

const initialState: VacationState = {
    items: [],
    loading: 'idle',
};

export const fetchVacations = createAsyncThunk(
    'vacations/fetchVacations',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/vacations');
            return response.data;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch vacations');
        }
    }
);

const vacationSlice = createSlice({
    name: 'vacations',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchVacations.pending, (state) => {
                state.loading = 'pending';
            })
            .addCase(fetchVacations.fulfilled, (state, action) => {
                state.loading = 'succeeded';
                state.items = action.payload; 
            })
            .addCase(fetchVacations.rejected, (state) => {
                state.loading = 'failed';
            });
    },
});

export default vacationSlice.reducer;