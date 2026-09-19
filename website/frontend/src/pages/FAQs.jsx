import { ChevronRight } from "lucide-react";
import Seo from "../components/common/Seo";
import SectionHeading from "../components/common/SectionHeading";
import FinalCta from "../components/home/FinalCta";
import { useSettings } from "../context/SettingsContext";

export default function FAQs() {
  const settings = useSettings();

  const faqs = [
    { q: "Do I need a referral?", a: "In most cases you don't need a referral to book a physiotherapy or chiropractic appointment — you're welcome to book directly. If you're claiming through an insurer, workplace scheme or a specific program, it's worth checking their requirements first." },
    { q: "What should I bring?", a: "Comfortable clothing you can move in, any relevant imaging or referral letters, and a list of current medications if applicable. Everything else we'll go through together." },
    { q: "How long is an appointment?", a: "Initial appointments typically run 45–60 minutes, with follow-up sessions often shorter. Exact timing depends on the service — see each service page for details." },
    { q: "What happens during my first visit?", a: "We start with a conversation about your goals and history, followed by a physical assessment. From there, your practitioner will explain what they've found and begin building a treatment plan with you." },
    { q: "Do you treat sports injuries?", a: "Yes — our sports injury rehabilitation service is designed for athletes and active people recovering from injury and working toward a safe return to their sport." },
    { q: "Do you offer both physiotherapy and chiropractic care?", a: "Yes, our team includes both physiotherapists and chiropractors, so we can recommend the approach that best suits your situation — or combine both where helpful." },
    { q: "How can I book?", a: "You can book online any time using our Book Appointment page, or call us directly during opening hours." },
    { q: "Where are you located?", a: `Our clinic is located at ${settings.address}, ${settings.suburb} ${settings.state} ${settings.postcode}. See our Contact page for directions and opening hours.` },
    { q: "What happens if I need to cancel?", a: "We understand plans change — please contact us as early as possible if you need to reschedule or cancel so we can offer the time to another patient. Specific cancellation policies and any fees are set by the clinic; please confirm these with our reception team." },
  ];

  return (
    <>
      <Seo title="FAQs" description="Answers to common questions about booking, appointments and what to expect." path="/faqs" />
      <section className="bg-brand-50 py-16 sm:py-20">
        <div className="container-clinic">
          <SectionHeading eyebrow="FAQs" title="Frequently asked questions" description="Can't find what you're looking for? Get in touch and we'll be happy to help." />
        </div>
      </section>
      <section className="bg-sand-50 py-16 sm:py-24">
        <div className="container-clinic mx-auto max-w-3xl divide-y divide-brand-100 rounded-xl2 border border-brand-100 bg-white">
          {faqs.map((item) => (
            <details key={item.q} className="group p-6">
              <summary className="focus-ring flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg text-brand-950">
                {item.q}
                <ChevronRight className="h-5 w-5 shrink-0 text-brand-400 transition-transform group-open:rotate-90" />
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-brand-600">{item.a}</p>
            </details>
          ))}
        </div>
      </section>
      <FinalCta />
    </>
  );
}
