import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Address } from "./user";

interface GuestCheckout {
    address: Address;
    email: string;
    phone: string;
}

interface OrderStore {
    guestCheckout: GuestCheckout | null;
    setGuestCheckout: (checkout: GuestCheckout) => void;
    clearGuestCheckout: () => void
}

const userGuestCheckout = create<OrderStore>()(
    persist((set) => ({
        guestCheckout: null,
        setGuestCheckout: (value) => {
            set({ guestCheckout: value })
        },
        clearGuestCheckout: () => {
            set({
                guestCheckout: null
            })
        }
    }),
        {
            name: "guest-checkout"
        }
    )
)

export default userGuestCheckout