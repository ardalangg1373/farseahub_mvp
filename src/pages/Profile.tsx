import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Settings, ShoppingBag, MapPin, Heart, Star, Calendar, Package } from 'lucide-react';

const Profile = () => {
  const user = {
    name: 'Sara Mohammadi',
    email: 'sara.mohammadi@email.com',
    joinDate: 'March 2024',
    location: 'Tehran, Iran',
    verified: true
  };

  const recentOrders = [
    {
      id: '1',
      title: 'Persian Saffron',
      date: '2024-01-15',
      status: 'Delivered',
      amount: '$45'
    },
    {
      id: '2',
      title: 'Handwoven Carpet',
      date: '2024-01-10',
      status: 'In Transit',
      amount: '$2,500'
    }
  ];

  const upcomingTours = [
    {
      id: '1',
      title: 'Persepolis Ancient City',
      date: '2024-02-20',
      time: '09:00 AM',
      guide: 'Ahmad Hosseini'
    },
    {
      id: '2',
      title: 'Isfahan Architecture Tour',
      date: '2024-03-05',
      time: '02:00 PM',
      guide: 'Maryam Karimi'
    }
  ];

  const matches = [
    { name: 'Arman', age: 31, city: 'Isfahan', status: 'Active' },
    { name: 'Kian', age: 29, city: 'Mashhad', status: 'New Match' },
    { name: 'Sina', age: 28, city: 'Tehran', status: 'Chatting' }
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-full flex items-center justify-center">
                <User className="h-12 w-12 text-muted-foreground" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start space-x-2 mb-2">
                  <h1 className="text-2xl font-bold">{user.name}</h1>
                  {user.verified && (
                    <Badge className="bg-blue-500">Verified</Badge>
                  )}
                </div>
                <p className="text-muted-foreground mb-2">{user.email}</p>
                <div className="flex items-center justify-center md:justify-start space-x-4 text-sm text-muted-foreground">
                  <span>📍 {user.location}</span>
                  <span>📅 Joined {user.joinDate}</span>
                </div>
              </div>
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Profile Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
            <TabsTrigger value="tourism">Tourism</TabsTrigger>
            <TabsTrigger value="dating">Dating</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <ShoppingBag className="h-5 w-5 mr-2" />
                    Marketplace
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Orders</span>
                      <span className="font-medium">12</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Favorites</span>
                      <span className="font-medium">8</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Reviews</span>
                      <span className="font-medium">5</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    Tourism
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Tours Booked</span>
                      <span className="font-medium">6</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Places Visited</span>
                      <span className="font-medium">4</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Reviews Left</span>
                      <span className="font-medium">3</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <Heart className="h-5 w-5 mr-2" />
                    Dating
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Matches</span>
                      <span className="font-medium">15</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Active Chats</span>
                      <span className="font-medium">3</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Profile Views</span>
                      <span className="font-medium">47</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="marketplace" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Your recent marketplace purchases</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Package className="h-8 w-8 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{order.title}</p>
                          <p className="text-sm text-muted-foreground">{order.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{order.amount}</p>
                        <Badge variant={order.status === 'Delivered' ? 'default' : 'secondary'}>
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tourism" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Tours</CardTitle>
                <CardDescription>Your booked tourism experiences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingTours.map((tour) => (
                    <div key={tour.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Calendar className="h-8 w-8 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{tour.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {tour.date} at {tour.time}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Guide: {tour.guide}
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dating" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Matches</CardTitle>
                <CardDescription>People you've connected with</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {matches.map((match, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900 dark:to-purple-900 rounded-full flex items-center justify-center">
                          <span className="font-semibold">{match.name[0]}</span>
                        </div>
                        <div>
                          <p className="font-medium">{match.name}, {match.age}</p>
                          <p className="text-sm text-muted-foreground">{match.city}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={match.status === 'New Match' ? 'default' : 'secondary'}>
                          {match.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;