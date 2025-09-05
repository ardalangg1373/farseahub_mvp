import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";

/* ===========================
   Hooks
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
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive((e.target as HTMLElement).id);
        });
      },
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

/* ===========================
   Small UI Parts
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
                className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
                  active ? "text-white" : "text-zinc-400 hover:text-zinc-200"
                }`}
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
      className={`mb-16 rounded-2xl p-6 md:p-8 bg-white/5 border border-white/10 transition-all duration-500 will-change-transform ${
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
            background:
              "radial-gradient(circle, rgba(229,9,20,1) 0%, rgba(229,9,20,0.4) 60%, transparent 70%)",
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
   Whitepaper Page with Hestia-like motion
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

  /* ===== Scroll-scrubbed video + parallax layers ===== */
  const stageRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const particlesRef = useRef<HTMLDivElement | null>(null);
  const [duration, setDuration] = useState(8); // اگر ویدیو کوتاه/بلند بود می‌گیریم

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onMeta = () => setDuration(v.duration || 8);
    v.addEventListener("loadedmetadata", onMeta);
    return () => v.removeEventListener("loadedmetadata", onMeta);
  }, []);

  useEffect(() => {
    let raf = 0;
    const loop = () => {
      const stage = stageRef.current;
      const v = videoRef.current;
      const glow = glowRef.current;
      const grid = gridRef.current;
      const particles = particlesRef.current;
      if (stage) {
        const rect = stage.getBoundingClientRect();
        const vh = window.innerHeight || 1;
        // progress از 0 (خارج از بالا) تا 1 (خارج از پایین)
        const p = 1 - Math.min(1, Math.max(0, (rect.top + rect.height * 0.5) / (vh + rect.height)));
        // ویدیو را اسکراب کن:
        if (v && !isNaN(duration)) {
          v.currentTime = duration * p;
        }
        // پارالاکس: عمق‌های مختلف
        const translate = (el: HTMLElement | null, strength: number) => {
          if (!el) return;
          el.style.transform = `translateY(${(p - 0.5) * strength}px)`;
        };
        translate(glow as any, -60);
        translate(grid as any, -30);
        translate(particles as any, -10);

        // تیتر شناور داخل استیج
        const headings = stage.querySelectorAll<HTMLElement>("[data-float]");
        headings.forEach((h, i) => {
          const speed = (i + 1) * 6; // اختلاف سرعت
          h.style.transform = `translateY(${(1 - p) * speed}px)`;
          h.style.opacity = String(Math.min(1, p * 1.8));
          h.style.webkitMaskImage =
            "linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0.4) 70%, transparent 100%)";
          h.style.maskImage = h.style.webkitMaskImage;
        });
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [duration]);

  return (
    <div
      className="relative"
      style={{
        backgroundImage:
          `radial-gradient(40rem 40rem at 80% -10%, rgba(229,9,20,0.10), transparent 60%),
           radial-gradient(30rem 30rem at -10% 110%, rgba(229,9,20,0.05), transparent 60%)`,
      }}
    >
      <ScrollProgressBar />

      {/* ===== HERO / STAGE with scroll-scrub video ===== */}
      <section className="pt-24 md:pt-28 pb-10">
        <div className="max-w-6xl mx-auto px-6">
          <div
            ref={stageRef}
            className="relative rounded-[28px] border border-white/10 overflow-hidden bg-black/50"
            style={{ backdropFilter: "blur(12px)" }}
          >
            {/* پارالاکس لایه‌ها */}
            <div ref={glowRef} className="pointer-events-none absolute -inset-20"
                 style={{ background: "radial-gradient(40rem 40rem at 50% 20%, rgba(229,9,20,0.18), transparent 60%)" }} />
            <div ref={gridRef} className="pointer-events-none absolute inset-0 opacity-[0.08]"
                 style={{
                   backgroundImage:
                     "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
                   backgroundSize: "48px 48px, 48px 48px",
                 }} />
            <div ref={particlesRef} className="pointer-events-none absolute inset-0">
              {/* نقاط ساده */}
              <div className="absolute left-[10%] top-[20%] h-1 w-1 rounded-full bg-white/50" />
              <div className="absolute left-[80%] top-[35%] h-1 w-1 rounded-full bg-white/50" />
              <div className="absolute left-[60%] top-[70%] h-1 w-1 rounded-full bg-white/50" />
            </div>

            {/* ویدیو مرکزی که با اسکرول اسکراب می‌شود */}
            <div className="relative aspect-[16/9] md:aspect-[12/5]">
              <video
                ref={videoRef}
                src="/videos/whitepaper-hero.mp4" // ⬅️ مسیر ویدیو را عوض کن
                muted
                playsInline
                preload="metadata"
                className="h-full w-full object-cover opacity-90"
              />
              {/* تیترهای شناور روی استیج */}
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <h1
                    data-float
                    className="text-4xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent"
                    style={{
                      backgroundImage:
                        "linear-gradient(180deg, #fff 0%, rgba(255,255,255,0.85) 35%, rgba(229,9,20,0.9) 100%)",
                      textShadow: "0 0 24px rgba(229,9,20,0.35)",
                    }}
                  >
                    FarseaHub Whitepaper
                  </h1>
                  <p data-float className="mt-3 md:mt-4 text-zinc-300 max-w-xl mx-auto">
                    Scroll down — let it fly.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA بالای استیج */}
            <div className="relative p-5 md:p-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/10">
              <p className="text-sm text-zinc-300">
                Metaverse, Marketplace, and Community-owned economy powered by <b>FarsiCoin</b>.
              </p>
              <div className="flex gap-3">
                <a
                  href="/whitepaper.pdf"
                  className="rounded-xl px-4 py-3 text-sm font-semibold border border-red-500/50"
                  style={{
                    background: "linear-gradient(180deg, rgba(229,9,20,0.2), rgba(229,9,20,0.08))",
                    boxShadow: "0 0 22px rgba(229,9,20,0.35), inset 0 0 14px rgba(229,9,20,0.25)",
                  }}
                >
                  Download PDF
                </a>
                <Link
                  to="/farsicoin"
                  className="rounded-xl px-4 py-3 text-sm font-semibold bg-white/10 border border-white/10 hover:bg-white/15 transition"
                >
                  View FarsiCoin
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Body with sticky TOC & sections ===== */}
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
