export interface User {
    uuid: string;
    firstName: string;
    lastName: string;
    email: string;
    role: 'user' | 'admin';
}

export interface AuthState {
    token: string | null;
    user: User | null;
    isAuthenticated: boolean;
}

export interface Vacation {
    uuid: string;
    destination: string;
    description: string;
    startDate: string; 
    endDate: string; 
    price: number;
    pictureUrl: string; 
    isFollowing: boolean;
    followersCount: number;
}