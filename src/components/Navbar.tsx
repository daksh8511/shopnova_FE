import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import {
  ShoppingCart,
  Search,
  Menu,
  X,
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
import Profile from './Profile'
import NodeApi from '../NodeApi'
import userAuthStore from '../stores/user'
import { Skeleton } from './ui/skeleton'
import useCartStore from '../stores/cart'
import CartSidebar from './CartSidebar'

type SearchProduct = {
  _id: string
  title: string
  price: number | string
  image?: string
}

const Navbar = () => {
  const { user, token, logout } = userAuthStore()
  const { clearCart } = useCartStore()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openPopup, setOpenPopup] = useState(false)
  const navigate = useNavigate()
  const [searchInput, setSearchInput] = useState('')
  const [searchProducts, setSearchProducts] = useState<SearchProduct[]>([])
  const [showSearchDropdown, setShowSearchDropdown] = useState(false)
  const [cartItems, setCartItems] = useState<{ items: { product?: { _id?: string; title?: string; price?: number; image?: string }; qty?: number }[] }[]>([])
  const [loading, setLoading] = useState(false)
  const location = useLocation()

  const handleRemoteRemove = (productId?: string) => {
    if (!productId) return
    setCartItems((prev) =>
      prev.map((cart) => ({
        ...cart,
        items: cart.items.filter((it) => it.product?._id !== productId),
      })),
    )
  }

  const handleProductSelect = (productId: string) => {
    setSearchInput('')
    navigate(`/products/${productId}`)
    setShowSearchDropdown(false)
  }

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

    const handleCartUpdated = () => {
      void fetchCartIfNeeded()
    }

    window.addEventListener('cart:updated', handleCartUpdated)

    return () => {
      window.removeEventListener('cart:updated', handleCartUpdated)
    }
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
                            onClick={() => setShowSearchDropdown(false)}
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
                {
                  !location.pathname.includes('checkout') &&
                  <CartSidebar cartItems={cartItems} onRemove={handleRemoteRemove} />
                }

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
