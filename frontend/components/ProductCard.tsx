'use client';

import React from 'react';
import { ShoppingCart, Star } from 'lucide-react';
import { useTranslate } from '@/hooks/useTranslate';
import { useLanguage } from '@/context/LanguageContext';

interface ProductCardProps {
    product: {
        id: string;
        name: string;
        description: string;
        price: number;
        image: string;
        rating: number;
        inStock: boolean;
    };
    onAddToCart: (id: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
    const { t } = useLanguage();

    // Translate product name and description
    const { translatedText: translatedName } = useTranslate(product.name);
    const { translatedText: translatedDescription } = useTranslate(product.description);

    return (
        <div className="group bg-card rounded-2xl overflow-hidden border shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            {/* Product Image */}
            <div className="aspect-square overflow-hidden relative bg-muted/30">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {!product.inStock && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="bg-white text-black px-4 py-2 rounded-lg font-semibold">
                            {t.shop.outOfStock}
                        </span>
                    </div>
                )}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-semibold">{product.rating}</span>
                </div>
            </div>

            {/* Product Info */}
            <div className="p-5">
                <div className="mb-3">
                    <h3 className="text-lg font-semibold mb-1 line-clamp-1">
                        {translatedName}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                        {translatedDescription}
                    </p>
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">
                        {t.shop.currency}{product.price}
                    </span>
                    <button
                        onClick={() => onAddToCart(product.id)}
                        disabled={!product.inStock}
                        className="bg-primary text-primary-foreground px-4 py-2 rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        <ShoppingCart className="w-4 h-4" />
                        {t.shop.add}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
