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
      className={`transition-all duration-700 ease-out will-change-transform opacity-0 translate-y-6 ${
        visible ? 'opacity-100 translate-y-0' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}

/* ======================= */
/* Matrix rain (کلمه‌ای)  */
/* ======================= */

const LEFT_TEXT = [
  'For too long,',
  'mainstream',
  'media has told',
  'our story',
  'for us.'
];

const RIGHT_TEXT = [
  'RoyalVerse —',
  'the most luxurious',
  'metaverse on Cardano.',
  'Built for Middle Eastern',
  'storytellers.'
];

function MatrixRain({ side, lines }: { side: 'left' | 'right'; lines: string[] }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const words = lines.flatMap((l) => l.split(" "));
    const fontSize = 18;
    const columns = Math.floor(width / fontSize);
    const drops: number[] = Array(columns).fill(0);

    const draw = () => {
      ctx.fillStyle = "rgba(0,0,0,0.15)";
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = "#7affc4";
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < columns; i++) {
        const word = words[Math.floor(Math.random() * words.length)];
        ctx.fillText(word, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 60);

    const onResize = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", onResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", onResize);
    };
  }, [lines]);

  return (
    <div
      className={`absolute inset-y-0 ${
        side === "left" ? "left-0" : "right-0"
      } z-30 hidden md:block w-[min(22vw,280px)]`}
    >
      <canvas ref={canvasRef} className="h-full w-full bg-black/40" />
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

          {/* ستون‌های بارون متریکسی */}
          <MatrixRain side="left"  lines={LEFT_TEXT} />
          <MatrixRain side="right" lines={RIGHT_TEXT} />

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
/* Home page (بقیه همونه) */
/* ======================= */

const Home = () => {
  // همون محتوای اصلی که قبلا داشتی (mainFeatures, detailedFeatures, stats, benefits ...)
  // من تغییرش ندادم. فقط بالاش VideoScrollSequence رو گذاشتیم.

  // برای کوتاهی اینجا حذفش می‌کنم، ولی همون کد قبلی‌ت رو نگه دار.
  return (
    <div className="min-h-screen">
      <VideoScrollSequence />
      {/* ادامه همون سکشن‌ها و کدهای قبلی‌ت */}
    </div>
  );
};

export default Home;
