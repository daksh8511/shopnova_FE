import { Button } from '../components/ui/button'
import {
  TrendingUp,
  ArrowRight,
} from 'lucide-react'
import CustomCard from './CustomCard'

const trendingProducts = [
  {
    _id: 1,
    name: 'Apple iPhone 16 Pro Max',
    brand: 'Apple',
    category: 'Smartphones',
    emoji: '📱',
    price: '₹1,34,900',
    originalPrice: '₹1,59,900',
    discount: '16%',
    rating: 4.8,
    reviews: 12450,
    badge: 'Bestseller',
    sold: '5K+ sold',
  },
  {
    _id: 2,
    name: 'Sony WH-1000XM5 Headphones',
    brand: 'Sony',
    category: 'Audio',
    emoji: '🎧',
    price: '₹24,990',
    originalPrice: '₹34,990',
    discount: '29%',
    rating: 4.9,
    reviews: 8231,
    badge: 'Hot',
    sold: '3K+ sold',
  },
  {
    _id: 3,
    name: "Levi's 501 Original Jeans",
    brand: "Levi's",
    category: 'Fashion',
    emoji: '👖',
    price: '₹2,999',
    originalPrice: '₹5,499',
    discount: '45%',
    rating: 4.7,
    reviews: 6789,
    badge: 'Trending',
    sold: '10K+ sold',
  },
  {
    _id: 4,
    name: 'Samsung 55" QLED 4K Smart TV',
    brand: 'Samsung',
    category: 'TVs',
    emoji: '📺',
    price: '₹54,990',
    originalPrice: '₹89,990',
    discount: '39%',
    rating: 4.6,
    reviews: 4120,
    badge: 'Deal',
    sold: '1.5K+ sold',
  },
]

const TrendingSection = () => {
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
          <Button className="bg-white text-black border-0 hover:bg-zinc-200 gap-2">
            Explore All Trending <ArrowRight size={14} />
          </Button>
        </div>
      </div>
    </section>
  )
}

export default TrendingSection
