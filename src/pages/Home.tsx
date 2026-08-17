import HeroSlider from '../components/HeroSlider'
import TrendingSection from '../components/TrendingSection'
import OfferSection from '../components/OfferSection'
import { useEffect, useState } from 'react'
import NodeApi from '../NodeApi'
import { Loader2 } from 'lucide-react'

const Home = () => {
  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState([])
  const trendingProducts = products.slice(0,4)
  const hottestDeals = products.slice(4, 8)

  const GetAllProducts = async () => {
    setLoading(true)
    try {
      const response = await NodeApi.get('/product/get')

      if (response?.data?.success) {
        setProducts(response?.data?.allProducts)
      }
    } catch (error) {
      console.error("Error : ", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    GetAllProducts()
  }, [])
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {
        loading ? (
          <div className="flex flex-1 items-center justify-center min-h-screen">
            <Loader2 className="h-12 w-12 animate-spin text-white" />
          </div>
        ) : (
          <main className="flex-1 pt-24">
            <HeroSlider />
            <TrendingSection trendingProducts={trendingProducts} />
            <OfferSection hottestDeals={hottestDeals} />
          </main>
        )
      }
    </div>
  )
}

export default Home