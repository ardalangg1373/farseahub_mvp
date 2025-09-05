import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Gamepad2, Users, Zap, ArrowRight, Play, Settings } from 'lucide-react';

/* ----------------- Crossfade helpers (no libraries) ----------------- */
const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));

function segOpacityOverlap(p: number, a: number, b: number, ov = 0.08) {
  const finStart = a - ov;
  const finEnd = a + ov;
  const foutStart = b - ov;
  const foutEnd = b;

  if (p <= finStart || p >= foutEnd) return 0;

  if (p > finStart && p <= finEnd) {
    return clamp((p - finStart) / (finEnd - finStart), 0, 1);
  }
  if (p > foutStart && p < foutEnd) {
    return clamp(1 - (p - foutStart) / (foutEnd - foutStart), 0, 1);
  }
  return 1;
}

function ScrollVideo({
  src, a, b, progress, ov = 0.08,
}: { src: string; a: number; b: number; progress: number; ov?: number }) {
  const ref = useRef<HTMLVideoElement | null>(null);
  const opacity = segOpacityOverlap(progress, a, b, ov);

  // زوم ثابت بزرگ‌تر + حرکت نرم
  const baseScale = 1.25; // افزایش از 1.15 به 1.25
  const scale = baseScale + (1.0 - baseScale) * opacity * 0.05;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const inside = progress > a - ov && progress < b;
    if (inside) {
      el.play().catch(() => {});
    } else {
      el.pause();
      try { el.currentTime = 0; } catch {}
    }
  }, [progress, a, b, ov]);

  return (
    <video
      ref={ref}
      src={src}
      muted
      playsInline
      preload="auto"
      className="absolute top-0 left-0 w-full h-full object-cover will-change-transform"
      style={{
        opacity,
        transform: `scale(${scale})`,
      }}
    />
  );
}
/* -------------------------------------------------------------------- */

const Metaverse = () => {
  const railRef = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = railRef.current;
    if (!el) return;

    let target = 0;
    let current = 0;
    let raf: number;

    const update = () => {
      // lerp → نرم کردن حرکت
      current += (target - current) * 0.08; // ضریب کوچکتر = نرم‌تر
      setProgress(current);
      raf = requestAnimationFrame(update);
    };

    const onScroll = () => {
      const top = el.offsetTop;
      const h = el.offsetHeight;
      const vh = window.innerHeight;
      const y = window.scrollY;
      target = clamp((y - top) / (h - vh), 0, 1);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">

        {/* ========= Scroll-driven videos: film4 → film5 → film6 ========= */}
        <section ref={railRef} className="relative mb-12 h-[320vh]">
          <div className="sticky top-0 h-screen overflow-hidden">
            <ScrollVideo src="/film4.mp4" a={0.00} b={0.34} progress={progress} ov={0.08} />
            <ScrollVideo src="/film5.mp4" a={0.33} b={0.67} progress={progress} ov={0.08} />
            <ScrollVideo src="/film6.mp4" a={0.66} b={1.00} progress={progress} ov={0.08} />

            {/* گرادینت بسیار ملایم روی لبه‌ها */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_46%,rgba(0,0,0,0.55)_100%)]" />

            <div className="absolute bottom-6 left-0 right-0 text-center text-xs md:text-sm text-white/80">
              Scroll to explore
            </div>
          </div>
        </section>
        {/* =================== پایان سکشن ویدیو =================== */}

        {/* ======= محتوای اصلی قبلی (بدون تغییر) ======= */}
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            <Sparkles className="h-3 w-3 mr-1" />
            Coming Soon
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
            FarSea Metaverse
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Step into the future of Persian culture with our immersive virtual world. Experience authentic Persian environments, 
            connect with the community, and explore digital marketplaces in a whole new dimension.
          </p>
        </div>

        <div className="mb-12">
          <Card className="border-2 border-dashed border-muted-foreground/20 bg-muted/10">
            <CardContent className="p-12 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <Gamepad2 className="h-12 w-12 text-purple-600 dark:text-purple-400" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Metaverse Experience Loading...</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                This is where the immersive Metaverse experience will be embedded. 
                Get ready for a revolutionary way to explore Persian culture in virtual reality.
              </p>
              <Button disabled className="gap-2">
                <Play className="h-4 w-4" />
                Launch Metaverse (Coming Soon)
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card className="group hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Users className="h-6 w-6 text-white" />
              </div>
              <CardTitle>Virtual Communities</CardTitle>
              <CardDescription>
                Join virtual Persian communities, attend cultural events, and meet people from around the world in immersive 3D spaces.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-pink-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <CardTitle>Digital Marketplace</CardTitle>
              <CardDescription>
                Experience shopping in virtual Persian bazaars, examine products in 3D, and interact with sellers in real-time.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <CardTitle>Virtual Tourism</CardTitle>
              <CardDescription>
                Take virtual tours of historical Persian sites, explore ancient cities, and experience Iran's beauty from anywhere.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              System Requirements
            </CardTitle>
            <CardDescription>
              Prepare your system for the ultimate Metaverse experience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Minimum Requirements</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Modern web browser with WebGL support</li>
                  <li>• 8GB RAM minimum</li>
                  <li>• Stable internet connection (10+ Mbps)</li>
                  <li>• Graphics card with DirectX 11 support</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Recommended</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• VR headset (Oculus, HTC Vive, etc.)</li>
                  <li>• 16GB+ RAM for optimal performance</li>
                  <li>• High-speed internet (50+ Mbps)</li>
                  <li>• Dedicated graphics card (RTX 3060+)</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border-purple-200 dark:border-purple-800">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">Be the First to Experience FarSea Metaverse</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Join our waitlist to get early access to the Metaverse experience and be among the first to explore 
                Persian culture in virtual reality.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="gap-2">
                  Join Waitlist
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="lg">
                  Learn More
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
};

export default Metaverse;
