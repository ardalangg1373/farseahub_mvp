
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
      className={\`transition-all duration-700 ease-out will-change-transform opacity-0 translate-y-6 \${visible ? 'opacity-100 translate-y-0' : ''} \${className}\`}
    >
      {children}
    </div>
  );
}

/* ======================= */
/* Matrix rain (کلمه‌ای) — نئون قرمز، شیشه‌ای، لبه نرم */
/* ======================= */

const LEFT_SLOGANS = [
  'For too long,', 'mainstream', 'media has told', 'our story', 'for us.',
  'We tell our own story.', 'Own the narrative.', 'Culture. Power. Future.',
  'From the Middle East — to the world.'
];

const RIGHT_SLOGANS = [
  'RoyalVerse —', 'the most luxurious', 'metaverse on Cardano.',
  'Built for Middle Eastern', 'storytellers — open to the world.',
  'Create. Trade. Thrive.', 'Luxury x Culture x Web3', 'Community-owned economy.',
];

function MatrixRain({
  side,
  words,
  speed = 55,
  density = 1.0,
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

    const neonColor = '#ff4d6d';
    const neonGlow  = 'rgba(255, 77, 109, .75)';

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
        ctx.fillStyle = 'rgba(0,0,0,0.18)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.font = \`\${fontSize}px monospace\`;
        ctx.fillStyle = neonColor;
        ctx.shadowColor = neonGlow;
        ctx.shadowBlur  = 10;

        for (let i = 0; i < columns; i++) {
          const word = words[Math.floor(Math.random() * words.length)];
          const x = i * colW;
          const y = drops[i] * fontSize;

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
      className={\`\${fixed ? 'fixed' : 'absolute'} inset-y-0 \${side === 'left' ? 'left-0' : 'right-0'} z-30 hidden md:block pointer-events-none w-[min(18vw,220px)]\`}
      style={{
        WebkitMaskImage:
          'linear-gradient(to right, transparent 0, black 14px, black calc(100% - 14px), transparent 100%)',
        maskImage:
          'linear-gradient(to right, transparent 0, black 14px, black calc(100% - 14px), transparent 100%)',
      }}
    >
      <div
        className="absolute inset-0 rounded-2xl backdrop-blur-md"
        style={{
          background:
            'linear-gradient(180deg, rgba(15,15,20,.55), rgba(15,15,20,.55))',
          boxShadow:
            'inset 0 0 0 1px rgba(255,77,109,.18), 0 0 24px rgba(255,77,109,.10)',
        }}
      />
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          background:
            'radial-gradient(120% 60% at 50% 0%, rgba(255,77,109,.10), transparent 60%)',
          mixBlendMode: 'screen',
        }}
      />
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
    if (idx === 0) return \`scale(\${0.9 + w * 0.05})\`;
    return \`scale(\${1 + w * 0.06})\`;
  };
  const blur = (w: number) => \`blur(\${(1 - w) * 6}px)\`;
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
                  className="absolute inset-0 size-full object-cover"
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
  return (
    <div className="min-h-screen relative">
      {/* Matrix Rain ثابت در کل سایت */}
      <MatrixRain side="left"  words={LEFT_SLOGANS}  speed={55} density={1.0} fixed />
      <MatrixRain side="right" words={RIGHT_SLOGANS} speed={55} density={1.0} fixed />

      {/* سکشن ویدیو */}
      <VideoScrollSequence />

      {/* بقیه سکشن‌ها همون قبلیت */}
    </div>
  );
};

export default Home;
