import { useEffect, useState } from "react";
import Seo from "../components/common/Seo";
import BookingWizard from "../components/booking/BookingWizard";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { getServices } from "../services/serviceService";
import { getPractitioners } from "../services/practitionerService";

export default function BookAppointment() {
  const [services, setServices] = useState([]);
  const [practitioners, setPractitioners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    Promise.all([getServices(), getPractitioners()]).then(([s, p]) => {
      if (!mounted) return;
      setServices(s.items);
      setPractitioners(p.items);
      setLoading(false);
    });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="bg-sand-50 py-14 sm:py-20">
      <Seo title="Book an Appointment" description="Book a physiotherapy or chiropractic appointment online." path="/book-appointment" />
      <div className="container-clinic">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-brand-500">Book an Appointment</p>
          <h1 className="font-display text-3xl text-brand-950 sm:text-4xl">Let&rsquo;s get you booked in</h1>
          <p className="mt-4 text-base leading-relaxed text-brand-700/90">
            Tell us a little about what you need and we&rsquo;ll confirm your appointment shortly
            after you submit this form.
          </p>
        </div>
        <div className="mx-auto mt-10 max-w-3xl">
          {loading ? <LoadingSpinner label="Loading booking form..." /> : <BookingWizard services={services} practitioners={practitioners} />}
        </div>
      </div>
    </section>
  );
}
