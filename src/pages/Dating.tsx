import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Heart, X, MapPin, MessageCircle, Users, Shield, Volume2, VolumeX,
  Star, Sparkles, Filter, Verified, Crown, Search, ChevronLeft, ChevronRight,
  XCircle, Camera, Upload, CheckCircle2, ArrowLeft, ArrowRight, ZoomIn
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/* =========================================================
   THEME
========================================================= */
const LUX_RED = '#B1060F';
const LUX_RED_SOFT = 'rgba(177,6,15,0.25)';

/* =========================================================
   HEADER (Glass + CTA)
========================================================= */
function HeaderGlass() {
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-40">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mt-4 mb-4 flex items-center justify-between rounded-2xl border border-white/10 bg-black/40 px-4 py-3 backdrop-blur-xl shadow-lg">
          <div className="flex items-center gap-3">
            <div
              className="h-9 w-9 rounded-xl ring-2 shadow"
              style={{ background: LUX_RED, borderColor: LUX_RED }}
            />
            <span className="text-lg font-extrabold tracking-wide" style={{ color: LUX_RED }}>
              FarsiHub Dating
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-white/80">
            <button onClick={() => navigate('/')} className="hover:text-white transition">Home</button>
            <button onClick={() => navigate('/dating')} className="hover:text-white transition">Dating</button>
            <button onClick={() => navigate('/messages')} className="hover:text-white transition">Messages</button>
            <button onClick={() => navigate('/profile')} className="hover:text-white transition">Profile</button>
            <button onClick={() => navigate('/vip')} className="hover:text-white transition">VIP</button>
          </nav>
          <Button
            onClick={() => navigate('/signup')}
            className="rounded-xl bg-[--lux-red] hover:opacity-90"
            style={{ ['--lux-red' as any]: LUX_RED }}
          >
            Join Now
          </Button>
        </div>
      </div>
    </header>
  );
}

/* =========================================================
   HERO: film11 + film12 with soft crossfade + audio toggle
========================================================= */
function VideoHeroDuo({ srcA = '/film11.mp4', srcB = '/film12.mp4' }: { srcA?: string; srcB?: string; }) {
  const vidA = useRef<HTMLVideoElement | null>(null);
  const vidB = useRef<HTMLVideoElement | null>(null);
  const [active, setActive] = useState<0 | 1>(0);
  const [muted, setMuted] = useState(true);

  const safePlay = (v: HTMLVideoElement | null) => v?.play().catch(() => {});
  useEffect(() => {
    const a = vidA.current, b = vidB.current;
    if (!a || !b) return;
    a.style.opacity = '1'; b.style.opacity = '0';
    a.muted = true; b.muted = true; a.volume = 1; b.volume = 1;
    safePlay(a);
    const crossFade = () => {
      const current = active === 0 ? a : b;
      const next = active === 0 ? b : a;
      if (!current || !next) return;
      try { next.currentTime = 0; } catch {}
      next.style.transition = 'opacity 900ms ease';
      current.style.transition = 'opacity 900ms ease';
      if (!muted) { current.muted = true; next.muted = false; next.removeAttribute('muted'); next.volume = 1; }
      next.style.opacity = '1'; current.style.opacity = '0'; safePlay(next);
      setActive(p => (p === 0 ? 1 : 0));
    };
    a.addEventListener('ended', crossFade);
    b.addEventListener('ended', crossFade);
    return () => { a.removeEventListener('ended', crossFade); b.removeEventListener('ended', crossFade); };
  }, [active, muted]);

  const toggleMute = () => {
    const a = vidA.current, b = vidB.current;
    const willBeMuted = !muted; setMuted(willBeMuted);
    const activeEl = active === 0 ? a : b; const inactiveEl = active === 0 ? b : a;
    if (activeEl) {
      activeEl.muted = willBeMuted;
      if (!willBeMuted) { activeEl.removeAttribute('muted'); activeEl.volume = 1; activeEl.paused && activeEl.play().catch(() => {}); }
    }
    if (inactiveEl) inactiveEl.muted = true;
  };

  return (
    <section className="relative w-full h-[60vh] md:h-[75vh] overflow-hidden rounded-2xl mb-8 shadow-2xl">
      <div className="pointer-events-none absolute inset-0 z-10"
           style={{ background: 'linear-gradient(90deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.15) 25%, rgba(0,0,0,0.15) 75%, rgba(0,0,0,0.65) 100%)' }} />
      <video ref={vidA} src={srcA} className="absolute inset-0 h-full w-full object-cover" playsInline preload="auto" autoPlay loop={false} muted />
      <video ref={vidB} src={srcB} className="absolute inset-0 h-full w-full object-cover" playsInline preload="auto" autoPlay loop={false} muted />

      {/* Taglines */}
      <div className="absolute inset-0 z-20 flex items-center">
        <div className="w-full px-6 md:px-10">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="hidden md:flex flex-col gap-3">
              <span className="text-xs uppercase tracking-[0.25em] text-white/70">Find Love</span>
              <h2 className="text-3xl md:text-5xl font-extrabold leading-tight drop-shadow">
                Middle Eastern <span style={{ color: LUX_RED }}>style</span>
              </h2>
              <p className="text-white/80">Real connections, modern safety, and a luxurious experience tailored for the Middle East.</p>
              <div className="flex gap-3">
                <Button className="bg-[--lux-red] rounded-xl hover:opacity-90" style={{ ['--lux-red' as any]: LUX_RED }}>Get Started</Button>
                <Button variant="outline" className="rounded-xl border-white/30 text-white hover:bg-white/10">Learn More</Button>
              </div>
            </div>
            <div className="hidden md:flex flex-col items-end justify-end gap-2">
              <div className="rounded-2xl bg-black/40 backdrop-blur-md px-4 py-2 border border-white/10 text-white">Verified profiles • AI safety filters • VIP lounges</div>
              <div className="rounded-2xl bg-black/40 backdrop-blur-md px-4 py-2 border border-white/10 text-white">Swipe smoothly • Smart discovery • Private mode</div>
            </div>
          </div>
        </div>
      </div>

      <button onClick={toggleMute}
              className="absolute bottom-4 right-4 z-30 rounded-xl px-4 py-2 text-sm font-semibold border border-white/30 bg-black/50 text-white hover:bg-black/70 transition backdrop-blur-md shadow-lg">
        {muted ? <span className="inline-flex items-center gap-2"><Volume2 size={16}/> Unmute</span>
               : <span className="inline-flex items-center gap-2"><VolumeX size={16}/> Mute</span>}
      </button>
    </section>
  );
}

/* =========================================================
   DATA TYPES
========================================================= */
type Profile = {
  id: number; name: string; age: number; city: string; bio: string;
  interests: string[]; photos: number; verified: boolean; vip?: boolean;
  gender?: 'female' | 'male' | 'other'; photoUrls?: string[];
};
type MatchItem = { id: number; name: string; age: number; city: string; lastMessage: string; timestamp: string; unread: boolean; };

/* =========================================================
   MOCK DATA (add real images later in /public if you want)
========================================================= */
const PROFILES: Profile[] = [
  {
    id: 1, name: 'Sara', age: 27, city: 'Dubai',
    bio: 'Exploring cultures, photography, and poetry. Looking for meaningful connections.',
    interests: ['Photography', 'Poetry', 'Travel', 'Art'],
    photos: 5, verified: true, vip: true, gender: 'female',
    photoUrls: ['/photos/sara-1.jpg','/photos/sara-2.jpg','/photos/sara-3.jpg']
  },
  {
    id: 2, name: 'Arman', age: 31, city: 'Tehran',
    bio: 'Software engineer into tech and traditional music. Hiking and cooking on weekends.',
    interests: ['Technology', 'Music', 'Hiking', 'Cooking'],
    photos: 4, verified: true, gender: 'male',
    photoUrls: ['/photos/arman-1.jpg','/photos/arman-2.jpg']
  },
  {
    id: 3, name: 'Mina', age: 25, city: 'Beirut',
    bio: 'Designer who loves books, cats, and tea-time talks. Seeking genuine vibes.',
    interests: ['Art', 'Books', 'Design', 'Cats'],
    photos: 6, verified: false, vip: true, gender: 'female',
    photoUrls: ['/photos/mina-1.jpg']
  },
  {
    id: 4, name: 'Kian', age: 29, city: 'Riyadh',
    bio: 'Doctor. Passionate about helping others. Basketball, reading, and history.',
    interests: ['Medicine', 'Basketball', 'History', 'Reading'],
    photos: 3, verified: true, gender: 'male',
    photoUrls: []
  },
];

const MATCHES: MatchItem[] = [
  { id: 11, name: 'Neda', age: 26, city: 'Doha', lastMessage: 'That plan sounds great!', timestamp: '2h ago', unread: true },
  { id: 12, name: 'Sina', age: 28, city: 'Tehran', lastMessage: 'How was your day?', timestamp: '1d ago', unread: false },
  { id: 13, name: 'Roya', age: 24, city: 'Dubai', lastMessage: 'Loved your book rec!', timestamp: '3d ago', unread: false },
  { id: 14, name: 'Ali', age: 30, city: 'Muscat', lastMessage: 'Coffee this weekend?', timestamp: '5d ago', unread: true },
];

/* =========================================================
   SMALL UTILS
========================================================= */
const vibrate = (ms = 30) => (navigator?.vibrate ? navigator.vibrate(ms) : undefined);

/* Count-up animation */
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
   PHOTO GALLERY + LIGHTBOX
========================================================= */
function PhotoGallery({ name, photos }: { name: string; photos?: string[] }) {
  const [index, setIndex] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const hasPhotos = photos && photos.length > 0;

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(false);
      if (e.key === 'ArrowRight') setIndex(i => Math.min(i + 1, (photos?.length || 1) - 1));
      if (e.key === 'ArrowLeft') setIndex(i => Math.max(i - 1, 0));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox, photos]);

  return (
    <>
      <div className="relative aspect-[3/4] bg-gradient-to-br from-black to-neutral-800 rounded-t-3xl overflow-hidden">
        {/* Fallback visual if no photo */}
        {!hasPhotos ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-28 w-28 rounded-3xl grid place-items-center font-extrabold text-4xl"
                 style={{ background: `linear-gradient(135deg, ${LUX_RED_SOFT}, rgba(0,0,0,0.55))`, boxShadow: `0 0 0 2px ${LUX_RED}` }}>
              {name[0]}
            </div>
          </div>
        ) : (
          <img
            src={photos![index]}
            alt={`${name}-${index+1}`}
            className="absolute inset-0 h-full w-full object-cover"
            onClick={() => setLightbox(true)}
          />
        )}
        <button
          className="absolute bottom-3 right-3 rounded-full bg-black/60 text-white text-xs px-3 py-1 backdrop-blur inline-flex items-center gap-1"
          onClick={() => hasPhotos && setLightbox(true)}
          title="Open gallery"
        >
          <ZoomIn size={14}/> {hasPhotos ? `${index+1}/${photos!.length}` : 'No photos'}
        </button>
      </div>

      {/* Thumbs */}
      {hasPhotos && (
        <div className="px-4 py-3 flex gap-2 overflow-x-auto">
          {photos!.map((p, i) => (
            <button key={p}
                    onClick={() => setIndex(i)}
                    className={`h-14 w-10 rounded-lg overflow-hidden ring-1 ${i===index ? 'ring-[--lux-red]' : 'ring-white/10'}`}
                    style={{ ['--lux-red' as any]: LUX_RED }}>
              <img src={p} alt={`${name}-thumb-${i+1}`} className="h-full w-full object-cover"/>
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && hasPhotos && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center">
          <button className="absolute top-5 right-5 text-white/80 hover:text-white" onClick={() => setLightbox(false)}>
            <XCircle size={28}/>
          </button>
          <div className="absolute left-4">
            <Button variant="outline" size="icon" className="rounded-full border-white/20 text-white hover:bg-white/10"
                    onClick={() => setIndex(i => Math.max(0, i-1))}><ArrowLeft/></Button>
          </div>
          <div className="absolute right-4">
            <Button variant="outline" size="icon" className="rounded-full border-white/20 text-white hover:bg-white/10"
                    onClick={() => setIndex(i => Math.min((photos!.length-1), i+1))}><ArrowRight/></Button>
          </div>
          <img src={photos![index]} alt={`${name}-light-${index+1}`} className="max-h-[80vh] max-w-[90vw] rounded-2xl shadow-2xl"/>
        </div>
      )}
    </>
  );
}

/* =========================================================
   CHAT (Front-end only)
========================================================= */
type ChatMsg = { id: string; from: 'me' | 'them'; text: string; time: string };
function ChatModal({ open, onClose, peerName }:
  { open: boolean; onClose: () => void; peerName: string; }) {

  const [typing, setTyping] = useState(false);
  const [msgs, setMsgs] = useState<ChatMsg[]>([
    { id: 'm1', from: 'them', text: `Hi, I'm ${peerName}!`, time: 'now' },
    { id: 'm2', from: 'me', text: 'Hey! Nice to meet you.', time: 'now' },
  ]);
  const [draft, setDraft] = useState('');
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs, open]);

  const send = () => {
    if (!draft.trim()) return;
    setMsgs(m => [...m, { id: crypto.randomUUID(), from: 'me', text: draft.trim(), time: 'now' }]);
    setDraft('');
    setTyping(true);
    setTimeout(() => {
      setMsgs(m => [...m, { id: crypto.randomUUID(), from: 'them', text: 'Sounds good 😊', time: 'now' }]);
      setTyping(false);
    }, 800);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm grid place-items-center p-4">
      <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-black/60 backdrop-blur-xl shadow-2xl">
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <div className="font-semibold">{peerName}</div>
          <button onClick={onClose} className="text-white/70 hover:text-white"><X size={20}/></button>
        </div>
        <div className="h-[50vh] overflow-y-auto p-4 space-y-3">
          {msgs.map(m => (
            <div key={m.id} className={`flex ${m.from==='me'?'justify-end':''}`}>
              <div className={`max-w-[70%] rounded-2xl px-3 py-2 text-sm ${m.from==='me'
                  ? 'bg-[--lux-red] text-white' : 'bg-white/10 text-white/90 border border-white/10'}`}
                   style={{ ['--lux-red' as any]: LUX_RED }}>
                {m.text}
              </div>
            </div>
          ))}
          {typing && <div className="text-xs text-white/60">Typing…</div>}
          <div ref={endRef} />
        </div>
        <div className="flex items-center gap-2 p-3 border-t border-white/10">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            placeholder="Write a message…"
            className="flex-1 rounded-xl bg-black/40 border border-white/15 px-3 py-2 text-white placeholder:text-white/40 focus:outline-none"
          />
          <Button className="rounded-xl bg-[--lux-red] hover:opacity-90" style={{ ['--lux-red' as any]: LUX_RED }} onClick={send}>
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   SWIPE CARD (with Message/VIP buttons + Gallery)
========================================================= */
function SwipeCard({
  profile,
  onSwipeLeft,
  onSwipeRight,
  onMessage,
  onVipUpsell,
}: {
  profile: Profile;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onMessage: (p: Profile) => void;
  onVipUpsell: () => void;
}) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [drag, setDrag] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const el = cardRef.current; if (!el) return;
    let startX = 0, startY = 0;
    const onPointerDown = (e: PointerEvent) => {
      setDragging(true); startX = e.clientX; startY = e.clientY;
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    };
    const onPointerMove = (e: PointerEvent) => { if (!dragging) return; setDrag({ x: e.clientX - startX, y: e.clientY - startY }); };
    const onPointerUp = () => {
      setDragging(false);
      const threshold = 120;
      if (drag.x > threshold) {
        vibrate(20);
        el.style.transition = 'transform 300ms ease, opacity 300ms ease';
        el.style.transform = `translateX(${window.innerWidth}px) rotate(10deg)`; el.style.opacity = '0';
        setTimeout(onSwipeRight, 260);
      } else if (drag.x < -threshold) {
        vibrate(15);
        el.style.transition = 'transform 300ms ease, opacity 300ms ease';
        el.style.transform = `translateX(-${window.innerWidth}px) rotate(-10deg)`; el.style.opacity = '0';
        setTimeout(onSwipeLeft, 260);
      } else {
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

  const rotate = drag.x / 24;
  const likeOpacity = Math.max(0, Math.min(1, drag.x / 120));
  const nopeOpacity = Math.max(0, Math.min(1, -drag.x / 120));

  return (
    <div ref={cardRef} className="relative select-none will-change-transform"
         style={{ transform: `translate(${drag.x}px, ${drag.y}px) rotate(${rotate}deg)`, transition: dragging ? 'none' : 'transform 250ms ease' }}>
      <Card className="w-full max-w-xl mx-auto overflow-hidden rounded-3xl border-white/10 bg-black/40 backdrop-blur-xl">
        {/* Gallery */}
        <div className="relative">
          <PhotoGallery name={profile.name} photos={profile.photoUrls} />
          {/* badges */}
          <div className="absolute top-3 left-3 flex items-center gap-2">
            {profile.verified && (
              <Badge className="bg-blue-500/90 backdrop-blur border-0">
                <Shield className="h-3 w-3 mr-1"/> Verified
              </Badge>
            )}
            {profile.vip && (
              <Badge className="bg-yellow-500/90 backdrop-blur border-0">
                <Crown className="h-3 w-3 mr-1"/> VIP
              </Badge>
            )}
          </div>
          {/* like/nope hints */}
          <div className="absolute top-4 right-4 rounded-md border-2 px-3 py-1 text-sm font-bold"
               style={{ borderColor: 'rgba(34,197,94,0.9)', color: 'rgba(34,197,94,0.9)', opacity: likeOpacity }}>
            LIKE
          </div>
          <div className="absolute top-4 left-4 rounded-md border-2 px-3 py-1 text-sm font-bold"
               style={{ borderColor: 'rgba(239,68,68,0.9)', color: 'rgba(239,68,68,0.9)', opacity: nopeOpacity }}>
            NOPE
          </div>
        </div>

        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-2xl font-extrabold">{profile.name}, {profile.age}</h3>
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
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button variant="outline" size="lg" className="rounded-full w-16 h-16 border-red-300/30 bg-black/40 hover:bg-red-900/20"
                    onClick={() => { setDrag({ x: -200, y: 0 }); setTimeout(onSwipeLeft, 200); }} title="Nope">
              <X className="h-6 w-6 text-red-500" />
            </Button>
            <Button size="lg" className="rounded-full w-16 h-16 bg-[--lux-red] hover:opacity-90"
                    style={{ ['--lux-red' as any]: LUX_RED }}
                    onClick={() => { setDrag({ x: 200, y: 0 }); setTimeout(onSwipeRight, 200); }} title="Like">
              <Heart className="h-6 w-6" />
            </Button>

            {/* Message + VIP */}
            <Button variant="outline" className="rounded-lg border-white/20 text-white hover:bg-white/10"
                    onClick={() => onMessage(profile)}>
              <MessageCircle className="h-4 w-4 mr-1" /> Message
            </Button>
            {!profile.vip && (
              <Button className="rounded-lg bg-[--lux-red] hover:opacity-90"
                      style={{ ['--lux-red' as any]: LUX_RED }} onClick={onVipUpsell}>
                <Crown className="h-4 w-4 mr-1" /> Go VIP
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* =========================================================
   MATCHES BAR (uses in-page chat open)
========================================================= */
function MatchesBar({ items, onOpenChat }: { items: MatchItem[]; onOpenChat: (m: MatchItem) => void; }) {
  const scRef = useRef<HTMLDivElement | null>(null);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center"><MessageCircle className="h-5 w-5 mr-2" />Your Matches</CardTitle>
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
                  <Button variant="outline" size="sm" className="rounded-lg border-white/20 text-white hover:bg-white/10"
                          onClick={() => onOpenChat(m)}>
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
                    onClick={() => scRef.current?.scrollBy({ left: -260, behavior: 'smooth' })}><ChevronLeft /></Button>
            <Button variant="outline" size="icon" className="rounded-full border-white/20 text-white"
                    onClick={() => scRef.current?.scrollBy({ left: 260, behavior: 'smooth' })}><ChevronRight /></Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* =========================================================
   DISCOVER FILTERS (advanced) + URL sync
========================================================= */
type Filters = {
  genders: Array<'female' | 'male' | 'other'> | 'any';
  cities: string[];
  minAge: number; maxAge: number;
  interests: string[]; onlyVerified: boolean; onlyVip: boolean;
};
const DEFAULT_FILTERS: Filters = {
  genders: 'any', cities: [], minAge: 18, maxAge: 80, interests: [], onlyVerified: false, onlyVip: false,
};

function useFilterUrlSync(filters: Filters, setFilters: (f: Filters)=>void) {
  // read on mount
  useEffect(() => {
    const qs = new URLSearchParams(window.location.search);
    const genders = qs.get('genders'); // csv or 'any'
    const cities = qs.get('cities');   // csv
    const interests = qs.get('interests');
    const minAge = parseInt(qs.get('minAge') || '18', 10);
    const maxAge = parseInt(qs.get('maxAge') || '80', 10);
    const onlyVerified = qs.get('verified') === '1';
    const onlyVip = qs.get('vip') === '1';

    setFilters({
      genders: genders && genders !== 'any' ? (genders.split(',').filter(Boolean) as Filters['genders']) : 'any',
      cities: cities ? cities.split(',').filter(Boolean) : [],
      minAge, maxAge,
      interests: interests ? interests.split(',').filter(Boolean) : [],
      onlyVerified, onlyVip
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // write when filters change (debounced)
  useEffect(() => {
    const t = setTimeout(() => {
      const qs = new URLSearchParams();
      if (filters.genders !== 'any' && filters.genders.length) qs.set('genders', filters.genders.join(','));
      if (filters.cities.length) qs.set('cities', filters.cities.join(','));
      if (filters.interests.length) qs.set('interests', filters.interests.join(','));
      if (filters.minAge !== 18) qs.set('minAge', String(filters.minAge));
      if (filters.maxAge !== 80) qs.set('maxAge', String(filters.maxAge));
      if (filters.onlyVerified) qs.set('verified','1');
      if (filters.onlyVip) qs.set('vip','1');
      const url = `${window.location.pathname}?${qs.toString()}`;
      window.history.replaceState({}, '', url);
    }, 250);
    return () => clearTimeout(t);
  }, [filters]);
}

function FiltersBar({
  filters, setFilters, interestsPool, citiesPool
}: {
  filters: Filters; setFilters: (f: Filters) => void; interestsPool: string[]; citiesPool: string[];
}) {
  const toggleArray = (arr: string[], v: string) => (arr.includes(v) ? arr.filter(i => i!==v) : [...arr, v]);

  return (
    <div className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur p-4">
      <div className="mb-3 flex items-center gap-2 text-white/80">
        <Filter className="h-4 w-4" /> Filters
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
        {/* Gender multi */}
        <div>
          <label className="block text-white/70 mb-1">Gender</label>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline"
                    className={`rounded-lg border-white/20 text-white hover:bg-white/10 ${filters.genders==='any'?'bg-white/10':''}`}
                    onClick={() => setFilters({ ...filters, genders: 'any' })}>Any</Button>
            {(['female','male','other'] as const).map(g => (
              <Button key={g} variant="outline"
                      className={`rounded-lg border-white/20 text-white hover:bg-white/10 ${
                        filters.genders!=='any' && filters.genders.includes(g) ? 'bg-white/10':''}`}
                      onClick={() => setFilters({
                        ...filters,
                        genders: filters.genders==='any' ? [g] :
                          (toggleArray(filters.genders as string[], g) as any)
                      })}>{g}</Button>
            ))}
          </div>
        </div>

        {/* Cities multi (popular) */}
        <div>
          <label className="block text-white/70 mb-1">Cities</label>
          <div className="flex flex-wrap gap-2">
            {citiesPool.map(c => (
              <Button key={c} variant="outline"
                      className={`rounded-lg border-white/20 text-white hover:bg-white/10 ${filters.cities.includes(c)?'bg-white/10':''}`}
                      onClick={() => setFilters({ ...filters, cities: toggleArray(filters.cities, c) })}>
                {c}
              </Button>
            ))}
          </div>
        </div>

        {/* Age range */}
        <div>
          <label className="block text-white/70 mb-1">Age</label>
          <div className="flex items-center gap-2">
            <input type="number" min={18} max={80}
                   className="w-20 rounded-lg bg-black/40 border border-white/15 px-2 py-2 text-white focus:outline-none"
                   value={filters.minAge}
                   onChange={(e) => setFilters({ ...filters, minAge: Math.min(parseInt(e.target.value || '18',10), filters.maxAge) })} />
            <span className="text-white/60">to</span>
            <input type="number" min={18} max={80}
                   className="w-20 rounded-lg bg-black/40 border border-white/15 px-2 py-2 text-white focus:outline-none"
                   value={filters.maxAge}
                   onChange={(e) => setFilters({ ...filters, maxAge: Math.max(parseInt(e.target.value || '80',10), filters.minAge) })} />
          </div>
        </div>

        {/* Interests multi */}
        <div>
          <label className="block text-white/70 mb-1">Interests</label>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className={`rounded-lg border-white/20 text-white hover:bg-white/10 ${filters.interests.length===0?'bg-white/10':''}`}
                    onClick={() => setFilters({ ...filters, interests: [] })}>Any</Button>
            {interestsPool.slice(0,8).map(int => (
              <Button key={int} variant="outline"
                      className={`rounded-lg border-white/20 text-white hover:bg-white/10 ${filters.interests.includes(int)?'bg-white/10':''}`}
                      onClick={() => setFilters({ ...filters, interests: toggleArray(filters.interests, int) })}>{int}</Button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <label className="inline-flex items-center gap-2 text-white/80">
          <input type="checkbox" checked={filters.onlyVerified}
                 onChange={(e) => setFilters({ ...filters, onlyVerified: e.target.checked })} />
          Only Verified
        </label>
        <label className="inline-flex items-center gap-2 text-white/80">
          <input type="checkbox" checked={filters.onlyVip}
                 onChange={(e) => setFilters({ ...filters, onlyVip: e.target.checked })} />
          Only VIP
        </label>
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
            <div className="absolute bottom-3 right-3 text-xs rounded-full bg-black/60 text-white px-3 py-1 backdrop-blur">{p.photos} photos</div>
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
              <Button variant="outline" size="sm" className="rounded-lg border-white/20 text-white hover:bg-white/10">View</Button>
              <Button size="sm" className="rounded-lg bg-[--lux-red] hover:opacity-90" style={{ ['--lux-red' as any]: LUX_RED }}>Like</Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

/* =========================================================
   VIP UPSELL MODAL
========================================================= */
function VipModal({ open, onClose, onPurchase }: { open: boolean; onClose: () => void; onPurchase: (plan:'monthly'|'yearly'|'quarterly') => void; }) {
  if (!open) return null;
  const Feature = ({ text }: { text: string }) => <li className="flex items-center gap-2 text-white/80"><CheckCircle2 className="h-4 w-4 text-yellow-400"/>{text}</li>;
  return (
    <div className="fixed inset-0 z-[95] bg-black/70 backdrop-blur-sm grid place-items-center p-4">
      <div className="w-full max-w-3xl rounded-2xl border border-white/10 bg-black/60 backdrop-blur-xl shadow-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="text-xl font-extrabold"><Crown className="inline mr-2" /> Become VIP</div>
          <button onClick={onClose} className="text-white/70 hover:text-white"><X size={20}/></button>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {/* Monthly */}
          <Card className="rounded-xl border-white/10 bg-black/40">
            <CardHeader><CardTitle>Monthly</CardTitle><CardDescription>Great to get started</CardDescription></CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-4">
                <Feature text="VIP badge"/>
                <Feature text="Unlimited likes"/>
                <Feature text="Priority in Discover"/>
              </ul>
              <Button className="w-full rounded-lg bg-[--lux-red] hover:opacity-90" style={{ ['--lux-red' as any]: LUX_RED }}
                      onClick={() => onPurchase('monthly')}>Choose</Button>
            </CardContent>
          </Card>
          {/* Quarterly */}
          <Card className="rounded-xl border-white/10 bg-black/40 ring-2 ring-yellow-400/30">
            <CardHeader><CardTitle>Quarterly</CardTitle><CardDescription>Popular choice</CardDescription></CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-4">
                <Feature text="All Monthly features"/>
                <Feature text="See who liked you"/>
                <Feature text="Incognito mode"/>
              </ul>
              <Button className="w-full rounded-lg bg-[--lux-red] hover:opacity-90" style={{ ['--lux-red' as any]: LUX_RED }}
                      onClick={() => onPurchase('quarterly')}>Choose</Button>
            </CardContent>
          </Card>
          {/* Yearly */}
          <Card className="rounded-xl border-white/10 bg-black/40">
            <CardHeader><CardTitle>Yearly</CardTitle><CardDescription>Best value</CardDescription></CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-4">
                <Feature text="All Quarterly features"/>
                <Feature text="VIP Lounge access"/>
                <Feature text="Boosts & Super Likes"/>
              </ul>
              <Button className="w-full rounded-lg bg-[--lux-red] hover:opacity-90" style={{ ['--lux-red' as any]: LUX_RED }}
                      onClick={() => onPurchase('yearly')}>Choose</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   VERIFY (KYC) MODAL - 3 steps (Mock)
========================================================= */
function VerifyModal({ open, onClose }: { open: boolean; onClose: () => void; }) {
  const [step, setStep] = useState<1|2|3>(1);
  const [idFile, setIdFile] = useState<File | null>(null);
  const [selfie, setSelfie] = useState<File | null>(null);
  const next = () => setStep(s => (s===3?3:(s+1 as any)));
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[95] bg-black/70 backdrop-blur-sm grid place-items-center p-4">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-black/60 backdrop-blur-xl shadow-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="text-xl font-extrabold"><Shield className="inline mr-2"/> Verify your profile</div>
          <button onClick={onClose} className="text-white/70 hover:text-white"><X size={20}/></button>
        </div>

        {step===1 && (
          <div>
            <div className="mb-2 font-semibold">Step 1: Upload ID</div>
            <label className="flex items-center gap-2 rounded-xl border border-dashed border-white/20 bg-black/30 p-4 cursor-pointer">
              <Upload className="h-5 w-5"/> <span>{idFile ? idFile.name : 'Choose a file…'}</span>
              <input type="file" className="hidden" accept="image/*,application/pdf" onChange={(e) => setIdFile(e.target.files?.[0] || null)} />
            </label>
            <div className="mt-4 flex justify-end">
              <Button disabled={!idFile} onClick={next} className="rounded-xl bg-[--lux-red] hover:opacity-90" style={{ ['--lux-red' as any]: LUX_RED }}>
                Continue
              </Button>
            </div>
          </div>
        )}

        {step===2 && (
          <div>
            <div className="mb-2 font-semibold">Step 2: Selfie</div>
            <label className="flex items-center gap-2 rounded-xl border border-dashed border-white/20 bg-black/30 p-4 cursor-pointer">
              <Camera className="h-5 w-5"/> <span>{selfie ? selfie.name : 'Upload a selfie…'}</span>
              <input type="file" className="hidden" accept="image/*" onChange={(e) => setSelfie(e.target.files?.[0] || null)} />
            </label>
            <div className="mt-4 flex justify-end">
              <Button disabled={!selfie} onClick={next} className="rounded-xl bg-[--lux-red] hover:opacity-90" style={{ ['--lux-red' as any]: LUX_RED }}>
                Continue
              </Button>
            </div>
          </div>
        )}

        {step===3 && (
          <div className="text-center">
            <CheckCircle2 className="mx-auto mb-2 text-emerald-400" size={36}/>
            <div className="font-semibold mb-1">Submitted</div>
            <div className="text-white/70">Your verification is under review (mock).</div>
            <div className="mt-4 flex justify-center">
              <Button onClick={onClose} className="rounded-xl bg-[--lux-red] hover:opacity-90" style={{ ['--lux-red' as any]: LUX_RED }}>
                Done
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   TRUST & STATS
========================================================= */
function TrustAndStats({ likesToday, newMatches, visitors, onOpenVerify }:
  { likesToday: number; newMatches: number; visitors: number; onOpenVerify: () => void; }) {

  const likes = useCountUp(likesToday);
  const matches = useCountUp(newMatches);
  const visit = useCountUp(visitors);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5"/> Trust & Verify</CardTitle>
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
            <Button className="rounded-xl bg-[--lux-red] hover:opacity-90" style={{ ['--lux-red' as any]: LUX_RED }}
                    onClick={onOpenVerify}>Get Verified</Button>
            <Button variant="outline" className="rounded-xl border-white/20 text-white hover:bg-white/10">Safety Guidelines</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Star className="h-5 w-5"/> Today</CardTitle>
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
   FOOTER (Glass + bg video)
========================================================= */
function FooterGlassVideo({ src = '/film2.mp4' }) {
  const navigate = useNavigate();
  return (
    <footer className="relative mt-16">
      <div className="absolute inset-0 -z-10 overflow-hidden rounded-none">
        <video src={src} className="h-full w-full object-cover opacity-50" autoPlay muted loop playsInline preload="metadata" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
      </div>
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
            <div>
              <div className="font-semibold mb-3" style={{ color: LUX_RED }}>FarsiHub</div>
              <ul className="space-y-2 text-white/70">
                <li><button className="hover:text-white" onClick={()=>navigate('/about')}>About</button></li>
                <li><button className="hover:text-white" onClick={()=>navigate('/blog')}>Blog</button></li>
                <li><button className="hover:text-white" onClick={()=>navigate('/careers')}>Careers</button></li>
              </ul>
            </div>
            <div>
              <div className="font-semibold mb-3" style={{ color: LUX_RED }}>Product</div>
              <ul className="space-y-2 text-white/70">
                <li><button className="hover:text-white" onClick={()=>navigate('/dating')}>Dating</button></li>
                <li><button className="hover:text-white" onClick={()=>navigate('/vip')}>VIP</button></li>
                <li><button className="hover:text-white" onClick={()=>navigate('/security')}>Security</button></li>
              </ul>
            </div>
            <div>
              <div className="font-semibold mb-3" style={{ color: LUX_RED }}>Legal</div>
              <ul className="space-y-2 text-white/70">
                <li><button className="hover:text-white" onClick={()=>navigate('/terms')}>Terms</button></li>
                <li><button className="hover:text-white" onClick={()=>navigate('/privacy')}>Privacy</button></li>
                <li><button className="hover:text-white" onClick={()=>navigate('/cookies')}>Cookies</button></li>
              </ul>
            </div>
            <div>
              <div className="font-semibold mb-3" style={{ color: LUX_RED }}>Support</div>
              <ul className="space-y-2 text-white/70">
                <li><button className="hover:text-white" onClick={()=>navigate('/help')}>Help Center</button></li>
                <li><button className="hover:text-white" onClick={()=>navigate('/report')}>Report</button></li>
                <li><button className="hover:text-white" onClick={()=>navigate('/contact')}>Contact</button></li>
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

  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  useFilterUrlSync(filters, setFilters);

  const [chatOpen, setChatOpen] = useState(false);
  const [chatPeer, setChatPeer] = useState<string>('User');

  const [vipOpen, setVipOpen] = useState(false);
  const [verifyOpen, setVerifyOpen] = useState(false);
  const [isVipUser, setIsVipUser] = useState(false);

  const currentProfile = profiles[currentIndex];

  const handleNext = () => setCurrentIndex((i) => (i < profiles.length - 1 ? i + 1 : 0));
  const onSwipeLeft = () => { handleNext(); };
  const onSwipeRight = () => {
    setLikesCount((c) => c + 1);
    setNewMatchesCount((m) => ((likesCount + 1) % 5 === 0 ? m + 1 : m));
    handleNext();
  };

  const openChatWithProfile = useCallback((p: Profile) => { setChatPeer(p.name); setChatOpen(true); }, []);
  const openChatWithMatch = useCallback((m: MatchItem) => { setChatPeer(m.name); setChatOpen(true); }, []);
  const openVip = useCallback(() => setVipOpen(true), []);
  const purchaseVip = (plan: 'monthly'|'yearly'|'quarterly') => {
    setIsVipUser(true);
    setVipOpen(false);
  };

  const interestsPool = useMemo(() => Array.from(new Set(PROFILES.flatMap(p => p.interests))), []);
  const citiesPool = useMemo(() => Array.from(new Set(PROFILES.map(p => p.city))), []);

  const filteredDiscover = useMemo(() => {
    return PROFILES.filter(p => {
      // gender
      if (filters.genders !== 'any' && !filters.genders.includes(p.gender as any)) return false;
      // cities
      if (filters.cities.length && !filters.cities.includes(p.city)) return false;
      // age
      if (p.age < filters.minAge || p.age > filters.maxAge) return false;
      // interests
      if (filters.interests.length && !filters.interests.some(i => p.interests.includes(i))) return false;
      // verified/vip
      if (filters.onlyVerified && !p.verified) return false;
      if (filters.onlyVip && !p.vip) return false;
      return true;
    });
  }, [filters]);

  return (
    <div className="min-h-screen bg-black text-white">
      <style>{`.neon-edge { box-shadow: 0 0 0 1px rgba(255,255,255,0.06), 0 0 40px ${LUX_RED_SOFT}; }`}</style>

      <HeaderGlass />

      <main className="py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Title */}
          <div className="mb-6 text-center">
            <h1 className="text-3xl md:text-4xl font-extrabold mb-2 tracking-tight">
              Find Love, <span style={{ color: LUX_RED }}>Middle Eastern</span> Style {isVipUser && <Badge className="ml-2 bg-yellow-500/90"><Crown className="h-3 w-3 mr-1"/>VIP</Badge>}
            </h1>
            <p className="text-lg text-white/70">Smart discovery • Secure profiles • Luxury experience</p>
          </div>

          {/* HERO VIDEOS */}
          <VideoHeroDuo srcA="/film11.mp4" srcB="/film12.mp4" />

          {/* Main grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* LEFT: Swipe card */}
            <div className="lg:col-span-2">
              {currentProfile ? (
                <SwipeCard
                  profile={currentProfile}
                  onSwipeLeft={onSwipeLeft}
                  onSwipeRight={onSwipeRight}
                  onMessage={openChatWithProfile}
                  onVipUpsell={openVip}
               
                />
              ) : (
                <Card className="p-10 text-center rounded-3xl border-white/10 bg-black/40 backdrop-blur">
                  <p>No more profiles. Check back later!</p>
                </Card>
              )}
            </div>

            {/* RIGHT: Matches + Safety + Quick Stats */}
            <div className="space-y-6">
              <MatchesBar items={MATCHES} onOpenChat={openChatWithMatch} />

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
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-3 rounded-lg border-white/20 text-white hover:bg-white/10"
                    onClick={() => setVerifyOpen(true)}
                  >
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
            <TrustAndStats
              likesToday={likesCount}
              newMatches={newMatchesCount}
              visitors={visitorsCount}
              onOpenVerify={() => setVerifyOpen(true)}
            />
          </div>

          {/* Discover + Filters */}
          <div className="mt-10 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-extrabold">Discover</h2>
              <div className="text-white/70 text-sm">Explore nearby, find your vibe</div>
            </div>
            <FiltersBar
              filters={filters}
              setFilters={setFilters}
              interestsPool={interestsPool}
              citiesPool={citiesPool}
            />
            <DiscoverGrid profiles={filteredDiscover} />
          </div>
        </div>

        {/* Footer with video background */}
        <FooterGlassVideo src="/film2.mp4" />
      </main>

      {/* Modals (front-end only) */}
      <ChatModal open={chatOpen} onClose={() => setChatOpen(false)} peerName={chatPeer} />
      <VipModal open={vipOpen} onClose={() => setVipOpen(false)} onPurchase={purchaseVip} />
      <VerifyModal open={verifyOpen} onClose={() => setVerifyOpen(false)} />
    </div>
  );
}

export default Dating;
