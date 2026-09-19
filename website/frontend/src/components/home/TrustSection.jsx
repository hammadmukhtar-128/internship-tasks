import { Star, Users, HeartHandshake, Building2 } from "lucide-react";

const items = [
  { icon: Star, title: "4.9 Google Rating", description: "Rated highly by the patients we've worked with." },
  { icon: Users, title: "Experienced Practitioners", description: "A qualified team across physiotherapy and chiropractic care." },
  { icon: HeartHandshake, title: "Personalised Care", description: "Treatment plans built around your goals, not a template." },
  { icon: Building2, title: "Modern Clinic", description: "A calm, comfortable space designed around your recovery." },
];

export default function TrustSection() {
  return (
    <section className="border-y border-brand-100 bg-white py-12">
      <div className="container-clinic grid grid-cols-2 gap-8 sm:grid-cols-4">
        {items.map((item) => (
          <div key={item.title} className="flex flex-col items-center text-center sm:items-start sm:text-left">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-brand-50 text-brand-700">
              <item.icon className="h-5 w-5" aria-hidden="true" />
            </div>
            <p className="font-display text-base text-brand-950">{item.title}</p>
            <p className="mt-1 text-sm text-brand-600">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
