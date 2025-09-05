// Home.tsx  — dynamic Matrix colors on scroll + 3D neon depth
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, MapPin, Heart, Users, ArrowRight, Globe, Shield, Zap, Sparkles, Youtube, Play } from 'lucide-react';

/* =============== Shared utilities =============== */
function Reveal({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver((ents) => {
      ents.forEach((e) => { if (e.isIntersecting) { setVisible(true); obs.unobserve(e.target); } });
    }, { threshold: 0.2 });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={`transition-all duration-700 ease-out will-change-transform opacity-0 translate-y-6 ${visible ? 'opacity-100 translate-y-0' : ''} ${className}`}>
      {children}
    </div>
  );
}

/* =============== MatrixRain with dynamic colors + 3D =============== */
/** کلمات پیشنهادی — هرچی خواستی تغییر بده */
const LEFT_WORDS = ['Own','the','narrative','FarsiHub','Middle','East','to','World','Culture','Power','Future'];
const RIGHT_WORDS = ['RoyalVerse','Cardano','Luxury','Community','Economy','Web3','Immersive','Design'];

type MatrixTheme = {
  neon: string;        // رنگ اصلی نئون
  deep: string;        // رنگ سایه خیلی تیره
  glow: string;        // رنگ هاله
  glassBorder: string; // بوردر شیشه‌ای
  glassGlow: string;   // گلو شیشه‌ای
};

const THEMES: MatrixTheme[] = [
  // 0) فیلم اول: قرمز خیلی تیره
  { neon:'#d31228', deep:'#0a0a0f', glow:'rgba(211,18,40,0.85)', glassBorder:'rgba(211,18,40,0.22)', glassGlow:'rgba(160,12,30,0.18)' },
  // 1) فیلم دوم: آبی خیلی تیره
  { neon:'#1f7cff', deep:'#05070d', glow:'rgba(31,124,255,0.9)', glassBorder:'rgba(31,124,255,0.22)', glassGlow:'rgba(20,80,210,0.16)' },
  // 2) پایین‌تر: بنفش
  { neon:'#9c3dff', deep:'#0a0710', glow:'rgba(156,61,255,0.88)', glassBorder:'rgba(156,61,255,0.22)', glassGlow:'rgba(120,40,210,0.16)' },
  // 3) آبی تیره‌تر
  { neon:'#0fb8ff', deep:'#03080c', glow:'rgba(15,184,255,0.88)', glassBorder:'rgba(15,184,255,0.22)', glassGlow:'rgba(10,120,180,0.14)' },
  // 4) برگشت به قرمز خیلی تیره
  { neon:'#c10f24', deep:'#07070a', glow:'rgba(193,15,36,0.86)', glassBorder:'rgba(193,15,36,0.22)', glassGlow:'rgba(140,12,30,0.16)' },
];

function MatrixRain({
  side, words, theme, speed = 55, density = 1.0, fixed = false,
}: {
  side: 'left' | 'right';
  words: string[];
  theme: MatrixTheme;
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

    // اندازه فونت نسبت به ارتفاع، برای تیره‌تر بودن صحنه بهتره کمی کوچیک باشه
    const fontBase = 18;
    const fontSize = Math.max(13, Math.round(fontBase * (window.innerHeight / 900)));
    const colW     = fontSize;
    const columns  = Math.max(6, Math.floor((canvas.width / colW) * density));
    const drops: number[] = Array(columns).fill(0).map(() => Math.floor(Math.random() * canvas.height / fontSize));

    // پارامترهای 3D: اکستروژن چندلایه + شیفت جهت‌دار
    const depthLayers = 6;         // تعداد لایه‌های اکستروژن
    const depthPx     = 1.1;       // فاصله هر لایه
    const xShift      = side === 'left' ? 0.6 : -0.6; // کمی پرسپکتیو به سمت داخل صفحه

    let raf: number | null = null;
    let last = 0;

    const tick = (now: number) => {
      if (!last || now - last >= speed) {
        last = now;

        // فید تاریک برای رد شبحی
        ctx.fillStyle = 'rgba(0,0,0,0.22)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.font = `${fontSize}px monospace`;

        for (let i = 0; i < columns; i++) {
          const word = words[Math.floor(Math.random() * words.length)];
          const x = i * colW;
          const y = drops[i] * fontSize;

          // --- اکستروژن 3D: چند لایه تیره با شیفت جزئی
          for (let d = depthLayers; d >= 1; d--) {
            ctx.fillStyle   = theme.deep;
            ctx.shadowColor = 'transparent';
            ctx.shadowBlur  = 0;
            ctx.globalCompositeOperation = 'source-over';
            ctx.fillText(word, x + d * xShift, y + d * depthPx);
          }

          // --- هاله زیرین بزرگ و خیلی نرم
          ctx.save();
          ctx.fillStyle   = theme.neon;
          ctx.shadowColor = theme.glow;
          ctx.shadowBlur  = 26;
          ctx.globalCompositeOperation = 'lighter';
          ctx.fillText(word, x, y);
          ctx.restore();

          // --- متن اصلی با نئون تیزتر
          ctx.fillStyle   = theme.neon;
          ctx.shadowColor = theme.glow;
          ctx.shadowBlur  = 14;
          ctx.globalCompositeOperation = 'lighter';
          ctx.fillText(word, x, y);

          // ریست دراپ
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
  }, [words, speed, density, theme, side]);

  return (
    <div
      className={`${fixed ? 'fixed' : 'absolute'} inset-y-0 ${side === 'left' ? 'left-0' : 'right-0'} z-30 hidden md:block pointer-events-none w-[min(18vw,220px)]`}
      style={{
        WebkitMaskImage:'linear-gradient(to right, transparent 0, black 14px, black calc(100% - 14px), transparent 100%)',
        maskImage:'linear-gradient(to right, transparent 0, black 14px, black calc(100% - 14px), transparent 100%)',
      }}
    >
      {/* شیشه خیلی تیره با بوردر/گلو هم‌رنگ تم جاری */}
      <div
        className="absolute inset-0 rounded-2xl backdrop-blur-md"
        style={{
          background: 'linear-gradient(180deg, rgba(6,6,10,.55), rgba(6,6,10,.55))',
          boxShadow: `inset 0 0 0 1px ${theme.glassBorder}, 0 0 28px ${theme.glassGlow}`,
        }}
      />
      <canvas ref={canvasRef} className="relative h-full w-full rounded-2xl" />
    </div>
  );
}

/* =============== 3-video scroll hero =============== */
function VideoScrollSequence({ onActiveIndex }: { onActiveIndex: (i: number) => void }) {
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
    const el = wrapRef.current; if (!el) return;
    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = el.offsetHeight - vh;
      const passed = Math.min(Math.max(0, -rect.top), total);
      const p = total > 0 ? passed / total : 0;
      setProgress(p);
      // فعال‌سازی ایندکس برای سوئیچ رنگ
      // a:0..~0.33 -> 0, b: ~0.33..~0.66 ->1, c: ~0.66..1 ->2
      const idx = p < 0.34 ? 0 : p < 0.67 ? 1 : 2;
      onActiveIndex(idx);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [onActiveIndex]);

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
  const scale = (w: number, idx: number) => (idx === 0 ? `scale(${0.9 + w * 0.05})` : `scale(${1 + w * 0.06})`);
  const blur  = (w: number) => `blur(${(1 - w) * 6}px)`;
  const op    = (w: number) => w;

  return (
    <section ref={wrapRef} className="relative h-[420vh] w-full overflow-visible">
      <div className="sticky top-0 h-[100svh] w-full">
        <div className="relative h-full w-full">
          {[0,1,2].map((idx) => {
            const w = idx === 0 ? a : idx === 1 ? b : c;
            const s = srcs[idx].url;
            return (
              <div key={idx} className="absolute inset-0 will-change-transform"
                style={{ opacity: op(w), transform: scale(w, idx), filter: blur(w), transition:'opacity .15s linear, transform .15s linear, filter .15s linear' }}>
                <video className="absolute inset-0 w-full h-full object-cover" autoPlay muted playsInline preload="auto" loop src={s} onError={() => handleError(idx)} />
                <div className="absolute inset-0 bg-black/35" />
              </div>
            );
          })}
          <div className="pointer-events-none absolute bottom-6 left-0 right-0 z-10 flex justify-center">
            <div className="rounded-full bg-black/50 px-4 py-2 text-xs text-white/90 backdrop-blur">Scroll to explore</div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =============== Home page =============== */
const Home = () => {
  // ایندکس سکشن فعال (برای سوئیچ تم)
  const [activeIdx, setActiveIdx] = useState(0);

  // تم پویا: 0=>قرمز تیره، 1=>آبی تیره، 2.. پایین‌تر چرخه (بنفش/آبی/قرمز)
  const dynamicTheme = useMemo<MatrixTheme>(() => {
    if (activeIdx === 0) return THEMES[0];
    if (activeIdx === 1) return THEMES[1];
    // پایین‌تر که میاد: بنفش -> آبی -> قرمز (با اسکرول بیشتر می‌تونیم تنوع بدیم)
    // برای سادگی، ایندکس را از اسکرول پایین‌تر با چرخه 2..4 می‌چرخانیم:
    const cycle = [THEMES[2], THEMES[3], THEMES[4]];
    const spin = (Date.now() / 1200) | 0; // کمی جنبش subtle
    return cycle[spin % cycle.length];
  }, [activeIdx]);

  const mainFeatures = [
    { icon: ShoppingBag, title: 'Persian Marketplace', description: 'Discover authentic Persian products, crafts, and goods from trusted sellers worldwide.', link: '/marketplace', color: 'bg-blue-500' },
    { icon: MapPin, title: 'Cultural Tourism', description: "Explore Iran's rich heritage with guided tours, cultural experiences, and travel packages.", link: '/tourism', color: 'bg-green-500' },
    { icon: Heart, title: 'Persian Dating', description: 'Connect with Persian singles and build meaningful relationships within our community.', link: '/dating', color: 'bg-pink-500' },
    { icon: Sparkles, title: 'Metaverse Experience', description: 'Step into the future with immersive virtual Persian environments and digital experiences.', link: '/metaverse', color: 'bg-purple-500' }
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
    <div className="min-h-screen relative bg-black">
      {/* Bar sides: Matrix columns with dynamic theme */}
      <MatrixRain side="left"  words={LEFT_WORDS}  theme={dynamicTheme} speed={52} density={1.05} fixed />
      <MatrixRain side="right" words={RIGHT_WORDS} theme={dynamicTheme} speed={52} density={1.05} fixed />

      {/* Videos + active index notifier */}
      <VideoScrollSequence onActiveIndex={setActiveIdx} />

      {/* Tagline */}
      <section className="py-16 md:py-24">
        <Reveal>
          <h1 style={{ fontSize: 'clamp(28px, 6vw, 64px)', lineHeight: 1.15 }}
              className="text-center font-semibold tracking-tight text-white">
            FarsiHub isn’t just another metaverse
          </h1>
        </Reveal>
      </section>

      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-[#08090b] via-[#0b0c11] to-[#09080d]">
        <div className="container mx-auto text-center">
          <Badge variant="secondary" className="mb-4">Welcome to FarSeaHub</Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent">
            Your Gateway to<br />Persian Culture
          </h1>
          <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
            Discover authentic Persian products, explore cultural destinations, connect with the global Persian community, and experience the future in our Metaverse.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/marketplace"><Button size="lg" className="w-full sm:w-auto">Explore Marketplace <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
            <Link to="/metaverse"><Button variant="outline" size="lg" className="w-full sm:w-auto"><Sparkles className="mr-2 h-4 w-4" /> Enter Metaverse</Button></Link>
          </div>
        </div>
      </section>

      {/* Main Features */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Everything Persian in One Place</h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              From shopping authentic goods to planning cultural trips, finding love, and exploring virtual worlds - FarSeaHub brings the Persian community together.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {mainFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-[#0b0b10] to-[#0e0e14] text-white">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <CardDescription className="text-base text-white/70">{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link to={feature.link}><Button variant="ghost" className="group-hover:bg-primary">Learn More <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4 bg-[#0a0b10]">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="text-center text-white">
                  <Icon className="h-8 w-8 mx-auto mb-2 text-white/80" />
                  <div className="text-3xl font-bold mb-1">{s.value}</div>
                  <div className="text-sm text-white/60">{s.label}</div>
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Why Choose FarSeaHub?</h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              We're more than just a platform - we're a community dedicated to preserving and celebrating Persian culture.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((b, i) => {
              const Icon = b.icon;
              return (
                <div key={i} className="text-center text-white">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Icon className="h-8 w-8 text-white/80" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{b.title}</h3>
                  <p className="text-white/70">{b.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* YouTube Demo */}
      <section className="py-20 px-4 bg-[#0a0b10]">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4 inline-flex items-center"> <Youtube className="h-3 w-3 mr-1" /> Watch Demo </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Experience FarSeaHub Metaverse</h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto mb-8">
              Watch our exclusive demo video showcasing the immersive Metaverse experience and see how Persian culture comes alive in virtual reality.
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <Card className="overflow-hidden border-2 border-white/10 bg-[#0b0c11]">
              <div className="aspect-video flex items-center justify-center relative group cursor-pointer">
                <div className="text-center">
                  <div className="rounded-full bg-white/10 text-white inline-flex p-4">
                    <Play className="h-8 w-8" />
                  </div>
                  <p className="mt-4 text-lg font-medium text-white/80">Watch on YouTube</p>
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
