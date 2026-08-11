import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Input } from '../components/ui/input'
import {
  ShoppingCart,
  Search,
  Menu,
  X,
  MapPin,
  Package,
  UserRound,
  Settings,
  LogOut,
  UserCircle
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "../components/ui/dropdown-menu"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../components/ui/avatar"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../components/ui/sheet";
import Profile from './Profile'
import NodeApi from '../NodeApi'
import userAuthStore from '../stores/user'
import { Skeleton } from './ui/skeleton'
import useCartStore from '../stores/cart'

type SearchProduct = {
  _id: string
  title: string
  price: number | string
  image?: string
}

const Navbar = () => {
  const { user, token, logout } = userAuthStore()
  const { cart, clearCart } = useCartStore()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openPopup, setOpenPopup] = useState(false)
  const navigate = useNavigate()
  const [searchInput, setSearchInput] = useState('')
  const [searchProducts, setSearchProducts] = useState<SearchProduct[]>([])
  const [showSearchDropdown, setShowSearchDropdown] = useState(false)
  const [cartItems, setCartItems] = useState<{ items: { product?: { _id?: string; title?: string; price?: number; image?: string }; qty?: number }[] }[]>([])
  const [loading, setLoading] = useState(false)

  const remoteCartItems = Array.isArray(cartItems) && cartItems[0]?.items ? cartItems[0].items : []
  const guestCartItems = cart
  const activeCartItems = token ? remoteCartItems : guestCartItems

  const cartCount = activeCartItems.reduce((acc: number, item: { qty?: number }) => acc + (item.qty ?? 0), 0)
  const cartTotal = activeCartItems.reduce((sum: number, item: { qty?: number; product?: { price?: number }; price?: number }) => {
    const price = token ? item.product?.price ?? 0 : item.price ?? 0
    const qty = item.qty ?? 1
    return sum + price * qty
  }, 0)
  const handleProductSelect = (productId: string) => {
    setSearchInput('')
    navigate(`/products/${productId}`)
    setShowSearchDropdown(false)
  }

  console.log('cart from store : ', cart)
  console.log('cart from api : ', cartItems)

  useEffect(() => {
    const fetchCartIfNeeded = async () => {
      setLoading(true)
      try {
        if (user !== null) {
          const response = await NodeApi.get(`/cart/get/${user._id}`)
          if (response?.data?.success) {
            setCartItems(response?.data?.carts)
          }
        } else {
          setCartItems([])
        }
      } catch (error) {
        console.error("Error : ", error)
      } finally {
        setLoading(false)
      }
    }

    void fetchCartIfNeeded()
  }, [user])

  useEffect(() => {
    const trimmedQuery = searchInput.trim()

    if (!trimmedQuery) {
      const timeoutId = window.setTimeout(() => {
        setSearchProducts([])
        setShowSearchDropdown(false)
      }, 0)

      return () => window.clearTimeout(timeoutId)
    }

    const timer = window.setTimeout(async () => {
      try {
        const response = await NodeApi.get('/product/search_product', {
          params: { search: trimmedQuery },
        })

        if (response?.data?.success) {
          setSearchProducts(response?.data?.search_result || [])
          setShowSearchDropdown(true)
        }
      } catch (error) {
        console.error('error', error)
        setSearchProducts([])
        setShowSearchDropdown(false)
      }
    }, 250)

    return () => window.clearTimeout(timer)
  }, [searchInput])

  return (
    loading ? (<Skeleton />) :
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="bg-white text-black text-xs text-center py-1.5 px-4 flex items-center justify-center gap-2 border-b border-black/10">
          <Package size={12} />
          <span>Free shipping on orders above ₹999 — Use code <strong>FREESHIP</strong></span>
        </div >

        <div className="bg-black/95 backdrop-blur border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 gap-4">
              <Link to="/" className="flex items-center gap-2.5 shrink-0">
                <div className="w-9 h-9 rounded-xl bg-white text-black flex items-center justify-center">
                  <ShoppingCart size={18} />
                </div>
                <span className="text-white font-black text-xl tracking-tight hidden sm:block">
                  Shop<span className="text-zinc-400">Nova</span>
                </span>
              </Link>

              <div className="flex-1 max-w-xl hidden md:block">
                <div className="relative flex items-center">
                  <div className="absolute left-3 text-zinc-500">
                    <Search size={16} />
                  </div>
                  <Input
                    placeholder="Search products, brands, categories..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onFocus={() => searchInput.trim() && setShowSearchDropdown(true)}
                    onBlur={() => setTimeout(() => setShowSearchDropdown(false), 150)}
                    className="pl-9 pr-24 bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500 h-10 rounded-xl"
                  />

                  {showSearchDropdown && (
                    <div className="absolute left-0 right-0 top-full mt-2 z-50 rounded-xl border border-zinc-800 bg-zinc-950 shadow-2xl overflow-hidden">
                      {searchProducts.length > 0 ? (

                        searchProducts.slice(0, 6).map((product: SearchProduct) => (
                          <Link
                            key={product?._id}
                            to={`/products/${product?._id}`}
                            onMouseDown={(e) => e.preventDefault()}
                            className="flex items-center gap-3 px-3 py-2.5 hover:bg-white/10 transition-colors"
                          >
                            <img
                              src={product?.image}
                              alt={product?.title}
                              className="h-10 w-10 rounded-lg object-cover"
                            />

                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm text-white">
                                {product.title}
                              </p>
                              <p className="text-xs text-zinc-400">
                                ₹{product.price}
                              </p>
                            </div>
                          </Link>
                        ))

                      ) : (
                        <div className="px-3 py-3 text-sm text-zinc-400">
                          No products found
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button className="hidden lg:flex items-center gap-1.5 text-zinc-400 hover:text-white text-xs px-2 py-1.5 rounded-lg hover:bg-white/10 transition-all">
                  <MapPin size={14} className="text-zinc-300" />
                  <div className="text-left">
                    <div className="text-zinc-500 text-[10px]">Deliver to</div>
                    <div className="text-white font-semibold">Mumbai 400001</div>
                  </div>
                </button>

                <Sheet>
                  <SheetTrigger>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="relative text-zinc-300 hover:text-white hover:bg-white/10 mr-3 mt-2"
                    >
                      <ShoppingCart size={18} />
                      <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-white text-black border-0">
                        {cartCount}
                      </Badge>
                    </Button>
                  </SheetTrigger>

                  <SheetContent className="bg-zinc-950 border-white/10 text-white w-[400px] sm:w-[450px]">
                    <SheetHeader>
                      <SheetTitle className="text-white">
                        Shopping Cart
                      </SheetTitle>
                    </SheetHeader>

                    <div className="mt-6 space-y-4 flex flex-col h-full">
                      {activeCartItems.length === 0 ? (
                        <div className="flex h-full items-center justify-center">
                          <p className="text-center text-zinc-500">Your cart is empty</p>
                        </div>
                      ) : (
                        activeCartItems.map((item: any) => {
                          const product = token ? item.product : item
                          return (
                            <div className="flex gap-3 border-b border-white/10 pb-4" key={product?._id || item?._id}>
                              <img
                                src={product?.image || 'https://placehold.co/80x80'}
                                alt={product?.title || 'Cart item'}
                                className="w-20 h-20 rounded-lg object-cover"
                              />

                              <div className="flex-1">
                                <h3 className="font-medium">{product?.title}</h3>

                                <p className="text-zinc-400 text-sm">₹{product?.price}</p>

                                <p className="text-xs text-zinc-500">Qty: {item?.qty ?? 1}</p>
                              </div>
                            </div>
                          )
                        })
                      )}

                      {/* Total */}
                      {activeCartItems.length !== 0 && (
                        <div className='mt-auto mb-5'>
                          <div className="flex justify-between font-semibold text-lg">
                            <span>Total</span>
                            <span>₹{cartTotal.toLocaleString('en-IN')}</span>
                          </div>

                          <Button className="w-full">Checkout</Button>
                        </div>
                      )}
                    </div>
                  </SheetContent>
                </Sheet>

                {
                  token ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <button className="outline-none">
                          <Avatar className="h-9 w-9 cursor-pointer border border-white/20">
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback className="bg-white text-black">
                              <UserRound size={18} />
                            </AvatarFallback>
                          </Avatar>
                        </button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent
                        align="end"
                        className="w-52 bg-zinc-950 border-white/10 text-white"
                      >
                        <DropdownMenuGroup>
                          <DropdownMenuLabel className="text-zinc-400">
                            My Account
                          </DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => setOpenPopup(true)}
                            className="cursor-pointer flex items-center gap-2"
                          >
                            <UserCircle size={16} />
                            Profile
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => {
                              setMobileOpen(false)
                              navigate('/settings')
                            }}
                            className='flex items-center gap-2'
                          >
                            <Settings size={16} />
                            Settings
                          </DropdownMenuItem>
                        </DropdownMenuGroup>

                        <DropdownMenuSeparator className="bg-white/10" />
                        <DropdownMenuItem
                          onClick={() => {
                            logout()
                            clearCart()
                            setCartItems([])
                          }}
                          className="cursor-pointer text-red-400"
                        >
                          <LogOut size={16} />
                          Logout
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                  ) : (

                    <Link to="/signup">
                      <Button
                        className="bg-white text-black border-0 text-sm h-9 hover:bg-zinc-200"
                      >
                        Sign Up
                      </Button>
                    </Link>

                  )
                }

                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden text-zinc-300 hover:text-white hover:bg-white/10"
                  onClick={() => setMobileOpen(!mobileOpen)}
                >
                  {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                </Button>
              </div>
            </div>

            <div className="md:hidden pb-3">
              <div className="relative flex items-center">
                <Search size={15} className="absolute left-3 text-zinc-500" />
                <Input
                  placeholder="Search products..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onFocus={() => searchInput.trim() && setShowSearchDropdown(true)}
                  onBlur={() => setTimeout(() => setShowSearchDropdown(false), 150)}
                  className="pl-9 pr-4 bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500 h-10 rounded-xl"
                />

                {showSearchDropdown && (
                  <div className="absolute left-0 right-0 top-full mt-2 z-50 rounded-xl border border-zinc-800 bg-zinc-950 shadow-2xl overflow-hidden">
                    {searchProducts.length > 0 ? (
                      searchProducts.slice(0, 6).map((product: SearchProduct) => (
                        <Link
                          key={product._id}
                          to={`/products/${product._id}`}
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => handleProductSelect(product._id)}
                          className="flex items-center gap-3 px-3 py-2.5 hover:bg-white/10 transition-colors"
                        >
                          <img
                            src={product.image || 'https://placehold.co/48x48'}
                            alt={product.title}
                            className="h-10 w-10 rounded-lg object-cover"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm text-white">{product.title}</p>
                            <p className="text-xs text-zinc-400">₹{product.price}</p>
                          </div>
                        </Link>
                      ))
                    ) : (
                      <div className="px-3 py-3 text-sm text-zinc-400">
                        No products found
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {
          mobileOpen && (
            <div className="md:hidden bg-black border-b border-white/10 px-4 py-4 space-y-3">
              <div className="flex gap-2 pt-2">
                <Link to="/login" className="flex-1" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" className="w-full text-sm border-white/20 text-white hover:bg-white/10 bg-transparent">
                    Log In
                  </Button>
                </Link>
                <Link to="/signup" className="flex-1" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full bg-white text-black text-sm border-0 hover:bg-zinc-200">
                    Sign Up
                  </Button>
                </Link>
              </div>
            </div>
          )
        }
        {
          openPopup && (
            <Profile
              open={openPopup}
              onOpenChange={setOpenPopup}
            />
          )
        }
      </header >
  )
}

export default Navbar
