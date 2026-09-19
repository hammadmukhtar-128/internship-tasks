import { HeartHandshake, Target, Sparkles, ShieldCheck } from "lucide-react";
import Seo from "../components/common/Seo";
import SectionHeading from "../components/common/SectionHeading";
import FinalCta from "../components/home/FinalCta";
import { useSettings } from "../context/SettingsContext";

const values = [
  { icon: HeartHandshake, title: "Patient-centred approach", description: "Every plan starts with your goals, not a one-size-fits-all protocol." },
  { icon: Target, title: "Evidence-based treatment", description: "We draw on current clinical research to guide every treatment decision." },
  { icon: Sparkles, title: "Modern facilities", description: "A calm, well-equipped space designed to support hands-on and active care." },
  { icon: ShieldCheck, title: "Honest communication", description: "Clear explanations of what we find and realistic expectations for recovery." },
];

export default function About() {
  const settings = useSettings();

  return (
    <>
      <Seo title="About Us" description={`Learn about ${settings.clinicName}, our approach to care and our team.`} path="/about" />

      <section className="bg-brand-50 py-16 sm:py-20">
        <div className="container-clinic grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-brand-500">About {settings.clinicName}</p>
            <h1 className="font-display text-3xl leading-tight text-brand-950 sm:text-4xl">
              Our story, our mission, and the way we care for you
            </h1>
            <p className="mt-5 text-base leading-relaxed text-brand-700/90">
              {settings.clinicName} was built around a simple idea: healthcare should feel
              personal. Our physiotherapists and chiropractors work together to help patients
              across {settings.suburb} and the surrounding area move with less pain and more
              confidence — whether that means recovering from an injury, managing an ongoing
              condition, or building long-term strength.
            </p>
            <p className="mt-4 text-base leading-relaxed text-brand-700/90">
              We believe good care is collaborative. That means listening first, explaining
              our reasoning clearly, and building a plan that fits into your actual life —
              not just the clinic.
            </p>
          </div>
          <div className="relative mx-auto aspect-[4/3] w-full max-w-lg overflow-hidden rounded-xl2 shadow-soft">
            <img
              src="/images/clinic/gallery-treatment-table.jpg"
              alt="A practitioner assessing a patient's hip and leg mobility on a treatment table"
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-24">
        <div className="container-clinic">
          <SectionHeading eyebrow="Our Values" title="What guides how we work" />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div key={v.title} className="rounded-xl2 border border-brand-100 bg-sand-50 p-7">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-white text-brand-700 shadow-sm">
                  <v.icon className="h-5 w-5" />
                </div>
                <h3 className="font-display text-lg text-brand-950">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-brand-600">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-sand-50 py-16 sm:py-24">
        <div className="container-clinic grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="relative mx-auto aspect-[4/3] w-full max-w-lg overflow-hidden rounded-xl2 shadow-soft lg:order-2">
            <img
              src="/images/clinic/gallery-leg-stretch.jpg"
              alt="A practitioner guiding a patient through a supported leg stretch"
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="lg:order-1">
            <h2 className="font-display text-2xl text-brand-950 sm:text-3xl">Why patients choose us</h2>
            <p className="mt-4 leading-relaxed text-brand-700/90">
              From your first phone call to your final review session, we aim to make care
              straightforward — clear appointment times, honest conversations about progress,
              and a team that remembers your goals from one visit to the next.
            </p>
            <p className="mt-4 leading-relaxed text-brand-700/90">
              Our treatment philosophy blends hands-on manual therapy with active
              rehabilitation, because lasting change usually needs both.
            </p>
          </div>
        </div>
      </section>

      <FinalCta />
    </>
  );
}
