
// src/components/Footer.tsx
import { Link } from "react-router-dom";
import { useMemo, useRef, useEffect } from "react";
import { Twitter, Youtube, Send, Disc, ChevronRight, Crown, Code2, PenTool, Shield, Globe, Sparkles } from "lucide-react";

/**
 * FarseaHub — Ultra Glass Footer with Video Backdrop
 * Notes:
 * 1) Put the video file in /public with EXACT name: film2.mp4.mp4
 * 2) Works on mobile (muted + playsInline). We try to force play on mount as well.
 * 3) TailwindCSS required. Designed for dark/red luxury theme.
 */

const VIDEO_SRC = "/film2.mp4.mp4";
const VIDEO_POSTER: string | undefined = undefined;

const socials = [
  { name: "X / Twitter", href: "https://x.com/farseahub", icon: Twitter },
  { name: "YouTube", href: "https://youtube.com/@farseahub", icon: Youtube },
  { name: "Telegram", href: "https://t.me/farseahub", icon: Send },
  { name: "Discord", href: "https://discord.gg/farseahub", icon: Disc },
];

export default function Footer() {
  const year = useMemo(() => new Date().getFullYear(), []);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const tryPlay = () => {
      v.muted = true;
      const p = v.play();
      if (p && typeof p.then === "function") p.catch(() => {/* ignore autoplay block */});
    };
    v.addEventListener("canplay", tryPlay, { once: true });
    tryPlay();
    return () => {
      v.removeEventListener("canplay", tryPlay as any);
    };
  }, []);

  return (
    <footer className="relative mt-24 text-zinc-300 overflow-hidden">
      {/* ===== VIDEO LAYER (BACKGROUND) ===== */}
      <div aria-hidden className="absolute inset-0 -z-40">
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          src={VIDEO_SRC}
          {...(VIDEO_POSTER ? { poster: VIDEO_POSTER } : {})}
          autoPlay
          loop
          muted
          playsInline
        />
      </div>

      {/* ===== STYLING OVERLAYS ===== */}
      {/* Dark gradient for readability */}
      <div className="absolute inset-0 -z-30" style={{
        background: "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(10,10,10,0.65) 40%, rgba(0,0,0,0.9) 100%)"
      }} />
      {/* Glass blur + tint */}
      <div className="absolute inset-0 -z-20 backdrop-blur-2xl supports-[backdrop-filter]:bg-black/35" />
      {/* Animated scanlines for a premium feel */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 opacity-[0.07] [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)]">
        <div className="h-[300%] w-full animate-scanlines bg-[linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_2px)] bg-[length:100%_6px]" />
      </div>
      {/* Top neon hairline */}
      <div aria-hidden className="absolute top-0 left-0 right-0 h-[1.5px]" style={{
        background: "linear-gradient(90deg, rgba(255,0,40,0) 0%, rgba(255,0,40,0.6) 10%, rgba(255,0,40,0.95) 50%, rgba(255,0,40,0.6) 90%, rgba(255,0,40,0) 100%)"
      }} />

      <div className="relative container px-4 py-12 md:py-16">
        {/* BRAND */}
        <div className="flex items-center gap-4 mb-10">
          <div className="relative">
            <img src="/logoasli1373.png" alt="FarseaHub logo" className="h-10 w-auto drop-shadow-[0_4px_24px_rgba(255,40,40,0.25)]" />
            <span className="pointer-events-none absolute -inset-2 rounded-2xl blur-2xl" style={{background:"radial-gradient(closest-side, rgba(255,40,40,0.22), transparent)"}} />
          </div>
          <div>
            <div className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-red-400 via-rose-500 to-fuchsia-500">
              FarseaHub
            </div>
            <p className="text-sm text-zinc-200/80">Culture-first experiences • Web3 • Metaverse • Gaming</p>
          </div>
        </div>

        {/* CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
          {/* Quick Links */}
          <nav aria-label="Footer quick links" className="rounded-2xl p-4 border border-white/10 bg-white/10 backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
            <h3 className="mb-3 text-sm font-semibold text-zinc-100">Navigate</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <li><FooterLink to="/">Home</FooterLink></li>
              <li><FooterLink to="/marketplace">Marketplace</FooterLink></li>
              <li><FooterLink to="/tourism">Tourism</FooterLink></li>
              <li><FooterLink to="/dating">Dating</FooterLink></li>
              <li><FooterLink to="/metaverse">Metaverse</FooterLink></li>
              <li><FooterLink to="/whitepaper">Whitepaper</FooterLink></li>
              <li><FooterLink to="/farsicoin">FarsiCoin</FooterLink></li>
              <li><FooterLink to="/login">Login / Signup</FooterLink></li>
            </ul>
          </nav>

          {/* Team Section */}
          <section className="rounded-2xl p-4 border border-white/10 bg-white/10 backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-zinc-100">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-red-600/20">
                <Crown className="h-3.5 w-3.5 text-red-400" />
              </span>
              Farsea Team
            </h3>
            <ul className="mt-3 space-y-2">
              <TeamRow role="CEO" name="Ardalan" avatarUrl="/team/ardalan.jpg" icon={Crown} />
              <TeamRow role="CTO" name="—" avatarUrl="/team/cto.jpg" icon={Shield} />
              <TeamRow role="Developers" name="—" avatarUrl="/team/devs.jpg" icon={Code2} />
              <TeamRow role="Design" name="—" avatarUrl="/team/design.jpg" icon={PenTool} />
              <TeamRow role="Community & BizDev" name="—" avatarUrl="/team/bizdev.jpg" icon={Globe} />
            </ul>
          </section>

          {/* Partners with marquee */}
          <section className="rounded-2xl p-4 border border-white/10 bg-white/10 backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-zinc-100">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-red-600/20">
                <ChevronRight className="h-3.5 w-3.5 text-red-400" />
              </span>
              Our Partners
            </h3>

            {/* Grid for desktop */}
            <div className="hidden sm:grid grid-cols-2 gap-3 mt-3">
              <PartnerCard name="Partner One" href="https://partner1.example" logo="/partners/partner1.svg" />
              <PartnerCard name="Partner Two" href="https://partner2.example" logo="/partners/partner2.svg" />
            </div>

            {/* Marquee for mobile */}
            <div className="sm:hidden mt-4 overflow-hidden rounded-xl relative">
              <div className="flex items-center gap-4 animate-marquee will-change-transform">
                <PartnerPill name="Partner One" logo="/partners/partner1.svg" />
                <PartnerPill name="Partner Two" logo="/partners/partner2.svg" />
                <PartnerPill name="Soon™" logo="/partners/soon.svg" />
              </div>
            </div>

            <p className="mt-3 text-xs text-zinc-300/80">
              برای افزودن شریک جدید لوگو را در مسیر <code className="text-zinc-100/90">/public/partners/</code> بگذار و یک
              <code className="text-zinc-100/90"> &lt;PartnerCard /&gt;</code> دیگر اضافه کن.
            </p>
          </section>
        </div>

        {/* Social Buttons */}
        <div className="mt-10 flex flex-wrap items-center gap-3">
          {socials.map(({ name, href, icon: Icon }) => (
            <a
              key={name}
              href={href}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm hover:bg-white/15 transition"
            >
              <span className="relative">
                <Icon className="h-4 w-4 transition-transform group-hover:-rotate-6" />
                <span className="absolute -inset-2 -z-10 rounded-lg bg-red-600/0 blur-md group-hover:bg-red-600/15 transition" />
              </span>
              <span className="text-zinc-200 group-hover:text-white">{name}</span>
            </a>
          ))}
        </div>

        {/* Divider */}
        <div className="my-8 h-px w-full bg-gradient-to-r from-transparent via-red-500/60 to-transparent" />

        {/* Bottom Row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-zinc-300/75">
          <p>© {year} FarseaHub. All rights reserved.</p>
          <div className="flex flex-wrap gap-4">
            <Link className="hover:text-zinc-100" to="/terms">Terms</Link>
            <Link className="hover:text-zinc-100" to="/privacy">Privacy</Link>
            <Link className="hover:text-zinc-100" to="/contact">Contact</Link>
          </div>
        </div>
      </div>

      {/* bottom glow + particles */}
      <div aria-hidden className="pointer-events-none absolute -bottom-24 left-1/2 h-56 w-[60rem] -translate-x-1/2 rounded-full blur-3xl" style={{ background: "radial-gradient(closest-side, rgba(255,30,60,0.25), transparent)" }} />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-24 [background:radial-gradient(50%_80%_at_50%_100%,rgba(255,255,255,0.06),transparent)]" />

      {/* Local CSS (keyframes) */}
      <style>{`
        @keyframes scanlines {
          0% { transform: translateY(0); }
          100% { transform: translateY(-66.66%); }
        }
        .animate-scanlines { animation: scanlines 9s linear infinite; }

        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee { animation: marquee 16s linear infinite; }

        @keyframes shineCard {
          0% { transform: translateX(-120%); }
          100% { transform: translateX(220%); }
        }
        .shine::after {
          content: "";
          position: absolute;
          inset: -20%;
          transform: translateX(-120%);
          background: linear-gradient(110deg, transparent 40%, rgba(255,255,255,0.16) 50%, transparent 60%);
          filter: blur(8px);
          animation: shineCard 1.8s ease forwards;
        }
      `}</style>
    </footer>
  );
}

/* ------------- Subcomponents ------------- */

function FooterLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="group inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-zinc-200/90 hover:text-white hover:bg-white/10 transition"
    >
      <span className="h-1.5 w-1.5 rounded-full bg-red-600/50 group-hover:bg-red-500" />
      {children}
    </Link>
  );
}

function TeamRow({
  icon: Icon,
  role,
  name,
  avatarUrl,
}: {
  icon: any;
  role: string;
  name: string;
  avatarUrl?: string;
}) {
  return (
    <li className="group relative flex items-center justify-between rounded-2xl border border-white/10 bg-white/10 px-3 py-2.5 backdrop-blur-md overflow-hidden">
      {/* subtle moving shine on hover */}
      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition">
        <div className="absolute -left-1/3 top-0 h-full w-1/3 rotate-12 bg-white/10 blur-xl" style={{ animation: "shineCard 1.4s ease forwards" }} />
      </div>

      <span className="flex items-center gap-3">
        <AvatarCircle name={name} src={avatarUrl} />
        <span className="flex items-center gap-2">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-red-600/15">
            <Icon className="h-3.5 w-3.5 text-red-400" />
          </span>
          <span className="text-zinc-100">{role}</span>
        </span>
      </span>
      <span className="text-zinc-300/90">{name}</span>
    </li>
  );
}

function AvatarCircle({ name, src }: { name?: string; src?: string }) {
  const initials =
    (name || "")
      .trim()
      .split(/\s+/)
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "??";

  return (
    <div className="relative h-16 w-16 shrink-0">
      {src ? (
        <img
          src={src}
          alt={name ? \`\${name} avatar\` : "team avatar"}
          className="h-16 w-16 rounded-full object-cover ring-2 ring-white/15"
          loading="lazy"
        />
      ) : (
        <div className="h-16 w-16 rounded-full grid place-items-center bg-gradient-to-br from-zinc-800 to-zinc-700 ring-2 ring-white/15">
          <span className="text-sm font-semibold text-zinc-200">{initials}</span>
        </div>
      )}
      {/* glossy highlight & glow */}
      <span className="pointer-events-none absolute inset-0 rounded-full shadow-[inset_0_6px_12px_rgba(255,255,255,0.08)]" />
      <span className="pointer-events-none absolute -inset-1 rounded-full blur-lg" style={{background:"radial-gradient(closest-side, rgba(255,50,80,0.12), transparent)"}}/>
    </div>
  );
}

function PartnerCard({ name, href, logo }: { name: string; href: string; logo: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="shine relative flex items-center justify-center rounded-2xl border border-white/10 bg-white/10 p-4 overflow-hidden backdrop-blur-md hover:bg-white/15 transition"
    >
      <img src={logo} alt={\`\${name} logo\`} className="h-10 w-auto opacity-90" />
    </a>
  );
}

function PartnerPill({ name, logo }: { name: string; logo: string }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-3 py-2 backdrop-blur-md">
      <img src={logo} alt={\`\${name} logo\`} className="h-6 w-auto opacity-90" />
      <span className="text-xs text-zinc-100/90">{name}</span>
    </div>
  );
}


