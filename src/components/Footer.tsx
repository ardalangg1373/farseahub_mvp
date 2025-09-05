import { Link } from "react-router-dom";
import { Twitter, Youtube, Send, Disc, ChevronRight, Crown, Code2, PenTool, Shield, Globe } from "lucide-react";
import { useMemo } from "react";

const socials = [
  { name: "X / Twitter", href: "https://x.com/farseahub", icon: Twitter },
  { name: "YouTube", href: "https://youtube.com/@farseahub", icon: Youtube },
  { name: "Telegram", href: "https://t.me/farseahub", icon: Send },
  { name: "Discord", href: "https://discord.gg/farseahub", icon: Disc },
];

export default function Footer() {
  // فقط برای سال کپی‌رایت
  const year = useMemo(() => new Date().getFullYear(), []);

  return (
    <footer
      className="relative mt-20 text-zinc-300"
      style={{
        background:
          "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(12,12,12,0.65) 20%, rgba(0,0,0,0.85) 100%)",
      }}
    >
      {/* خط گرادیانی بالای فوتر */}
      <div
        className="pointer-events-none absolute -top-px left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, rgba(229,9,20,0) 0%, rgba(229,9,20,0.5) 12%, rgba(229,9,20,0.75) 50%, rgba(229,9,20,0.5) 88%, rgba(229,9,20,0) 100%)",
        }}
      />

      {/* هاله قرمز شیشه‌ای */}
      <div className="absolute inset-0 -z-10 backdrop-blur supports-[backdrop-filter]:bg-black/40" />
      <div className="absolute inset-0 -z-20" style={{ backgroundImage: "radial-gradient(40rem 30rem at 120% 0%, rgba(229,9,20,0.18), transparent 60%)" }} />

      <div className="container px-4 py-12 md:py-14">
        {/* برند و اسلوگان */}
        <div className="flex items-center gap-3 mb-10">
          <img src="/logoasli1373.png" alt="FarseaHub logo" className="h-9 w-auto" />
          <div>
            <div className="text-lg font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-rose-500 to-purple-500">
              FarseaHub
            </div>
            <p className="text-sm text-zinc-400">
              Culture-first experiences • Web3 • Metaverse • Gaming
            </p>
          </div>
        </div>

        {/* شبکه اصلی: لینک‌ها + تیم + پارتنرها */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {/* لینک‌های سریع */}
          <nav aria-label="Footer quick links" className="space-y-2">
            <FooterLink to="/">Home</FooterLink>
            <FooterLink to="/marketplace">Marketplace</FooterLink>
            <FooterLink to="/whitepaper">Whitepaper</FooterLink>
            <FooterLink to="/farsicoin">FarsiCoin</FooterLink>
            <FooterLink to="/metaverse">Metaverse</FooterLink>
            <FooterLink to="/login">Login / Signup</FooterLink>
          </nav>

          {/* FARSEA TEAM */}
          <section aria-labelledby="team-title" className="space-y-4">
            <h3 id="team-title" className="flex items-center gap-2 text-sm font-semibold text-zinc-200">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-red-600/20">
                <Crown className="h-3.5 w-3.5 text-red-400" />
              </span>
              Farsea Team
            </h3>

            <ul className="space-y-2 text-sm">
              <TeamRow icon={Crown} title="CEO" name="Ardalan" />
              <TeamRow icon={Shield} title="CTO" name="—" />
              <TeamRow icon={Code2} title="Developers" name="—" />
              <TeamRow icon={PenTool} title="Design" name="—" />
              <TeamRow icon={Globe} title="Community & BizDev" name="—" />
            </ul>

            {/* نوار باریک پالس قرمز */}
            <div className="mt-4 h-[2px] w-28 rounded-full bg-red-600/40 animate-pulse" />
          </section>

          {/* OUR PARTNERS */}
          <section aria-labelledby="partners-title" className="space-y-4">
            <h3 id="partners-title" className="flex items-center gap-2 text-sm font-semibold text-zinc-200">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-red-600/20">
                <ChevronRight className="h-3.5 w-3.5 text-red-400" />
              </span>
              Our Partners
            </h3>

            {/* گرید لوگوها با افکت شیشه‌ای و هُوِر */}
            <div className="grid grid-cols-2 gap-3">
              <PartnerCard name="Partner One" href="https://partner1.example" logo="/partners/partner1.svg" />
              <PartnerCard name="Partner Two" href="https://partner2.example" logo="/partners/partner2.svg" />
            </div>

            <p className="text-xs text-zinc-500">
              برای افزودن شریک جدید، فقط فایل SVG/PNG لوگو را در مسیر <code className="text-zinc-400">/partners/</code> قرار بده و یک <code className="text-zinc-400">&lt;PartnerCard /&gt;</code> دیگر اضافه کن.
            </p>
          </section>
        </div>

        {/* سوشال‌ها */}
        <div className="mt-10 flex flex-wrap items-center gap-3">
          {socials.map(({ name, href, icon: Icon }) => (
            <a
              key={name}
              href={href}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10 transition"
            >
              <span className="relative">
                <Icon className="h-4 w-4 transition-transform group-hover:-rotate-6" />
                <span className="absolute -inset-2 -z-10 rounded-lg bg-red-600/0 blur-md group-hover:bg-red-600/15 transition" />
              </span>
              <span className="text-zinc-200 group-hover:text-white">{name}</span>
            </a>
          ))}
        </div>

        {/* جداکننده گرادیانی */}
        <div
          className="my-8 h-px w-full"
          style={{
            background:
              "linear-gradient(90deg, rgba(229,9,20,0) 0%, rgba(229,9,20,0.35) 20%, rgba(229,9,20,0.6) 50%, rgba(229,9,20,0.35) 80%, rgba(229,9,20,0) 100%)",
          }}
        />

        {/* کپی‌رایت و ریزلینک‌ها */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© {year} FarseaHub. All rights reserved.</p>
          <div className="flex flex-wrap gap-4">
            <Link className="hover:text-zinc-300" to="/terms">Terms</Link>
            <Link className="hover:text-zinc-300" to="/privacy">Privacy</Link>
            <Link className="hover:text-zinc-300" to="/contact">Contact</Link>
          </div>
        </div>
      </div>

      {/* جلوه‌ی subtle glow پایین فوتر */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-20 left-1/2 h-40 w-[50rem] -translate-x-1/2 rounded-full blur-3xl"
        style={{ background: "radial-gradient(closest-side, rgba(229,9,20,0.18), transparent)" }}
      />
    </footer>
  );
}

/* ---------- Subcomponents ---------- */

function FooterLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="group inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-zinc-300/90 hover:text-white hover:bg-white/5 transition"
    >
      <span className="h-1.5 w-1.5 rounded-full bg-red-600/50 group-hover:bg-red-500" />
      {children}
    </Link>
  );
}

function TeamRow({ icon: Icon, title, name }: { icon: any; title: string; name: string }) {
  return (
    <li className="flex items-center justify-between rounded-lg border border-white/5 bg-white/5 px-3 py-2">
      <span className="flex items-center gap-2">
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-red-600/15">
          <Icon className="h-3.5 w-3.5 text-red-400" />
        </span>
        <span className="text-zinc-200">{title}</span>
      </span>
      <span className="text-zinc-400">{name}</span>
    </li>
  );
}

function PartnerCard({ name, href, logo }: { name: string; href: string; logo: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group relative flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-4 overflow-hidden"
    >
      {/* Reflection/shine animation */}
      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition">
        <div
          className="absolute -left-1/3 top-0 h-full w-1/3 rotate-12 bg-white/10 blur-xl"
          style={{ animation: "shine 1.6s ease forwards" }}
        />
      </div>
      <img src={logo} alt={`${name} logo`} className="h-10 w-auto opacity-90 group-hover:opacity-100 transition" />
      <style>
        {`@keyframes shine{0%{transform:translateX(0)}100%{transform:translateX(350%)}}`}
      </style>
    </a>
  );
}
