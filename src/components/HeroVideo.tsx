import { useEffect, useRef, useState } from "react";

export default function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ended, setEnded] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    (async () => { try { await v.play(); } catch {} })(); // تلاش برای autoplay
    const onEnded = () => setEnded(true);
    v.addEventListener("ended", onEnded);
    return () => v.removeEventListener("ended", onEnded);
  }, []);

  return (
    <section className="section" style={{ position: "relative", padding: 0 }}>
      <video
        ref={videoRef}
        src="/comp.mp4"            // ویدیوی توی public
        poster="/comp-poster.jpg"  // اختیاری
        muted
        playsInline
        autoPlay
        style={{ width: "100%", height: "100svh", objectFit: "cover" }}
      />
      {/* می‌تونی بعد از پایان ویدئو اسکرول خودکار هم بزنی، فعلاً ساده گذاشتیم */}
    </section>
  );
}
