import { useState, useEffect, useCallback } from 'react'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Link } from 'react-router-dom'
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  ShoppingCart,
  Zap,
  Shield,
  RefreshCw,
  Tag,
} from 'lucide-react'

const slides = [
  {
    id: 1,
    badge: 'New Arrival',
    eyebrow: 'Simple essentials',
    title: 'Clean',
    titleAccent: 'Everyday Picks',
    subtitle: 'for modern living',
    description:
      'Discover thoughtfully chosen essentials with a calm, minimal look and straightforward value.',
    emoji: '📱',
    secondEmoji: '💻',
    thirdEmoji: '⌚',
    stats: [
      { label: 'Products', value: '5,000+' },
      { label: 'Brands', value: '200+' },
      { label: 'Reviews', value: '1M+' },
    ],
    ctaPrimary: 'Shop Essentials',
    tag: 'Free delivery + simple returns',
  },
  {
    id: 2,
    badge: 'Season Sale',
    eyebrow: 'Made for everyday wear',
    title: 'Minimal',
    titleAccent: 'Style',
    subtitle: 'in every season',
    description:
      'Choose sharp staples and timeless pieces without extra fuss or noise.',
    emoji: '👗',
    secondEmoji: '👟',
    thirdEmoji: '👜',
    stats: [
      { label: 'Styles', value: '20,000+' },
      { label: 'Brands', value: '500+' },
      { label: 'Sold', value: '2M+' },
    ],
    ctaPrimary: 'Browse Basics',
    tag: 'Easy exchanges and clear pricing',
  },
  {
    id: 3,
    badge: 'Best Deals',
    eyebrow: 'Quiet luxury at home',
    title: 'Thoughtful',
    titleAccent: 'Home Finds',
    subtitle: 'built to last',
    description:
      'Upgrade your home with reliable essentials, everyday comfort, and a restrained look.',
    emoji: '🛋️',
    secondEmoji: '🍳',
    thirdEmoji: '💡',
    stats: [
      { label: 'Products', value: '8,000+' },
      { label: 'Brands', value: '150+' },
      { label: 'Customers', value: '500K+' },
    ],
    ctaPrimary: 'Shop Home',
    tag: 'Simple delivery with no hidden surprises',
  },
]

const trustBadges = [
  { icon: <Zap size={13} />, label: 'Fast Delivery' },
  { icon: <Shield size={13} />, label: '100% Secure' },
  { icon: <RefreshCw size={13} />, label: 'Easy Returns' },
  { icon: <Tag size={13} />, label: 'Best Prices' },
]

const HeroSlider = () => {
  const [current, setCurrent] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [dir, setDir] = useState<'left' | 'right'>('right')

  const goTo = useCallback(
    (index: number, direction: 'left' | 'right') => {
      if (isAnimating) return
      setDir(direction)
      setIsAnimating(true)
      setTimeout(() => {
        setCurrent(index)
        setIsAnimating(false)
      }, 380)
    },
    [isAnimating]
  )

  const next = useCallback(() => goTo((current + 1) % slides.length, 'right'), [current, goTo])
  const prev = () => goTo((current - 1 + slides.length) % slides.length, 'left')

  useEffect(() => {
    const t = setInterval(next, 5500)
    return () => clearInterval(t)
  }, [next])

  const slide = slides[current]

  return (
    <section className="relative overflow-hidden bg-black text-white" style={{ minHeight: 'calc(100vh - 96px)' }}>
      <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center py-16">
        <div
          className={`flex flex-col lg:flex-row items-center gap-10 lg:gap-20 transition-all duration-380 ${isAnimating
            ? dir === 'right'
              ? '-translate-x-10 opacity-0'
              : 'translate-x-10 opacity-0'
            : 'translate-x-0 opacity-100'
            }`}
        >
          <div className="flex-1 space-y-6 text-center lg:text-left">
            <div className="flex items-center gap-2 justify-center lg:justify-start">
              <Badge variant="outline" className="bg-white text-black border-white text-xs font-bold px-3 py-1 tracking-wide uppercase">
                ✦ {slide.badge}
              </Badge>
              <span className="text-xs text-zinc-500 font-medium">{slide.eyebrow}</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-none tracking-tight">
              {slide.title}{' '}
              <br className="hidden lg:block" />
              <span className="text-zinc-400">{slide.titleAccent}</span>
              <br />
              <span className="text-zinc-500 text-4xl sm:text-5xl lg:text-6xl font-bold">{slide.subtitle}</span>
            </h1>

            <p className="text-zinc-400 text-base sm:text-lg leading-relaxed max-w-lg mx-auto lg:mx-0">
              {slide.description}
            </p>

            <div className="flex items-center gap-8 justify-center lg:justify-start">
              {slide.stats.map((stat) => (
                <div key={stat.label} className="text-center lg:text-left">
                  <div className="text-2xl font-black text-white">{stat.value}</div>
                  <div className="text-xs text-zinc-600 mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>

            <Link to="/signup">
              <Button size="lg" className="bg-white text-black border-0 gap-2 text-sm font-bold px-6 h-12 hover:bg-zinc-200">
                {slide.ctaPrimary} <ArrowRight size={16} />
              </Button>
            </Link>

            <p className="text-xs text-zinc-600 mt-3">{slide.tag}</p>
          </div>

          <div className="shrink-0 flex flex-col items-center gap-4">
            <div className="w-64 h-64 lg:w-80 lg:h-80 rounded-3xl flex flex-col items-center justify-center gap-3 border border-white/10 bg-zinc-950 relative overflow-hidden">
              <span className="text-9xl">{slide.emoji}</span>
              <div className="absolute top-4 right-4 w-14 h-14 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center text-4xl">
                {slide.secondEmoji}
              </div>
              <div className="absolute bottom-4 left-4 w-14 h-14 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center text-4xl">
                {slide.thirdEmoji}
              </div>
              <div className="absolute top-4 left-4 bg-white text-black text-[11px] font-black px-2 py-1 rounded-lg border border-white/20">
                SIMPLE
              </div>
            </div>

            <div className="flex items-center gap-2">
              {trustBadges.map((b) => (
                <div key={b.label} className="flex items-center gap-1 text-[10px] text-zinc-500 bg-white/5 border border-white/10 rounded-full px-2.5 py-1">
                  <span className="text-white">{b.icon}</span>
                  {b.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all hover:scale-110">
        <ChevronLeft size={20} />
      </button>
      <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all hover:scale-110">
        <ChevronRight size={20} />
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {slides.map((s, i) => (
          <button
            key={s.id}
            onClick={() => goTo(i, i > current ? 'right' : 'left')}
            className={`transition-all duration-300 rounded-full ${i === current ? 'w-8 h-2 bg-white' : 'w-2 h-2 bg-white/25 hover:bg-white/50'}`}
          />
        ))}
      </div>

      <div className="absolute bottom-6 right-6 z-20 text-xs text-zinc-600">
        {String(current + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
      </div>
    </section>
  )
}

export default HeroSlider
