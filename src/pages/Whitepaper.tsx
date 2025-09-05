import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";

/** ---------- Hooks (بدون وابستگی بیرونی) ---------- */

// اسکرول‌اسپای برای هایلایت کردن آیتم فعال TOC
function useScrollSpy(ids: string[], rootMargin = "-40% 0px -55% 0px") {
  const [activeId, setActiveId] = useState<string>(ids[0] || "");
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) setActiveId(id);
          });
        },
        { root: null, rootMargin, threshold: 0.01 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [ids, rootMargin]);
  return activeId;
}

// ریویل ساده با IntersectionObserver
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
        } else if (!once) {
          setShow(false);
        }
      },
      { root: null, rootMargin: margin, threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [once, margin]);
  return { ref, show } as const;
}

// درصد پیشرفت مطالعه (براساس ارتفاع کل صفحه)
function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgress(Math.min(100, Math.max(0, pct)));
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

/** ---------- UI Parts ---------- */

function ScrollProgressBar() {
  const progress = useScrollProgress();
  return (
    <div className="fixed inset-x-0 top-0 z-50 h-1 bg-black/40 backdrop-blur">
      <div
        className="h-full transition-[width] duration-150"
        style={{
          width: `${progress}%`,
          boxShadow: "0 0 20px rgba(229,9,20,0.55)",
          background:
            "linear-gradient(90deg, rgba(229,9,20,0.95), rgba(229,9,20,0.6))",
        }}
      />
    </div>
  );
}

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  const { ref, show } = useReveal<HTMLDivElement>(true);
  return (
    <section
      id={id}
      ref={ref}
      className={`mb-16 rounded-2xl p-6 md:p-8 bg-white/5 border border-white/10
      shadow-[0_0_0_1px_rgba(255,255,255,0.03)] 
      transition-all duration-500 will-change-transform
      ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
      style={{
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        boxShadow:
          "0 0 0 1px rgba(255,255,255,0.03), 0 0 24px rgba(229,9,20,0.08), inset 0 0 24px rgba(229,9,20,0.05)",
      }}
    >
      <h2 className="text-2xl md:text-3xl font-semibold mb-4 flex items-center gap-3">
        <span className="inline-block h-2 w-2 rounded-full"
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

function StickyTOC({ ids, labels, activeId }: { ids: string[]; labels: string[]; activeId: string }) {
  return (
    <aside
      className="hidden lg:block lg:sticky lg:top-24 self-start w-64 shrink-0 pr-6"
      aria-label="Table of contents"
    >
      <div
        className="rounded-2xl p-4 border border-white/10 bg-white/5"
        style={{ backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}
      >
        <div className="text-sm uppercase tracking-wider text-zinc-400 mb-3">On this page</div>
        <nav className="space-y-1">
          {ids.map((id, i) => {
            const isActive = id === activeId;
            return (
              <a
                key={id}
                href={`#${id}`}
                className={`block rounded-lg px-3 py-2 text-sm transition-colors
                ${isActive ? "text-white" : "text-zinc-400 hover:text-zinc-200"}`}
                style={
                  isActive
                    ? {
                        background:
                          "linear-gradient(90deg, rgba(229,9,20,0.16), rgba(229,9,20,0.04))",
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

/** ---------- Page ---------- */

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
        // پس‌زمینه قرمز/مشکی لوکس هماهنگ با App
        backgroundImage:
          `radial-gradient(40rem 40rem at 80% -10%, rgba(229,9,20,0.10), transparent 60%),
           radial-gradient(30rem 30rem at -10% 110%, rgba(229,9,20,0.05), transparent 60%)`,
      }}
    >
      <ScrollProgressBar />

      {/* هِرو فشرده */}
      <header className="pt-20 md:pt-24 pb-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="rounded-3xl p-8 md:p-12 border border-white/10 bg-black/40"
               style={{ backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}>
            <div className="flex flex-col md:flex-row md:items-end gap-6 md:gap-10">
              <div className="flex-1">
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
                  <span
                    className="bg-clip-text text-transparent"
                    style={{
                      backgroundImage:
                        "linear-gradient(180deg, #fff 0%, rgba(255,255,255,0.85) 35%, rgba(229,9,20,0.9) 100%)",
                      textShadow: "0 0 24px rgba(229,9,20,0.35)",
                    }}
                  >
                    FarsiHub Whitepaper
                  </span>
                </h1>
                <p className="mt-4 text-zinc-300 max-w-2xl">
                  Culturally tailored metaverse & community-owned economy powered by <b>FarsiCoin</b>.
                  Scroll to explore the vision, tokenomics, and roadmap.
                </p>
              </div>

              <div className="flex gap-3">
                <a
                  href="/whitepaper.pdf"
                  className="rounded-xl px-4 py-3 text-sm font-semibold border border-red-500/50"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(229,9,20,0.2), rgba(229,9,20,0.08))",
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
      </header>

      {/* بدنه با TOC چسبان */}
      <div className="max-w-6xl mx-auto px-6 pb-24 grid grid-cols-1 lg:grid-cols-[16rem_1fr] gap-8">
        <StickyTOC ids={ids} labels={SECTIONS.map(s => s.label)} activeId={activeId} />

        <div className="min-w-0">
          {/* Vision */}
          <Section id="vision" title="Vision & Problem">
            <p>
              Mainstream platforms often overlook Middle Eastern and cross-cultural communities.
              FarsiHub aims to provide culturally tuned spaces—<i>Persian Bazaar</i>, <i>EastWorld Modern</i>,
              and global hubs—backed by community ownership via FarsiCoin.
            </p>
          </Section>

          {/* Utility */}
          <Section id="utility" title="FarsiCoin Utility">
            <ul className="list-disc pl-6 space-y-2">
              <li>Marketplace fees, creator payouts, and event tickets.</li>
              <li>Governance voting on hubs, events, and treasury allocation.</li>
              <li>Staking for access tiers, boosts, and cross-hub perks.</li>
              <li>In-world payments for games, assets, and services.</li>
            </ul>
          </Section>

          {/* Tokenomics */}
          <Section id="tokenomics" title="Tokenomics">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Parameters</h3>
                <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm">
                  <div className="flex justify-between py-2"><span>Total Supply</span><span>1,000,000,000</span></div>
                  <div className="flex justify-between py-2"><span>Ticker</span><span>FAR</span></div>
                  <div className="flex justify-between py-2"><span>Chain</span><span>Cardano (testnet first)</span></div>
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

          {/* Distribution */}
          <Section id="distribution" title="Distribution & Vesting">
            <p>
              Team/advisor tokens vest linearly after a cliff; investor tranches unlock by milestones.
              Community rewards are emission-based, tied to engagement and creator payouts.
            </p>
            <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4 text-sm">
              <p>Sample: Team 12-month cliff + 24-month linear. Investors 6-month cliff + 18-month linear.</p>
            </div>
          </Section>

          {/* Governance */}
          <Section id="governance" title="Governance & Treasury">
            <p>
              Token-weighted proposals for new hubs, budget allocations, and strategic partnerships.
              Transparent multi-sig for treasury with scheduled reports.
            </p>
          </Section>

          {/* Roadmap */}
          <Section id="roadmap" title="Roadmap">
            <ol className="list-decimal pl-6 space-y-2">
              <li>MVP Metaverse: Persian Bazaar & EastWorld Modern hubs (streamed interiors).</li>
              <li>Testnet token mint + payment rails via Paima Engine.</li>
              <li>Creator tools, events, marketplace integrations.</li>
              <li>Mainnet launch & governance v1.</li>
            </ol>
          </Section>

          {/* Security */}
          <Section id="security" title="Security & Audits">
            <p>Independent audits, bug bounties, and staged rollouts. Custody minimized; user-owned assets.</p>
          </Section>

          {/* Legal */}
          <Section id="legal" title="Legal / Risk">
            <p>Jurisdiction-aware disclaimers, evolving compliance, and community transparency.</p>
          </Section>

          {/* Appendices */}
          <Section id="appendix" title="Appendices & Links">
            <ul className="list-disc pl-6 space-y-2">
              <li><a className="underline decoration-red-600/60 underline-offset-4" href="/whitepaper.pdf">Whitepaper PDF</a></li>
              <li><Link className="underline decoration-red-600/60 underline-offset-4" to="/farsicoin">FarsiCoin page</Link></li>
            </ul>
          </Section>

          {/* CTA پایانی */}
          <div className="mt-12 flex flex-wrap gap-3">
            <a
              href="/whitepaper.pdf"
              className="rounded-xl px-5 py-3 text-sm font-semibold border border-red-500/50"
              style={{
                background:
                  "linear-gradient(180deg, rgba(229,9,20,0.2), rgba(229,9,20,0.08))",
                boxShadow: "0 0 22px rgba(229,9,20,0.35), inset 0 0 14px rgba(229,9,20,0.25)",
              }}
            >
              Download PDF
            </a>
            <Link
              to="/farsicoin"
              className="rounded-xl px-5 py-3 text-sm font-semibold bg-white/10 border border-white/10 hover:bg-white/15 transition"
            >
              Explore FarsiCoin
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Whitepaper;
