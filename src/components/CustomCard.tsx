import { Card, CardContent, CardFooter } from "./ui/card";
import { ShoppingCart, Zap } from "lucide-react";
import { Button } from "./ui/button";
import ProductFetch from "../utils/ProductFetch";
import { Link } from "react-router-dom";

const CustomCard = ({ product }) => {
  return (
    <Card
      onClick={() => ProductFetch(product?._id)}
      className="group relative overflow-hidden border border-white/10 bg-zinc-950 transition-all duration-300 hover:border-white/30"
    >
      <Link to={`/products/${product?._id}`} className="block">
        {/* Image */}
        <div className="relative h-64 w-full overflow-hidden bg-zinc-900">
          <img
            src={product?.image}
            alt={product?.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Badge */}
          {product?.badge && (
            <div className="absolute left-3 top-3">
              <span className="rounded-md bg-white px-2 py-1 text-xs font-bold text-black">
                {product.badge}
              </span>
            </div>
          )}

          {/* Discount */}
          {product?.discount && (
            <div className="absolute right-3 top-3 rounded-md bg-white px-2 py-0.5 text-xs font-black text-black">
              -{product.discount}%
            </div>
          )}
        </div>

        {/* Content */}
        <CardContent className="space-y-2.5 p-4">
          <span className="mb-2 block text-[10px] uppercase tracking-wider text-zinc-500">
            {product?.category}
          </span>

          <h3 className="line-clamp-1 text-sm font-bold leading-snug text-white">
            {product?.title}
          </h3>

          <p className="flex items-center gap-1 text-[11px] text-zinc-600">
            <Zap size={10} className="text-white" />
            {product?.sold} this month
          </p>
        </CardContent>

        {/* Footer */}
        <CardFooter className="flex items-center justify-between px-4 pb-4 pt-3">
          <div>
            <div className="text-lg font-black leading-none text-white">
              ₹{product?.price?.toLocaleString("en-IN")}
            </div>
          </div>

          <Button
            size="sm"
            className="h-9 shrink-0 gap-1 border-0 bg-white px-3 text-xs text-black hover:bg-zinc-200"
          >
            <ShoppingCart size={11} />
            Buy
          </Button>
        </CardFooter>
      </Link>
    </Card>
  );
};

export default CustomCard;