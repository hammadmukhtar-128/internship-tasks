"use client";

import { useEffect, useState } from "react";
import { HiArrowUp } from "react-icons/hi";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-ink text-ivory shadow-luxury transition-transform hover:scale-110 hover:bg-gold hover:text-ink"
    >
      <HiArrowUp size={20} />
    </button>
  );
}
