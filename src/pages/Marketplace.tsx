import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Star, Heart, ShoppingCart } from 'lucide-react';

const Marketplace = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'handicrafts', label: 'Handicrafts' },
    { value: 'carpets', label: 'Persian Carpets' },
    { value: 'jewelry', label: 'Jewelry' },
    { value: 'food', label: 'Persian Food' },
    { value: 'books', label: 'Books & Literature' },
    { value: 'clothing', label: 'Traditional Clothing' },
    { value: 'art', label: 'Art & Paintings' }
  ];

  const products = [
    {
      id: 1,
      title: 'Handwoven Persian Carpet',
      description: 'Authentic Isfahan carpet with intricate floral patterns',
      price: '$2,500',
      originalPrice: '$3,200',
      seller: 'Persian Treasures',
      rating: 4.9,
      reviews: 127,
      category: 'carpets',
      featured: true
    },
    {
      id: 2,
      title: 'Saffron Premium Grade',
      description: 'Pure Iranian saffron from Khorasan province - 10g',
      price: '$45',
      originalPrice: '$55',
      seller: 'Spice Palace',
      rating: 4.8,
      reviews: 89,
      category: 'food',
      featured: false
    },
    {
      id: 3,
      title: 'Turquoise Silver Bracelet',
      description: 'Traditional Persian turquoise jewelry handcrafted in Isfahan',
      price: '$180',
      originalPrice: '$220',
      seller: 'Heritage Jewels',
      rating: 4.7,
      reviews: 56,
      category: 'jewelry',
      featured: true
    },
    {
      id: 4,
      title: 'Persian Poetry Collection',
      description: 'Complete works of Hafez with English translation',
      price: '$35',
      originalPrice: '$45',
      seller: 'Cultural Books',
      rating: 4.9,
      reviews: 203,
      category: 'books',
      featured: false
    },
    {
      id: 5,
      title: 'Minakari Decorative Plate',
      description: 'Hand-painted enamel work from Isfahan artisans',
      price: '$120',
      originalPrice: '$150',
      seller: 'Art & Craft Co',
      rating: 4.6,
      reviews: 34,
      category: 'handicrafts',
      featured: false
    },
    {
      id: 6,
      title: 'Traditional Chador',
      description: 'High-quality black chador with elegant embroidery',
      price: '$85',
      originalPrice: '$110',
      seller: 'Persian Fashion',
      rating: 4.5,
      reviews: 78,
      category: 'clothing',
      featured: true
    }
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Persian Marketplace</h1>
          <p className="text-lg text-muted-foreground">
            Discover authentic Persian products from trusted sellers worldwide
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" className="w-full md:w-auto">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </div>

        {/* Featured Products Banner */}
        <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-lg">
          <h2 className="text-2xl font-bold mb-2">Featured Products</h2>
          <p className="text-muted-foreground">Hand-picked authentic items from our top sellers</p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="group hover:shadow-lg transition-all duration-300">
              <CardHeader className="p-0">
                <div className="relative">
                  <div className="aspect-square bg-muted rounded-t-lg flex items-center justify-center">
                    <div className="text-muted-foreground text-sm">Product Image</div>
                  </div>
                  {product.featured && (
                    <Badge className="absolute top-2 left-2 bg-orange-500">
                      Featured
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <CardTitle className="text-lg line-clamp-1">{product.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{product.description}</CardDescription>
                  
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{product.rating}</span>
                    <span className="text-sm text-muted-foreground">({product.reviews})</span>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">by {product.seller}</div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="text-2xl font-bold">{product.price}</div>
                      {product.originalPrice && (
                        <div className="text-sm text-muted-foreground line-through">
                          {product.originalPrice}
                        </div>
                      )}
                    </div>
                    <Button className="flex items-center space-x-2">
                      <ShoppingCart className="h-4 w-4" />
                      <span>Add to Cart</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Load More Products
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;