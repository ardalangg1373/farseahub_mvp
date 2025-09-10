'use client'
import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  ShoppingBag, MapPin, Heart, Users, ArrowRight, Globe, Shield, Zap, Sparkles, Youtube, Play
} from 'lucide-react'

/* =========================================================
   1) موتور اسکرول-ریویل سبک (IntersectionObserver + CSS)
   ========================================================= */
type RevealKind = 'fade-up' | 'slide-left' | 'slide-right' | 'scale-in' | 'focus-title'

function RevealProvider() {
  useEffect(() => {
    const root = document.body
    const els = new Set<HTMLElement>()

    root.querySelectorAll<HTMLElement>('[data-reveal]').forEach(el => els.add(el))

    root.querySelectorAll<HTMLElement>('[data-stagger]').forEach(parent => {
      const step = Number(parent.getAttribute('data-stagger')) || 120
      parent.querySelectorAll<HTMLElement>('> *').forEach((child, i) => {
        child.style.setProperty('--rv2-delay', `${i * step}ms`)
      })
    })

    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        const el = e.target as HTMLElement
        if (e.isIntersecting) {
          el.classList.add('rv2-in')
          if (el.dataset.countTo && !el.dataset.rv2Counted) {
            startCountUp(el)
            el.dataset.rv2Counted = '1'
          }
          io.unobserve(el)
        }
      }
    }, { threshold: 0.2, rootMargin: '0px 0px -10% 0px' })

    els.forEach((el) => {
      const kind = (el.getAttribute('data-reveal') as RevealKind) || 'fade-up'
      el.classList.add('rv2', `rv2--${kind}`)
      const d = el.getAttribute('data-delay')
      if (d) el.style.setProperty('--rv2-delay', d)
      io.observe(el)
    })

    return () => io.disconnect()
  }, [])
  return null
}

function startCountUp(el: HTMLElement) {
  const original = el.getAttribute('data-count-to') || '0'
  const dur = Number(el.getAttribute('data-count-duration') || 1400)
  const to = Number(original.replace(/[^\d.]/g, '')) || 0
  const plus = original.endsWith('+') ? '+' : ''
  const suffix = original.includes('K') ? 'K' : original.includes('M') ? 'M' : ''

  const t0 = performance.now()
  const tick = (t: number) => {
    const p = Math.min(1, (t - t0) / dur)
    const eased = 1 - Math.pow(1 - p, 2)
    const val = Math.floor(to * eased)
    el.textContent = `${val}${suffix}${plus}`
    if (p < 1) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}

function RevealStyles() {
  return (
    <style>{`
      :root{ --rv2-dur:560ms; --rv2-ease:cubic-bezier(.22,.61,.36,1); --rv2-delay:0ms; }
      .rv2{
        opacity:0; transform:translate3d(0,0,0);
        transition:
          opacity var(--rv2-dur) var(--rv2-ease) var(--rv2-delay),
          transform var(--rv2-dur) var(--rv2-ease) var(--rv2-delay),
          letter-spacing var(--rv2-dur) var(--rv2-ease) var(--rv2-delay),
          filter var(--rv2-dur) var(--rv2-ease) var(--rv2-delay);
        will-change:opacity,transform,letter-spacing,filter;
      }
      .rv2-in{ opacity:1; transform:none; filter:none; }
      .rv2--fade-up{ transform:translate3d(0,14px,0); }
      .rv2--slide-left{ transform:translate3d(-24px,0,0); }
      .rv2--slide-right{ transform:translate3d(24px,0,0); }
      .rv2--scale-in{ transform:scale(.98); filter:blur(.3px); }
      .rv2--focus-title{ letter-spacing:.06em; transform:translate3d(0,12px,0); }
      .rv2-in.rv2--focus-title{ letter-spacing:0; }
      [data-stagger] > *{ transition-delay: var(--rv2-delay, 0ms); }
      @media (prefers-reduced-motion: reduce){
        .rv2,[data-stagger] > *{ transition-duration:120ms !important; transition-delay:0ms !important; }
      }
    `}</style>
  )
}

/* =========================================================
   2) ویدیوهای هیرو — دست‌نخورده
   ========================================================= */
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
                  autoPlay muted playsInline preload="auto" loop
                  src={s}
                  onError={() => handleError(idx)}
                />
                <div className="absolute inset-0 bg-black/20" />
              </div>
            );
          })}
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

/* =========================================================
   3) صفحهٔ Home — با data-reveal
   ========================================================= */
const Home = () => {
  const mainFeatures = [
    { icon: ShoppingBag, title: 'Persian Marketplace', description: 'Discover authentic Persian products, crafts, and goods from trusted sellers worldwide.', link: '/marketplace', color: 'bg-blue-500' },
    { icon: MapPin,       title: 'Cultural Tourism',    description: "Explore Iran's rich heritage with guided tours, cultural experiences, and travel packages.", link: '/tourism',     color: 'bg-green-500' },
    { icon: Heart,        title: 'Persian Dating',      description: 'Connect with Persian singles and build meaningful relationships within our community.',   link: '/dating',      color: 'bg-pink-500' },
    { icon: Sparkles,     title: 'Metaverse Experience',description: 'Step into the future with immersive virtual Persian environments and digital experiences.',link: '/metaverse',   color: 'bg-purple-500' }
  ]

  const detailedFeatures = [
    { image: '/assets/marketplace.png',      title: 'Persian Marketplace', description: 'Shop authentic Persian products, handcrafted items, and cultural goods...', link: '/marketplace' },
    { image: '/assets/tourism.png',          title: 'Cultural Tourism',    description: "Discover Iran's magnificent heritage sites, book guided tours...", link: '/tourism' },
    { image: '/assets/metaverse.png',        title: 'Metaverse World',     description: 'Enter virtual Persian environments, attend digital cultural events...', link: '/metaverse' }
  ]

  return (
    <div className="min-h-screen">
      <RevealStyles />
      <RevealProvider />

      <VideoScrollSequence />

      {/* Tagline */}
      <section className="py-16 md:py-24">
        <h1 data-reveal="focus-title" className="text-center font-semibold tracking-tight text-4xl md:text-6xl">
          FarsiHub isn’t just another metaverse
        </h1>
      </section>

      {/* Main Features */}
      <section className="py-20 px-4">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8" data-stagger="180">
          {mainFeatures.map((feature, index) => {
            const Icon = feature.icon
            const reveal: RevealKind = index % 2 === 0 ? 'slide-left' : 'slide-right'
            return (
              <Card key={index} data-reveal={reveal} className="p-6">
                <CardHeader>
                  <Icon className="h-6 w-6 mb-4" />
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link to={feature.link}>
                    <Button variant="ghost">Learn More <ArrowRight className="ml-2 h-4 w-4" /></Button>
                  </Link>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Detailed Features */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8" data-stagger="200">
          {detailedFeatures.map((feature, index) => (
            <Card key={index} data-reveal="scale-in" className="overflow-hidden">
              <div className="aspect-video bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const img = e.currentTarget as HTMLImageElement
                    img.style.display = 'none'
                    const parent = img.parentElement
                    if (parent) {
                      const wrap = document.createElement('div')
                      wrap.className = 'flex items-center justify-center w-full h-full text-muted-foreground'
                      const span = document.createElement('span')
                      span.className = 'text-lg font-medium'
                      span.textContent = feature.title
                      wrap.appendChild(span)
                      parent.appendChild(wrap)
                    }
                  }}
                />
              </div>
              <CardHeader>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Home
