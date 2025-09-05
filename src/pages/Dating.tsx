import { useEffect, useMemo, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Heart, X, MapPin, MessageCircle, Users, Shield, Volume2, VolumeX,
  Star, Sparkles, Filter, Verified, Crown, Search, ChevronLeft, ChevronRight
} from 'lucide-react';

/* =========================================================
   COLORS (luxury red/black)
========================================================= */
const LUX_RED = '#B1060F';     // deep luxury red
const LUX_RED_SOFT = 'rgba(177,6,15,0.2)';

/* =========================================================
   HEADER (Glass + CTA)
========================================================= */
function HeaderGlass() {
  return (
    <header className="sticky top-0 z-40">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mt-4 mb-4 flex items-center justify-between rounded-2xl border border-white/10 bg-black/40 px-4 py-3 backdrop-blur-xl shadow-lg">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-[--lux-red] ring-2 ring-[--lux-red] shadow"
                 style={{ ['--lux-red' as any]: LUX_RED }} />
            <span className="text-lg font-extrabold tracking-wide"
                  style={{ color: LUX_RED }}>FarsiHub Dating</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-white/80">
            <a className="hover:text-white transition" href="#">Home</a>
            <a className="hover:text-white transition" href="#">Dating</a>
            <a className="hover:text-white transition" href="#">Messages</a>
            <a className="hover:text-white transition" href="#">Profile</a>
            <a className="hover:text-white transition" href="#">VIP</a>
          </nav>
          <Button className="rounded-xl bg-[--lux-red] hover:opacity-90"
                  style={{ ['--lux-red' as any]: LUX_RED }}>
            Join Now
          </Button>
        </div>
      </div>
    </header>
  );
}

/* =========================================================
   HERO: film11 + film12 from /public (root) with audio + soft crossfade
========================================================= */
function VideoHeroDuo({
  srcA = '/film11.mp4',
  srcB = '/film12.mp4',
}: {
  srcA?: string;
  srcB?: string;
}) {
  const vidA = useRef<HTMLVideoElement | null>(null);
  const vidB = useRef<HTMLVideoElement | null>(null);
  const [active, setActive] = useState<0 | 1>(0); // 0 -> A, 1 -> B
  const [muted, setMuted] = useState(true);

  const safePlay = (v: HTMLVideoElement | null) => v?.play().catch(() => {});

  useEffect(() => {
    const a = vidA.current;
    const b = vidB.current;
    if (!a || !b) return;

    // initial styles
    a.style.opacity = '1';
    b.style.opacity = '0';

    // start muted so autoplay works
    a.muted = true;
    b.muted = true;
    a.volume = 1;
    b.volume = 1;

    safePlay(a);

    const crossFade = () => {
      const current = active === 0 ? a : b;
      const next = active === 0 ? b : a;
      if (!current || !next) return;

      try { next.currentTime = 0; } catch {}

      next.style.transition = 'opacity 900ms ease';
      current.style.transition = 'opacity 900ms ease';

      // audio handover
      if (!muted) {
        current.muted = true;
        next.muted = false;
        next.removeAttribute('muted');
        next.volume = 1;
      }

      next.style.opacity = '1';
      current.style.opacity = '0';
      safePlay(next);

      setActive((p) => (p === 0 ? 1 : 0));
    };

    a.addEventListener('ended', crossFade);
    b.addEventListener('ended', crossFade);

    return () => {
      a.removeEventListener('ended', crossFade);
      b.removeEventListener('ended', crossFade);
    };
  }, [active, muted]);

  const toggleMute = () => {
    const a = vidA.current;
    const b = vidB.current;
    const willBeMuted = !muted;
    setMuted(willBeMuted);

    const activeEl = active === 0 ? a : b;
    const inactiveEl = active === 0 ? b : a;

    if (activeEl) {
      activeEl.muted = willBeMuted;
      if (!willBeMuted) {
        activeEl.removeAttribute('muted');
        activeEl.volume = 1;
        if (activeEl.paused) activeEl.play().catch(() => {});
      }
    }
    if (inactiveEl) inactiveEl.muted = true;
  };

  return (
    <section className="relative w-full h-[60vh] md:h-[75vh] overflow-hidden rounded-2xl mb-8 shadow-2xl">
      {/* edge mask */}
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            'linear-gradient(90deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.15) 25%, rgba(0,0,0,0.15) 75%, rgba(0,0,0,0.65) 100%)',
        }}
      />
      {/* stacked videos */}
      <video
        ref={vidA}
        src={srcA}
        className="absolute inset-0 h-full w-full object-cover"
        playsInline
        preload="auto"
        autoPlay
        loop={false}
        muted
      />
      <video
        ref={vidB}
        src={srcB}
        className="absolute inset-0 h-full w-full object-cover"
        playsInline
        preload="auto"
        autoPlay
        loop={false}
        muted
      />
      {/* Taglines (Middle Eastern style) */}
      <div className="absolute inset-0 z-20 flex items-center">
        <div className="w-full px-6 md:px-10">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="hidden md:flex flex-col gap-3">
              <span className="text-xs uppercase tracking-[0.25em] text-white/70">Find Love</span>
              <h2 className="text-3xl md:text-5xl font-extrabold leading-tight drop-shadow">
                Middle Eastern <span style={{ color: LUX_RED }}>style</span>
              </h2>
              <p className="text-white/80">
                Real connections, modern safety, and a luxurious experience tailored for the Middle East.
              </p>
              <div className="flex gap-3">
                <Button className="bg-[--lux-red] rounded-xl hover:opacity-90"
                        style={{ ['--lux-red' as any]: LUX_RED }}>Get Started</Button>
                <Button variant="outline" className="rounded-xl border-white/30 text-white hover:bg-white/10">
                  Learn More
                </Button>
              </div>
            </div>
            <div className="hidden md:flex flex-col items-end justify-end gap-2">
              <div className="rounded-2xl bg-black/40 backdrop-blur-md px-4 py-2 border border-white/10 text-white">
                Verified profiles • AI safety filters • VIP lounges
              </div>
              <div className="rounded-2xl bg-black/40 backdrop-blur-md px-4 py-2 border border-white/10 text-white">
                Swipe smoothly • Smart discovery • Private mode
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Mute / Unmute */}
      <button
        onClick={toggleMute}
        className="absolute bottom-4 right-4 z-30 rounded-xl px-4 py-2 text-sm font-semibold border border-white/30 bg-black/50 text-white hover:bg-black/70 transition backdrop-blur-md shadow-lg"
      >
        {muted ? (
          <span className="inline-flex items-center gap-2"><Volume2 size={16}/> Unmute</span>
        ) : (
          <span className="inline-flex items-center gap-2"><VolumeX size={16}/> Mute</span>
        )}
      </button>
    </section>
  );
}

/* =========================================================
   TYPES & MOCK DATA
========================================================= */
type Profile = {
  id: number;
  name: string;
  age: number;
  city: string;
  bio: string;
  interests: string[];
  photos: number;
  verified: boolean;
  vip?: boolean;
  gender?: 'female' | 'male' | 'other';
  photoUrls?: string[]; // optional; if not provided, gradient avatar shows
};

type MatchItem = {
  id: number; name: string; age: number; city: string;
  lastMessage: string; timestamp: string; unread: boolean;
};

const PROFILES: Profile[] = [
  {
    id: 1,
    name: 'Sara',
    age: 27,
    city: 'Dubai',
    bio: 'Exploring cultures, photography, and poetry. Looking for meaningful connections.',
    interests: ['Photography', 'Poetry', 'Travel', 'Art'],
    photos: 5,
    verified: true,
    vip: true,
    gender: 'female',
  },
  {
    id: 2,
    name: 'Arman',
    age: 31,
    city: 'Tehran',
    bio: 'Software engineer into tech and traditional music. Hiking and cooking on weekends.',
    interests: ['Technology', 'Music', 'Hiking', 'Cooking'],
    photos: 4,
    verified: true,
    gender: 'male',
  },
  {
    id: 3,
    name: 'Mina',
    age: 25,
    city: 'Beirut',
    bio: 'Designer who loves books, cats, and tea-time talks. Seeking genuine vibes.',
    interests: ['Art', 'Books', 'Design', 'Cats'],
    photos: 6,
    verified: false,
    vip: true,
    gender: 'female',
  },
  {
    id: 4,
    name: 'Kian',
    age: 29,
    city: 'Riyadh',
    bio: 'Doctor. Passionate about helping others. Basketball, reading, and history.',
    interests: ['Medicine', 'Basketball', 'History', 'Reading'],
    photos: 3,
    verified: true,
    gender: 'male',
  },
];

const MATCHES: MatchItem[] = [
  { id: 11, name: 'Neda', age: 26, city: 'Doha', lastMessage: 'That plan sounds great!', timestamp: '2h ago', unread: true },
  { id: 12, name: 'Sina', age: 28, city: 'Tehran', lastMessage: 'How was your day?', timestamp: '1d ago', unread: false },
  { id: 13, name: 'Roya', age: 24, city: 'Dubai', lastMessage: 'Loved your book rec!', timestamp: '3d ago', unread: false },
  { id: 14, name: 'Ali', age: 30, city: 'Muscat', lastMessage: 'Coffee this weekend?', timestamp: '5d ago', unread: true },
];

/* =========================================================
   UTIL: Count-up animation
========================================================= */
function useCountUp(target: number, durationMs = 1200) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / durationMs);
      setValue(Math.round(target * (0.2 + 0.8 * p)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, durationMs]);
  return value;
}

/* =========================================================
   SWIPE CARD (Tinder-like)
========================================================= */
function SwipeCard({
  profile,
  onSwipeLeft,
  onSwipeRight,
}: {
  profile: Profile;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [drag, setDrag] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);

  // pointer handlers
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    let startX = 0, startY = 0;

    const onPointerDown = (e: PointerEvent) => {
      setDragging(true);
      startX = e.clientX;
      startY = e.clientY;
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return;
      setDrag({ x: e.clientX - startX, y: e.clientY - startY });
    };
    const onPointerUp = () => {
      setDragging(false);
      const threshold = 120;
      if (drag.x > threshold) {
        // like
        el.style.transition = 'transform 300ms ease, opacity 300ms ease';
        el.style.transform = `translateX(${window.innerWidth}px) rotate(12deg)`;
        el.style.opacity = '0';
        setTimeout(onSwipeRight, 260);
      } else if (drag.x < -threshold) {
        // nope
        el.style.transition = 'transform 300ms ease, opacity 300ms ease';
        el.style.transform = `translateX(-${window.innerWidth}px) rotate(-12deg)`;
        el.style.opacity = '0';
        setTimeout(onSwipeLeft, 260);
      } else {
        // snap back
        setDrag({ x: 0, y: 0 });
      }
    };

    el.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    return () => {
      el.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, [drag.x, dragging, onSwipeLeft, onSwipeRight]);

  const rotate = drag.x / 20;
  const likeOpacity = Math.max(0, Math.min(1, drag.x / 120));
  const nopeOpacity = Math.max(0, Math.min(1, -drag.x / 120));

  return (
    <div
      ref={cardRef}
      className="relative select-none will-change-transform"
      style={{
        transform: `translate(${drag.x}px, ${drag.y}px) rotate(${rotate}deg)`,
        transition: dragging ? 'none' : 'transform 250ms ease',
      }}
    >
      <Card className="w-full max-w-xl mx-auto overflow-hidden rounded-3xl border-white/10 bg-black/40 backdrop-blur-xl">
        {/* Photo area (placeholder gradients; replace with real photos if available) */}
        <div className="relative aspect-[3/4] bg-gradient-to-br from-black to-neutral-800">
          {/* badges */}
          {profile.verified && (
            <div className="absolute top-3 left-3 flex items-center gap-2">
              <Badge className="bg-blue-500/90 backdrop-blur border-0">
                <Shield className="h-3 w-3 mr-1"/> Verified
              </Badge>
              {profile.vip && (
                <Badge className="bg-yellow-500/90 backdrop-blur border-0">
                  <Crown className="h-3 w-3 mr-1"/> VIP
                </Badge>
              )}
            </div>
          )}
          {/* like/nope hints */}
          <div className="absolute top-4 right-4 rounded-md border-2 px-3 py-1 text-sm font-bold"
               style={{ borderColor: 'rgba(34,197,94,0.9)', color: 'rgba(34,197,94,0.9)', opacity: likeOpacity }}>
            LIKE
          </div>
          <div className="absolute top-4 left-4 rounded-md border-2 px-3 py-1 text-sm font-bold"
               style={{ borderColor: 'rgba(239,68,68,0.9)', color: 'rgba(239,68,68,0.9)', opacity: nopeOpacity }}>
            NOPE
          </div>
          {/* initials bubble as fallback visual */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-28 w-28 rounded-3xl grid place-items-center font-extrabold text-4xl"
                 style={{
                   background: `linear-gradient(135deg, ${LUX_RED_SOFT}, rgba(0,0,0,0.55))`,
                   boxShadow: `0 0 0 2px ${LUX_RED}`,
                 }}>
              {profile.name[0]}
            </div>
          </div>
          {/* photo count */}
          <div className="absolute bottom-3 right-3 rounded-full bg-black/60 text-white text-xs px-3 py-1 backdrop-blur">
            {profile.photos} photos
          </div>
        </div>

        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-2xl font-extrabold">
                {profile.name}, {profile.age}
              </h3>
              <div className="mt-1 flex items-center text-white/70">
                <MapPin className="h-4 w-4 mr-1" /> {profile.city}
              </div>
            </div>
            <Badge variant="secondary" className="bg-white/10 border-white/10 text-white">
              <Sparkles className="h-3 w-3 mr-1" /> Middle Eastern style
            </Badge>
          </div>

          <p className="mt-4 text-white/80">{profile.bio}</p>

          <div className="mt-5">
            <h4 className="mb-2 font-semibold">Interests</h4>
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((interest, idx) => (
                <Badge key={idx} variant="secondary" className="bg-black/40 border-white/10 text-white">
                  {interest}
                </Badge>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex justify-center gap-4">
            <Button
              variant="outline"
              size="lg"
              className="rounded-full w-16 h-16 border-red-300/30 bg-black/40 hover:bg-red-900/20"
              onClick={() => {
                setDrag({ x: -200, y: 0 });
                setTimeout(onSwipeLeft, 200);
              }}
              title="Nope"
            >
              <X className="h-6 w-6 text-red-500" />
            </Button>
            <Button
              size="lg"
              className="rounded-full w-16 h-16 bg-[--lux-red] hover:opacity-90"
              style={{ ['--lux-red' as any]: LUX_RED }}
              onClick={() => {
                setDrag({ x: 200, y: 0 });
                setTimeout(onSwipeRight, 200);
              }}
              title="Like"
            >
              <Heart className="h-6 w-6" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* =========================================================
   MATCHES SLIDER
========================================================= */
function MatchesBar({ items }: { items: MatchItem[] }) {
  const scRef = useRef<HTMLDivElement | null>(null);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <MessageCircle className="h-5 w-5 mr-2" />
          Your Matches
        </CardTitle>
        <CardDescription>{items.length} matches waiting to chat</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <div ref={scRef} className="flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory">
            {items.map((m) => (
              <div key={m.id}
                   className="min-w-[220px] snap-start rounded-2xl border border-white/10 bg-black/40 backdrop-blur p-4 hover:bg-white/5 transition">
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-12 rounded-full grid place-items-center font-bold"
                       style={{ background: `linear-gradient(135deg, ${LUX_RED_SOFT}, rgba(255,255,255,0.05))`, boxShadow: `0 0 0 2px ${LUX_RED}`}}>
                    {m.name[0]}
                    {m.unread && <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-pink-500" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{m.name}, {m.age}</p>
                      <span className="text-xs text-white/60">{m.timestamp}</span>
                    </div>
                    <p className="text-sm text-white/70 line-clamp-1">{m.lastMessage}</p>
                  </div>
                </div>
                <div className="mt-3 flex justify-end">
                  <Button variant="outline" size="sm" className="rounded-lg border-white/20 text-white hover:bg-white/10">
                    Open Chat
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-black to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-black to-transparent" />
          <div className="absolute -top-12 right-0 hidden md:flex gap-2">
            <Button variant="outline" size="icon" className="rounded-full border-white/20 text-white"
                    onClick={() => scRef.current?.scrollBy({ left: -260, behavior: 'smooth' })}>
              <ChevronLeft />
            </Button>
            <Button variant="outline" size="icon" className="rounded-full border-white/20 text-white"
                    onClick={() => scRef.current?.scrollBy({ left: 260, behavior: 'smooth' })}>
              <ChevronRight />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* =========================================================
   DISCOVER GRID + FILTERS
========================================================= */
type Filters = {
  gender?: 'female' | 'male' | 'other' | 'any';
  city?: string;
  minAge: number;
  maxAge: number;
  interest?: string;
};

function FiltersBar({ filters, setFilters, interestsPool }:
  { filters: Filters; setFilters: (f: Filters) => void; interestsPool: string[]; }) {

  return (
    <div className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur p-4">
      <div className="mb-3 flex items-center gap-2 text-white/80">
        <Filter className="h-4 w-4" /> Filters
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
        {/* Gender */}
        <div>
          <label className="block text-white/70 mb-1">Gender</label>
          <div className="flex flex-wrap gap-2">
            {(['any','female','male','other'] as const).map(g => (
              <Button key={g} variant="outline"
                      className={`rounded-lg border-white/20 text-white hover:bg-white/10 ${filters.gender===g?'bg-white/10':''}`}
                      onClick={() => setFilters({ ...filters, gender: g })}>{g}</Button>
            ))}
          </div>
        </div>
        {/* City */}
        <div>
          <label className="block text-white/70 mb-1">City</label>
          <div className="flex gap-2">
            <Search className="h-4 w-4 mt-2 text-white/60" />
            <input
              className="flex-1 rounded-lg bg-black/40 border border-white/15 px-3 py-2 text-white placeholder:text-white/40 focus:outline-none"
              placeholder="Type a city..."
              value={filters.city ?? ''}
              onChange={(e) => setFilters({ ...filters, city: e.target.value })}
            />
          </div>
        </div>
        {/* Age */}
        <div>
          <label className="block text-white/70 mb-1">Age</label>
          <div className="flex items-center gap-2">
            <input type="number" min={18} max={80}
                   className="w-20 rounded-lg bg-black/40 border border-white/15 px-2 py-2 text-white focus:outline-none"
                   value={filters.minAge}
                   onChange={(e) => setFilters({ ...filters, minAge: parseInt(e.target.value || '18', 10) })} />
            <span className="text-white/60">to</span>
            <input type="number" min={18} max={80}
                   className="w-20 rounded-lg bg-black/40 border border-white/15 px-2 py-2 text-white focus:outline-none"
                   value={filters.maxAge}
                   onChange={(e) => setFilters({ ...filters, maxAge: parseInt(e.target.value || '80', 10) })} />
          </div>
        </div>
        {/* Interest */}
        <div>
          <label className="block text-white/70 mb-1">Interest</label>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className={`rounded-lg border-white/20 text-white hover:bg-white/10 ${!filters.interest?'bg-white/10':''}`}
                    onClick={() => setFilters({ ...filters, interest: undefined })}>
              Any
            </Button>
            {interestsPool.slice(0,5).map(int => (
              <Button key={int} variant="outline"
                      className={`rounded-lg border-white/20 text-white hover:bg-white/10 ${filters.interest===int?'bg-white/10':''}`}
                      onClick={() => setFilters({ ...filters, interest: int })}>
                {int}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function DiscoverGrid({ profiles }: { profiles: Profile[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {profiles.map((p) => (
        <Card key={p.id} className="overflow-hidden rounded-2xl border-white/10 bg-black/40 backdrop-blur">
          <div className="relative aspect-[4/3] bg-gradient-to-br from-black to-neutral-800">
            <div className="absolute top-3 left-3 flex gap-2">
              {p.vip && <Badge className="bg-yellow-500/90 border-0"><Crown className="h-3 w-3 mr-1"/>VIP</Badge>}
              {p.verified && <Badge className="bg-blue-500/90 border-0"><Verified className="h-3 w-3 mr-1"/>Verified</Badge>}
            </div>
            <div className="absolute bottom-3 right-3 text-xs rounded-full bg-black/60 text-white px-3 py-1 backdrop-blur">
              {p.photos} photos
            </div>
            <div className="absolute inset-0 grid place-items-center">
              <div className="h-16 w-16 rounded-2xl grid place-items-center font-extrabold text-2xl"
                   style={{ background: `linear-gradient(135deg, ${LUX_RED_SOFT}, rgba(0,0,0,0.55))`, boxShadow: `0 0 0 2px ${LUX_RED}` }}>
                {p.name[0]}
              </div>
            </div>
          </div>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="font-semibold">{p.name}, {p.age}</div>
              <div className="text-xs text-white/70 flex items-center"><MapPin className="h-3 w-3 mr-1"/>{p.city}</div>
            </div>
            <p className="mt-2 text-sm text-white/80 line-clamp-2">{p.bio}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {p.interests.slice(0,3).map((i) => (
                <Badge key={i} variant="secondary" className="bg-white/10 border-white/10 text-white">{i}</Badge>
              ))}
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" size="sm" className="rounded-lg border-white/20 text-white hover:bg-white/10">
                View
              </Button>
              <Button size="sm" className="rounded-lg bg-[--lux-red] hover:opacity-90"
                      style={{ ['--lux-red' as any]: LUX_RED }}>
                Like
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

/* =========================================================
   TRUST & VERIFY + STATS
========================================================= */
function TrustAndStats({ likesToday, newMatches, visitors }:
  { likesToday: number; newMatches: number; visitors: number; }) {

  const likes = useCountUp(likesToday);
  const matches = useCountUp(newMatches);
  const visit = useCountUp(visitors);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Trust */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5"/> Trust & Verify
          </CardTitle>
          <CardDescription>Safety-first experience for the Middle East</CardDescription>
        </CardHeader>
        <CardContent className="text-white/80">
          <ul className="space-y-2">
            <li>• AI-powered content moderation & fraud detection</li>
            <li>• Optional ID verification for a blue badge</li>
            <li>• Private mode & location fuzzing for privacy</li>
            <li>• Report & block tools with quick support</li>
          </ul>
          <div className="mt-4 flex gap-3">
            <Button className="rounded-xl bg-[--lux-red] hover:opacity-90"
                    style={{ ['--lux-red' as any]: LUX_RED }}>
              Get Verified
            </Button>
            <Button variant="outline" className="rounded-xl border-white/20 text-white hover:bg-white/10">
              Safety Guidelines
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5"/> Today
          </CardTitle>
          <CardDescription>Your activity at a glance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 text-center gap-3">
            <div className="rounded-xl bg-black/40 border border-white/10 p-3">
              <div className="text-2xl font-extrabold" style={{ color: LUX_RED }}>{likes}</div>
              <div className="text-xs text-white/70">Likes</div>
            </div>
            <div className="rounded-xl bg-black/40 border border-white/10 p-3">
              <div className="text-2xl font-extrabold text-blue-400">{matches}</div>
              <div className="text-xs text-white/70">Matches</div>
            </div>
            <div className="rounded-xl bg-black/40 border border-white/10 p-3">
              <div className="text-2xl font-extrabold text-emerald-400">{visit}</div>
              <div className="text-xs text-white/70">Visitors</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* =========================================================
   FOOTER (Glass over bg video)
========================================================= */
function FooterGlassVideo({ src = '/film2.mp4' }) {
  return (
    <footer className="relative mt-16">
      <div className="absolute inset-0 -z-10 overflow-hidden rounded-none">
        <video
          src={src}
          className="h-full w-full object-cover opacity-50"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
      </div>
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
            <div>
              <div className="font-semibold mb-3" style={{ color: LUX_RED }}>FarsiHub</div>
              <ul className="space-y-2 text-white/70">
                <li><a className="hover:text-white" href="#">About</a></li>
                <li><a className="hover:text-white" href="#">Blog</a></li>
                <li><a className="hover:text-white" href="#">Careers</a></li>
              </ul>
            </div>
            <div>
              <div className="font-semibold mb-3" style={{ color: LUX_RED }}>Product</div>
              <ul className="space-y-2 text-white/70">
                <li><a className="hover:text-white" href="#">Dating</a></li>
                <li><a className="hover:text-white" href="#">VIP</a></li>
                <li><a className="hover:text-white" href="#">Security</a></li>
              </ul>
            </div>
            <div>
              <div className="font-semibold mb-3" style={{ color: LUX_RED }}>Legal</div>
              <ul className="space-y-2 text-white/70">
                <li><a className="hover:text-white" href="#">Terms</a></li>
                <li><a className="hover:text-white" href="#">Privacy</a></li>
                <li><a className="hover:text-white" href="#">Cookies</a></li>
              </ul>
            </div>
            <div>
              <div className="font-semibold mb-3" style={{ color: LUX_RED }}>Support</div>
              <ul className="space-y-2 text-white/70">
                <li><a className="hover:text-white" href="#">Help Center</a></li>
                <li><a className="hover:text-white" href="#">Report</a></li>
                <li><a className="hover:text-white" href="#">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-6 flex items-center justify-between text-xs text-white/60">
            <span>© {new Date().getFullYear()} FarsiHub. All rights reserved.</span>
            <div className="flex gap-3">
              <a href="#" className="hover:text-white">Instagram</a>
              <a href="#" className="hover:text-white">YouTube</a>
              <a href="#" className="hover:text-white">X</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* =========================================================
   MAIN PAGE
========================================================= */
function Dating() {
  const [profiles, setProfiles] = useState<Profile[]>(PROFILES);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likesCount, setLikesCount] = useState(12);
  const [newMatchesCount, setNewMatchesCount] = useState(3);
  const [visitorsCount, setVisitorsCount] = useState(21);

  const [filters, setFilters] = useState<Filters>({
    gender: 'any',
    minAge: 18,
    maxAge: 80,
  });

  const currentProfile = profiles[currentIndex];

  const handleNext = () => setCurrentIndex((i) => (i < profiles.length - 1 ? i + 1 : 0));
  const onSwipeLeft = () => {
    handleNext();
  };
  const onSwipeRight = () => {
    setLikesCount((c) => c + 1);
    // naive: every 5 likes => +1 new match
    setNewMatchesCount((m) => ( (likesCount+1) % 5 === 0 ? m + 1 : m ));
    handleNext();
  };

  // Discover filtering
  const interestsPool = useMemo(
    () => Array.from(new Set(PROFILES.flatMap(p => p.interests))),
    []
  );

  const filteredDiscover = useMemo(() => {
    return PROFILES.filter(p => {
      if (filters.gender && filters.gender !== 'any' && p.gender !== filters.gender) return false;
      if (filters.city && !p.city.toLowerCase().includes(filters.city.toLowerCase())) return false;
      if (p.age < filters.minAge || p.age > filters.maxAge) return false;
      if (filters.interest && !p.interests.includes(filters.interest)) return false;
      return true;
    });
  }, [filters]);

  return (
    <div className="min-h-screen bg-black text-white">
      <style>{`
        /* subtle neon accent */
        .neon-edge { box-shadow: 0 0 0 1px rgba(255,255,255,0.06), 0 0 40px ${LUX_RED_SOFT}; }
      `}</style>

      <HeaderGlass />

      <main className="py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Title */}
          <div className="mb-6 text-center">
            <h1 className="text-3xl md:text-4xl font-extrabold mb-2 tracking-tight">
              Find Love, <span style={{ color: LUX_RED }}>Middle Eastern</span> Style
            </h1>
            <p className="text-lg text-white/70">
              Smart discovery • Secure profiles • Luxury experience
            </p>
          </div>

          {/* HERO VIDEOS */}
          <VideoHeroDuo srcA="/film11.mp4" srcB="/film12.mp4" />

          {/* Main grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* LEFT: Swipe card */}
            <div className="lg:col-span-2">
              {currentProfile ? (
                <SwipeCard profile={currentProfile} onSwipeLeft={onSwipeLeft} onSwipeRight={onSwipeRight} />
              ) : (
                <Card className="p-10 text-center rounded-3xl border-white/10 bg-black/40 backdrop-blur">
                  <p>No more profiles. Check back later!</p>
                </Card>
              )}
            </div>

            {/* RIGHT: Matches + Safety + Quick Stats */}
            <div className="space-y-6">
              <MatchesBar items={MATCHES} />

              {/* Safety tips quick */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-sm">
                    <Shield className="h-4 w-4 mr-2" />
                    Safety First
                  </CardTitle>
                  <CardDescription>Quick reminders</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-white/80">
                  <p>• Meet in public places</p>
                  <p>• Trust your instincts</p>
                  <p>• Report suspicious behavior</p>
                  <p>• Keep personal info private</p>
                  <Button variant="outline" size="sm" className="w-full mt-3 rounded-lg border-white/20 text-white hover:bg-white/10">
                    Safety Guidelines
                  </Button>
                </CardContent>
              </Card>

              {/* Quick counters */}
              <Card>
                <CardContent className="p-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold" style={{ color: LUX_RED }}>{likesCount}</div>
                      <div className="text-xs text-white/70">Likes Today</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-400">{newMatchesCount}</div>
                      <div className="text-xs text-white/70">New Matches</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-emerald-400">{visitorsCount}</div>
                      <div className="text-xs text-white/70">Visitors</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Trust & Stats */}
          <div className="mt-10">
            <TrustAndStats likesToday={likesCount} newMatches={newMatchesCount} visitors={visitorsCount} />
          </div>

          {/* Discover + Filters */}
          <div className="mt-10 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-extrabold">Discover</h2>
              <div className="text-white/70 text-sm">Explore nearby, find your vibe</div>
            </div>
            <FiltersBar filters={filters} setFilters={setFilters} interestsPool={interestsPool} />
            <DiscoverGrid profiles={filteredDiscover} />
          </div>
        </div>

        {/* Footer with video background */}
        <FooterGlassVideo src="/film2.mp4" />
      </main>
    </div>
  );
}

export default Dating;
