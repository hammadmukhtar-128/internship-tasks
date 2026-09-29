"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { HiMenu, HiX } from "react-icons/hi";

const links = [
  { href: "/", label: "Home" },
  { href: "/properties", label: "Properties" },
  { href: "/properties?purpose=Buy", label: "Buy" },
  { href: "/properties?purpose=Rent", label: "Rent" },
  { href: "/communities", label: "Communities" },
  { href: "/agents", label: "Agents" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-500 ${
        scrolled ? "glass shadow-[0_4px_30px_rgba(0,0,0,0.08)]" : "bg-transparent"
      }`}
    >
      <nav className="container-luxury flex items-center justify-between py-5">
        <Link href="/" className="font-display text-2xl font-bold tracking-tight text-ink">
          Lahore <span className="gold-text">Estate</span> Hub
        </Link>

        <ul className="hidden items-center gap-7 lg:flex">
          {links.map((l) => (
            <li key={l.label}>
              <Link
                href={l.href}
                className="text-sm font-medium uppercase tracking-wide text-ink/80 transition-colors hover:text-gold-dark"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden lg:block">
          <Link href="/contact" className="btn-gold text-xs">
            Book Consultation
          </Link>
        </div>

        <button
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="text-2xl text-ink lg:hidden"
        >
          {open ? <HiX /> : <HiMenu />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-ivory lg:hidden"
          >
            <ul className="container-luxury flex flex-col gap-4 py-6">
              {links.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-base font-medium text-ink">
                    {l.label}
                  </Link>
                </li>
              ))}
              <Link href="/contact" className="btn-gold mt-2 w-full text-xs">
                Book Consultation
              </Link>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
