import Button from "../common/Button";
import { CheckCircle2 } from "lucide-react";

const points = [
  "Treatment plans shaped around your goals",
  "Clear communication at every step",
  "A calm, modern space to recover in",
];

export default function AboutPreview() {
  return (
    <section className="bg-sand-50 py-20 sm:py-28">
      <div className="container-clinic grid gap-12 lg:grid-cols-2 lg:items-center">
        <div className="relative order-2 mx-auto aspect-[4/3] w-full max-w-xl overflow-hidden rounded-xl2 shadow-soft lg:order-1">
          <img
            src="/images/clinic/about-practitioner-preview.jpg"
            alt="A practitioner guiding a patient through a shoulder and arm mobility stretch"
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="order-1 lg:order-2">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-brand-500">About Us</p>
          <h2 className="font-display text-3xl leading-tight text-brand-950 sm:text-4xl">
            Care that puts your goals first.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-brand-700/90 sm:text-lg">
            Our team of physiotherapists and chiropractors take the time to understand what
            matters to you — whether that&rsquo;s returning to sport, sitting through a workday
            without pain, or simply moving more freely. Every session builds toward that goal.
          </p>
          <ul className="mt-6 space-y-3">
            {points.map((point) => (
              <li key={point} className="flex items-start gap-2.5 text-sm text-brand-800">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
                {point}
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <Button to="/team" variant="secondary" size="lg">
              Meet Our Team
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
