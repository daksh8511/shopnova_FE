import { ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '../components/ui/badge'
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetClose,
} from "../components/ui/sheet";
import useCartStore from '../stores/cart';
import useAuthStore from '../stores/user';
import { Button } from './ui/button';
import { X } from 'lucide-react'
import NodeApi from '../NodeApi';

interface CartProduct {
    _id?: string
    title?: string
    price?: number
    image?: string
    category?: string;
    qty?: number
}

interface CartItem {
    _id?: string
    product?: CartProduct
    qty?: number
    price?: number
    title?: string
    image?: string
}

interface CartData {
    _id?: string
    user?: string
    items: CartItem[]
    createdAt?: string
    updatedAt?: string
    __v?: number
}

interface CartSidebarDatatype {
    cartItems: CartData[]
    onRemove?: (productId?: string) => void
}
const CartSidebar = ({ cartItems, onRemove }: CartSidebarDatatype) => {
    const navigate = useNavigate()
    const { cart, removeFromCart } = useCartStore()
    const { token, user } = useAuthStore()
    const remoteCartItems: CartItem[] = Array.isArray(cartItems) && cartItems[0]?.items ? cartItems[0].items : []
    const activeCartItems: (CartItem)[] = token ? remoteCartItems : cart

    const cartTotal = activeCartItems.reduce((sum: number, item: { qty?: number; product?: { price?: number }; price?: number }) => {
        const price = token ? item.product?.price ?? 0 : item.price ?? 0
        const qty = item.qty ?? 1
        return sum + price * qty
    }, 0)

    const RemoveItemFromCart = async (item: any) => {
        if (token) {
            const productId = item?.product?._id ?? item?._id
            const response = await NodeApi.post('/cart/product_remove', {
                userId: user?._id,
                productId,
            })

            if (response?.data?.success) {
                if (typeof onRemove === 'function') onRemove(productId)
                try {
                    removeFromCart({ _id: productId } as any)
                } catch (e) {
                    console.warn('Failed to update local cart store', e)
                }
            }
        } else {
            removeFromCart(item)
        }
    }

    return (
        <Sheet>
            <SheetTrigger>
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative text-zinc-300 hover:text-white hover:bg-white/10 mr-3 mt-2"
                >
                    <ShoppingCart size={18} />
                    <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-white text-black border-0">
                        {!token ? cart.length : cartItems[0]?.items.length}
                    </Badge>
                </Button>
            </SheetTrigger>

            <SheetContent className="bg-zinc-950 border-white/10 text-white w-[400px] sm:w-[450px]">
                <SheetHeader>
                    <SheetTitle className="text-white">
                        Shopping Cart
                    </SheetTitle>
                </SheetHeader>

                <div className="mt-6 flex flex-col h-[calc(100vh-100px)]">

                    {activeCartItems.length === 0 ? (
                        <div className="flex flex-1 items-center justify-center">
                            <p className="text-center text-zinc-500">
                                Your cart is empty
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
                                {activeCartItems.map((item) => {
                                    const product = token ? item?.product : item

                                    return (
                                        <div
                                            className="flex gap-3 border-b border-white/10 pb-4"
                                            key={product?._id || item?._id}
                                        >
                                            <img
                                                src={product?.image}
                                                alt={product?.title}
                                                className="w-20 h-20 rounded-lg object-cover shrink-0"
                                            />

                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-medium truncate">
                                                    {product?.title}
                                                </h3>

                                                <p className="text-zinc-400 text-sm">
                                                    ₹{product?.price}
                                                </p>

                                                <p className="text-xs text-zinc-500">
                                                    Qty: {item?.qty ?? 1}
                                                </p>
                                            </div>

                                            <Button
                                                onClick={() => RemoveItemFromCart(item)}
                                                className="bg-transparent hover:bg-transparent shrink-0"
                                            >
                                                <X className="bg-red-500 text-white" />
                                            </Button>
                                        </div>
                                    )
                                })}
                            </div>

                            <div className="mt-4 pt-4 mb-5 border-t border-white/10 space-y-3 shrink-0">
                                <div className="flex justify-between font-semibold text-lg">
                                    <span>Total</span>
                                    <span>
                                        ₹{cartTotal.toLocaleString('en-IN')}
                                    </span>
                                </div>

                                <SheetClose
                                    onClick={() => navigate('/checkout')}
                                    className="w-full bg-white text-black hover:bg-zinc-200 py-2 rounded-lg font-medium text-sm text-center block"
                                >
                                    Checkout
                                </SheetClose>
                            </div>
                        </>
                    )}
                </div>
            </SheetContent>
        </Sheet >
    )
}

export default CartSidebar