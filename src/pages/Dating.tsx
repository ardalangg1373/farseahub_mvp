function VideoHeroDuo() {
  const vidA = useRef<HTMLVideoElement | null>(null);
  const vidB = useRef<HTMLVideoElement | null>(null);
  const [active, setActive] = useState<0 | 1>(0); // 0 -> film11, 1 -> film12
  const [muted, setMuted] = useState(true);

  // helper to play safely
  const safePlay = (v: HTMLVideoElement | null) => v?.play().catch(() => {});

  useEffect(() => {
    const a = vidA.current;
    const b = vidB.current;
    if (!a || !b) return;

    // initial states
    a.style.opacity = '1';
    b.style.opacity = '0';

    a.muted = true;
    b.muted = true;
    safePlay(a);

    const crossFade = () => {
      const current = active === 0 ? a : b;
      const next = active === 0 ? b : a;

      if (!current || !next) return;

      next.currentTime = 0;
      next.style.transition = 'opacity 1s ease';
      current.style.transition = 'opacity 1s ease';

      if (!muted) {
        current.muted = true;
        next.muted = false;
      }

      next.style.opacity = '1';
      current.style.opacity = '0';

      safePlay(next);
      setActive((prev) => (prev === 0 ? 1 : 0));
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

    if (activeEl) activeEl.muted = willBeMuted;
    if (inactiveEl) inactiveEl.muted = true;

    if (activeEl?.paused) activeEl.play().catch(() => {});
  };

  return (
    <section className="relative w-full h-[55vh] md:h-[70vh] overflow-hidden rounded-xl mb-8 shadow-xl">
      {/* gradient overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            'linear-gradient(90deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 70%, rgba(0,0,0,0.5) 100%)',
        }}
      />

      {/* videos */}
      <video
        ref={vidA}
        src="/film11.mp4"
        className="absolute inset-0 h-full w-full object-cover"
        playsInline
        preload="auto"
        autoPlay
        loop={false}
      />
      <video
        ref={vidB}
        src="/film12.mp4"
        className="absolute inset-0 h-full w-full object-cover"
        playsInline
        preload="auto"
        autoPlay
        loop={false}
      />

      {/* mute button */}
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
