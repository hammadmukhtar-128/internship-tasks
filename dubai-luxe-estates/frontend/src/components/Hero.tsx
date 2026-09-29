"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { HiOutlineSearch } from "react-icons/hi";

const slides = ["/images/img1.jpg", "/images/img2.jpg", "/images/img3.jpg"];

export default function Hero() {
  const [active, setActive] = useState(0);
  const router = useRouter();

  const [form, setForm] = useState({ location: "", propertyType: "", bedrooms: "", budget: "" });

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (form.location) params.set("location", form.location);
    if (form.propertyType) params.set("propertyType", form.propertyType);
    if (form.bedrooms) params.set("bedrooms", form.bedrooms);
    if (form.budget) params.set("maxPrice", form.budget);
    router.push(`/properties?${params.toString()}`);
  };

  return (
    <section className="relative flex h-screen min-h-[720px] w-full items-center overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <Image src={slides[active]} alt="Lahore luxury property skyline" fill priority className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/40 to-ink/20" />
        </motion.div>
      </AnimatePresence>

      <div className="container-luxury relative z-10 pt-24 text-ivory">
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="eyebrow text-gold-light"
        >
          Lahore&apos;s Premier Real Estate Advisory
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.9 }}
          className="mt-5 max-w-3xl font-display text-5xl font-bold leading-[1.1] md:text-6xl lg:text-7xl"
        >
          Find Your <span className="gold-text">Lahore Address</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.9 }}
          className="mt-6 max-w-xl text-lg text-ivory/80"
        >
          Curated houses, apartments, villas, plots, and commercial spaces across DHA Lahore, Bahria Town, Gulberg,
          Johar Town, and Lake City.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.8 }}
          className="mt-8 flex flex-wrap gap-4"
        >
          <a href="/properties" className="btn-gold">
            Explore Properties
          </a>
          <a href="/contact" className="btn-outline border-ivory/30 text-ivory hover:text-ink">
            Book Consultation
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.9 }}
          className="glass mt-14 grid grid-cols-1 gap-4 rounded-2xl p-5 md:grid-cols-5 md:items-end"
        >
          <div className="md:col-span-1">
            <label className="mb-1 block text-xs uppercase tracking-wider text-ivory/60">Location</label>
            <input
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder="e.g. DHA Lahore"
              className="w-full rounded-lg bg-white/10 px-3 py-2.5 text-sm text-ivory placeholder:text-ivory/40 focus:outline-none"
            />
          </div>
          <div className="md:col-span-1">
            <label className="mb-1 block text-xs uppercase tracking-wider text-ivory/60">Property Type</label>
            <select
              value={form.propertyType}
              onChange={(e) => setForm({ ...form, propertyType: e.target.value })}
              className="w-full rounded-lg bg-white/10 px-3 py-2.5 text-sm text-ivory focus:outline-none [&>option]:text-ink"
            >
              <option value="">Any</option>
              <option>House</option>
              <option>Apartment</option>
              <option>Villa</option>
              <option>Plot</option>
              <option>Commercial</option>
              <option>Office</option>
              <option>Shop</option>
            </select>
          </div>
          <div className="md:col-span-1">
            <label className="mb-1 block text-xs uppercase tracking-wider text-ivory/60">Bedrooms</label>
            <select
              value={form.bedrooms}
              onChange={(e) => setForm({ ...form, bedrooms: e.target.value })}
              className="w-full rounded-lg bg-white/10 px-3 py-2.5 text-sm text-ivory focus:outline-none [&>option]:text-ink"
            >
              <option value="">Any</option>
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n}+
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-1">
            <label className="mb-1 block text-xs uppercase tracking-wider text-ivory/60">Max Budget (PKR)</label>
            <input
              value={form.budget}
              onChange={(e) => setForm({ ...form, budget: e.target.value })}
              placeholder="e.g. 50000000"
              className="w-full rounded-lg bg-white/10 px-3 py-2.5 text-sm text-ivory placeholder:text-ivory/40 focus:outline-none"
            />
          </div>
          <button onClick={handleSearch} className="btn-gold md:col-span-1">
            <HiOutlineSearch /> Search
          </button>
        </motion.div>
      </div>

      <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`h-1.5 rounded-full transition-all ${active === i ? "w-8 bg-gold" : "w-1.5 bg-ivory/40"}`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
