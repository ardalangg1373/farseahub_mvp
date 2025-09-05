import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, ShoppingBag, MapPin, Heart, User, Sparkles, Wallet } from 'lucide-react';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [walletAddr, setWalletAddr] = useState<string | null>(null); // mock wallet
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6);
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
  const toggleMockWallet = () => {
    if (walletAddr) setWalletAddr(null);
    else setWalletAddr('addr1qxy23k9v0m4c89test9cardano99xyz');
  };

  return (
    <header
      className={[
        'sticky top-0 z-50 w-full transition-all duration-300',
        // شیشه‌ای + پس‌زمینه ملایم (پررنگ‌تر وقتی اسکرول می‌کنی)
        scrolled
          ? 'bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm'
          : 'bg-background/40 backdrop-blur supports-[backdrop-filter]:bg-background/30',
        scrolled ? 'h-14' : 'h-20',
        'border-b border-border/40'
      ].join(' ')}
      role="navigation"
      aria-label="Main"
    >
      <div className="container flex h-full items-center justify-between">
        {/* Logo + Brand */}
       <Link to="/" className="flex items-center gap-1.5">
  <img
    src="/logoasli1373.png"
    alt="arseahub logo"
    className="h-8 w-auto"
  />
  <span className="-ml-1 leading-none text-[20px] font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-pink-500 to-purple-500">
    arseahub
  </span>
</Link>


        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2">
          {navigation.map((item) => {
            const Icon = item.icon as any;
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                className={[
                  'relative px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  active
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                ].join(' ')}
              >
                <span className="flex items-center gap-2">
                  {Icon && <Icon className="h-4 w-4" />}
                  {item.name}
                </span>
                {/* underline indicator */}
                <span
                  className={[
                    'absolute left-3 right-3 -bottom-[2px] h-[2px] rounded-full transition-all',
                    active ? 'bg-primary scale-x-100 opacity-100' : 'bg-primary/60 scale-x-0 opacity-0'
                  ].join(' ')}
                />
              </Link>
            );
          })}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          {/* Wallet (mock) */}
          <Button variant={walletAddr ? 'outline' : 'default'} onClick={toggleMockWallet}>
            <Wallet className="h-4 w-4 mr-2" />
            {walletAddr ? shortAddr(walletAddr) : 'Connect Wallet'}
          </Button>

          {/* Auth / Profile */}
          {walletAddr ? (
            <Link to="/profile">
              <Button variant="ghost" className="gap-2">
                <User className="h-4 w-4" />
                Profile
              </Button>
            </Link>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link to="/signup">
                <Button>Sign Up</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[380px]">
            <div className="flex items-center gap-2 mb-6">
              <img src="/logoasli1373.png" alt="arseahub logo" className="h-8 w-auto" />
              <span className="text-lg font-semibold">arseahub</span>
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
                      'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                      active
                        ? 'bg-primary text-primary-foreground'
                        : 'text-foreground hover:bg-muted'
                    ].join(' ')}
                  >
                    {Icon && <Icon className="h-5 w-5" />}
                    {item.name}
                  </Link>
                );
              })}
            </div>

            <div className="mt-6 border-t pt-4 space-y-2">
              <Button
                className="w-full justify-start gap-2"
                variant={walletAddr ? 'outline' : 'default'}
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
                  <Button variant="ghost" className="w-full justify-start gap-2">
                    <User className="h-4 w-4" />
                    Profile
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">
                      Login
                    </Button>
                  </Link>
                  <Link to="/signup" onClick={() => setIsOpen(false)}>
                    <Button className="w-full">Sign Up</Button>
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
