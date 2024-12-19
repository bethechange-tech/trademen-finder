import { ExtendedUser } from '@/types';
import { create } from 'zustand';

// Define the shape of your state and actions
interface UserState {
    user: ExtendedUser | null; // Replace `any` with a specific type for `user`, if possible
    setCurrentUser: (user: ExtendedUser | null) => void; // Replace `any` with a specific type for `user`, if possible
}

// Create the Zustand store with type annotations
export const userStore = create<UserState>((set) => ({
    user: null,

    setCurrentUser: (user) => {
        set({ user });
    },
}));
