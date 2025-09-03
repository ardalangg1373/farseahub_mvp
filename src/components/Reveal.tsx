import { useEffect, useRef, ReactNode } from "react";

export default function Reveal({ children, margin = "0px 0px -20% 0px" }:{
  children: ReactNode;
  margin?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current!;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.add("visible");
          }
        });
      },
      { root: null, rootMargin: margin, threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [margin]);

  return <div ref={ref} className="reveal">{children}</div>;
}
