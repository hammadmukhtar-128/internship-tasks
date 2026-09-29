import Image from "next/image";
import Link from "next/link";
import { HiOutlineTrendingUp, HiOutlineCash, HiOutlineDocumentText } from "react-icons/hi";

const items = [
  { icon: HiOutlineTrendingUp, title: "Strong Growth Potential", text: "Lahore’s prime communities continue to grow in value and demand." },
  { icon: HiOutlineCash, title: "Healthy Rental Returns", text: "Well-located homes and commercial spaces offer dependable monthly returns." },
  { icon: HiOutlineDocumentText, title: "Family-Friendly Communities", text: "Neighbourhoods with schools, parks, healthcare, and strong resale demand." },
];

export default function InvestmentSection() {
  return (
    <section className="section-padding bg-white">
      <div className="container-luxury grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
        <div className="relative h-[420px] overflow-hidden rounded-3xl">
          <Image src="/images/img28.jpg" alt="Lahore skyline and property market" fill className="object-cover" />
        </div>
        <div>
          <span className="eyebrow">Why Invest in Lahore</span>
          <h2 className="mt-3 font-display text-3xl font-bold text-ink md:text-4xl">
            A High-Potential Market for Homeowners and Investors
          </h2>
          <p className="mt-5 text-ink/60">
            Lahore combines vibrant urban living, strong community demand, and growing property value in established neighbourhoods like DHA Lahore, Bahria Town, Gulberg, and Johar Town.
          </p>
          <div className="mt-8 space-y-6">
            {items.map((it) => (
              <div key={it.title} className="flex gap-4">
                <it.icon className="mt-1 shrink-0 text-2xl text-gold-dark" />
                <div>
                  <h4 className="font-semibold text-ink">{it.title}</h4>
                  <p className="text-sm text-ink/60">{it.text}</p>
                </div>
              </div>
            ))}
          </div>
          <Link href="/contact" className="btn-primary mt-8 inline-flex">
            Speak to an Investment Advisor
          </Link>
        </div>
      </div>
    </section>
  );
}
