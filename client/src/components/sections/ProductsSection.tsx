import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PRODUCTS } from "@shared/const";
import { toast } from "sonner";

interface ProductsSectionProps {
  onAddToCart: (item: { id: number; name: string; price: number; size: string; image: string }) => void;
}

export default function ProductsSection({ onAddToCart }: ProductsSectionProps) {
  const [selectedSizes, setSelectedSizes] = useState<Record<number, string>>({});
  const [filter, setFilter] = useState<string>("all");

  const filteredProducts = filter === "all" 
    ? PRODUCTS 
    : PRODUCTS.filter(p => p.category === filter);

  const handleAddToCart = (product: typeof PRODUCTS[0]) => {
    const size = selectedSizes[product.id] || "M";
    onAddToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      size,
      image: product.image,
    });
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <section id="products" className="py-20 bg-background">
      <div className="container">
        <div className="text-center mb-12 animate-fadeIn">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Our Collection</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Premium quality streetwear with meaningful Palestinian designs
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex justify-center gap-4 mb-12">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
          >
            All
          </Button>
          <Button
            variant={filter === "tshirt" ? "default" : "outline"}
            onClick={() => setFilter("tshirt")}
          >
            T-Shirts
          </Button>
          <Button
            variant={filter === "hoodie" ? "default" : "outline"}
            onClick={() => setFilter("hoodie")}
          >
            Hoodies
          </Button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product, index) => (
            <Card
              key={product.id}
              className="overflow-hidden hover:shadow-lg transition-shadow animate-fadeIn"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader className="p-0">
                <div className="relative aspect-square overflow-hidden bg-muted">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  {product.badge && (
                    <Badge className="absolute top-4 right-4" variant="secondary">
                      {product.badge}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <CardTitle className="mb-2">{product.name}</CardTitle>
                <p className="text-sm text-muted-foreground mb-4">
                  {product.description}
                </p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-primary">
                    ${product.price}
                  </span>
                </div>

                {/* Size Selection */}
                <div>
                  <p className="text-sm font-medium mb-2">Size:</p>
                  <div className="flex gap-2">
                    {product.sizes.map((size) => (
                      <Button
                        key={size}
                        variant={selectedSizes[product.id] === size ? "default" : "outline"}
                        size="sm"
                        onClick={() =>
                          setSelectedSizes({ ...selectedSizes, [product.id]: size })
                        }
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-6 pt-0">
                <Button
                  className="w-full"
                  onClick={() => handleAddToCart(product)}
                >
                  Add to Cart
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

