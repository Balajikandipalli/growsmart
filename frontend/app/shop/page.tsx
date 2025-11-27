'use client';

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useTranslate } from '@/hooks/useTranslate';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingCart, Filter, Package, Sprout, Wrench, Droplet, Star } from 'lucide-react';
import ProductCard from '@/components/ProductCard';

interface Product {
    id: string;
    name: string;
    category: 'seeds' | 'tools' | 'fertilizers' | 'pots' | 'accessories';
    price: number;
    image: string;
    description: string;
    rating: number;
    inStock: boolean;
}

const mockProducts: Product[] = [
    {
        id: '1',
        name: 'Organic Tomato Seeds',
        category: 'seeds',
        price: 149,
        image: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=500&q=80',
        description: 'Premium heirloom tomato seeds, non-GMO',
        rating: 4.8,
        inStock: true,
    },
    {
        id: '2',
        name: 'Garden Pruning Shears',
        category: 'tools',
        price: 599,
        image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500&q=80',
        description: 'Professional-grade stainless steel pruning shears',
        rating: 4.9,
        inStock: true,
    },
    {
        id: '3',
        name: 'Organic Plant Fertilizer',
        category: 'fertilizers',
        price: 399,
        image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=500&q=80',
        description: 'All-purpose organic fertilizer for healthy growth',
        rating: 4.7,
        inStock: true,
    },
    {
        id: '4',
        name: 'Ceramic Plant Pot Set',
        category: 'pots',
        price: 899,
        image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500&q=80',
        description: 'Set of 3 modern ceramic pots with drainage',
        rating: 4.6,
        inStock: true,
    },
    {
        id: '5',
        name: 'Herb Garden Seeds Kit',
        category: 'seeds',
        price: 299,
        image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=500&q=80',
        description: 'Complete kit with basil, parsley, and cilantro seeds',
        rating: 4.9,
        inStock: true,
    },
    {
        id: '6',
        name: 'Garden Trowel & Fork Set',
        category: 'tools',
        price: 449,
        image: 'https://images.unsplash.com/photo-1617576683096-00fc8eecb3af?w=500&q=80',
        description: 'Ergonomic hand tools for planting and weeding',
        rating: 4.5,
        inStock: true,
    },
    {
        id: '7',
        name: 'Automatic Watering System',
        category: 'accessories',
        price: 1299,
        image: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=500&q=80',
        description: 'Smart drip irrigation system for up to 10 plants',
        rating: 4.8,
        inStock: false,
    },
    {
        id: '8',
        name: 'Sunflower Seeds Mix',
        category: 'seeds',
        price: 199,
        image: 'https://images.unsplash.com/photo-1470509037663-253afd7f0f51?w=500&q=80',
        description: 'Variety pack of giant and dwarf sunflower seeds',
        rating: 4.7,
        inStock: true,
    },
    {
        id: '9',
        name: 'Rose Plant Seeds',
        category: 'seeds',
        price: 249,
        image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&q=80',
        description: 'Beautiful mixed color rose seeds for your garden',
        rating: 4.6,
        inStock: true,
    },
    {
        id: '10',
        name: 'Vegetable Seeds Combo',
        category: 'seeds',
        price: 399,
        image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=500&q=80',
        description: 'Includes carrot, radish, spinach, and lettuce seeds',
        rating: 4.8,
        inStock: true,
    },
    {
        id: '13',
        name: 'Garden Gloves Set',
        category: 'accessories',
        price: 199,
        image: 'https://images.unsplash.com/photo-1617953141905-b27fb1f17d88?w=500&q=80',
        description: 'Comfortable and protective gardening gloves',
        rating: 4.7,
        inStock: true,
    },
    {
        id: '14',
        name: 'Vermicompost - 5kg',
        category: 'fertilizers',
        price: 249,
        image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=500&q=80',
        description: 'Rich organic vermicompost for plant nutrition',
        rating: 4.9,
        inStock: true,
    },
    {
        id: '15',
        name: 'NPK Fertilizer',
        category: 'fertilizers',
        price: 299,
        image: 'https://images.unsplash.com/photo-1615671524827-c1fe3973b648?w=500&q=80',
        description: 'Balanced NPK formula for all plants',
        rating: 4.6,
        inStock: true,
    },
    {
        id: '16',
        name: 'Terracotta Pots - Set of 5',
        category: 'pots',
        price: 599,
        image: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=500&q=80',
        description: 'Traditional clay pots in various sizes',
        rating: 4.5,
        inStock: true,
    },
    {
        id: '17',
        name: 'Hanging Planters',
        category: 'pots',
        price: 449,
        image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?w=500&q=80',
        description: 'Set of 3 decorative hanging planters',
        rating: 4.7,
        inStock: true,
    },
    {
        id: '18',
        name: 'Plant Support Stakes',
        category: 'accessories',
        price: 149,
        image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=500&q=80',
        description: 'Bamboo stakes for supporting climbing plants',
        rating: 4.3,
        inStock: true,
    },
    {
        id: '19',
        name: 'Soil pH Tester',
        category: 'accessories',
        price: 499,
        image: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=500&q=80',
        description: 'Digital pH meter for soil testing',
        rating: 4.8,
        inStock: true,
    },
    {
        id: '20',
        name: 'Marigold Seeds',
        category: 'seeds',
        price: 99,
        image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=500&q=80',
        description: 'Bright orange and yellow marigold seeds',
        rating: 4.6,
        inStock: true,
    },
];

export default function ShopPage() {
    const { t } = useLanguage();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [sortBy, setSortBy] = useState<'name' | 'price-low' | 'price-high' | 'rating'>('name');
    const [cart, setCart] = useState<{ [key: string]: number }>({});

    const categories = [
        { id: 'all', name: t.shop.allProducts, icon: Package },
        { id: 'seeds', name: t.shop.seeds, icon: Sprout },
        { id: 'tools', name: t.shop.tools, icon: Wrench },
        { id: 'fertilizers', name: t.shop.fertilizers, icon: Droplet },
        { id: 'pots', name: t.shop.pots, icon: Package },
        { id: 'accessories', name: t.shop.accessories, icon: Star },
    ];

    const filteredProducts = mockProducts
        .filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.description.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
            return matchesSearch && matchesCategory;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'price-low': return a.price - b.price;
                case 'price-high': return b.price - a.price;
                case 'rating': return b.rating - a.rating;
                default: return a.name.localeCompare(b.name);
            }
        });

    const addToCart = (productId: string) => {
        setCart(prev => ({
            ...prev,
            [productId]: (prev[productId] || 0) + 1,
        }));
    };

    const getTotalItems = () => {
        return Object.values(cart).reduce((sum, count) => sum + count, 0);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent">
                        {t.shop.title}
                    </h1>
                    <p className="text-muted-foreground">
                        {t.shop.subtitle}
                    </p>
                </div>
                <div className="relative">
                    <button className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors flex items-center gap-2">
                        <ShoppingCart className="w-5 h-5" />
                        {t.shop.cart} ({getTotalItems()})
                    </button>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="mb-8 space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                        <input
                            type="text"
                            placeholder={t.shop.searchPlaceholder}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-muted/50 border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                    </div>

                    {/* Sort */}
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="px-4 py-3 bg-muted/50 border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    >
                        <option value="name">{t.shop.sortByName}</option>
                        <option value="price-low">{t.shop.priceLowToHigh}</option>
                        <option value="price-high">{t.shop.priceHighToLow}</option>
                        <option value="rating">{t.shop.highestRated}</option>
                    </select>
                </div>

                {/* Category Filters */}
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {categories.map((category) => {
                        const Icon = category.icon;
                        return (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap ${selectedCategory === category.id
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted/50 hover:bg-muted'
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                {category.name}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
                <div className="text-center py-20 bg-muted/30 rounded-3xl border border-dashed">
                    <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                        <Package className="w-10 h-10 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{t.shop.noProducts}</h3>
                    <p className="text-muted-foreground">{t.shop.tryAdjusting}</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    <AnimatePresence mode="popLayout">
                        {filteredProducts.map((product, index) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                layout
                            >
                                <ProductCard product={product} onAddToCart={addToCart} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Coming Soon Notice */}
            <div className="mt-12 bg-gradient-to-r from-primary/10 to-emerald-500/10 border border-primary/20 rounded-2xl p-8 text-center">
                <h3 className="text-2xl font-bold mb-2">{t.shop.comingSoon}</h3>
                <p className="text-muted-foreground mb-4">
                    {t.shop.comingSoonDesc}
                </p>
            </div>
        </div>
    );
}
