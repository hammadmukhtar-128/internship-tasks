import SectionHeading from "../common/SectionHeading";
import { CalendarCheck, ClipboardList, ListChecks, TrendingUp } from "lucide-react";

const steps = [
  { icon: CalendarCheck, title: "Book Your Appointment", description: "Choose a service, practitioner and time that suits you, online in minutes." },
  { icon: ClipboardList, title: "Initial Assessment", description: "We assess your movement, history and goals to understand what's going on." },
  { icon: ListChecks, title: "Personalised Treatment Plan", description: "A plan built around your body, your goals and your day-to-day life." },
  { icon: TrendingUp, title: "Recovery & Progress", description: "Regular reviews to track progress and adjust your plan as you improve." },
];

export default function HowItWorks() {
  return (
    <section className="bg-brand-950 py-20 text-white sm:py-28">
      <div className="container-clinic">
        <SectionHeading eyebrow="How It Works" title="A clear path from first visit to recovery" light />
        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <div key={step.title} className="relative">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-brand-800 text-brand-100">
                <step.icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-brand-400">Step {i + 1}</p>
              <h3 className="font-display text-lg text-white">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-brand-300">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
