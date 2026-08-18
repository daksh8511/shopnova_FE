import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Card, CardContent, CardHeader } from '../components/ui/card'
import { Separator } from '../components/ui/separator'
import {
  ShoppingCart,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Shield,
  Star,
  Package,
  Heart,
  Tag,
} from 'lucide-react'
import { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'
import NodeApi from '../NodeApi'
import userAuthStore from '../stores/user'
import useCartStore from '../stores/cart'
import OtpComponent from '../components/OtpComponent'

const recentOrders = [
  { emoji: '📱', name: 'iPhone 15 Pro', status: 'Delivered', date: 'Jul 12' },
  { emoji: '👟', name: 'Nike Air Max', status: 'In Transit', date: 'Jul 18' },
  { emoji: '🎧', name: 'Sony WH-1000XM5', status: 'Processing', date: 'Jul 19' },
]

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [otpDialogOpen, setOtpDialogOpen] = useState(false)
  const navigate = useNavigate()
  const { setAuth } = userAuthStore()
  const { cart, clearCart } = useCartStore()

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },

    validationSchema: Yup.object({
      email: Yup.string()
        .email('Please enter a valid email')
        .required('Email is required'),

      password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .required('Password is required'),
    }),

    onSubmit: (values) => {
      void SignIn(values)
    },
  })

  const SignIn = async (values: { email: string; password: string; }) => {
    try {
      const response = await NodeApi.post('/auth/login', {
        email: values.email,
        password: values.password,
      })

      if (response.data?.success) {
        setAuth(response?.data?.user, response?.data?.token)

        if (cart.length > 0) {
          const cartMerge = cart.reduce<Record<string, number>>((acc, item) => {
            const qty = item.qty ?? 1
            acc[item._id] = (acc[item._id] ?? 0) + qty
            return acc
          }, {})

          const addRequests = Object.entries(cartMerge).map(([productId, qty]) =>
            NodeApi.post('/cart/add_cart', {
              userId: response.data.user._id,
              productId,
              qty,
            }),
          )

          await Promise.allSettled(addRequests)
          clearCart()
        }

        navigate('/')
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(error.response?.data || error.message)
      } else {
        console.error(error)
      }
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden px-4 py-20">
      <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      <div className="relative z-10 w-full max-w-4xl flex flex-col lg:flex-row gap-10 items-center">
        <div className="hidden lg:flex flex-col flex-1">
          <Link to="/" className="flex items-center gap-2.5 mb-10">
            <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center">
              <ShoppingCart size={20} />
            </div>
            <span className="text-white font-black text-xl tracking-tight">Shop<span className="text-zinc-400">Nova</span></span>
          </Link>

          <h2 className="text-4xl font-black text-white leading-tight mb-3">Welcome <span className="text-zinc-400">back!</span></h2>
          <p className="text-zinc-500 text-sm mb-8 leading-relaxed max-w-sm">Your cart, wishlist, and order history are waiting. Log in to continue where you left off.</p>

          <div className="bg-zinc-950 border border-white/10 rounded-2xl p-5 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Package size={15} className="text-white" />
              <span className="text-white text-sm font-bold">Recent Orders</span>
              <span className="ml-auto text-xs text-zinc-400">Track all</span>
            </div>
            <div className="space-y-3">
              {recentOrders.map((order, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center text-lg shrink-0">{order.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-xs font-semibold truncate">{order.name}</div>
                    <div className="text-zinc-600 text-[10px]">{order.date}</div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-zinc-300">{order.status}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: <Heart size={14} className="text-white" />, label: 'Wishlist', value: '12 items' },
              { icon: <Tag size={14} className="text-white" />, label: 'Coupons', value: '3 active' },
              { icon: <Star size={14} className="text-white" />, label: 'Reward Points', value: '1,240 pts' },
            ].map((s) => (
              <div key={s.label} className="bg-zinc-950 border border-white/10 rounded-xl p-3 text-center">
                <div className="flex items-center justify-center mb-1">{s.icon}</div>
                <div className="text-white text-xs font-bold">{s.value}</div>
                <div className="text-zinc-600 text-[10px]">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <Card className="w-full lg:max-w-md bg-zinc-950 border border-white/10">
          <CardHeader className="pb-0 pt-8 px-8">
            <Link to="/" className="flex items-center gap-2 mb-5 lg:hidden">
              <div className="w-8 h-8 rounded-xl bg-white text-black flex items-center justify-center">
                <ShoppingCart size={16} />
              </div>
              <span className="text-white font-black">Shop<span className="text-zinc-400">Nova</span></span>
            </Link>

            <h1 className="text-2xl font-black text-white">Sign in to your account</h1>
            <p className="text-zinc-500 text-sm mt-1">Continue shopping and track your orders.</p>
          </CardHeader>

          <form onSubmit={formik?.handleSubmit}>
            <CardContent className="px-8 py-6 space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm text-zinc-300 font-medium">Email Address</Label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="pl-9 bg-black border-white/10 text-white placeholder:text-zinc-500 h-11"
                  />
                  {formik.touched.email && formik.errors.email && (
                    <p className="text-red-500 text-xs">
                      {formik.errors.email}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm text-zinc-300 font-medium">Password</Label>
                  <a href="#" className="text-xs text-zinc-400 hover:text-white transition-colors">Forgot password?</a>
                </div>
                <div className="relative">
                  <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="pl-9 pr-10 bg-black border-white/10 text-white placeholder:text-zinc-500 h-11"
                  />
                  {formik.touched.password && formik.errors.password && (
                    <p className="text-red-500 text-xs">
                      {formik.errors.password}
                    </p>
                  )}
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors">
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full bg-white text-black border-0 h-11 font-bold gap-2 hover:bg-zinc-200">
                Sign In <ArrowRight size={15} />
              </Button>

              <div className="flex items-center justify-center gap-1.5 text-xs text-zinc-600">
                <Shield size={12} className="text-white" />
                <span>256-bit SSL encrypted & 100% secure</span>
              </div>

              <Separator className="bg-white/10" />

              <Button onClick={() => setOtpDialogOpen(true)} type="button" variant="outline" className="w-full border-white/15 text-zinc-300 hover:text-white hover:bg-white/10 bg-transparent h-10 gap-2 text-sm">
                Login with OTP instead
              </Button>

              <OtpComponent open={otpDialogOpen} onOpenChange={setOtpDialogOpen} />

              <p className="text-center text-sm text-zinc-500">
                New to ShopNova?{' '}
                <Link to="/signup" className="text-white hover:text-zinc-300 font-bold transition-colors">Create an account</Link>
              </p>
            </CardContent>
          </form>

        </Card>
      </div>
    </div>
  )
}

export default Login