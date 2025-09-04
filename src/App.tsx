// src/App.tsx
import { BrowserRouter, Routes, Route, NavLink, Outlet } from "react-router-dom";
import { Suspense } from "react";
// import Header from "@/components/Header"; // اگر داری، فعالش کن
import Home from "./pages/Home"; // ← هوم واقعی

// --------------- Layout ---------------
function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      {/* <Header /> */}
      <SiteTopbar />
      <main className="flex-1">
        <Suspense fallback={<PageLoading />}>
          <Outlet />
        </Suspense>
      </main>
      <SiteFooter />
    </div>
  );
}

function SiteTopbar() {
  const linkCls = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-lg transition-colors ${
      isActive ? "bg-white/10 text-white" : "text-white/80 hover:text-white"
    }`;
  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-black/50 border-b border-white/10">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-4">
        <NavLink to="/" className="font-semibold tracking-wide">
          FarSeaHub
        </NavLink>
        <nav className="flex items-center gap-1 text-sm">
          <NavLink to="/whitepaper" className={linkCls}>Whitepaper</NavLink>
          <NavLink to="/farsicoin" className={linkCls}>FarsiCoin</NavLink>
        </nav>
      </div>
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t border-white/10">
      <div className="mx-auto max-w-6xl px-4 py-6 text-xs text-white/60">
        © {new Date().getFullYear()} FarSeaHub — All rights reserved.
      </div>
    </footer>
  );
}

function PageLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div className="animate-pulse text-white/70">Loading…</div>
    </div>
  );
}

// --------------- Whitepaper (Nested) ---------------
function WhitepaperIndex() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-2xl font-bold mb-2">Whitepaper</h1>
      <p className="text-white/80 mb-6">Main index of the whitepaper. Choose a section below.</p>
      <WhitepaperNav />
      <Outlet />
    </section>
  );
}
function WhitepaperNav() {
  const base = "/whitepaper";
  const item = (to: string, label: string) => (
    <NavLink
      key={to}
      to={to}
      className={({ isActive }) =>
        `px-3 py-2 rounded-lg text-sm mr-2 mb-2 inline-block border border-white/10 ${
          isActive ? "bg-white/10 text-white" : "text-white/80 hover:text-white"
        }`
      }
      end
    >
      {label}
    </NavLink>
  );
  return (
    <div className="mb-8">
      {item(`${base}`, "Overview")}
      {item(`${base}/tokenomics`, "Tokenomics")}
      {item(`${base}/game-rules`, "Game Rules")}
      {item(`${base}/economy`, "Economy")}
      {item(`${base}/roadmap`, "Roadmap")}
      {item(`${base}/legal`, "Legal")}
    </div>
  );
}
const WhitepaperOverview = () => <Section title="Whitepaper — Overview" />;
const WhitepaperTokenomics = () => <Section title="Whitepaper — Tokenomics" />;
const WhitepaperGameRules = () => <Section title="Whitepaper — Game Rules" />;
const WhitepaperEconomy = () => <Section title="Whitepaper — Economy" />;
const WhitepaperRoadmap = () => <Section title="Whitepaper — Roadmap" />;
const WhitepaperLegal = () => <Section title="Whitepaper — Legal" />;

// --------------- FarsiCoin (Nested) ---------------
function FarsiCoinIndex() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-2xl font-bold mb-2">FarsiCoin</h1>
      <p className="text-white/80 mb-6">Overview and docs for FarsiCoin. Choose a section below.</p>
      <FarsiCoinNav />
      <Outlet />
    </section>
  );
}
function FarsiCoinNav() {
  const base = "/farsicoin";
  const item = (to: string, label: string) => (
    <NavLink
      key={to}
      to={to}
      className={({ isActive }) =>
        `px-3 py-2 rounded-lg text-sm mr-2 mb-2 inline-block border border-white/10 ${
          isActive ? "bg-white/10 text-white" : "text-white/80 hover:text-white"
        }`
      }
      end
    >
      {label}
    </NavLink>
  );
  return (
    <div className="mb-8">
      {item(`${base}`, "Overview")}
      {item(`${base}/tokenomics`, "Tokenomics")}
      {item(`${base}/distribution`, "Distribution")}
      {item(`${base}/faq`, "FAQ")}
      {item(`${base}/legal`, "Legal")}
    </div>
  );
}
const FarsiCoinOverview = () => <Section title="FarsiCoin — Overview" />;
const FarsiCoinTokenomics = () => <Section title="FarsiCoin — Tokenomics" />;
const FarsiCoinDistribution = () => <Section title="FarsiCoin — Distribution" />;
const FarsiCoinFAQ = () => <Section title="FarsiCoin — FAQ" />;
const FarsiCoinLegal = () => <Section title="FarsiCoin — Legal" />;

// --------------- Shared ---------------
function NotFoundPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-2xl font-bold mb-2">404 — Not Found</h1>
      <p className="text-white/70">The page you’re looking for doesn’t exist.</p>
    </section>
  );
}
function Section({ title }: { title: string }) {
  return (
    <div className="rounded-2xl p-6 border border-white/10 bg-white/5">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-white/75">Placeholder content. Replace with the real content for this section.</p>
    </div>
  );
}

// --------------- App (Router) ---------------
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Layout wrapper */}
        <Route element={<Layout />}>
          {/* Home → هوم واقعی */}
          <Route index element={<Home />} />

          {/* Whitepaper + nested routes */}
          <Route path="whitepaper" element={<WhitepaperIndex />}>
            <Route index element={<WhitepaperOverview />} />
            <Route path="tokenomics" element={<WhitepaperTokenomics />} />
            <Route path="game-rules" element={<WhitepaperGameRules />} />
            <Route path="economy" element={<WhitepaperEconomy />} />
            <Route path="roadmap" element={<WhitepaperRoadmap />} />
            <Route path="legal" element={<WhitepaperLegal />} />
          </Route>

          {/* FarsiCoin + nested routes */}
          <Route path="farsicoin" element={<FarsiCoinIndex />}>
            <Route index element={<FarsiCoinOverview />} />
            <Route path="tokenomics" element={<FarsiCoinTokenomics />} />
            <Route path="distribution" element={<FarsiCoinDistribution />} />
            <Route path="faq" element={<FarsiCoinFAQ />} />
            <Route path="legal" element={<FarsiCoinLegal />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
