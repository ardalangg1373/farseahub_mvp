import React, { useEffect, useRef, useState } from 'react';

import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { Badge } from '@/components/ui/badge';

import {
  ShoppingBag, MapPin, Heart, Users, ArrowRight, Globe, Shield, Zap, Sparkles, Youtube, Play
} from 'lucide-react';


/* ======================= */
/* Helpers (Reveal)        */
/* ======================= */

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
      className={`transition-all duration-700 ease-out will-change-transform opacity-0 translate-y-6 ${visible ? 'opacity-100 translate-y-0' : ''} ${className}`}
    >
      {children}
    </div>
  );
}


/* ======================= */
/* Matrix rain — Red/Black Neon, Glass, Soft edges */
/* ======================= */

/** شعارها – هر چی خواستی اضافه/کم کن */
const LEFT_SLOGANS = [
  'For too long,', 'mainstream', 'media has told', 'our story', 'for us.',
  'We tell our own story.', 'Own the narrative.', 'Culture.ARDALAN Power. Future.',
  'From the Middle East — to the world.'
];

const RIGHT_SLOGANS = [
  'RoyalVerse —', 'the most luxurious', 'metaverse on Cardano.',
  'Built for Middle Eastern GALEDARI',
  'Luxury x Culture x Web3', 'Community-owned economy.',
];

function MatrixRain({
  side,
  words,
  speed = 55,     // بزرگ‌تر = کندتر
  density = 1.0,  // 0.8 خلوت‌تر | 1.2 شلوغ‌تر
  fixed = false,
}: {
  side: 'left' | 'right';
  words: string[];
  speed?: number;
  density?: number;
  fixed?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const fit = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    fit();

    // 🎯 قرمز تیره لاکچری به‌جای صورتی
    const deepRed   = '#b1001e';
    const neonColor = '#ff1a2b';
    const neonGlow  = 'rgba(255, 26, 43, .82)';

    const fontBase = 18;
    const fontSize = Math.max(14, Math.round(fontBase * (window.innerHeight / 900)));
    const colW     = fontSize;
    const columns  = Math.max(6, Math.floor((canvas.width / colW) * density));
    const drops: number[] = Array(columns)
      .fill(0)
      .map(() => Math.floor(Math.random() * canvas.height / fontSize));

    let raf: number | null = null;
    let last = 0;

    const tick = (now: number) => {
      if (!last || now - last >= speed) {
        last = now;

        // پس‌زمینه‌ی تار برای رد شبحی
        ctx.fillStyle = 'rgba(0,0,0,0.18)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.font = `${fontSize}px monospace`;
        ctx.fillStyle = neonColor;
        ctx.shadowColor = neonGlow;
        ctx.shadowBlur  = 12;

        for (let i = 0; i < columns; i++) {
          const word = words[Math.floor(Math.random() * words.length)];
          const x = i * colW;
          const y = drops[i] * fontSize;

          // سایه‌ی دوم خیلی لطیف برای عمق
          ctx.save();
          ctx.shadowColor = 'rgba(177, 0, 30, .35)'; // deep red glow
          ctx.shadowBlur = 22;
          ctx.fillText(word, x, y);
          ctx.restore();

          // متن اصلی
          ctx.fillStyle = neonColor;
          ctx.shadowColor = neonGlow;
          ctx.shadowBlur  = 12;
          ctx.fillText(word, x, y);

          if (y > canvas.height && Math.random() > 0.975) drops[i] = 0;
          drops[i]++;
        }
      }
      raf = requestAnimationFrame(tick);
    };

    const onResize = () => fit();

    raf = requestAnimationFrame(tick);
    window.addEventListener('resize', onResize);
    return () => { if (raf) cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); };
  }, [words, speed, density]);

  return (
    <div
      className={`${fixed ? 'fixed' : 'absolute'} inset-y-0 ${side === 'left' ? 'left-0' : 'right-0'} z-30 hidden md:block pointer-events-none w-[min(18vw,220px)]`}
      style={{
        // feather برای نرم‌شدن مرز با ویدیو
        WebkitMaskImage:
          'linear-gradient(to right, transparent 0, black 14px, black calc(100% - 14px), transparent 100%)',
        maskImage:
          'linear-gradient(to right, transparent 0, black 14px, black calc(100% - 14px), transparent 100%)',
      }}
    >
      {/* لایهٔ شیشه‌ای/مات با گلو قرمز تیره */}
      <div
        className="absolute inset-0 rounded-2xl backdrop-blur-md"
        style={{
          background: 'linear-gradient(180deg, rgba(10,10,12,.55), rgba(10,10,12,.55))',
          boxShadow: 'inset 0 0 0 1px rgba(255,26,43,.20), 0 0 28px rgba(177,0,30,.14)',
        }}
      />
      {/* هایلایت قرمز ملایمِ لبه‌ها */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          background: 'radial-gradient(120% 60% at 50% 0%, rgba(255,26,43,.12), transparent 60%)',
          mixBlendMode: 'screen',
        }}
      />
      {/* بوم بارون کلمه‌ای */}
      <canvas ref={canvasRef} className="relative h-full w-full rounded-2xl" />
    </div>
  );
}


/* ======================= */
/* 3-video scroll hero     */
/* ======================= */

function VideoScrollSequence() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [srcs, setSrcs] = useState([
    { primary: '/film1.mp4.mp4', fallback: '/flim1.mp4.mp4', url: '/film1.mp4.mp4' },
    { primary: '/film2.mp4.mp4', fallback: '/flim2.mp4.mp4', url: '/film2.mp4.mp4' },
    { primary: '/film3.mp4.mp4', fallback: '/flim3.mp4.mp4', url: '/film3.mp4.mp4' },
  ]);
  const [progress, setProgress] = useState(0);

  const handleError = (idx: number) =>
    setSrcs((arr) => arr.map((s, i) => (i === idx ? { ...s, url: s.fallback } : s)));

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = el.offsetHeight - vh;
      const passed = Math.min(Math.max(0, -rect.top), total);
      setProgress(total > 0 ? passed / total : 0);
    };
    const onResize = () => onScroll();
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const phase = (p: number) => {
    const a = Math.min(1, Math.max(0, (0.43 - p) / 0.10));
    const bIn = Math.min(1, Math.max(0, (p - 0.23) / 0.10));
    const bOut = Math.min(1, Math.max(0, (0.76 - p) / 0.10));
    const b = Math.min(bIn, bOut);
    const c = Math.min(1, Math.max(0, (p - 0.57) / 0.10));
    const sum = a + b + c || 1;
    return { a: a / sum, b: b / sum, c: c / sum };
  };

  const { a, b, c } = phase(progress);

  const scale = (w: number, idx: number) => {
    if (idx === 0) return `scale(${0.9 + w * 0.05})`;
    return `scale(${1 + w * 0.06})`;
  };
  const blur = (w: number) => `blur(${(1 - w) * 6}px)`;
  const op = (w: number) => w;

  return (
    <section ref={wrapRef} className="relative h-[420vh] w-full overflow-visible">
      <div className="sticky top-0 h-[100svh] w-full">
        <div className="relative h-full w-full">
          {[0, 1, 2].map((idx) => {
            const w = idx === 0 ? a : idx === 1 ? b : c;
            const s = srcs[idx].url;
            return (
              <div
                key={idx}
                className="absolute inset-0 will-change-transform"
                style={{
                  opacity: op(w),
                  transform: scale(w, idx),
                  filter: blur(w),
                  transition: 'opacity 0.15s linear, transform 0.15s linear, filter 0.15s linear',
                }}
              >
                <video
                  className="absolute inset-0 w-full h-full object-cover"
                  autoPlay
                  muted
                  playsInline
                  preload="auto"
                  loop
                  src={s}
                  onError={() => handleError(idx)}
                />
                <div className="absolute inset-0 bg-black/20" />
              </div>
            );
          })}

          {/* Scroll hint */}
          <div className="pointer-events-none absolute bottom-6 left-0 right-0 z-10 flex justify-center">
            <div className="rounded-full bg-black/40 px-4 py-2 text-xs text-white/90 backdrop-blur">
              Scroll to explore
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


/* ======================= */
/* Home page               */
/* ======================= */

const Home = () => {
  const mainFeatures = [
    { icon: ShoppingBag, title: 'Persian Marketplace', description: 'Discover authentic Persian products, crafts, and goods from trusted sellers worldwide.', link: '/marketplace', color: 'bg-blue-500' },
    { icon: MapPin, title: 'Cultural Tourism', description: "Explore Iran's rich heritage with guided tours, cultural experiences, and travel packages.", link: '/tourism', color: 'bg-green-500' },
    { icon: Heart, title: 'Persian Dating', description: 'Connect with Persian singles and build meaningful relationships within our community.', link: '/dating', color: 'bg-pink-500' },
    { icon: Sparkles, title: 'Metaverse Experience', description: 'Step into the future with immersive virtual Persian environments and digital experiences.', link: '/metaverse', color: 'bg-purple-500' }
  ];

  const detailedFeatures = [
    { image: '/assets/marketplace.png', title: 'Persian Marketplace', description: 'Shop authentic Persian products, handcrafted items, and cultural goods from verified sellers around the world. Experience traditional bazaar shopping in a modern digital environment.', link: '/marketplace' },
    { image: '/assets/tourism.png', title: 'Cultural Tourism', description: "Discover Iran's magnificent heritage sites, book guided cultural tours, and explore ancient Persian civilization through immersive travel experiences.", link: '/tourism' },
    { image: '/assets/metaverse.png', title: 'Metaverse World', description: 'Enter virtual Persian environments, attend digital cultural events, and experience the future of Persian community interaction in our immersive 3D world.', link: '/metaverse' },
    { image: '/assets/gaming_rewards.png', title: 'Gaming & Rewards', description: 'Earn rewards through gamified experiences, participate in Persian cultural challenges, and unlock exclusive benefits within our community ecosystem.', link: '/marketplace' },
    { image: '/assets/vip_experiences.png', title: 'VIP Experiences', description: 'Access exclusive Persian cultural events, premium tours, private cultural sessions, and connect with notable figures in the Persian community.', link: '/tourism' },
    { image: '/assets/partnerships.png', title: 'Strategic Partnerships', description: 'Collaborate with Persian businesses, cultural organizations, and community leaders to expand opportunities and strengthen our global network.', link: '/marketplace' }
  ];

  const stats = [
    { label: 'Active Users', value: '50K+', icon: Users },
    { label: 'Products Listed', value: '25K+', icon: ShoppingBag },
    { label: 'Tours Available', value: '500+', icon: MapPin },
    { label: 'Success Stories', value: '1K+', icon: Heart }
  ];

  const benefits = [
    { icon: Globe, title: 'Global Persian Community', description: 'Connect with Persians worldwide and celebrate our shared culture and heritage.' },
    { icon: Shield, title: 'Trusted & Secure', description: 'Your privacy and security are our top priorities with end-to-end encryption.' },
    { icon: Zap, title: 'Easy to Use', description: 'Intuitive interface designed for seamless browsing, shopping, and connecting.' }
  ];

  return (
    <div className="min-h-screen relative">
      {/* Matrix Rain ثابت در کل سایت */}
      <MatrixRain side="left"  words={LEFT_SLOGANS}  speed={55} density={1.0} fixed />
      <MatrixRain side="right" words={RIGHT_SLOGANS} speed={55} density={1.0} fixed />

      {/* سکشن ویدیو */}
      <VideoScrollSequence />

      {/* Tagline */}
      <section className="py-16 md:py-24">
        <Reveal>
          <h1 style={{ fontSize: 'clamp(28px, 6vw, 64px)', lineHeight: 1.15 }} className="text-center font-semibold tracking-tight">
            FarsiHub isn’t just another metaverse
          </h1>
        </Reveal>
      </section>

      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950 dark:via-purple-950 dark:to-pink-950">
        <div className="container mx-auto text-center">
          <Badge variant="secondary" className="mb-4">Welcome to FarSeaHub</Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Your Gateway to<br />Persian Culture
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Discover authentic Persian products, explore cultural destinations, connect with the global Persian community, and experience the future in our Metaverse.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/marketplace">
              <Button size="lg" className="w-full sm:w-auto">
                Explore Marketplace <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/metaverse">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                <Sparkles className="mr-2 h-4 w-4" /> Enter Metaverse
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Features */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything Persian in One Place</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From shopping authentic goods to planning cultural trips, finding love, and exploring virtual worlds - FarSeaHub brings the Persian community together.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {mainFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800"
                >
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <CardDescription className="text-base">{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link to={feature.link}>
                      <Button variant="ghost" className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        Learn More <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Detailed Features */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Discover Our Features</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore the comprehensive features that make FarSeaHub your ultimate destination for Persian culture and community.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { image: '/assets/marketplace.png', title: 'Persian Marketplace', description: 'Shop authentic Persian products, handcrafted items, and cultural goods from verified sellers around the world. Experience traditional bazaar shopping in a modern digital environment.', link: '/marketplace' },
              { image: '/assets/tourism.png', title: 'Cultural Tourism', description: "Discover Iran's magnificent heritage sites, book guided cultural tours, and explore ancient Persian civilization through immersive travel experiences.", link: '/tourism' },
              { image: '/assets/metaverse.png', title: 'Metaverse World', description: 'Enter virtual Persian environments, attend digital cultural events, and experience the future of Persian community interaction in our immersive 3D world.', link: '/metaverse' },
              { image: '/assets/gaming_rewards.png', title: 'Gaming & Rewards', description: 'Earn rewards through gamified experiences, participate in Persian cultural challenges, and unlock exclusive benefits within our community ecosystem.', link: '/marketplace' },
              { image: '/assets/vip_experiences.png', title: 'VIP Experiences', description: 'Access exclusive Persian cultural events, premium tours, private cultural sessions, and connect with notable figures in the Persian community.', link: '/tourism' },
              { image: '/assets/partnerships.png', title: 'Strategic Partnerships', description: 'Collaborate with Persian businesses, cultural organizations, and community leaders to expand opportunities and strengthen our global network.', link: '/marketplace' }
            ].map((feature, index) => (
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
                  <CardDescription className="text-base leading-relaxed">{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link to={feature.link}>
                    <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      Explore Feature <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
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

      {/* Benefits */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose FarSeaHub?</h2>
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

      {/* YouTube Demo */}
      <section className="py-20 px-4 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950 dark:to-pink-950">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4 inline-flex items-center">
              <Youtube className="h-3 w-3 mr-1" />
              Watch Demo
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Experience FarSeaHub Metaverse</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Watch our exclusive demo video showcasing the immersive Metaverse experience and see how Persian culture comes alive in virtual reality.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="overflow-hidden border-2 border-red-200 dark:border-red-800">
              <div className="aspect-video bg-gradient-to-br from-red-100 to-pink-100 dark:from-red-900 dark:to-pink-900 flex items-center justify-center relative group cursor-pointer">
                <div className="text-center">
                  <div className="rounded-full bg-red-600 text-white inline-flex p-4">
                    <Play className="h-8 w-8" />
                  </div>
                  <p className="mt-4 text-lg font-medium">Watch on YouTube</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
