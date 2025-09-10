/** 
 * Home.tsx — Scroll Reveal (بدون Framer Motion)
 * - ویدیوها دست‌نخورده
 * - سیستم انیمیشن عمومی با IntersectionObserver + CSS
 * - ریویل عمومی: fade-up، slide-left/right، scale-in، focus-title
 * - استیجر کارت‌ها
 * - شمارنده اعداد با data-count-to
 */
'use client'
import * as React from 'react'

// ------------------------ //
// 1) موتور ریویلِ عمومی     //
// ------------------------ //

type RevealKind =
  | 'fade-up'      // محو + حرکت نرم به بالا
  | 'slide-left'   // ورود از چپ
  | 'slide-right'  // ورود از راست
  | 'scale-in'     // اسکیل خیلی نرم
  | 'focus-title'  // تیتر سینمایی: letter-spacing کوچک می‌شود
  | 'auto'         // بگذار موتور خودش تشخیص بده

function useRevealOnScroll(root: HTMLElement | null) {
  React.useEffect(() => {
    if (!root) return
    const els = new Set<HTMLElement>()

    // 1) Opt-in با data-reveal
    root.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
      els.add(el)
    })

    // 2) Auto-detect: تیترها، باکس‌ها، کارت‌ها (اگر data-reveal نداده‌ای)
    root.querySelectorAll<HTMLElement>([
      // تیترهای داخل سکشن‌ها
      'section h1:not([data-reveal]), section h2:not([data-reveal]), section h3:not([data-reveal])',
      // پاراگراف‌های شرح زیر تیتر
      'section p:not([data-reveal])',
      // کارت‌ها و باکس‌های رایج
      '[class*="card"]:not([data-reveal])',
      '.feature, .features [class*="item"], .grid > *:not([data-reveal])',
    ].join(',')).forEach((el) => els.add(el))

    // استیجر ساده با data-stagger روی والد
    root.querySelectorAll<HTMLElement>('[data-stagger]').forEach((parent) => {
      const step = Number(parent.getAttribute('data-stagger')) || 120
      parent.querySelectorAll<HTMLElement>('> *').forEach((child, i) => {
        child.style.setProperty('--rv-delay', `${i * step}ms`)
      })
    })

    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        const el = e.target as HTMLElement
        if (e.isIntersecting) {
          el.classList.add('rv-inview')
          // شمارنده‌ها: وقتی برای اولین بار وارد دید شدند
          if (el.dataset.countTo && !el.dataset.rvCounted) {
            startCountUp(el)
            el.dataset.rvCounted = '1'
          }
          // یکبار کافی‌ست
          io.unobserve(el)
        }
      }
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.2 })

    els.forEach((el) => {
      // نوع افکت
      const k = (el.getAttribute('data-reveal') as RevealKind) || inferRevealKind(el)
      el.classList.add('rv', `rv--${k}`)
      // تاخیر سفارشی (اگر گذاشتی)
      const d = el.getAttribute('data-delay')
      if (d) el.style.setProperty('--rv-delay', d)
      io.observe(el)
    })

    return () => io.disconnect()
  }, [root])
}

function inferRevealKind(el: HTMLElement): RevealKind {
  const tag = el.tagName.toLowerCase()
  if (tag === 'h1' || tag === 'h2') return 'focus-title'
  if (el.className.includes('card') || el.className.includes('feature')) return 'slide-up' as any
  return 'fade-up'
}

// ------------------------ //
// 2) شمارندهٔ سبک           //
// ------------------------ //
function startCountUp(el: HTMLElement) {
  const toRaw = el.getAttribute('data-count-to') || '0'
  const duration = Number(el.getAttribute('data-count-duration') || 1400)
  const format = el.getAttribute('data-count-format') || '' // مثل: 'K+' یا ''

  const to = Number(toRaw.replace(/[^\d.]/g, '')) || 0
  const start = performance.now()
  const from = 0

  const tick = (t: number) => {
    const p = Math.min(1, (t - start) / duration)
    const eased = 1 - Math.pow(1 - p, 2) // easeOutQuad
    const val = Math.floor(from + (to - from) * eased)
    el.textContent = formatValue(val, format, toRaw)
    if (p < 1) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}

function formatValue(n: number, fmt: string, original: string) {
  // اگر در مقدار اصلی K/M/+ داشتید، همان را حفظ کنیم
  if (original.includes('K')) return `${n}K${original.endsWith('+') ? '+' : ''}`
  if (original.includes('M')) return `${n}M${original.endsWith('+') ? '+' : ''}`
  if (fmt) return `${n}${fmt}`
  return String(n)
}

// ------------------------ //
// 3) کامپوننت موتور         //
// ------------------------ //
function RevealEngine() {
  const ref = React.useRef<HTMLDivElement>(null)
  useRevealOnScroll(ref.current || (typeof document !== 'undefined' ? document.body : null))
  return null
}

// ------------------------ //
// 4) صفحهٔ Home             //
// ------------------------ //
// ⛔️ مهم: ویدیوهای شما دست‌نخورده باقی می‌مانند.
// فقط RevealEngine و CSS جهانی را اضافه کرده‌ایم.
export default function Home() {
  return (
    <main>
      <RevealEngine />

      {/* استایل‌های جهانی برای ریویل‌ها */}
      <style jsx global>{`
        :root {
          --rv-duration: 560ms;
          --rv-ease: cubic-bezier(.22,.61,.36,1);
          --rv-delay: 0ms;
        }
        /* پایه */
        .rv {
          opacity: 0;
          transform: translate3d(0, 0, 0);
          transition:
            opacity var(--rv-duration) var(--rv-ease) var(--rv-delay),
            transform var(--rv-duration) var(--rv-ease) var(--rv-delay),
            letter-spacing var(--rv-duration) var(--rv-ease) var(--rv-delay),
            filter var(--rv-duration) var(--rv-ease) var(--rv-delay);
          will-change: opacity, transform, letter-spacing, filter;
        }
        .rv-inview { opacity: 1; transform: none; filter: none; }

        /* گونه‌ها */
        .rv--fade-up { transform: translate3d(0, 14px, 0); }
        .rv--slide-left { transform: translate3d(-24px, 0, 0); }
        .rv--slide-right { transform: translate3d(24px, 0, 0); }
        .rv--scale-in { transform: scale(.98); filter: blur(.3px); }
        .rv--focus-title { 
          letter-spacing: .06em; 
          transform: translate3d(0, 12px, 0);
        }

        /* وقتی در دید قرار گرفتند */
        .rv-inview.rv--focus-title { letter-spacing: 0; }

        /* Stagger برای گریدها: روی والد بزنید data-stagger="120" */
        [data-stagger] > * { transition-delay: var(--rv-delay, 0ms); }

        /* احترام به reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .rv, [data-stagger] > * {
            transition-duration: 120ms !important;
            transition-delay: 0ms !important;
          }
        }
      `}</style>

      {/* === بخش ویدیوهای شما — دست نزن! === */}
      <VideoScrollSequence />

      {/* === نمونه‌ها: این‌ها را با ساختار واقعی‌ت مچ کن === */}
      {/* هدر/قهرمان: تیتر و زیرتیتر با fade-up */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 data-reveal="focus-title" className="text-4xl md:text-6xl font-extrabold text-white">
          Your Gateway to Persian Culture
        </h1>
        <p data-reveal="fade-up" data-delay="120ms" className="mt-4 text-lg md:text-xl text-white/70">
          Discover authentic products, explore destinations, and join our global community.
        </p>
      </section>

      {/* شمارنده‌ها: فقط کافی‌ست data-count-to بدهی */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center" data-stagger="140">
          <div data-reveal="scale-in" className="rounded-2xl bg-white/5 p-6 border border-white/10">
            <div className="text-sm text-white/60">Active Users</div>
            <div data-count-to="50" className="mt-1 text-3xl font-bold text-white">0</div><span className="text-white ml-1">K+</span>
          </div>
          <div data-reveal="scale-in" className="rounded-2xl bg-white/5 p-6 border border-white/10">
            <div className="text-sm text-white/60">Products Listed</div>
            <div data-count-to="25" className="mt-1 text-3xl font-bold text-white">0</div><span className="text-white ml-1">K+</span>
          </div>
          <div data-reveal="scale-in" className="rounded-2xl bg-white/5 p-6 border border-white/10">
            <div className="text-sm text-white/60">Tours Available</div>
            <div data-count-to="500" className="mt-1 text-3xl font-bold text-white">0</div><span className="text-white ml-1">+</span>
          </div>
          <div data-reveal="scale-in" className="rounded-2xl bg-white/5 p-6 border border-white/10">
            <div className="text-sm text-white/60">Success Stories</div>
            <div data-count-to="1000" className="mt-1 text-3xl font-bold text-white">0</div><span className="text-white ml-1">+</span>
          </div>
        </div>
      </section>

      {/* کارت‌های فیچر با استیجر: از چپ/راست بیان */}
      <section className="container mx-auto px-4 py-20">
        <h2 data-reveal="focus-title" className="text-3xl md:text-4xl font-bold text-center text-white">
          Discover Our Features
        </h2>
        <p data-reveal="fade-up" data-delay="120ms" className="mt-3 text-center text-white/70">
          Explore the comprehensive features that make FarSeaHub your ultimate destination.
        </p>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6" data-stagger="200">
          <article data-reveal="slide-left" className="rounded-2xl bg-white/5 p-6 border border-white/10">
            <h3 className="text-xl font-semibold text-white">Persian Marketplace</h3>
            <p className="mt-2 text-white/70">Shop authentic Persian products from verified sellers worldwide.</p>
            <a className="mt-4 inline-block text-sm text-white/80 underline underline-offset-4" href="/marketplace">Learn More →</a>
          </article>

          <article data-reveal="scale-in" className="rounded-2xl bg-white/5 p-6 border border-white/10">
            <h3 className="text-xl font-semibold text-white">Cultural Tourism</h3>
            <p className="mt-2 text-white/70">Discover heritage sites, guided tours, and cultural experiences.</p>
            <a className="mt-4 inline-block text-sm text-white/80 underline underline-offset-4" href="/tourism">Learn More →</a>
          </article>

          <article data-reveal="slide-right" className="rounded-2xl bg-white/5 p-6 border border-white/10">
            <h3 className="text-xl font-semibold text-white">Metaverse World</h3>
            <p className="mt-2 text-white/70">Enter virtual Persian environments and digital events.</p>
            <a className="mt-4 inline-block text-sm text-white/80 underline underline-offset-4" href="/metaverse">Learn More →</a>
          </article>
        </div>
      </section>

      {/* تیتر بزرگ سینمایی */}
      <section className="container mx-auto px-4 py-24 text-center">
        <h2 data-reveal="focus-title" className="text-4xl md:text-5xl font-extrabold text-white">
          FarsiHub isn’t just another metaverse
        </h2>
      </section>
    </main>
  )
}

// ⛔️ فقط یادآوری: این را حذف نکن.
// در پروژهٔ شما قبلاً موجود است؛ همین‌جا صداش می‌کنیم تا ویدیوها دست‌نخورده بمانند.
function VideoScrollSequence() {
  // @NOTE: در پروژهٔ واقعی شما این کامپوننت موجود است.
  // اینجا فقط جای نگهدار گذاشتیم که ساختار نشکند.
  return <div />
}
