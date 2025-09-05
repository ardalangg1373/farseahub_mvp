import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";

/* ===========================
   HERO with /film10.mp4 + Slogans + Unmute
=========================== */
function FarsiCoinHero() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [muted, setMuted] = useState(true);

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
    if (v.paused) v.play().catch(() => {});
  };

  const slogansLeft = [
    "Frictionless payments across cultural hubs",
    "Community-owned, not platform-owned",
    "Direct rewards for creators & contributors",
  ];
  const slogansRight = [
    "Transparent governance & treasury reports",
    "Seamless bridge to games and marketplaces",
  ];

  const CYCLE = 10;
  const STAGGER = 2.2;

  return (
    <section className="relative h-screen w-screen overflow-hidden">
      <style>{`
        @keyframes colorCycle {
          0%   { color: #000000; }
          50%  { color: #B1060F; }
          100% { color: #000000; }
        }
        @keyframes fadeSlide {
          0%   { opacity: 0; transform: translateY(12px); }
          8%   { opacity: 1; transform: translateY(0); }
          30%  { opacity: 1; transform: translateY(0); }
          38%  { opacity: 0; transform: translateY(-10px); }
          100% { opacity: 0; transform: translateY(-10px); }
        }
        .animate-colorCycle {
          animation: colorCycle 3.2s ease-in-out infinite;
        }
        .slogan {
          animation-name: fadeSlide;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
          animation-duration: ${CYCLE}s;
          will-change: opacity, transform;
          text-shadow: 0 0 16px rgba(255,255,255,0.25);
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-colorCycle { animation: none; }
          .slogan { animation: none; opacity: 1; transform: none; }
        }
      `}</style>

      <video
        ref={videoRef}
        src="/film10.mp4"
        autoPlay
        loop
        playsInline
        preload="auto"
        muted={muted}
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 70%, rgba(0,0,0,0.35) 100%)",
        }}
      />

      {/* Left slogans */}
      <div className="absolute left-6 md:left-12 top-0 bottom-0 z-10 flex items-center pointer-events-none">
        <div className="flex flex-col gap-5 md:gap-6 max-w-sm md:max-w-md">
          {slogansLeft.map((t, i) => (
            <div
              key={`L-${i}`}
              className="slogan px-4 py-2 md:px-5 md:py-3 text-xl md:text-3xl font-extrabold animate-colorCycle"
              style={{ animationDelay: `${i * STAGGER}s` }}
            >
              {t}
            </div>
          ))}
        </div>
      </div>

      {/* Right slogans */}
      <div className="absolute right-6 md:right-12 top-0 bottom-0 z-10 flex items-center pointer-events-none">
        <div className="flex flex-col items-end gap-5 md:gap-6 max-w-sm md:max-w-md text-right">
          {slogansRight.map((t, i) => (
            <div
              key={`R-${i}`}
              className="slogan px-4 py-2 md:px-5 md:py-3 text-xl md:text-3xl font-extrabold animate-colorCycle"
              style={{ animationDelay: `${(i + slogansLeft.length) * STAGGER}s` }}
            >
              {t}
            </div>
          ))}
        </div>
      </div>

      {/* mute/unmute */}
      <button
        onClick={toggleMute}
        className="absolute bottom-6 right-6 z-20 rounded-xl px-4 py-2 text-base md:text-lg font-semibold border border-white/20 bg-black/40 text-white hover:bg-black/60 transition"
        style={{ backdropFilter: "blur(6px)" }}
      >
        {muted ? "🔊 Unmute" : "🔇 Mute"}
      </button>
    </section>
  );
}

/* ===========================
   Utility components
=========================== */
function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section
      id={id}
      className="mb-10 md:mb-14 rounded-2xl p-6 md:p-8 bg-white/5 border border-white/10"
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

function KeyValueRow({ k, v }: { k: React.ReactNode; v: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-white/5 last:border-b-0">
      <span className="text-zinc-300">{k}</span>
      <span className="font-semibold text-zinc-100">{v}</span>
    </div>
  );
}

/* ===========================
   PAGE
=========================== */
const FarsiCoinPage = () => {
  const sections = useMemo(
    () => [
      { id: "about", label: "About FarsiCoin" },
      { id: "why", label: "Why Different?" },
      { id: "utility", label: "Utility" },
      { id: "tokenomics", label: "Tokenomics" },
      { id: "vesting", label: "Vesting" },
      { id: "roadmap", label: "Roadmap" },
      { id: "get", label: "How to Get FAR" },
      { id: "links", label: "Links" },
    ],
    []
  );

  return (
    <div
      className="relative"
      style={{
        backgroundImage: `radial-gradient(40rem 40rem at 80% -10%, rgba(229,9,20,0.10), transparent 60%),
           radial-gradient(30rem 30rem at -10% 110%, rgba(229,9,20,0.05), transparent 60%)`,
      }}
    >
      <FarsiCoinHero />

      <div className="max-w-6xl mx-auto px-6 pb-24">
        <Section id="about" title="About FarsiCoin">
          <p>
            FarsiCoin fuels the cultural hubs of FarsiHub: seamless in-world payments,
            participation rewards, and community-driven governance. It is built with a
            focus on cultural identity and user-friendly crypto adoption.
          </p>
        </Section>

        <Section id="why" title="Why Different?">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm">
              <h3 className="font-semibold mb-3">FarsiCoin</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Cultural & creative economy focus</li>
                <li>Direct creator & community rewards</li>
                <li>Transparent governance & reports</li>
                <li>Deep integration with games/marketplace</li>
                <li>Frictionless UX</li>
              </ul>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm">
              <h3 className="font-semibold mb-3">Generic Coins</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>No cultural identity focus</li>
                <li>Lack of creator integration</li>
                <li>Opaque governance</li>
                <li>Limited synergy with creative economy</li>
                <li>Complex UX</li>
              </ul>
            </div>
          </div>
        </Section>

        <Section id="utility" title="Utility">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <h3 className="font-semibold mb-2">Payments</h3>
              <p className="text-sm">Tickets, services, and digital assets inside hubs and events.</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <h3 className="font-semibold mb-2">Staking & Rewards</h3>
              <p className="text-sm">Tiered staking perks, community rewards, and loyalty boosts.</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <h3 className="font-semibold mb-2">Governance</h3>
              <p className="text-sm">Token-weighted voting, treasury allocation, hub upgrades.</p>
            </div>
          </div>
        </Section>

        <Section id="tokenomics" title="Tokenomics">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm">
              <KeyValueRow k="Total Supply" v="1,000,000,000" />
              <KeyValueRow k="Ticker" v="FAR" />
              <KeyValueRow k="Chain" v="Cardano (testnet)" />
              <KeyValueRow k="Decimals" v="6" />
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm space-y-2">
              <div className="flex justify-between"><span>Community & Rewards</span><span>40%</span></div>
              <div className="flex justify-between"><span>Treasury & Ecosystem</span><span>25%</span></div>
              <div className="flex justify-between"><span>Team & Advisors</span><span>15%</span></div>
              <div className="flex justify-between"><span>Investors</span><span>15%</span></div>
              <div className="flex justify-between"><span>Liquidity</span><span>5%</span></div>
            </div>
          </div>
        </Section>

        <Section id="vesting" title="Vesting (Sample)">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Team & Advisors</h4>
                <p>6-month cliff, then linear vesting over 18 months.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Investors</h4>
                <p>3-month cliff, then linear vesting over 12 months.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Community</h4>
                <p>Emission tied to participation & ecosystem KPIs.</p>
              </div>
            </div>
          </div>
        </Section>

        <Section id="roadmap" title="Roadmap">
          <ol className="list-decimal pl-6 space-y-2">
            <li>MVP hubs (Persian Bazaar & EastWorld Modern)</li>
            <li>Testnet mint + payments (Paima Engine)</li>
            <li>Creator tools, events, marketplace</li>
            <li>Mainnet launch & Governance v1</li>
          </ol>
        </Section>

        <Section id="get" title="How to Get FAR?">
          <ol className="list-decimal pl-6 space-y-2">
            <li>Set up/connect a Cardano-compatible wallet (testnet).</li>
            <li>Claim testnet tokens from faucet and try transactions.</li>
            <li>Join community events to earn FAR rewards.</li>
            <li>After mainnet: purchase via listed DEX/marketplaces.</li>
          </ol>
        </Section>

        <Section id="links" title="Links & Resources">
          <div className="flex flex-wrap gap-3">
            <a
              href="/whitepaper.pdf"
              className="rounded-xl px-4 py-3 text-sm font-semibold border border-white/20 bg-white/10 hover:bg-white/15 transition"
              style={{ backdropFilter: "blur(6px)" }}
            >
              Whitepaper
            </a>
            <Link
              to="/"
              className="rounded-xl px-4 py-3 text-sm font-semibold border border-white/20 bg-white/10 hover:bg-white/15 transition"
              style={{ backdropFilter: "blur(6px)" }}
            >
              Back to Home
            </Link>
          </div>
        </Section>
      </div>
    </div>
  );
};

export default FarsiCoinPage;
