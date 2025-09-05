import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ShoppingBag,
  MapPin,
  Heart,
  Users,
  Star,
  ArrowRight,
  Globe,
  Shield,
  Zap,
  Sparkles,
  Play,
} from 'lucide-react';

/* ===== استایل فونت و نئون ===== */
<style>{`
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@600;700;800&display=swap');

  .neonText{
    font-family:'Orbitron',system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;
    color:#8ffcff;
    text-shadow:
      0 0 4px rgba(0,255,200,0.85),
      0 0 12px rgba(0,255,180,0.65),
      0 0 28px rgba(0,220,160,0.45);
    animation: neonPulse 6s ease-in-out infinite;
  }
  @keyframes neonPulse{0%,100%{filter:brightness(1)}50%{filter:brightness(1.25)}}
`}</style>

/* ===== کامپوننت متن‌های فید ===== */
const NeonSideText: React.FC<{
  side: 'left' | 'right';
  delayMs?: number;
  children: React.ReactNode;
}> = ({ side, delayMs = 0, children }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`pointer-events-none absolute inset-y-0 ${
        side === 'left' ? 'left-4 md:left-6' : 'right-4 md:right-6'
      } flex items-center`}
    >
      <p
        className={`neonText text-[clamp(18px,1.8vw,28px)] font-bold
          transition-opacity transition-transform duration-[1200ms] ease-out will-change-transform
          ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}
          ${side === 'right' ? 'text-right' : 'text-left'}`}
        style={{ animationDuration: '14s', transitionDelay: `${delayMs}ms` }}
      >
        {children}
      </p>
    </div>
  );
};

/* ===== صفحه Home ===== */
const Home = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ===== ویدیو اول ===== */}
      <section className="relative h-screen overflow-hidden">
        <video
          src="/film1.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
        <NeonSideText side="left" delayMs={0}>
          RoyalVerse is the most luxurious metaverse on Cardano.
        </NeonSideText>
        <NeonSideText side="right" delayMs={150}>
          Built for Middle Eastern storytellers — open to the world.
        </NeonSideText>
      </section>

      {/* ===== ویدیو دوم ===== */}
      <section className="relative h-screen overflow-hidden">
        <video
          src="/film2.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
        <NeonSideText side="left" delayMs={0}>
          Powered by FarsiCoin and community governance.
        </NeonSideText>
      </section>

      {/* ===== ویدیو سوم ===== */}
      <section className="relative h-screen overflow-hidden">
        <video
          src="/film3.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
        <NeonSideText side="left" delayMs={0}>
          Designed with taste, crafted with tech.
        </NeonSideText>
        <NeonSideText side="right" delayMs={150}>
          Join early. Build legacy.
        </NeonSideText>
      </section>

      {/* ===== ادامه محتوا (مثل قبل) ===== */}
      <div className="text-center py-20">
        <Badge variant="secondary" className="mb-4">
          <Sparkles className="h-3 w-3 mr-1" />
          Coming Soon
        </Badge>
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
          FarSea Hub
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
          Explore the luxurious RoyalVerse, connect with communities, and
          experience a new dimension of culture on Cardano.
        </p>
        <Button size="lg" className="gap-2">
          Join Waitlist <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Home;
