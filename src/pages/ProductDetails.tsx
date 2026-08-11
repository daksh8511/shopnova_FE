import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import NodeApi from "../NodeApi";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import useCartStore from "../stores/cart";
import useAuthStore from "../stores/user";

interface Product {
    _id: string;
    title: string;
    category: string;
    price: number;
    stock: number;
    image: string;
    description?: string;
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
}

const getDiscountPercent = (category: string) => {
    switch (category) {
        case "electronics":
            return 15;
        case "fashion":
            return 20;
        case "home_living":
            return 18;
        case "sports":
            return 12;
        case "beauty":
            return 25;
        default:
            return 10;
    }
};

const ProductDetails = () => {
    const { id } = useParams();
    const { token, user } = useAuthStore()
    const { addCartItem } = useCartStore()
    const [product, setProduct] = useState<Product | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [activeSlide, setActiveSlide] = useState(0);
    const [location, setLocation] = useState("Delhi, India");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await NodeApi.get("/product/get");
                if (response?.data?.success) {
                    const allProducts = response.data.allProducts as Product[];
                    setProducts(allProducts);
                    const currentProduct = allProducts.find((item) => item._id === id) || null;
                    setProduct(currentProduct);
                    setActiveSlide(0);
                }
            } catch (error) {
                console.error("Error loading product:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation(`Lat ${position.coords.latitude.toFixed(2)}, Long ${position.coords.longitude.toFixed(2)}`);
                },
                () => {
                    setLocation("Delhi, India");
                }
            );
        }
    }, []);

    if (loading) {
        return (
            <div className="container mx-auto mt-24 flex min-h-[50vh] items-center justify-center px-4">
                <p className="text-lg font-medium text-muted-foreground">Loading product details...</p>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="container mx-auto mt-24 px-4">
                <Card className="p-8 text-center">
                    <h2 className="text-2xl font-semibold">Product not found</h2>
                    <p className="mt-2 text-muted-foreground">The product you are looking for is unavailable right now.</p>
                </Card>
            </div>
        );
    }

    const discountPercent = getDiscountPercent(product.category);
    const slides = [product.image, product.image, product.image];
    const similarProducts = products
        .filter((item) => item._id !== product._id && item.category === product.category)

    const goToNextSlide = () => {
        setActiveSlide((prev) => (prev + 1) % slides.length);
    };

    const goToPrevSlide = () => {
        setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };


    const AddToCart = async () => {
        if (token) {
            try {
                await NodeApi.post(`/cart/add_cart`, {
                    userId: user?._id,
                    productId: product?._id,
                    qty: 1,
                })
            } catch (error) {
                console.error("Error : ", error)
            }
        } else {
            addCartItem({
                _id: product?._id,
                category: product?.category,
                image: product?.image,
                price: product?.price,
                title: product?.title,
                qty: 1,
            })
        }
    }

    return (
        <div className="container mx-auto mt-20 px-4 py-8">
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
                <Card className="overflow-hidden border-none shadow-sm">
                    <div className="relative h-[26rem] bg-muted">
                        <img
                            src={slides[activeSlide]}
                            alt={product.title}
                            className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-x-0 top-4 flex items-center justify-between px-4">
                            <Button variant="secondary" size="sm" onClick={goToPrevSlide}>
                                ←
                            </Button>
                            <Button variant="secondary" size="sm" onClick={goToNextSlide}>
                                →
                            </Button>
                        </div>
                    </div>

                    <CardContent className="space-y-4 p-6">
                        <div className="flex items-center justify-center gap-2">
                            {slides.map((_, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => setActiveSlide(index)}
                                    className={`h-2.5 w-2.5 rounded-full ${activeSlide === index ? "bg-primary" : "bg-muted-foreground/30"}`}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>

                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span>1 of {slides.length} images</span>
                            <span className="capitalize">{product.category}</span>
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <div className="space-y-3">
                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Featured Product</p>
                        <h1 className="text-3xl font-bold leading-tight">{product.title}</h1>
                        <p className="text-sm text-muted-foreground">{product.description || "Premium quality product crafted for daily comfort and style."}</p>
                    </div>

                    <div className="rounded-2xl border bg-background p-4 shadow-sm">
                        <div className="flex flex-wrap items-center gap-3">
                            <p className="text-3xl font-bold">₹{product.price.toLocaleString("en-IN")}</p>
                            <p className="text-lg text-muted-foreground line-through">₹{(product.price - 2000).toLocaleString("en-IN")}</p>
                            <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-600">
                                {discountPercent}% off
                            </span>
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">Inclusive of all taxes</p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                        <Button onClick={() => AddToCart()} className="flex-1">Add to Cart</Button>
                        <Button variant="outline" className="flex-1">
                            Buy Now
                        </Button>
                    </div>

                    <Card className="shadow-sm">
                        <CardContent className="space-y-3 p-5">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="font-semibold">Delivery</p>
                                    <p className="text-sm text-muted-foreground">Get it by tomorrow</p>
                                </div>
                                <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                                    Fast delivery
                                </span>
                            </div>
                            <div>
                                <p className="font-semibold">Your location</p>
                                <p className="text-sm text-muted-foreground">{location}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className="mt-12">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-2xl font-semibold">Similar products</h2>
                    <Link to="/products" className="text-sm font-medium text-primary">
                        View all
                    </Link>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                    {similarProducts.length > 0 ? (
                        similarProducts.map((item) => (
                            <Link key={item._id} to={`/products/${item._id}`}>
                                <Card className="overflow-hidden transition-transform hover:-translate-y-1">
                                    <div className="h-44 bg-muted">
                                        <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                                    </div>
                                    <CardContent className="space-y-2 p-4">
                                        <h3 className="font-semibold">{item.title}</h3>
                                        <p className="text-sm text-muted-foreground capitalize">{item.category}</p>
                                        <p className="text-lg font-bold">₹{item.price.toLocaleString("en-IN")}</p>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))
                    ) : (
                        <p className="text-sm text-muted-foreground">No similar products available yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;