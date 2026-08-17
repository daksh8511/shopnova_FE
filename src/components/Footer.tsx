import { Link, useLocation } from 'react-router-dom'
import { Separator } from '../components/ui/separator'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import {
  ShoppingCart,
  Mail,
  MapPin,
  Phone,
  ArrowRight,
  Heart,
  Shield,
  Truck,
  RefreshCw,
  Headphones,
} from 'lucide-react'

const footerLinks = {
  Shop: ['Electronics', 'Fashion & Apparel', 'Home & Living', 'Sports & Fitness', 'Beauty & Personal Care', 'Books & Stationery'],
  'Customer Care': ['Help Center', 'Track My Order', 'Returns & Refunds', 'Cancel an Order', 'Report a Problem', 'Give Feedback'],
  Company: ['About ShopNova', 'Blog & Guides', 'Careers', 'Press', 'Sell on ShopNova', 'Advertise'],
  Legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Refund Policy'],
}

const trustFeatures = [
  { icon: <Truck size={20} />, title: 'Free Delivery', desc: 'On orders above ₹999' },
  { icon: <RefreshCw size={20} />, title: 'Easy Returns', desc: '30-day hassle free' },
  { icon: <Shield size={20} />, title: 'Secure Payments', desc: '100% safe & encrypted' },
  { icon: <Headphones size={20} />, title: '24/7 Support', desc: 'Always here for you' },
]

const paymentIcons = ['💳', '🏦', '📱', '💰', '🎁']

const Footer = () => {
  const location = useLocation()
  return (
    <>
      {
        !location.pathname.includes('checkout') && <footer className="bg-black border-t border-white/10 text-zinc-400">
          <div className="border-b border-white/10 bg-zinc-950">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {trustFeatures.map((f) => (
                  <div key={f.title} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-white shrink-0">
                      {f.icon}
                    </div>
                    <div>
                      <div className="text-white text-sm font-bold">{f.title}</div>
                      <div className="text-zinc-500 text-xs mt-0.5">{f.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-zinc-950 border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-white font-bold text-xl mb-1">Get exclusive deals in your inbox</h3>
                <p className="text-zinc-500 text-sm">Subscribe for simple updates and early access to new arrivals.</p>
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <input type="email" placeholder="Enter your email" className="flex-1 md:w-64 px-4 py-2.5 rounded-lg bg-black border border-white/10 text-white placeholder:text-zinc-500 text-sm focus:outline-none focus:border-white/30" />
                <Button className="bg-white text-black border-0 gap-1.5 whitespace-nowrap hover:bg-zinc-200">
                  Subscribe <ArrowRight size={13} />
                </Button>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-10">
              <div className="lg:col-span-2">
                <Link to="/" className="flex items-center gap-2.5 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center">
                    <ShoppingCart size={20} />
                  </div>
                  <span className="text-white font-black text-xl tracking-tight">Shop<span className="text-zinc-400">Nova</span></span>
                </Link>

                <p className="text-sm text-zinc-500 leading-relaxed mb-5 max-w-xs">A simple, reliable place for everyday shopping with clear prices and straightforward service.</p>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin size={14} className="text-zinc-300 shrink-0" />
                    <span>ShopNova HQ, BKC, Mumbai 400051</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone size={14} className="text-zinc-300 shrink-0" />
                    <span>1800-123-4567 (Toll Free)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail size={14} className="text-zinc-300 shrink-0" />
                    <span>support@shopnova.in</span>
                  </div>
                </div>

                <div className="flex gap-2 mt-5">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-zinc-400 hover:bg-white/10 cursor-pointer transition-all">🍎 <span>App Store</span></div>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-zinc-400 hover:bg-white/10 cursor-pointer transition-all">🤖 <span>Google Play</span></div>
                </div>
              </div>

              {Object.entries(footerLinks).map(([category, links]) => (
                <div key={category}>
                  <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">{category}</h4>
                  <ul className="space-y-2.5">
                    {links.map((link) => (
                      <li key={link}><a href="#" className="text-sm text-zinc-500 hover:text-white transition-colors duration-200">{link}</a></li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <Separator className="mt-12 mb-6 bg-white/10" />

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-zinc-600 flex items-center gap-1.5">
                © 2026 ShopNova Technologies Pvt. Ltd. Made with <Heart size={11} className="text-white fill-white" /> in India. All rights reserved.
              </p>

              <div className="flex items-center gap-3 flex-wrap justify-center">
                <div className="flex items-center gap-1.5">
                  {paymentIcons.map((icon, i) => (
                    <div key={i} className="text-base w-8 h-6 flex items-center justify-center bg-white/5 border border-white/10 rounded-md">{icon}</div>
                  ))}
                </div>
                <Badge variant="outline" className="text-xs border-white/20 text-zinc-300 bg-white/5">🔒 100% Secure</Badge>
                <Badge variant="outline" className="text-xs border-white/20 text-zinc-300 bg-white/5">✅ GST Registered</Badge>
              </div>
            </div>
          </div>
        </footer>
      }
    </>

  )
}

export default Footer
