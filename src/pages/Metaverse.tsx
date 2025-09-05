
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Gamepad2, Users, Zap, ArrowRight, Play, Settings } from 'lucide-react';


import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { useEffect, useRef } from 'react';


function ScrollVideo({
  src,
  start,
  end,
  progress,
}: {
  src: string;
  start: number; // 0..1
  end: number;   // 0..1
  progress: any; // MotionValue<number>
}) {
  const opacity = useTransform(progress, [start, (start + end) / 2, end], [0, 1, 0]);
  const scale = useTransform(progress, [start, end], [1.03, 1]);
  const ref = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const unsub = progress.on('change', (v: number) => {
      const el = ref.current;
      if (!el) return;
      const inside = v >= start && v < end;
      if (inside) {
        el.play().catch(() => {});
      } else {
        el.pause();
        try { el.currentTime = 0; } catch {}
      }
    });
    return () => unsub();
  }, [progress, start, end]);

  return (
    <motion.video
      ref={ref}
      src={src}
      muted
      playsInline
      preload="auto"
      className="absolute inset-0 h-full w-full object-cover rounded-3xl shadow-2xl"
      style={{ opacity, scale }}
    />
  );
}

const Metaverse = () => {
  
  const railRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: railRef,
    offset: ['start start', 'end end'],
  });
  const smooth = useSpring(scrollYProgress, { stiffness: 80, damping: 20, mass: 0.5 });

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">

        
        <section ref={railRef} className="relative mb-12 h-[320vh]">
          <div className="sticky top-0 h-screen overflow-hidden rounded-3xl">
            <ScrollVideo src="/film4.mp4" start={0.00} end={0.33} progress={smooth} />
            <ScrollVideo src="/film5.mp4" start={0.33} end={0.66} progress={smooth} />
            <ScrollVideo src="/film6.mp4" start={0.66} end={0.99} progress={smooth} />
            
            <div className="pointer-events-none absolute inset-0 rounded-3xl bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.6)_100%)]" />
            <motion.div
              className="absolute bottom-6 left-0 right-0 text-center text-xs md:text-sm text-white/80"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Scroll to explore
            </motion.div>
          </div>
        </section>
        

        
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
