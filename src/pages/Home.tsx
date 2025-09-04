import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Play, Shield, Users, Globe, Zap, Sparkles, Star, ShoppingBag, Coins } from "lucide-react";

/**
 * صفحه Home — نسخه‌ی پایدار برای Vite + React Router + shadcn/ui
 * نکته مهم: ویدیو را در مسیر public/videos/comp.mp4 قرار بده و آدرس را به "/videos/comp.mp4" بگذار.
 */

// هوک ساده برای ریویل‌ شدن با اسکرول
function useRevealOnScroll<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible(true);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return { ref, visible } as const;
}

// کارت ویژگی‌ها
function Feature({ icon: Icon, title, desc }: { icon: React.ComponentType<any>; title: string; desc: string }) {
  return (
    <Card className="border border-white/10 bg-black/40 backdrop-blur-md hover:bg-black/50 transition-all">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl border border-white/10">
            <Icon className="size-5" />
          </div>
          <CardTitle className="text-base">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-sm leading-relaxed">{desc}</CardDescription>
      </CardContent>
    </Card>
  );
}

export default function Home() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { ref: introRef, visible: introVisible } = useRevealOnScroll<HTMLDivElement>();
  const { ref: featRef, visible: featVisible } = useRevealOnScroll<HTMLDivElement>();
  const { ref: ctaRef, visible: ctaVisible } = useRevealOnScroll<HTMLDivElement>();

  useEffect(() => {
    // تلاش برای شروع پخش خودکار (به‌ویژه iOS)
    const play = async () => {
      try {
        await videoRef.current?.play();
      } catch (e) {
        // کاربر باید تعامل کند—نمایش دکمه Play
      }
    };
    play();
  }, []);

  const scrollToIntro = () => {
    const el = document.getElementById("intro-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const features = [
    {
      icon: Shield,
      title: "Trust & Security",
      desc: "اقتصاد درون‌برنامه‌ای با FarsiCoin روی Cardano و طراحی ایمن برای تراکنش‌ها و مالکیت دارایی‌ها.",
    },
    {
      icon: Users,
      title: "Community-first",
      desc: "جامعه‌محور با هاب‌های فرهنگی: Persian Bazaar و EastWorld Modern و فضاهای بین‌فرهنگی.",
    },
    {
      icon: Globe,
      title: "Open & Extensible",
      desc: "اتصال به اکوسیستم‌ها، رویدادها و بازی‌ها—قابل‌گسترش برای تیم‌ها و سازندگان.",
    },
    {
      icon: Zap,
      title: "Performance",
      desc: "فرانت‌اند سبک با انیمیشن نرم، Scroll‑to‑Reveal و بهینه برای دیپلوی.",
    },
    {
      icon: ShoppingBag,
      title: "Marketplace-ready",
      desc: "آمادگی برای مارکت‌پلیس آیتم‌ها، NFT/Assets و خدمات داخل متاورس.",
    },
    {
      icon: Coins,
      title: "FarsiCoin Economy",
      desc: "توکنومیکس شفاف، قواعد بازی و ساب‌صفحات مستندات برای رشد پایدار.",
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black text-zinc-50">
      {/* قهرمان ویدیویی */}
      <section className="relative h-[100svh] w-full overflow-hidden">
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          src="/videos/comp.mp4" // فایل را در public/videos/comp.mp4 بگذار
          playsInline
          autoPlay
          muted
          controls={false}
          preload="auto"
        />

        {/* گرادینت و متن روی ویدیو */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />

        <div className="relative z-10 h-full flex items-center justify-center text-center px-6">
          <div className="max-w-4xl">
            <Badge className="mb-6 bg-white/10 text-white hover:bg-white/20 border border-white/20">
              <Sparkles className="mr-1 size-4" /> MVP Preview
            </Badge>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-semibold leading-tight">
              FarseaHub isn’t just <span className="italic">another metaverse</span>
            </h1>
            <p className="mt-4 text-zinc-300 text-base md:text-lg">
              It’s culturally tailored. Community‑owned economy via FarsiCoin. Events, games, and social spaces.
            </p>
            <div className="mt-8 flex items-center justify-center gap-3">
              <Button size="lg" asChild className="gap-2">
                <Link to="/metaverse">
                  Enter Metaverse <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button size="lg" variant="secondary" className="gap-2" onClick={scrollToIntro}>
                <Play className="size-4" /> Learn more
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* بخش معرفی با Scroll‑to‑Reveal */}
      <section
        id="intro-section"
        ref={introRef}
        className={`relative px-6 py-24 sm:py-28 md:py-32 max-w-6xl mx-auto transition-all duration-700 ${
          introVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <div className="grid md:grid-cols-5 gap-10 items-start">
          <div className="md:col-span-3 space-y-4">
            <h2 className="text-2xl sm:text-4xl font-semibold">
              Built for creators, players, and culturally rich communities
            </h2>
            <p className="text-zinc-300 leading-relaxed">
              FarseaHub ترکیبی است از فضاهای اجتماعی، رویدادها و مینی‌گیم‌ها که حول جوامع خاورمیانه‌ای و جهانی
              شکل گرفته‌اند. اقتصاد داخلی با <span className="font-medium">FarsiCoin</span> پشتیبانی می‌شود.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <Badge variant="secondary">Persian Bazaar</Badge>
              <Badge variant="secondary">EastWorld Modern</Badge>
              <Badge variant="secondary">Cross‑cultural Hubs</Badge>
            </div>
            <div className="flex gap-3 pt-6">
              <Button asChild className="gap-2">
                <Link to="/whitepaper">
                  Read Whitepaper <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="gap-2 border-white/20">
                <Link to="/farsicoin">FarsiCoin Docs</Link>
              </Button>
            </div>
          </div>

          <Card className="md:col-span-2 border-white/10 bg-black/40">
            <CardHeader>
              <CardTitle className="text-lg">Quick links</CardTitle>
              <CardDescription>پرطرفدارترین مسیرها</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Link to="/marketplace" className="group flex items-center justify-between rounded-xl border border-white/10 p-3 hover:bg-white/5">
                <span>Marketplace</span>
                <ArrowRight className="size-4 group-hover:translate-x-1 transition" />
              </Link>
              <Link to="/minigames" className="group flex items-center justify-between rounded-xl border border-white/10 p-3 hover:bg-white/5">
                <span>Mini‑Games</span>
                <ArrowRight className="size-4 group-hover:translate-x-1 transition" />
              </Link>
              <Link to="/youtube-demo" className="group flex items-center justify-between rounded-xl border border-white/10 p-3 hover:bg-white/5">
                <span>Watch demo</span>
                <ArrowRight className="size-4 group-hover:translate-x-1 transition" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ویژگی‌ها */}
      <section
        ref={featRef}
        className={`px-6 pb-16 md:pb-20 max-w-6xl mx-auto transition-all duration-700 ${
          featVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <div className="flex items-end justify-between mb-6">
          <h3 className="text-xl sm:text-2xl font-semibold">Why FarseaHub</h3>
          <div className="flex items-center gap-1 text-amber-400/90">
            <Star className="size-4" />
            <span className="text-sm">Creator‑friendly</span>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <Feature key={i} icon={f.icon} title={f.title} desc={f.desc} />
          ))}
        </div>
      </section>

      {/* CTA پایانی */}
      <section
        ref={ctaRef}
        className={`px-6 pb-28 max-w-5xl mx-auto transition-all duration-700 ${
          ctaVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <Card className="border-white/10 bg-gradient-to-br from-zinc-900/80 to-black/80 overflow-hidden">
          <CardContent className="p-8 md:p-10">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-10">
              <div className="flex-1">
                <h4 className="text-2xl font-semibold">Ready to build with us?</h4>
                <p className="mt-2 text-zinc-300">
                  به مستندات FarsiCoin، قوانین بازی و رودمپ مراجعه کنید یا مستقیماً وارد متاورس شوید.
                </p>
              </div>
              <div className="flex gap-3">
                <Button asChild className="gap-2">
                  <Link to="/docs/tokenomics">Tokenomics</Link>
                </Button>
                <Button asChild variant="outline" className="gap-2 border-white/20">
                  <Link to="/docs/game-rules">Game Rules</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* فوتر خیلی مختصر (اختیاری) */}
      <footer className="px-6 pb-10 text-center text-xs text-zinc-400/80">
        © {new Date().getFullYear()} FarseaHub · Built with ❤️
      </footer>
    </main>
  );
}
