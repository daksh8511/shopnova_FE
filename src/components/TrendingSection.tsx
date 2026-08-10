import { Button } from '../components/ui/button'
import {
  TrendingUp,
  ArrowRight,
} from 'lucide-react'
import CustomCard from './CustomCard'
import { useNavigate } from 'react-router-dom'

const TrendingSection = ({ trendingProducts }) => {
  const navigate = useNavigate()
  return (
    <section className="bg-black py-20" id="trending">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={18} className="text-zinc-300" />
              <span className="text-zinc-400 text-sm font-semibold uppercase tracking-widest">This Week</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              Best <span className="text-zinc-400">Trending</span> Products
            </h2>
            <p className="text-zinc-500 mt-1.5 text-sm">Top picks loved by thousands of shoppers</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {trendingProducts.map((product) => (
            <CustomCard product={product} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Button onClick={() => navigate('/products')} className="bg-white text-black border-0 hover:bg-zinc-200 gap-2">
            Explore All Trending <ArrowRight size={14} />
          </Button>
        </div>
      </div>
    </section>
  )
}

export default TrendingSection
