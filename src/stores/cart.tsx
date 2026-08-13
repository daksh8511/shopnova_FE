import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CartItems {
    _id: string
    title: string
    price: number
    image: string
    category: string
    qty: number
}

interface CartDataType {
    cart: CartItems[]
    addCartItem: (item: CartItems) => void
    clearCart: () => void
    setCartItems: (items: CartItems[]) => void
    removeFromCart: (item: CartItems) => void;
}

const useCartStore = create<CartDataType>()(
    persist(
        (set) => ({
            cart: [],

            addCartItem: (item) => {
                set((state) => {
                    const existingItem = state.cart.find(
                        (cartItem) => cartItem._id === item._id,
                    )

                    if (existingItem) {
                        return {
                            cart: state.cart.map((cartItem) =>
                                cartItem._id === item._id
                                    ? { ...cartItem, qty: cartItem.qty + item.qty }
                                    : cartItem,
                            ),
                        }
                    }

                    return {
                        cart: [...state.cart, item],
                    }
                })
            },

            clearCart: () => set({ cart: [] }),
            setCartItems: (items) => set({ cart: items }),

            removeFromCart: (item) => {
                set((state) => ({
                    cart: state.cart.filter(
                        (cartItem) => cartItem._id !== item._id
                    ),
                }))
            },
        }),
        {
            name: 'cart-storage',
        },
    ),
)

export default useCartStore