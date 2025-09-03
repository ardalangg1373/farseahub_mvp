
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, MapPin, Heart, Users, Star, ArrowRight, Globe, Shield, Zap, Sparkles, Play, Youtube } from 'lucide-react';

/* ======================= */
/* Helpers added (lightweight) */
/* ======================= */

// Reveal on scroll using IntersectionObserver
function Reveal({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible(true);
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out will-change-transform opacity-0 translate-y-6 ${
        visible ? 'opacity-100 translate-y-0' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}

// Fullscreen autoplay background video
function HeroVideo() {
  return (
    <section className="relative min-h-[100svh] w-full overflow-hidden">
      <video
        className="absolute inset-0 size-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        src="/videos/farsicoin-360.mp4"   {/* <-- replace with your actual path */}
        poster="/videos/farsicoin-poster.jpg"
      />
      <div className="absolute inset-0 bg-black/30" />
      <div className="relative z-10 flex h-[100svh] items-end justify-center pb-10 md:items-center md:pb-0">
        {/* Optional: scroll hint or minimal caption can go here */}
      </div>
    </section>
  );
}

const Home = () => {
  const mainFeatures = [
    {
      icon: ShoppingBag,
      title: 'Persian Marketplace',
      description: 'Discover authentic Persian products, crafts, and goods from trusted sellers worldwide.',
      link: '/marketplace',
      color: 'bg-blue-500'
    },
    {
      icon: MapPin,
      title: 'Cultural Tourism',
      description: "Explore Iran's rich heritage with guided tours, cultural experiences, and travel packages.",
      link: '/tourism',
      color: 'bg-green-500'
    },
    {
      icon: Heart,
      title: 'Persian Dating',
      description: 'Connect with Persian singles and build meaningful relationships within our community.',
      link: '/dating',
      color: 'bg-pink-500'
    },
    {
      icon: Sparkles,
      title: 'Metaverse Experience',
      description: 'Step into the future with immersive virtual Persian environments and digital experiences.',
      link: '/metaverse',
      color: 'bg-purple-500'
    }
  ];

  const detailedFeatures = [
    {
      image: '/assets/marketplace.png',
      title: 'Persian Marketplace',
      description: 'Shop authentic Persian products, handcrafted items, and cultural goods from verified sellers around the world. Experience traditional bazaar shopping in a modern digital environment.',
      link: '/marketplace'
    },
    {
      image: '/assets/tourism.png',
      title: 'Cultural Tourism',
      description: "Discover Iran's magnificent heritage sites, book guided cultural tours, and explore ancient Persian civilization through immersive travel experiences.",
      link: '/tourism'
    },
    {
      image: '/assets/metaverse.png',
      title: 'Metaverse World',
      description: 'Enter virtual Persian environments, attend digital cultural events, and experience the future of Persian community interaction in our immersive 3D world.',
      link: '/metaverse'
    },
    {
      image: '/assets/gaming_rewards.png',
      title: 'Gaming & Rewards',
      description: 'Earn rewards through gamified experiences, participate in Persian cultural challenges, and unlock exclusive benefits within our community ecosystem.',
      link: '/marketplace'
    },
    {
      image: '/assets/vip_experiences.png',
      title: 'VIP Experiences',
      description: 'Access exclusive Persian cultural events, premium tours, private cultural sessions, and connect with notable figures in the Persian community.',
      link: '/tourism'
    },
    {
      image: '/assets/partnerships.png',
      title: 'Strategic Partnerships',
      description: 'Collaborate with Persian businesses, cultural organizations, and community leaders to expand opportunities and strengthen our global network.',
      link: '/marketplace'
    }
  ];

  const stats = [
    { label: 'Active Users', value: '50K+', icon: Users },
    { label: 'Products Listed', value: '25K+', icon: ShoppingBag },
    { label: 'Tours Available', value: '500+', icon: MapPin },
    { label: 'Success Stories', value: '1K+', icon: Heart }
  ];

  const benefits = [
    {
      icon: Globe,
      title: 'Global Persian Community',
      description: 'Connect with Persians worldwide and celebrate our shared culture and heritage.'
    },
    {
      icon: Shield,
      title: 'Trusted & Secure',
      description: 'Your privacy and security are our top priorities with end-to-end encryption.'
    },
    {
      icon: Zap,
      title: 'Easy to Use',
      description: 'Intuitive interface designed for seamless browsing, shopping, and connecting.'
    }
  ];

  return (
    <div className="min-h-screen">

      {/* ✨ New: Video hero added at the very top */}
      <HeroVideo />

      {/* ✨ New: Scroll-to-reveal tagline */}
      <section className="py-16 md:py-24">
        <Reveal>
          <h1
            style={{ fontSize: 'clamp(28px, 6vw, 64px)', lineHeight: 1.15 }}
            className="text-center font-semibold tracking-tight"
          >
            FarsiHub isn’t just another metaverse
          </h1>
        </Reveal>
      </section>

      {/* Hero Section (kept as-is) */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950 dark:via-purple-950 dark:to-pink-950">
        <div className="container mx-auto text-center">
          <Badge variant="secondary" className="mb-4">
            Welcome to FarSeaHub
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Your Gateway to
            <br />
            Persian Culture
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Discover authentic Persian products, explore cultural destinations, connect with the global Persian community, and experience the future in our Metaverse.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/marketplace">
              <Button size="lg" className="w-full sm:w-auto">
                Explore Marketplace
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/metaverse">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                <Sparkles className="mr-2 h-4 w-4" />
                Enter Metaverse
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything Persian in One Place
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From shopping authentic goods to planning cultural trips, finding love, and exploring virtual worlds - FarSeaHub brings the Persian community together.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {mainFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link to={feature.link}>
                      <Button variant="ghost" className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        Learn More
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Detailed Features Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Discover Our Features
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore the comprehensive features that make FarSeaHub your ultimate destination for Persian culture and community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {detailedFeatures.map((feature, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="aspect-video overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `<div class="flex items-center justify-center w-full h-full text-muted-foreground"><span class="text-lg font-medium">${feature.title}</span></div>`;
                      }
                    }}
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link to={feature.link}>
                    <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      Explore Feature
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <Icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose FarSeaHub?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We're more than just a platform - we're a community dedicated to preserving and celebrating Persian culture.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* YouTube Demo Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950 dark:to-pink-950">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">
              <Youtube className="h-3 w-3 mr-1" />
              Watch Demo
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Experience FarSeaHub Metaverse
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Watch our exclusive demo video showcasing the immersive Metaverse experience and discover how Persian culture comes alive in virtual reality.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="overflow-hidden border-2 border-red-200 dark:border-red-800">
              <div className="aspect-video bg-gradient-to-br from-red-100 to-pink-100 dark:from-red-900 dark:to-pink-900 flex items-center justify-center relative group cursor-pointer">
                <div className="text-center">
                  <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                    <Play className="h-10 w-10 text-white ml-1" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">FarSeaHub Metaverse Demo</h3>
                  <p className="text-muted-foreground">Click to watch our exclusive preview</p>
                </div>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
              </div>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="bg-red-600 hover:bg-red-700">
                    <Youtube className="mr-2 h-5 w-5" />
                    Watch on YouTube
                  </Button>
                  <Button variant="outline" size="lg">
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Learn More
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Join Our Community?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Start your journey with FarSeaHub today. Discover, connect, and celebrate Persian culture like never before.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                Create Account
              </Button>
            </Link>
            <Link to="/marketplace">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-blue-600">
                Start Exploring
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;


