import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Heart, Star } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
  category: string;
  inStock: boolean;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: string) => void;
  onToggleWishlist: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onAddToCart, 
  onToggleWishlist 
}) => {
  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-border bg-card">
      <div className="relative overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 right-2 flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            className="h-8 w-8 p-0 bg-background/80 backdrop-blur-sm"
            onClick={() => onToggleWishlist(product.id)}
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>
        {!product.inStock && (
          <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
            <Badge variant="destructive">Out of Stock</Badge>
          </div>
        )}
      </div>
      
      <div className="p-4 space-y-3">
        <div className="space-y-1">
          <Badge variant="outline" className="text-xs">
            {product.category}
          </Badge>
          <h3 className="font-semibold text-foreground line-clamp-2">
            {product.name}
          </h3>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(product.rating) 
                    ? 'fill-yellow-400 text-yellow-400' 
                    : 'text-muted-foreground'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            ({product.rating})
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-foreground">
            ${product.price}
          </span>
          <Button 
            size="sm"
            disabled={!product.inStock}
            onClick={() => onAddToCart(product.id)}
            className="gap-2"
          >
            <ShoppingCart className="h-4 w-4" />
            Add to Cart
          </Button>
        </div>
      </div>
    </Card>
  );
};