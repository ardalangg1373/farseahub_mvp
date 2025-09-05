import { useRef, useState } from "react";

function FarsiCoinHero() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [muted, setMuted] = useState(true);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setMuted(videoRef.current.muted);
      // اگر ویدیو در حالت توقفه، پلی کن
      if (videoRef.current.paused) {
        videoRef.current.play().catch(() => {});
      }
    }
  };

  return (
    <section className="relative h-screen w-screen overflow-hidden">
      <video
        ref={videoRef}
        src="/film10.mp4"
        autoPlay
        loop
        playsInline
        preload="auto"
        muted={muted}
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* عنوان روی فیلم */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <h1
          className="text-5xl md:text-7xl font-extrabold text-white drop-shadow-lg bg-clip-text text-transparent"
          style={{ backgroundImage: "linear-gradient(180deg,#fff 0%, rgba(229,9,20,0.9) 100%)" }}
        >
          FarsiCoin
        </h1>
      </div>

      {/* دکمه Mute/Unmute */}
      <button
        onClick={toggleMute}
        className="absolute bottom-6 right-6 z-20 rounded-xl px-4 py-2 text-sm font-semibold border border-white/20 bg-black/40 text-white hover:bg-black/60 transition"
        style={{ backdropFilter: "blur(6px)" }}
      >
        {muted ? "🔊 Unmute" : "🔇 Mute"}
      </button>
    </section>
  );
}

export default FarsiCoinHero;
