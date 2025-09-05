import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";

/* ===========================
   Utils & Hooks
=========================== */

function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop;
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(h > 0 ? Math.min(100, Math.max(0, (y / h) * 100)) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  return progress;
}

function useScrollSpy(ids: string[], rootMargin = "-40% 0px -55% 0px") {
  const [activeId, setActive] = useState<string>(ids[0] || "");
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive((e.target as HTMLElement).id)),
      { root: null, rootMargin, threshold: 0.01 }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [ids, rootMargin]);
  return activeId;
}

function useReveal<T extends HTMLElement>(once = true, margin = "0px 0px -10% 0px") {
  const ref = useRef<T | null>(null);
  const [show, setShow] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true);
          if (once) obs.disconnect();
        } else if (!once) setShow(false);
      },
      { root: null, rootMargin: margin, threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [once, margin]);
  return { ref, show } as const;
}

function getInViewProgress(rect: DOMRect, vh: number) {
  const start = vh;
  const end = -rect.height;
  const y = rect.top;
  const p = (start - y) / (start - end);
  return Math.min(1, Math.max(0, p));
}

/* ===========================
   Small UI
=========================== */

function ScrollProgressBar() {
  const p = useScrollProgress();
  return (
    <div className="fixed inset-x-0 top-0 z-[60] h-1 bg-black/40 backdrop-blur">
      <div
        className="h-full transition-[width] duration-150"
        style={{
          width: `${p}%`,
          background: "linear-gradient(90deg, rgba(229,9,20,0.95), rgba(229,9,20,0.5))",
          boxShadow: "0 0 20px rgba(229,9,20,0.55)",
        }}
      />
    </div>
  );
}

function StickyTOC({ ids, labels, activeId }: { ids: string[]; labels: string[]; activeId: string }) {
  return (
    <aside className="hidden lg:block lg:sticky lg:top-24 self-start w-64 shrink-0 pr-6">
      <div className="rounded-2xl p-4 border border-white/10 bg-white/5" style={{ backdropFilter: "blur(8px)" }}>
        <div className="text-sm uppercase tracking-wider text-zinc-400 mb-3">On this page</div>
        <nav className="space-y-1">
          {ids.map((id, i) => {
            const active = id === activeId;
            return (
              <a
                key={id}
                href={`#${id}`}
                className={`block rounded-lg px-3 py-2 text-sm transition-colors ${active ? "text-white" : "text-zinc-400 hover:text-zinc-200"}`}
                style={
                  active
                    ? {
                        background: "linear-gradient(90deg, rgba(229,9,20,0.16), rgba(229,9,20,0.04))",
                        boxShadow: "0 0 18px rgba(229,9,20,0.25) inset",
                      }
                    : {}
                }
              >
                {labels[i]}
              </a>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  const { ref, show } = useReveal<HTMLDivElement>(true);
  return (
    <section
      id={id}
      ref={ref}
      className={`mb-16 rounded-2xl p-6 md:p-8 bg-white/5 border border-white/10 transition-all duration-500 ${
        show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
      style={{
        backdropFilter: "blur(10px)",
        boxShadow:
          "0 0 0 1px rgba(255,255,255,0.03), 0 0 24px rgba(229,9,20,0.08), inset 0 0 24px rgba(229,9,20,0.05)",
      }}
    >
      <h2 className="text-2xl md:text-3xl font-semibold mb-4 flex items-center gap-3">
        <span
          className="inline-block h-2 w-2 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(229,9,20,1) 0%, rgba(229,9,20,0.4) 60%, transparent 70%)",
            boxShadow: "0 0 18px rgba(229,9,20,0.8)",
          }}
        />
        {title}
      </h2>
      <div className="text-zinc-300 leading-8">{children}</div>
    </section>
  );
}

/* ===========================
   SCROLL VIDEO STACK (No rAF scrubbing)
=========================== */

function ScrollVideoStack({ sources }: { sources: string[] }) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const vidsRef = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    // دسترس‌پذیری: اگر کاربر موشن کم می‌خواهد، انیمیشن را خاموش کنیم
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    let raf = 0;
    const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
    const smoothstep = (e0: number, e1: number, x: number) => {
      const t = clamp((x - e0) / (e1 - e0));
      return t * t * (3 - 2 * t);
    };

    const loop = () => {
      const host = hostRef.current;
      if (host) {
        const rect = host.getBoundingClientRect();
        const vh = window.innerHeight || 1;
        // p از 0 تا n ویدیو (هر ویدیو پهنای 1)
        const p = getInViewProgress(rect, vh) * sources.length;
        const fadeWidth = 0.25; // پهنای محو شدن

        vidsRef.current.forEach((v, i) => {
          if (!v) return;
          const seg = p - i; // جایگاه نسبی ویدیو i نسبت به اسکرول
          let opacity = 0;

          // فید-این قبل از ورود
          if (seg >= -fadeWidth && seg < 0) {
            opacity = smoothstep(-fadeWidth, 0, seg);
          }
          // کامل در دید
          else if (seg >= 0 && seg <= 1) {
            // در میانه، 1؛ نزدیک مرز خروج، محوتر
            const out = smoothstep(1 - fadeWidth, 1, seg);
            opacity = 1 - out;
          } else {
            opacity = 0;
          }

          v.style.opacity = String(clamp(opacity, 0, 1));
        });
      }
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [sources.length]);

  // پرایم ویدیوها: اجازه بده مرورگر خودش Play/Buffer را مدیریت کند
  useEffect(() => {
    vidsRef.current.forEach((v) => {
      if (!v) return;
      try {
        // روی موبایل iOS/اندروید باید muted + playsInline باشد تا autoplay کار کند
        v.muted = true;
        v.playsInline = true;
        // فقط تلاش برای play (برخی مرورگرها lazy-play می‌کنند و اشکالی ندارد)
        const p = v.play();
        if (p && typeof p.catch === "function") p.catch(() => {});
      } catch {}
    });
  }, [sources]);

  return (
    // ارتفاع کلی: به‌ازای هر ویدیو ~120vh تا زمان برای کراس‌فید داشته باشیم
    <section ref={hostRef} className="relative" style={{ height: `${sources.length * 120}vh` }}>
      <div className="sticky top-0 h-screen w-screen overflow-hidden">
        {/* لایهٔ گریدینت برای حس سینمایی */}
        <div
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            background:
              "radial-gradient(60rem 60rem at 50% 15%, rgba(229,9,20,0.12), transparent 60%), linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0.35) 100%)",
          }}
        />
        {/* عنوان مرکزی */}
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
          <div className="text-center px-6">
            <h1
              className="hero-title text-4xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(180deg, #fff 0%, rgba(255,255,255,0.85) 45%, rgba(229,9,20,0.9) 100%)" }}
            >
              FarsiHub Whitepaper
            </h1>
            <p className="mt-3 md:mt-4 text-zinc-200 drop-shadow">Scroll down — seamless transition.</p>
          </div>
        </div>

        {/* خود ویدیوها: روی هم، با فید نرم */}
        {sources.map((src, i) => (
          <video
            key={src}
            ref={(el) => (vidsRef.current[i] = el)}
            src={src}
            className="absolute inset-0 h-full w-full object-cover will-change-[opacity] transition-opacity duration-300"
            style={{ opacity: 0 }}
            preload="auto"
            muted
            loop
            autoPlay
            playsInline
            // اگر پوستر داری بگذار: poster={`/thumbs/${basename}.jpg`}
            // crossOrigin="anonymous"
          />
        ))}

        {/* دکمه‌های گوشه پایین راست */}
        <div className="absolute right-4 md:right-8 bottom-4 md:bottom-8 z-30 flex gap-3 pointer-events-auto">
          <a
            href="/whitepaper.pdf"
            className="rounded-xl px-4 py-3 text-sm font-semibold border border-white/20 bg-white/10 hover:bg-white/15 transition"
            style={{ backdropFilter: "blur(6px)" }}
          >
            Download PDF
          </a>
          <Link
            to="/farsicoin"
            className="rounded-xl px-4 py-3 text-sm font-semibold border border-white/20 bg-white/10 hover:bg-white/15 transition"
            style={{ backdropFilter: "blur(6px)" }}
          >
            View FarsiCoin
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ===========================
   Page
=========================== */

const SECTIONS = [
  { id: "vision", label: "Vision & Problem" },
  { id: "utility", label: "FarsiCoin Utility" },
  { id: "tokenomics", label: "Tokenomics" },
  { id: "distribution", label: "Distribution & Vesting" },
  { id: "governance", label: "Governance" },
  { id: "roadmap", label: "Roadmap" },
  { id: "security", label: "Security & Audits" },
  { id: "legal", label: "Legal / Risk" },
  { id: "appendix", label: "Appendices" },
];

const Whitepaper = () => {
  const ids = useMemo(() => SECTIONS.map((s) => s.id), []);
  const activeId = useScrollSpy(ids);

  return (
    <div
      className="relative"
      style={{
        backgroundImage: `radial-gradient(40rem 40rem at 80% -10%, rgba(229,9,20,0.10), transparent 60%),
           radial-gradient(30rem 30rem at -10% 110%, rgba(229,9,20,0.05), transparent 60%)`,
      }}
    >
      <ScrollProgressBar />

      {/* ویدیوهای فول‌اسکرین با کراس‌فید نرم و بدون لگ */}
      <ScrollVideoStack sources={["/film7.mp4", "/film8.mp4", "/film9.mp4"]} />

      {/* بدنهٔ وایت‌پیپر */}
      <div className="max-w-6xl mx-auto px-6 pb-24 grid grid-cols-1 lg:grid-cols-[16rem_1fr] gap-8">
        <StickyTOC ids={ids} labels={SECTIONS.map((s) => s.label)} activeId={activeId} />
        <div className="min-w-0">
          <Section id="vision" title="Vision & Problem">
            <p>
              Mainstream platforms overlook Middle Eastern & cross-cultural communities. FarsiHub creates
              culturally tuned hubs—<i>Persian Bazaar</i>, <i>EastWorld Modern</i>—with community ownership via FarsiCoin.
            </p>
          </Section>

          <Section id="utility" title="FarsiCoin Utility">
            <ul className="list-disc pl-6 space-y-2">
              <li>Marketplace fees, creator payouts, and ticketing.</li>
              <li>Governance voting (hubs, events, treasury).</li>
              <li>Staking tiers, boosts, cross-hub perks.</li>
              <li>In-world payments for games, assets, services.</li>
            </ul>
          </Section>

          <Section id="tokenomics" title="Tokenomics">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Parameters</h3>
                <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm">
                  <div className="flex justify-between py-2"><span>Total Supply</span><span>1,000,000,000</span></div>
                  <div className="flex justify-between py-2"><span>Ticker</span><span>FAR</span></div>
                  <div className="flex justify-between py-2"><span>Chain</span><span>Cardano (testnet)</span></div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Allocation (sample)</h3>
                <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm space-y-2">
                  <div className="flex justify-between"><span>Community & Rewards</span><span>40%</span></div>
                  <div className="flex justify-between"><span>Treasury & Ecosystem</span><span>25%</span></div>
                  <div className="flex justify-between"><span>Team & Advisors</span><span>15%</span></div>
                  <div className="flex justify-between"><span>Investors</span><span>15%</span></div>
                  <div className="flex justify-between"><span>Liquidity</span><span>5%</span></div>
                </div>
              </div>
            </div>
          </Section>

          <Section id="distribution" title="Distribution & Vesting">
            Linear vesting with cliffs for team/investors; engagement-tied community emissions.
          </Section>

          <Section id="governance" title="Governance & Treasury">
            Token-weighted proposals, multi-sig treasury, scheduled transparency reports.
          </Section>

          <Section id="roadmap" title="Roadmap">
            <ol className="list-decimal pl-6 space-y-2">
              <li>MVP hubs (Persian Bazaar & EastWorld Modern).</li>
              <li>Testnet mint + payments (Paima Engine).</li>
              <li>Creator tools, events, marketplace.</li>
              <li>Mainnet & Governance v1.</li>
            </ol>
          </Section>

          <Section id="security" title="Security & Audits">
            Audits, bug bounties, staged rollouts; minimize custody, user-owned assets.
          </Section>

          <Section id="legal" title="Legal / Risk">
            Jurisdiction-aware disclaimers; evolving compliance; transparency.
          </Section>

          <Section id="appendix" title="Appendices & Links">
            <ul className="list-disc pl-6 space-y-2">
              <li><a className="underline decoration-red-600/60 underline-offset-4" href="/whitepaper.pdf">Whitepaper PDF</a></li>
              <li><Link className="underline decoration-red-600/60 underline-offset-4" to="/farsicoin">FarsiCoin page</Link></li>
            </ul>
          </Section>
        </div>
      </div>
    </div>
  );
};

export default Whitepaper;
