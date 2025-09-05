import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, ShoppingBag, MapPin, Heart, User, Sparkles, Wallet } from 'lucide-react';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [walletAddr, setWalletAddr] = useState<string | null>(null); // mock wallet
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const sTop = h.scrollTop || document.body.scrollTop;
      const sHeight = h.scrollHeight - h.clientHeight;
      setProgress(sHeight ? (sTop / sHeight) * 100 : 0);
      setScrolled(window.scrollY > 6);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navigation = [
    { name: 'Home', href: '/', icon: null },
    { name: 'Marketplace', href: '/marketplace', icon: ShoppingBag },
    { name: 'Tourism', href: '/tourism', icon: MapPin },
    { name: 'Dating', href: '/dating', icon: Heart },
    { name: 'Metaverse', href: '/metaverse', icon: Sparkles },
  ];

  const isActive = (path: string) => location.pathname === path;
  const shortAddr = (addr: string) => addr.slice(0, 6) + '…' + addr.slice(-4);
  const toggleMockWallet = () => setWalletAddr(w => (w ? null : 'addr1qxy23k9v0m4c89test9cardano99xyz'));

  return (
    <header
      role="navigation"
      aria-label="Main"
      className={[
        'sticky top-0 z-50 w-full transition-all duration-300',
        // شیشه‌ای لاکچری با گرادیان بسیار لطیف و حلقه قرمز
        scrolled
          ? 'backdrop-blur-md bg-black/55 supports-[backdrop-filter]:bg-black/45 shadow-[0_10px_30px_-15px_rgba(229,9,20,0.25)]'
          : 'backdrop-blur-md bg-black/35 supports-[backdrop-filter]:bg-black/25',
        scrolled ? 'h-14' : 'h-20',
        'border-b border-white/5'
      ].join(' ')}
      style={{
        // هاله‌ی قرمز خیلی ملایم زیر هدر
        boxShadow: scrolled
          ? '0 0 0 1px rgba(255,255,255,0.04), inset 0 -1px 0 rgba(255,255,255,0.04)'
          : undefined,
        backgroundImage:
          'radial-gradient(60rem 40rem at 110% -20%, rgba(229,9,20,0.12), transparent 60%)'
      }}
    >
      {/* نوار پیشرفت اسکرول (2px) */}
      <div
        className="absolute left-0 top-0 h-[2px] bg-gradient-to-r from-red-500 via-rose-500 to-purple-500 transition-[width] duration-150"
        style={{ width: `${progress}%` }}
        aria-hidden
      />

      {/* خط زیرین گرادیانیِ زنده */}
      <div
        className="pointer-events-none absolute inset-x-0 -bottom-px h-px"
        style={{
          background:
            'linear-gradient(90deg, rgba(229,9,20,0) 0%, rgba(229,9,20,0.5) 12%, rgba(229,9,20,0.7) 50%, rgba(229,9,20,0.5) 88%, rgba(229,9,20,0) 100%)'
        }}
      />

      <div className="container flex h-full items-center justify-between">
        {/* Logo + Brand */}
        <Link to="/" className="relative group flex items-center gap-1.5">
          {/* هاله پشت لوگو */}
          <span className="absolute -inset-2 rounded-xl bg-red-600/0 blur-xl transition group-hover:bg-red-600/10" aria-hidden></span>

          <img src="/logoasli1373.png" alt="Farseahub logo" className="relative h-8 w-auto" />

          <span className="relative -ml-1 leading-none text-[20px] font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-pink-500 to-purple-500">
            farseahub
          </span>
        </Link>

        {/* Desktop Navigation – کپسول شیشه‌ای */}
        <nav className="hidden md:flex items-center gap-1 rounded-2xl border border-white/5 bg-white/5 backdrop-blur px-1 py-1">
          {navigation.map((item) => {
            const Icon = item.icon as any;
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                className={[
                  'relative px-3 py-2 rounded-xl text-sm font-medium transition',
                  active
                    ? 'text-white'
                    : 'text-zinc-300/80 hover:text-white'
                ].join(' ')}
              >
                <span className="flex items-center gap-2">
                  {Icon && <Icon className="h-4 w-4" />}
                  {item.name}
                </span>

                {/* پس‌زمینه‌ی قرمز محو هنگام هاور/اکتیو */}
                <span
                  className={[
                    'pointer-events-none absolute inset-0 -z-10 rounded-xl transition',
                    active ? 'bg-red-600/15 shadow-[0_0_0_1px_rgba(229,9,20,0.35)_inset]' : 'group-hover:bg-red-600/10'
                  ].join(' ')}
                />

                {/* اندیکاتور زیر لینک با اسلاید */}
                <span
                  className={[
                    'absolute left-3 right-3 -bottom-[3px] h-[2px] rounded-full transition-all origin-left',
                    active ? 'bg-gradient-to-r from-red-500 via-rose-500 to-purple-500 scale-x-100 opacity-100' : 'bg-red-500/60 scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-80'
                  ].join(' ')}
                />
              </Link>
            );
          })}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-2">
          {/* Wallet (mock) */}
          <Button
            variant={walletAddr ? 'outline' : 'default'}
            onClick={toggleMockWallet}
            className={[
              'relative overflow-hidden rounded-xl',
              'bg-gradient-to-br from-red-600 to-red-700 text-white',
              'hover:opacity-95 border-0',
              walletAddr ? '!bg-transparent !text-zinc-100 !border !border-white/10' : '',
            ].join(' ')}
          >
            <span className="absolute inset-0 -z-10 opacity-30"
              style={{
                background:
                  'radial-gradient(30rem 30rem at -20% -50%, rgba(255,255,255,0.25), transparent)'
              }}
            />
            <Wallet className="h-4 w-4 mr-2" />
            {walletAddr ? shortAddr(walletAddr) : 'Connect Wallet'}
          </Button>

          {/* Auth / Profile */}
          {walletAddr ? (
            <Link to="/profile">
              <Button variant="ghost" className="gap-2 text-zinc-200 hover:text-white hover:bg-white/5 rounded-xl">
                <User className="h-4 w-4" />
                Profile
              </Button>
            </Link>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" className="text-zinc-200 hover:text-white hover:bg-white/5 rounded-xl">
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" aria-label="Open menu" className="rounded-xl hover:bg-white/10">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-[300px] sm:w-[380px] border-l border-white/10 bg-black/80 backdrop-blur-xl"
          >
            <div className="flex items-center gap-2 mb-6">
              <img src="/logoasli1373.png" alt="Farseahub logo" className="h-8 w-auto" />
              <span className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-pink-500 to-purple-500">
                farseahub
              </span>
            </div>

            <div className="flex flex-col space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon as any;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    className={[
                      'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition',
                      active
                        ? 'bg-red-600/20 text-white shadow-[inset_0_0_0_1px_rgba(229,9,20,0.35)]'
                        : 'text-zinc-200 hover:bg-white/5'
                    ].join(' ')}
                  >
                    {Icon && <Icon className="h-5 w-5" />}
                    {item.name}
                  </Link>
                );
              })}
            </div>

            <div className="mt-6 border-t border-white/10 pt-4 space-y-2">
              <Button
                className="w-full justify-start gap-2 rounded-xl bg-gradient-to-br from-red-600 to-red-700 text-white hover:opacity-95 border-0"
                variant={walletAddr ? 'default' : 'default'}
                onClick={() => {
                  toggleMockWallet();
                  setIsOpen(false);
                }}
              >
                <Wallet className="h-4 w-4" />
                {walletAddr ? shortAddr(walletAddr) : 'Connect Wallet'}
              </Button>

              {walletAddr ? (
                <Link to="/profile" onClick={() => setIsOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start gap-2 rounded-xl text-zinc-200 hover:text-white hover:bg-white/5">
                    <User className="h-4 w-4" />
                    Profile
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start rounded-xl text-zinc-200 hover:text-white hover:bg-white/5">
                      Login
                    </Button>
                  </Link>
                  <Link to="/signup" onClick={() => setIsOpen(false)}>
                    <Button className="w-full rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Header;
