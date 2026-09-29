import { HiOutlineShieldCheck, HiOutlineGlobeAlt, HiOutlineSparkles, HiOutlineUserGroup } from "react-icons/hi";
import SectionHeading from "./SectionHeading";

const points = [
  {
    icon: HiOutlineShieldCheck,
    title: "Verified Trust",
    text: "Every transaction is handled with transparent guidance, local market expertise, and a client-first advisory process.",
  },
  {
    icon: HiOutlineGlobeAlt,
    title: "Local Market Reach",
    text: "A network of buyers, renters, and investors across Lahore’s most active residential and commercial districts.",
  },
  {
    icon: HiOutlineSparkles,
    title: "Curated Portfolio",
    text: "Only the strongest opportunities in Lahore’s most desirable communities make our shortlist.",
  },
  {
    icon: HiOutlineUserGroup,
    title: "Dedicated Advisors",
    text: "A personal agent guides you from the first property visit to the final paperwork and handover.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="section-padding bg-ivory">
      <div className="container-luxury">
        <SectionHeading eyebrow="Why Choose Us" title="An Advisory Built on Trust and Precision" />
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {points.map((p) => (
            <div key={p.title} className="card-luxury p-8">
              <p.icon className="text-3xl text-gold-dark" />
              <h3 className="mt-5 font-display text-lg font-semibold text-ink">{p.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink/60">{p.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
