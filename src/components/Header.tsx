// src/components/Header.tsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

// —— Wallet (CIP-30) ——
declare global { interface Window { cardano?: Record<string, any>; } }
type DetectedWallet = { key: string; name: string; icon?: string };
const shorten = (s: string, L = 10, R = 6) => !s ? "" : (s.length <= L+R+3 ? s : `${s.slice(0,L)}…${s.slice(-R)}`);

function WalletConnectButton({ t }: { t: (k: string) => string }) {
  const [open, setOpen] = useState(false);
  const [wallets, setWallets] = useState<DetectedWallet[]>([]);
  const [busy, setBusy] = useState<string | null>(null);
  const [connectedKey, setConnectedKey] = useState<string | null>(null);
  const [connectedLabel, setConnectedLabel] = useState("");

  useEffect(() => {
    const w = window.cardano || {};
    const known = ["nami","eternl","lace","flint","gerowallet","yoroi","vespr"];
    const found: DetectedWallet[] = [];
    for (const key of Object.keys(w)) {
      if (!known.includes(key.toLowerCase())) continue;
      const api = (w as any)[key];
      if (!api) continue;
      found.push({ key, name: api.name || key, icon: api.icon });
    }
    setWallets(found);
  }, []);

  const connect = async (key: string) => {
    try {
      setBusy(key);
      const api = await (window as any).cardano?.[key]?.enable?.();
      if (!api) throw new Error("API not available");
      let label = (window as any).cardano?.[key]?.name || key;
      try {
        const changeHex = await api.getChangeAddress();
        if (changeHex) label = `${label} · ${shorten(changeHex)}`;
      } catch {}
      setConnectedKey(key); setConnectedLabel(label); setOpen(false);
    } catch (e) {
      console.error(e);
      alert("Failed to connect. Make sure a Cardano wallet extension is installed and unlocked.");
    } finally { setBusy(null); }
  };

  const disconnect = () => { setConnectedKey(null); setConnectedLabel(""); setOpen(false); };

  if (!wallets.length && !connectedKey) {
    return (
      <button type="button"
        onClick={() => alert("No Cardano wallet detected. Install Nami, Lace, Eternl, Flint or Gero.")}
        className="px-3 py-2 rounded-lg border border-foreground/20 text-sm text-foreground/80 hover:text-foreground hover:border-foreground/40">
        {t("wallet.connect")}
      </button>
    );
  }

  return (
    <div className="relative">
      {!connectedKey ? (
        <button type="button" onClick={() => setOpen(o=>!o)}
          className="px-3 py-2 rounded-lg border border-foreground/20 text-sm hover:bg-foreground/10">
          {busy ? t("wallet.connecting") : t("wallet.connect")}
        </button>
      ) : (
        <button type="button" title={connectedLabel} onClick={() => setOpen(o=>!o)}
          className="px-3 py-2 rounded-lg border border-emerald-400/30 text-sm text-emerald-300 bg-emerald-400/10 hover:bg-emerald-400/20">
          ✅ {t("wallet.connected")}
        </button>
      )}

      {open && !connectedKey && (
        <div className="absolute right-0 mt-2 min-w-56 rounded-xl border border-foreground/15 bg-background/95 backdrop-blur shadow-xl p-2 z-50">
          {wallets.map(w => (
            <button key={w.key} type="button" onClick={() => connect(w.key)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left hover:bg-foreground/10">
              {w.icon ? <img src={w.icon} alt={w.name} className="w-5 h-5 rounded" /> : <span className="w-5 h-5 rounded bg-foreground/20 inline-block" />}
              <span className="text-sm">{busy === w.key ? t("wallet.connecting") : w.name}</span>
            </button>
          ))}
          {!wallets.length && <div className="px-3 py-2 text-sm opacity-70">No wallets found.</div>}
        </div>
      )}

      {open && connectedKey && (
        <div className="absolute right-0 mt-2 min-w-56 rounded-xl border border-foreground/15 bg-background/95 backdrop-blur shadow-xl p-2 z-50">
          <div className="px-3 py-2 text-xs opacity-75">{connectedLabel}</div>
          <button type="button" onClick={disconnect}
            className="w-full px-3 py-2 rounded-lg text-left text-red-300 hover:bg-red-400/10">
            {t("wallet.disconnect")}
          </button>
        </div>
      )}
    </div>
  );
}

// —— Language (i18next) ——
const SUPPORTED = [
  { code: "fa", label: "FA", dir: "rtl" as const },
  { code: "en", label: "EN", dir: "ltr" as const },
  { code: "ar", label: "AR", dir: "rtl" as const },
  { code: "ru", label: "RU", dir: "ltr" as const },
];
function useDirWatcher() {
  const { i18n } = useTranslation();
  useEffect(() => {
    const lang = i18n.language;
    const found = SUPPORTED.find(l => l.code === lang) || SUPPORTED[1];
    document.documentElement.dir = found.dir;
    document.documentElement.lang = found.code;
  }, [i18n.language]);
}
function LanguageMenu() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const current = useMemo(() => SUPPORTED.find(l => l.code === i18n.language) || SUPPORTED[1], [i18n.language]);
  const change = async (code: string) => { await i18n.changeLanguage(code); setOpen(false); };
  return (
    <div className="relative">
      <button type="button" className="px-3 py-2 rounded-lg border border-foreground/20 text-sm hover:text-foreground hover:border-foreground/40"
        onClick={() => setOpen(o=>!o)} title="Language">
        {current.label}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 min-w-36 rounded-xl border border-foreground/15 bg-background/95 backdrop-blur shadow-xl p-1 z-50">
          {SUPPORTED.map(l => (
            <button key={l.code} type="button" onClick={() => change(l.code)}
              className={`w-full px-3 py-2 text-left rounded-lg hover:bg-foreground/10 ${l.code === current.code ? "opacity-100" : "opacity-80"}`}>
              {l.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// —— Header —— 
export default function Header() {
  const { t } = useTranslation("common");
  const loc = useLocation();
  useDirWatcher();

  useEffect(() => { window.dispatchEvent(new CustomEvent("close-menus")); }, [loc.pathname]);

  const linkCls = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-lg transition-colors ${isActive ? "bg-white/10 text-white" : "text-white/80 hover:text-white"}`;

  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-black/50 border-b border-white/10">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logoasli1373.png" alt="FarsiHub" className="h-9 w-auto" loading="eager" />
        </Link>

        <nav className="flex items-center gap-1 text-sm">
          <NavLink to="/" className={linkCls} end>{t("nav.home")}</NavLink>
          <NavLink to="/whitepaper" className={linkCls}>{t("nav.whitepaper")}</NavLink>
          <NavLink to="/farsicoin" className={linkCls}>{t("nav.farsicoin")}</NavLink>
          {/* صفحات دیگر در صورت نیاز */}
          <NavLink to="/marketplace" className={linkCls}>{t("nav.marketplace")}</NavLink>
          <NavLink to="/tourism" className={linkCls}>{t("nav.tourism")}</NavLink>
          <NavLink to="/dating" className={linkCls}>{t("nav.dating")}</NavLink>
          <NavLink to="/metaverse" className={linkCls}>{t("nav.metaverse")}</NavLink>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <LanguageMenu />
          <WalletConnectButton t={t} />
          <NavLink to="/login"><Button variant="ghost" size="sm">{t("auth.login")}</Button></NavLink>
          <NavLink to="/signup"><Button size="sm">{t("auth.signup")}</Button></NavLink>
        </div>
      </div>
    </header>
  );
}
