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

function getInViewProgress(rect: DOMRect, vh: number) {
  const start = vh;
  const end = -rect.height;
  const y = rect.top;
  const p = (start - y) / (start - end);
  return Math.min(1, Math.max(0, p));
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

function LiteLottie() {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
      <defs>
        <linearGradient id="lg" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="rgba(255,255,255,0)" />
          <stop offset="0.5" stopColor="rgba(255,255,255,0.8)" />
          <stop offset="1" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
      </defs>
      <g opacity="0.25">
        <rect x="-50" y="20" width="50" height="1.2" fill="url(#lg)">
          <animate attributeName="x" from="-50" to="150" dur="6s" repeatCount="indefinite" />
        </rect>
        <rect x="-60" y="60" width="60" height="1.2" fill="url(#lg)" opacity="0.7">
          <animate attributeName="x" from="-60" to="160" dur="8s" repeatCount="indefinite" />
        </rect>
      </g>
      {[...Array(18)].map((_, i) => {
        const rx = (i * 17) % 100;
        const ry = (i * 29) % 100;
        return (
          <g key={i} opacity="0.8">
            <circle cx={rx} cy={ry} r="0.4" fill="white">
              <animate attributeName="opacity" values="0;1;0" dur={`${2 + (i % 4)}s`} repeatCount="indefinite" />
              <animate attributeName="cy" from={ry} to={ry - 10} dur={`${5 + (i % 5)}s`} repeatCount="indefinite" />
            </circle>
          </g>
        );
      })}
    </svg>
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
   Whitepaper Page
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

function PinScene({ index, title, subtitle }: { index: number; title: React.ReactNode; subtitle?: React.ReactNode }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [p, setP] = useState(0);
  useEffect(() => {
    let raf = 0;
    const loop = () => {
      const el = ref.current;
      if (el) {
        const rect = el.getBoundingClientRect();
        const vh = window.innerHeight || 1;
        setP(getInViewProgress(rect, vh));
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section className="relative h-[160vh]">
      <div ref={ref} className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 transition-opacity duration-200"
          style={{ opacity: Math.max(0, Math.min(1, 1 - Math.abs(p * 2 - 1))) }}
        >
          <div
            className="absolute -inset-24"
            style={{
              background: `radial-gradient(50rem 50rem at ${20 + index * 30}% 20%, rgba(229,9,20,0.12), transparent 60%)`,
              filter: "blur(4px)",
            }}
          />
        </div>
        <div className="relative z-10 text-center px-6">
          <h2
            className="split-title text-4xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(180deg, #fff 0%, rgba(255,255,255,0.85) 35%, rgba(229,9,20,0.9) 100%)",
            }}
          >
            {title}
          </h2>
          {subtitle ? <p className="mt-4 text-zinc-300">{subtitle}</p> : null}
        </div>
      </div>
    </section>
  );
}

const Whitepaper = () => {
  const ids = useMemo(() => SECTIONS.map((s) => s.id), []);
  const activeId = useScrollSpy(ids);

  const stageRef = useRef<HTMLDivElement | null>(null);
  const videoRefA = useRef<HTMLVideoElement | null>(null);
  const videoRefB = useRef<HTMLVideoElement | null>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const [durA, setDurA] = useState(8);
  const [durB, setDurB] = useState(8);

  // لود متادیتا + پینت فریم اول
  useEffect(() => {
    const va = videoRefA.current;
    const vb = videoRefB.current;

    const prime = (v: HTMLVideoElement | null, setDur?: (n: number) => void) => {
      if (!v) return () => {};
      const onMeta = () => {
        if (setDur) setDur(isFinite(v.duration) ? v.duration : 8);
        try {
          v.pause();
          v.currentTime = 0.001; // تضمین پینت
        } catch {}
      };
      if (v.readyState >= 2) onMeta();
      v.addEventListener("loadedmetadata", onMeta);
      v.addEventListener("loadeddata", onMeta);
      return () => {
        v.removeEventListener("loadedmetadata", onMeta);
        v.removeEventListener("loadeddata", onMeta);
      };
    };

    const cleanA = prime(va, setDurA);
    const cleanB = prime(vb, setDurB);
    return () => {
      cleanA && cleanA();
      cleanB && cleanB();
    };
  }, []);

  // اسکراب با اسکرول + کراس فید
  useEffect(() => {
    let raf = 0;
    const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
    const smoothstep = (e0: number, e1: number, x: number) => {
      const t = clamp((x - e0) / (e1 - e0));
      return t * t * (3 - 2 * t);
    };

    const loop = () => {
      const stage = stageRef.current;
      const va = videoRefA.current;
      const vb = videoRefB.current;
      const glow = glowRef.current;
      const grid = gridRef.current;

      if (stage) {
        const rect = stage.getBoundingClientRect();
        const vh = window.innerHeight || 1;
        const p = 1 - Math.min(1, Math.max(0, (rect.top + rect.height * 0.5) / (vh + rect.height))); // 0..1
        const seg = p * 2; // 0..2

        if (va && !isNaN(durA)) {
          const localA = clamp(seg, 0, 1);
          va.currentTime = durA * localA;
        }
        if (vb && !isNaN(durB)) {
          const localB = clamp(seg - 1, 0, 1);
          vb.currentTime = durB * localB;
        }

        const fadeWidth = 0.18;
        const aOpacity = 1 - smoothstep(1 - fadeWidth, 1, seg);
        const bOpacity = smoothstep(1, 1 + fadeWidth, seg);
        if (va) va.style.opacity = String(aOpacity);
        if (vb) vb.style.opacity = String(bOpacity);

        const translate = (el: HTMLElement | null, strength: number) => {
          if (!el) return;
          el.style.transform = `translateY(${(p - 0.5) * strength}px)`;
        };
        translate(glow, -60);
        translate(grid, -30);

        const title = stage.querySelector<HTMLElement>(".hero-title");
        if (title) title.style.opacity = String(Math.min(1, p * 1.8));
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [durA, durB]);

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

      {/* ===== HERO / STAGE ===== */}
      <section className="pt-24 md:pt-28 pb-10">
        <div className="max-w-6xl mx-auto px-6">
          <div
            ref={stageRef}
            className="relative rounded-[28px] border border-white/10 overflow-hidden bg-black/50"
            style={{ backdropFilter: "blur(12px)" }}
          >
            <div
              ref={glowRef}
              className="pointer-events-none absolute -inset-20"
              style={{ background: "radial-gradient(40rem 40rem at 50% 20%, rgba(229,9,20,0.18), transparent 60%)" }}
            />
            <div
              ref={gridRef}
              className="pointer-events-none absolute inset-0 opacity-[0.08]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
                backgroundSize: "48px 48px, 48px 48px",
              }}
            />
            <LiteLottie />

            {/* === دو ویدیو با کراس‌فید نرم === */}
            <div className="relative aspect-[16/9] md:aspect-[12/5]">
              {/* ویدیو اول */}
              <video
                ref={videoRefA}
                src="/film7.mp4"
                muted
                playsInline
                preload="auto"
                className="absolute inset-0 h-full w-full object-cover opacity-100 transition-opacity duration-300"
              />
              {/* ویدیو دوم */}
              <video
                ref={videoRefB}
                src="/film8.mp4"
                muted
                playsInline
                preload="auto"
                className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-300"
              />

              {/* عنوان روی ویدیوها */}
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <h1
                    className="hero-title text-4xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent split-title"
                    style={{
                      backgroundImage:
                        "linear-gradient(180deg, #fff 0%, rgba(255,255,255,0.85) 35%, rgba(229,9,20,0.9) 100%)",
                      textShadow: "0 0 24px rgba(229,9,20,0.35)",
                    }}
                  >
                    FarsiHub Whitepaper
                  </h1>
                  <p className="mt-3 md:mt-4 text-zinc-300 max-w-xl mx-auto">Scroll down — let it fly.</p>
                </div>
              </div>
            </div>

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

      {/* SCENES */}
      <PinScene index={0} title={"FarsiHub Whitepaper"} subtitle={"Community-owned, culturally tailored."} />
      <PinScene index={1} title={"Tokenomics"} subtitle={"Fair distribution • Real utility"} />
      <PinScene index={2} title={"Governance"} subtitle={"Transparent treasury • Community vote"} />

      {/* BODY */}
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

      <style>{`
        .split-title .split-word { display:inline-block; white-space:pre; }
        .split-title .split-word > span {
          display:inline-block;
          transform: translateY(18px) rotateX(35deg);
          opacity: 0;
          filter: drop-shadow(0 0 10px rgba(229,9,20,0.25));
          animation: riseIn 900ms cubic-bezier(.2,.7,.2,1) forwards;
        }
        .split-title .split-word > span:nth-child(1){ animation-delay: 30ms; }
        .split-title .split-word > span:nth-child(2){ animation-delay: 70ms; }
        .split-title .split-word > span:nth-child(3){ animation-delay: 110ms; }
        .split-title .split-word > span:nth-child(4){ animation-delay: 150ms; }
        .split-title .split-word > span:nth-child(5){ animation-delay: 190ms; }
        .split-title .split-word > span:nth-child(6){ animation-delay: 230ms; }
        .split-title .split-word > span:nth-child(7){ animation-delay: 270ms; }
        .split-title .split-word > span:nth-child(8){ animation-delay: 310ms; }
        .split-title .split-word > span:nth-child(9){ animation-delay: 350ms; }
        .split-title .split-word > span:nth-child(10){ animation-delay: 390ms; }
        @keyframes riseIn {
          0% { transform: translateY(18px) rotateX(35deg); opacity:0; }
          60% { transform: translateY(-2px) rotateX(0deg); opacity:1; }
          100% { transform: translateY(0) rotateX(0deg); opacity:1; }
        }
      `}</style>
    </div>
  );
};

export default Whitepaper;
