import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Address {
  area: string;
  city: string;
  state: string;
  pincode: number;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  address: Address;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface AuthStore {
  user: User | null;
  token: string | null;

  setAuth: (user: User, token: string) => void;
  setUser: (user: User) => void;
  updateUserAddress: (address: Address) => void;
  logout: () => void;
}

const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,

      setAuth: (user, token) =>
        set({
          user,
          token,
        }),

      setUser: (user) =>
        set({
          user,
        }),

      updateUserAddress: (address) =>
        set((state) => ({
          user: state.user ? { ...state.user, address } : null,
        })),

      logout: () =>
        set({
          user: null,
          token: null,
        }),
    }),
    {
      name: "user",
    }
  )
);

export default useAuthStore;