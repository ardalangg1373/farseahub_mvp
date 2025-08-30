import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, MapPin, Calendar, Users, Star, Clock, Camera } from 'lucide-react';

const Tourism = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');

  const cities = [
    { value: 'all', label: 'All Cities' },
    { value: 'tehran', label: 'Tehran' },
    { value: 'isfahan', label: 'Isfahan' },
    { value: 'shiraz', label: 'Shiraz' },
    { value: 'yazd', label: 'Yazd' },
    { value: 'mashhad', label: 'Mashhad' },
    { value: 'tabriz', label: 'Tabriz' }
  ];

  const places = [
    {
      id: 1,
      title: 'Persepolis Ancient City',
      description: 'Explore the magnificent ruins of the ancient Persian capital',
      city: 'Shiraz',
      country: 'Iran',
      rating: 4.9,
      reviews: 1247,
      tours: 8,
      priceFrom: '$45',
      duration: '4-6 hours',
      category: 'Historical',
      featured: true,
      tags: ['Ancient', 'UNESCO', 'Historical']
    },
    {
      id: 2,
      title: 'Naqsh-e Jahan Square',
      description: 'UNESCO World Heritage site in the heart of Isfahan',
      city: 'Isfahan',
      country: 'Iran',
      rating: 4.8,
      reviews: 892,
      tours: 12,
      priceFrom: '$35',
      duration: '3-4 hours',
      category: 'Cultural',
      featured: true,
      tags: ['UNESCO', 'Architecture', 'Cultural']
    },
    {
      id: 3,
      title: 'Golestan Palace',
      description: 'Royal Qajar complex with stunning Persian architecture',
      city: 'Tehran',
      country: 'Iran',
      rating: 4.7,
      reviews: 634,
      tours: 6,
      priceFrom: '$25',
      duration: '2-3 hours',
      category: 'Palace',
      featured: false,
      tags: ['Royal', 'Architecture', 'Gardens']
    },
    {
      id: 4,
      title: 'Yazd Old City',
      description: 'Ancient desert city with unique wind tower architecture',
      city: 'Yazd',
      country: 'Iran',
      rating: 4.6,
      reviews: 445,
      tours: 5,
      priceFrom: '$30',
      duration: '5-7 hours',
      category: 'Historical',
      featured: false,
      tags: ['Desert', 'Architecture', 'Traditional']
    },
    {
      id: 5,
      title: 'Imam Reza Shrine',
      description: 'Sacred pilgrimage site and architectural masterpiece',
      city: 'Mashhad',
      country: 'Iran',
      rating: 4.9,
      reviews: 2156,
      tours: 4,
      priceFrom: '$20',
      duration: '2-4 hours',
      category: 'Religious',
      featured: true,
      tags: ['Religious', 'Pilgrimage', 'Architecture']
    },
    {
      id: 6,
      title: 'Blue Mosque',
      description: 'Stunning 15th-century mosque with intricate tilework',
      city: 'Tabriz',
      country: 'Iran',
      rating: 4.5,
      reviews: 278,
      tours: 3,
      priceFrom: '$15',
      duration: '1-2 hours',
      category: 'Religious',
      featured: false,
      tags: ['Architecture', 'Tilework', 'Historical']
    }
  ];

  const filteredPlaces = places.filter(place => {
    const matchesSearch = place.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         place.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCity = selectedCity === 'all' || place.city.toLowerCase() === selectedCity;
    return matchesSearch && matchesCity;
  });

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Discover Iran</h1>
          <p className="text-lg text-muted-foreground">
            Explore Iran's rich cultural heritage with expert guides and authentic experiences
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search destinations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="City" />
              </SelectTrigger>
              <SelectContent>
                {cities.map((city) => (
                  <SelectItem key={city.value} value={city.value}>
                    {city.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" className="w-full md:w-auto">
              <Calendar className="h-4 w-4 mr-2" />
              Dates
            </Button>
          </div>
        </div>

        {/* Featured Destinations Banner */}
        <div className="mb-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950 rounded-lg">
          <h2 className="text-2xl font-bold mb-2">Featured Destinations</h2>
          <p className="text-muted-foreground">UNESCO World Heritage sites and cultural treasures</p>
        </div>

        {/* Places Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlaces.map((place) => (
            <Card key={place.id} className="group hover:shadow-lg transition-all duration-300">
              <CardHeader className="p-0">
                <div className="relative">
                  <div className="aspect-[4/3] bg-muted rounded-t-lg flex items-center justify-center">
                    <Camera className="h-8 w-8 text-muted-foreground" />
                  </div>
                  {place.featured && (
                    <Badge className="absolute top-2 left-2 bg-green-500">
                      Featured
                    </Badge>
                  )}
                  <Badge variant="secondary" className="absolute top-2 right-2">
                    {place.category}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <CardTitle className="text-lg line-clamp-1">{place.title}</CardTitle>
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                      <MapPin className="h-3 w-3 mr-1" />
                      {place.city}, {place.country}
                    </div>
                  </div>
                  
                  <CardDescription className="line-clamp-2">{place.description}</CardDescription>
                  
                  <div className="flex flex-wrap gap-1">
                    {place.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{place.rating}</span>
                      <span className="text-muted-foreground">({place.reviews})</span>
                    </div>
                    <div className="flex items-center space-x-1 text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{place.duration}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-bold">From {place.priceFrom}</div>
                      <div className="text-xs text-muted-foreground">{place.tours} tours available</div>
                    </div>
                    <Button>
                      <Users className="h-4 w-4 mr-2" />
                      Book Tour
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
            Explore More Destinations
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Tourism;