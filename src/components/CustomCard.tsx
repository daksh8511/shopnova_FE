import { Card, CardContent, CardFooter } from './ui/card'
import { Badge } from './ui/badge'
import { ShoppingCart, Star, Zap } from 'lucide-react'
import { Button } from './ui/button'
import ProductFetch from '../utils/ProductFetch'
import { Link } from 'react-router-dom'

const CustomCard = ({ product }) => {
  return (
    <Card onClick={() => ProductFetch(product?._id)} className="group relative bg-zinc-950 border border-white/10 hover:border-white/30 transition-all duration-300 overflow-hidden">
      <Link to={`/products/${product?._id}`}>
        <div className="relative h-48 flex items-center justify-center bg-zinc-900 border-b border-white/10">
          <span className="text-8xl">{product.emoji}</span>

          <Badge className="absolute top-3 left-3 bg-white text-black border-0 text-xs font-bold">
            {product.badge}
          </Badge>

          <div className="absolute top-3 right-3 bg-white text-black text-xs font-black px-2 py-0.5 rounded-md">
            -{product.discount}
          </div>
        </div>

        <CardContent className="p-4 space-y-2.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider">{product.brand}</span>
            <span className="text-zinc-700">·</span>
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider">{product.category}</span>
          </div>

          <h3 className="text-white font-bold text-sm leading-snug line-clamp-2">{product.name}</h3>

          <div className="flex items-center gap-1.5">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={11} className={i < Math.floor(product.rating) ? 'text-white fill-white' : 'text-zinc-700'} />
              ))}
            </div>
            <span className="text-white text-xs font-semibold">{product.rating}</span>
            <span className="text-zinc-600 text-xs">({product.reviews.toLocaleString()})</span>
          </div>

          <p className="text-[11px] text-zinc-600 flex items-center gap-1">
            <Zap size={10} className="text-white" />
            {product.sold} this month
          </p>
        </CardContent>

        <CardFooter className="px-4 pb-4 pt-3 flex items-center justify-between">
          <div>
            <div className="text-white font-black text-lg leading-none">{product.price}</div>
            <div className="text-zinc-600 text-xs line-through mt-0.5">{product.originalPrice}</div>
          </div>
          <Button size="sm" className="bg-white text-black border-0 text-xs gap-1 h-9 px-3 hover:bg-zinc-200 shrink-0">
            <ShoppingCart size={11} /> Buy
          </Button>
        </CardFooter>
      </Link>
    </Card>
  )
}

export default CustomCard