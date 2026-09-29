import Image from "next/image";
import { Metadata } from "next";
import { HiOutlineEye, HiOutlineFlag } from "react-icons/hi";
import Stats from "@/components/Stats";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Lahore Estate Hub and our guidance for buyers, renters, and investors across Lahore’s prime residential and commercial communities.",
};

const timeline = [
  { year: "2014", text: "Established in Lahore with a focus on premium residential and commercial real estate advisory." },
  { year: "2017", text: "Expanded our reach across DHA Lahore, Bahria Town, Gulberg, Johar Town, and Lake City." },
  { year: "2021", text: "Became a trusted advisor for families, investors, and developers seeking high-growth Lahore properties." },
  { year: "2023", text: "Launched a dedicated rental and investment advisory service for the Lahore market." },
  { year: "2026", text: "Helping clients purchase, rent, and invest with confidence across Lahore’s most sought-after neighbourhoods." },
];

export default function AboutPage() {
  return (
    <div className="pt-32">
      <section className="container-luxury grid grid-cols-1 items-center gap-14 pb-24 lg:grid-cols-2">
        <div>
          <span className="eyebrow">Our Story</span>
          <h1 className="mt-3 font-display text-4xl font-bold text-ink md:text-5xl">
            Trusted Guidance for Lahore Real Estate
          </h1>
          <p className="mt-6 leading-relaxed text-ink/60">
            Lahore Estate Hub was founded on a simple principle: treat every client&apos;s property decision as a long-term investment in lifestyle, security, and opportunity.
            From a single office in Lahore, we&apos;ve grown into a trusted advisory for families, first-time buyers, investors, and businesses looking for the right address in the city.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-6">
            <div className="card-luxury p-6">
              <HiOutlineFlag className="text-2xl text-gold-dark" />
              <h3 className="mt-3 font-semibold text-ink">Our Mission</h3>
              <p className="mt-2 text-sm text-ink/60">
                Deliver transparent, expert guidance that helps clients make confident property decisions across Lahore.
              </p>
            </div>
            <div className="card-luxury p-6">
              <HiOutlineEye className="text-2xl text-gold-dark" />
              <h3 className="mt-3 font-semibold text-ink">Our Vision</h3>
              <p className="mt-2 text-sm text-ink/60">
                To be the leading name in Lahore real estate, recognized for integrity, local knowledge, and exceptional client care.
              </p>
            </div>
          </div>
        </div>
        <div className="relative h-[520px] overflow-hidden rounded-3xl">
          <Image src="/images/img33.jpg" alt="Lahore Estate Hub office" fill className="object-cover" />
        </div>
      </section>

      <section className="section-padding bg-ivory">
        <div className="container-luxury">
          <h2 className="text-center font-display text-3xl font-bold text-ink">Our Journey</h2>
          <div className="mx-auto mt-14 max-w-2xl space-y-8 border-l border-gold/30 pl-8">
            {timeline.map((t) => (
              <div key={t.year} className="relative">
                <span className="absolute -left-[38px] top-1 h-3 w-3 rounded-full bg-gold" />
                <p className="font-display text-xl font-bold text-gold-dark">{t.year}</p>
                <p className="mt-1 text-ink/60">{t.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Stats />

      <section className="section-padding container-luxury">
        <h2 className="text-center font-display text-3xl font-bold text-ink">Our Office</h2>
        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
          {["/images/img33.jpg", "/images/img34.jpg", "/images/img35.jpg"].map((img) => (
            <div key={img} className="relative h-72 overflow-hidden rounded-2xl">
              <Image src={img} alt="Office gallery" fill className="object-cover" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
