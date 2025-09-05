import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, X, MapPin, MessageCircle, Users, Shield, Volume2, VolumeX } from 'lucide-react';

/* ===========================
   HERO: film11 + film12 from /public (root) with audio + soft crossfade
=========================== */
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

  const wireDiagnostics = (v: HTMLVideoElement | null, label: string) => {
    if (!v) return;
    v.oncanplay = () => console.info(`[Video] ${label} canplay:`, v.src);
    v.onerror = () => console.error(`[Video] ${label} ERROR loading:`, v.src);
    v.onloadedmetadata = () =>
      console.info(`[Video] ${label} duration=${v.duration}s, muted=${v.muted}`);
  };

  useEffect(() => {
    const a = vidA.current;
    const b = vidB.current;
    if (!a || !b) return;

    wireDiagnostics(a, 'A');
    wireDiagnostics(b, 'B');

    // initial styles
    a.style.opacity = '1';
    b.style.opacity = '0';

    // start muted so autoplay works everywhere (attribute 'muted' is on the tag)
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
        next.removeAttribute('muted'); // allow audio on the next
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
        // user wants audio: remove attribute (Safari/Chrome sometimes honor attribute over prop)
        activeEl.removeAttribute('muted');
        activeEl.volume = 1;
        if (activeEl.paused) activeEl.play().catch(() => {});
      }
    }
    if (inactiveEl) inactiveEl.muted = true;
  };

  return (
    <section className="relative w-full h-[55vh] md:h-[70vh] overflow-hidden rounded-xl mb-8 shadow-xl">
      {/* mask for readability near edges */}
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            'linear-gradient(90deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 70%, rgba(0,0,0,0.5) 100%)',
        }}
      />

      {/* stacked videos (note: muted attribute kept for autoplay; we remove it only when unmuting) */}
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

      {/* Mute / Unmute */}
      <button
        onClick={toggleMute}
        className="absolute bottom-4 right-4 z-20 rounded-xl px-4 py-2 text-sm font-semibold border border-white/30 bg-black/50 text-white hover:bg-black/70 transition backdrop-blur-md shadow-lg"
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

/* ===========================
   Dating Page
=========================== */
function Dating() {
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);

  const profiles = [
    {
      id: 1,
      name: 'Sara',
      age: 27,
      city: 'Tehran',
      bio: 'Love exploring new cultures, photography, and Persian poetry. Looking for meaningful connections.',
      interests: ['Photography', 'Poetry', 'Travel', 'Art'],
      photos: 5,
      verified: true,
    },
    {
      id: 2,
      name: 'Arman',
      age: 31,
      city: 'Isfahan',
      bio: 'Software engineer passionate about technology and traditional Persian music. Enjoy hiking and cooking.',
      interests: ['Technology', 'Music', 'Hiking', 'Cooking'],
      photos: 4,
      verified: true,
    },
    {
      id: 3,
      name: 'Mina',
      age: 25,
      city: 'Shiraz',
      bio: 'Artist and designer who loves books, cats, and long conversations over tea. Seeking genuine connection.',
      interests: ['Art', 'Books', 'Design', 'Cats'],
      photos: 6,
      verified: false,
    },
    {
      id: 4,
      name: 'Kian',
      age: 29,
      city: 'Mashhad',
      bio: 'Doctor with a passion for helping others. Love basketball, reading, and exploring historical sites.',
      interests: ['Medicine', 'Basketball', 'History', 'Reading'],
      photos: 3,
      verified: true,
    },
  ];

  const matches = [
    { id: 1, name: 'Neda', age: 26, city: 'Tabriz', lastMessage: 'That sounds like a great plan!', timestamp: '2 hours ago', unread: true },
    { id: 2, name: 'Sina', age: 28, city: 'Tehran', lastMessage: 'How was your day?', timestamp: '1 day ago', unread: false },
    { id: 3, name: 'Roya', age: 24, city: 'Isfahan', lastMessage: 'Thanks for the book recommendation', timestamp: '3 days ago', unread: false },
  ];

  const currentProfile = profiles[currentProfileIndex];

  const handleNext = () => setCurrentProfileIndex((i) => (i < profiles.length - 1 ? i + 1 : 0));

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-6xl">

        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Persian Dating</h1>
          <p className="text-lg text-muted-foreground">
            Connect with Persian singles and build meaningful relationships
          </p>
        </div>

        {/* Videos from /public root */}
        <VideoHeroDuo srcA="/film11.mp4" srcB="/film12.mp4" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-2">
            <Card className="max-w-md mx-auto">
              <CardHeader className="p-0">
                <div className="relative">
                  <div className="aspect-[3/4] bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900 dark:to-purple-900 rounded-t-lg flex items-center justify-center">
                    <div className="text-center">
                      <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                      <div className="text-2xl font-bold">{currentProfile.name}</div>
                      <div className="text-muted-foreground">{currentProfile.photos} photos</div>
                    </div>
                  </div>
                  {currentProfile.verified && (
                    <Badge className="absolute top-2 right-2 bg-blue-500">
                      <Shield className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-2xl font-bold">
                        {currentProfile.name}, {currentProfile.age}
                      </h2>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-1" />
                      {currentProfile.city}
                    </div>
                  </div>

                  <p className="text-muted-foreground">{currentProfile.bio}</p>

                  <div className="space-y-2">
                    <h3 className="font-semibold">Interests</h3>
                    <div className="flex flex-wrap gap-2">
                      {currentProfile.interests.map((interest, index) => (
                        <Badge key={index} variant="secondary">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-center space-x-4 mt-6">
                  <Button
                    variant="outline"
                    size="lg"
                    className="rounded-full w-16 h-16 border-red-200 hover:bg-red-50 hover:border-red-300"
                    onClick={handleNext}
                  >
                    <X className="h-6 w-6 text-red-500" />
                  </Button>
                  <Button
                    size="lg"
                    className="rounded-full w-16 h-16 bg-pink-500 hover:bg-pink-600"
                    onClick={handleNext}
                  >
                    <Heart className="h-6 w-6" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Matches Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Your Matches
                </CardTitle>
                <CardDescription>{matches.length} matches waiting to chat</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-0">
                  {matches.map((match) => (
                    <div
                      key={match.id}
                      className="flex items-center space-x-3 p-4 hover:bg-muted/50 cursor-pointer border-b last:border-b-0"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-full flex items-center justify-center">
                        <span className="font-semibold">{match.name[0]}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium truncate">
                            {match.name}, {match.age}
                          </p>
                          {match.unread && <div className="w-2 h-2 bg-pink-500 rounded-full" />}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{match.lastMessage}</p>
                        <p className="text-xs text-muted-foreground">{match.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Safety Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-sm">
                  <Shield className="h-4 w-4 mr-2" />
                  Safety First
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>• Meet in public places</p>
                <p>• Trust your instincts</p>
                <p>• Report suspicious behavior</p>
                <p>• Keep personal info private</p>
                <Button variant="outline" size="sm" className="w-full mt-3">
                  Safety Guidelines
                </Button>
              </CardContent>
            </Card>

            {/* Stats */}
            <Card>
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-pink-500">12</div>
                    <div className="text-xs text-muted-foreground">Likes Today</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-500">3</div>
                    <div className="text-xs text-muted-foreground">New Matches</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Dating;
