import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Checkbox } from "../components/ui/checkbox";
import { Label } from "../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import NodeApi from "../NodeApi";
import { Loader2 } from 'lucide-react'

interface Product {
  _id: string;
  title: string;
  category: string;
  price: number;
  stock: number;
  image: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface CategoryFilter {
  label: string;
  value: string
}

const ProductsPage = () => {
  const categoryFilter: CategoryFilter[] = [
    {
      label: 'electronics',
      value: 'electronics'
    },
    {
      label: 'fashion',
      value: 'fashion'
    },
    {
      label: 'home & living',
      value: 'home_living'
    },
    {
      label: 'sports',
      value: 'sports'
    },
    {
      label: 'beauty',
      value: 'beauty'
    },
  ]

  const [products, setProducts] = useState<Product[]>([])
  const [sortOptions, setOptions] = useState<string>("")
  const [selectedCategory, setSelectedCategory] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const getProducts = async () => {
      setLoading(true)
      try {
        let query = "";

        if (selectedCategory.length > 0) {
          query += `category=${selectedCategory.join(",")}`;
        }

        if (sortOptions) {
          query += `${query ? "&" : ""}sortBy=${sortOptions}`;
        }

        const response = await NodeApi.get(
          query ? `/product/get/?${query}` : "/product/get"
        );

        if (response?.data?.success) {
          setProducts(response.data.allProducts as Product[]);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false)
      }
    };

    void getProducts();
  }, [selectedCategory, sortOptions])

  return (
    <div className="container mx-auto py-8 mt-20">
      <div className="grid grid-cols-12 gap-6">
        {/* Filter Sidebar */}
        <Card className="col-span-12 h-fit lg:col-span-3">
          <CardContent className="space-y-8 p-6">
            {/* Category */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Category</h3>

              {
                categoryFilter.map((category) => {
                  return (
                    <div className="flex gap-2">
                      <Checkbox
                        value={category.value}
                        id={category.value}
                        checked={selectedCategory.includes(category.value)}
                        onCheckedChange={(checked) => {
                          setSelectedCategory((prev) =>
                            checked
                              ? [...prev, category.value]
                              : prev.filter((item) => item !== category.value)
                          );
                        }}
                      />
                      <Label className="capitalize" htmlFor={category.value}>{category.label}</Label>
                    </div>
                  )
                })
              }
            </div>

            {/* Sort */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Sort By</h3>

              <RadioGroup onValueChange={(value) => setOptions(value)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="desc" id="high" />
                  <Label htmlFor="high">Price: High to Low</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="asc" id="low" />
                  <Label htmlFor="low">Price: Low to High</Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>

        {/* Products */}
        <div className="col-span-12 lg:col-span-9">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {loading ? (
              <div className="col-span-full flex min-h-[25rem] items-center justify-center">
                <Loader2 />
              </div>
            ) : products.length === 0 ? (
              <div className="col-span-full flex min-h-[25rem] items-center justify-center">
                <h2 className="text-xl font-semibold">
                  No products found
                </h2>
              </div>
            ) : (
              products.map((item) => (
                <Card key={item._id} className="overflow-hidden">
                  <Link to={`/products/${item._id}`}>
                    <div className="h-56 bg-muted">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <CardContent className="space-y-4 p-4">
                      <h3 className="text-lg line-clamp-1 font-semibold hover:text-primary">
                        {item.title}
                      </h3>

                      <p className="text-2xl font-bold">
                        ₹{item.price.toLocaleString("en-IN")}
                      </p>

                      <Button className="w-full">
                        Show details
                      </Button>
                    </CardContent>
                  </Link>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div >
  );
};

export default ProductsPage;