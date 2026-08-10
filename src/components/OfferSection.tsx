import { Button } from '../components/ui/button'
import {
  Flame,
  ArrowRight,
  Timer,
  Zap,
} from 'lucide-react'
import CustomCard from './CustomCard'
import { useNavigate } from 'react-router-dom'


const OfferSection = ({ hottestDeals }) => {
  const navigate = useNavigate()
  return (
    <section className="bg-zinc-950 py-20 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none border-t border-white/10" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Flame size={20} className="text-zinc-300" />
            <span className="text-zinc-400 text-sm font-bold uppercase tracking-widest">Limited Time Offers</span>
            <Flame size={20} className="text-zinc-300" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">
            Today's <span className="text-zinc-400">Hottest</span> Deals
          </h2>
          <p className="text-zinc-500 text-sm max-w-md mx-auto">Simple discounts on essentials, fashion, home and more.</p>

          <div className="inline-flex items-center gap-4 mt-5 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-sm">
            <span className="flex items-center gap-1.5 text-white font-semibold">
              <Zap size={14} /> LIVE DEALS
            </span>
            <span className="text-zinc-500">|</span>
            <span className="flex items-center gap-1.5 text-zinc-400 text-xs">
              <Timer size={13} /> Refreshes daily at midnight
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {hottestDeals.map((product) => (
            <CustomCard product={product} />
          ))}

        </div>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button onClick={() => navigate('/products')} size="lg" className="bg-white text-black border-0 hover:bg-zinc-200 gap-2 font-bold">
            <Flame size={16} /> View All Deals <ArrowRight size={14} />
          </Button>
          <p className="text-zinc-600 text-xs">
            ✅ Secure Payments &nbsp;•&nbsp; 🚚 Fast Shipping &nbsp;•&nbsp; 🔄 Easy Returns
          </p>
        </div>
      </div>
    </section>
  )
}

export default OfferSection
