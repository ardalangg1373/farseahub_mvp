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

    // هر چیزی که data-reveal داشته باشد
    root.querySelectorAll<HTMLElement>('[data-reveal]').forEach(el => els.add(el))

    // استیجر ساده روی والد
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
          // شمارندهٔ اعداد
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
    const eased = 1 - Math.pow(1 - p, 2) // easeOutQuad
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
   2) اسکرول هیرو 3 ویدیو — بدون تغییر نسبت به مرجع تو
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
   3) صفحهٔ Home — فقط data-reveal و data-stagger اضافه شده
   ========================================================= */
const Home = () => {
  const mainFeatures = [
    { icon: ShoppingBag, title: 'Persian Marketplace', description: 'Discover authentic Persian products, crafts, and goods from trusted sellers worldwide.', link: '/marketplace', color: 'bg-blue-500' },
    { icon: MapPin,       title: 'Cultural Tourism',    description: "Explore Iran's rich heritage with guided tours, cultural experiences, and travel packages.", link: '/tourism',     color: 'bg-green-500' },
    { icon: Heart,        title: 'Persian Dating',      description: 'Connect with Persian singles and build meaningful relationships within our community.',   link: '/dating',      color: 'bg-pink-500' },
    { icon: Sparkles,     title: 'Metaverse Experience',description: 'Step into the future with immersive virtual Persian environments and digital experiences.',link: '/metaverse',   color: 'bg-purple-500' }
  ]

  const detailedFeatures = [
    { image: '/assets/marketplace.png',      title: 'Persian Marketplace', description: 'Shop authentic Persian products, handcrafted items, and cultural goods from verified sellers around the world. Experience traditional bazaar shopping in a modern digital environment.', link: '/marketplace' },
    { image: '/assets/tourism.png',          title: 'Cultural Tourism',    description: "Discover Iran's magnificent heritage sites, book guided cultural tours, and explore ancient Persian civilization through immersive travel experiences.", link: '/tourism' },
    { image: '/assets/metaverse.png',        title: 'Metaverse World',     description: 'Enter virtual Persian environments, attend digital cultural events, and experience the future of Persian community interaction in our immersive 3D world.', link: '/metaverse' },
    { image: '/assets/gaming_rewards.png',   title: 'Gaming & Rewards',    description: 'Earn rewards through gamified experiences, participate in Persian cultural challenges, and unlock exclusive benefits within our community ecosystem.', link: '/marketplace' },
    { image: '/assets/vip_experiences.png',  title: 'VIP Experiences',     description: 'Access exclusive Persian cultural events, premium tours, private cultural sessions, and connect with notable figures in the Persian community.', link: '/tourism' },
    { image: '/assets/partnerships.png',     title: 'Strategic Partnerships', description: 'Collaborate with Persian businesses, cultural organizations, and community leaders to expand opportunities and strengthen our global network.', link: '/marketplace' }
  ]

  const stats = [
    { label: 'Active Users', value: '50K+', icon: Users },
    { label: 'Products Listed', value: '25K+', icon: ShoppingBag },
    { label: 'Tours Available', value: '500+', icon: MapPin },
    { label: 'Success Stories', value: '1K+', icon: Heart }
  ]

  const benefits = [
    { icon: Globe,  title: 'Global Persian Community', description: 'Connect with Persians worldwide and celebrate our shared culture and heritage.' },
    { icon: Shield, title: 'Trusted & Secure',         description: 'Your privacy and security are our top priorities with end-to-end encryption.' },
    { icon: Zap,    title: 'Easy to Use',              description: 'Intuitive interface designed for seamless browsing, shopping, and connecting.' }
  ]

  return (
    <div className="min-h-screen">
      {/* استایل‌ها و موتور ریویل */}
      <RevealStyles />
      <RevealProvider />

      {/* 3 ویدیو - دست‌نخورده */}
      <VideoScrollSequence />

      {/* Tagline */}
      <section className="py-16 md:py-24">
        <h1
          data-reveal="focus-title"
          style={{ fontSize: 'clamp(28px, 6vw, 64px)', lineHeight: 1.15 }}
          className="text-center font-semibold tracking-tight"
        >
          FarsiHub isn’t just another metaverse
        </h1>
      </section>

      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950 dark:via-purple-950 dark:to-pink-950">
        <div className="container mx-auto text-center">
          <Badge variant="secondary" className="mb-4" data-reveal="fade-up">Welcome to FarSeaHub</Badge>

          <h1 data-reveal="focus-title" className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Your Gateway to<br />Persian Culture
          </h1>

          <p data-reveal="fade-up" data-delay="120ms" className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Discover authentic Persian products, explore cultural destinations, connect with the global Persian community, and experience the future in our Metaverse.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center" data-stagger="140">
            <Link to="/marketplace">
              <Button size="lg" className="w-full sm:w-auto" data-reveal="slide-left">
                Explore Marketplace <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/metaverse">
              <Button variant="outline" size="lg" className="w-full sm:w-auto" data-reveal="slide-right" data-delay="80ms">
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
            <h2 data-reveal="focus-title" className="text-3xl md:text-4xl font-bold mb-4">Everything Persian in One Place</h2>
            <p data-reveal="fade-up" data-delay="120ms" className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From shopping authentic goods to planning cultural trips, finding love, and exploring virtual worlds - FarSeaHub brings the Persian community together.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8" data-stagger="180">
            {mainFeatures.map((feature, index) => {
              const Icon = feature.icon
              const reveal: RevealKind = index % 4 === 0 ? 'slide-left' : index % 4 === 1 ? 'scale-in' : index % 4 === 2 ? 'scale-in' : 'slide-right'
              return (
                <Card
                  key={index}
                  data-reveal={reveal}
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
              )
            })}
          </div>
        </div>
      </section>

      {/* Detailed Features */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 data-reveal="focus-title" className="text-3xl md:text-4xl font-bold mb-4">Discover Our Features</h2>
            <p data-reveal="fade-up" data-delay="120ms" className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore the comprehensive features that make FarSeaHub your ultimate destination for Persian culture and community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" data-stagger="200">
            {detailedFeatures.map((feature, index) => (
              <Card key={index} data-reveal={(index % 3 === 0 ? 'slide-left' : index % 3 === 1 ? 'scale-in' : 'slide-right')}
                    className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="aspect-video overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                      const parent = target.parentElement
                      if (parent) parent.innerHTML = \`<div class="flex items-center justify-center w-full h-full text-muted-foreground"><span class="text-lg font-medium">\${feature.title}</span></div>\`
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8" data-stagger="140">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div key={index} className="text-center" data-reveal="scale-in">
                  <Icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <div className="text-3xl font-bold mb-1">
                    <span data-count-to={stat.value}>{stat.value.replace(/[0-9KM+]/g, '') ? 0 : 0}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 data-reveal="focus-title" className="text-3xl md:text-4xl font-bold mb-4">Why Choose FarSeaHub?</h2>
            <p data-reveal="fade-up" data-delay="120ms" className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We're more than just a platform - we're a community dedicated to preserving and celebrating Persian culture.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8" data-stagger="180">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon
              return (
                <div key={index} className="text-center" data-reveal="scale-in">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* YouTube Demo */}
      <section className="py-20 px-4 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950 dark:to-pink-950">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4 inline-flex items-center" data-reveal="fade-up">
              <Youtube className="h-3 w-3 mr-1" /> Watch Demo
            </Badge>
            <h2 data-reveal="focus-title" className="text-3xl md:text-4xl font-bold mb-4">Experience FarSeaHub Metaverse</h2>
            <p data-reveal="fade-up" data-delay="120ms" className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Watch our exclusive demo video showcasing the immersive Metaverse experience and see how Persian culture comes alive in virtual reality.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="overflow-hidden border-2 border-red-200 dark:border-red-800" data-reveal="scale-in">
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
  )
}

export default Home
