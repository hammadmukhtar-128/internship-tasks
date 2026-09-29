"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import SectionHeading from "./SectionHeading";
import { FaQuoteLeft } from "react-icons/fa";

const testimonials = [
  {
    name: "Ahsan Raza",
    role: "Investor, Lahore",
    image: "/images/img40.jpg",
    quote:
      "The team helped us shortlist premium opportunities in DHA Lahore and Bahria Town with clear market guidance and honest advice throughout the process.",
  },
  {
    name: "Hina Malik",
    role: "Homeowner, Gulberg",
    image: "/images/img41.jpg",
    quote:
      "We explored several homes before choosing the right family property. Their guidance was thoughtful, practical, and completely aligned with our needs.",
  },
];

export default function Testimonials() {
  return (
    <section className="section-padding bg-white">
      <div className="container-luxury">
        <SectionHeading eyebrow="Client Stories" title="What Our Clients Say" />
        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 5000 }}
          pagination={{ clickable: true }}
          spaceBetween={32}
          slidesPerView={1}
          breakpoints={{ 768: { slidesPerView: 2 } }}
          className="pb-14"
        >
          {testimonials.map((t) => (
            <SwiperSlide key={t.name}>
              <div className="card-luxury flex h-full flex-col gap-6 p-10">
                <FaQuoteLeft className="text-3xl text-gold" />
                <p className="text-base leading-relaxed text-ink/70">{t.quote}</p>
                <div className="mt-auto flex items-center gap-4">
                  <div className="relative h-12 w-12 overflow-hidden rounded-full">
                    <Image src={t.image} alt={t.name} fill className="object-cover" />
                  </div>
                  <div>
                    <p className="font-semibold text-ink">{t.name}</p>
                    <p className="text-xs text-ink/50">{t.role}</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
