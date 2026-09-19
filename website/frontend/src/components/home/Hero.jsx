import { Star } from "lucide-react";
import Button from "../common/Button";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 via-sand-50 to-sand-50">
      <div className="container-clinic grid gap-10 py-14 sm:py-20 lg:grid-cols-2 lg:items-center lg:py-24">
        <div className="animate-fade-up opacity-0 [animation-delay:0.05s]">
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-medium text-brand-700 shadow-sm">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            4.9 Google Rating from our patients
          </span>
          <h1 className="mt-6 font-display text-4xl leading-[1.1] text-brand-950 sm:text-5xl lg:text-6xl">
            Move Better. Feel Stronger. Live Better.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-brand-700/90">
            Personalised physiotherapy and chiropractic care designed to help you recover,
            move confidently and get back to doing what you love.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button to="/book-appointment" size="lg">
              Book an Appointment
            </Button>
            <Button to="/services" variant="secondary" size="lg">
              Explore Our Services
            </Button>
          </div>
        </div>

        <div className="relative animate-fade-in opacity-0 [animation-delay:0.2s]">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-xl2 shadow-soft sm:max-w-lg">
            <img
              src="/images/clinic/hero-treatment.jpg"
              alt="A physiotherapist guiding a patient through a hands-on assessment in a bright treatment room"
              loading="eager"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -left-4 hidden rounded-2xl bg-white p-4 shadow-soft sm:block sm:-left-8">
            <p className="text-xs font-medium uppercase tracking-wide text-brand-400">
              Personalised Care
            </p>
            <p className="mt-1 font-display text-xl text-brand-900">One-on-one sessions</p>
          </div>
        </div>
      </div>
    </section>
  );
}
