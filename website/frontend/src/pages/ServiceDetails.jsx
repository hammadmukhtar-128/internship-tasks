import { useEffect, useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { ChevronRight, CheckCircle2, Phone, CalendarCheck } from "lucide-react";
import Seo from "../components/common/Seo";
import Button from "../components/common/Button";
import ServiceCard from "../components/services/ServiceCard";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { getServiceBySlug, getServices } from "../services/serviceService";
import { useSettings } from "../context/SettingsContext";

const faqItems = [
  {
    q: "Do I need a referral?",
    a: "In most cases you don't need a referral to see a physiotherapist or chiropractor — you can book directly. If you're being treated under a specific scheme (such as an insurer or workplace claim), check with us beforehand.",
  },
  {
    q: "What should I bring to my appointment?",
    a: "Comfortable clothing you can move in, any relevant scan or referral letters you have, and a list of current medications is helpful, though not essential.",
  },
  {
    q: "How many sessions will I need?",
    a: "This varies from person to person. Your practitioner will give you an estimate after your initial assessment and review this as your treatment progresses.",
  },
];

export default function ServiceDetails() {
  const { slug } = useParams();
  const settings = useSettings();
  const [service, setService] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    Promise.all([getServiceBySlug(slug), getServices()]).then(([svc, all]) => {
      if (!mounted) return;
      if (!svc) {
        setNotFound(true);
      } else {
        setService(svc);
        setRelated(all.items.filter((s) => s.slug !== slug).slice(0, 3));
      }
      setLoading(false);
    });
    return () => {
      mounted = false;
    };
  }, [slug]);

  if (notFound) return <Navigate to="/services" replace />;
  if (loading || !service) return <LoadingSpinner label="Loading service..." className="min-h-[50vh]" />;

  return (
    <>
      <Seo title={service.name} description={service.shortDescription} path={`/services/${service.slug}`} />

      <nav aria-label="Breadcrumb" className="border-b border-brand-100 bg-white">
        <div className="container-clinic flex items-center gap-1.5 py-4 text-sm text-brand-500">
          <Link to="/" className="hover:text-brand-800">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link to="/services" className="hover:text-brand-800">Services</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-brand-800">{service.name}</span>
        </div>
      </nav>

      <section className="relative">
        <div className="relative h-[320px] w-full overflow-hidden sm:h-[420px]">
          <img src={service.image} alt={`${service.name} session in progress`} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-950/70 via-brand-950/20 to-transparent" />
        </div>
        <div className="container-clinic">
          <div className="relative -mt-20 rounded-xl2 bg-white p-8 shadow-soft sm:-mt-24 sm:p-10">
            <h1 className="font-display text-3xl text-brand-950 sm:text-4xl">{service.name}</h1>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-brand-700/90">{service.description}</p>
            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-brand-600">
              <span><strong className="text-brand-900">Duration:</strong> {service.duration}</span>
              <span className="h-1 w-1 rounded-full bg-brand-300" />
              <span><strong className="text-brand-900">Price:</strong> {service.price}</span>
            </div>
            <div className="mt-7 flex flex-wrap gap-4">
              <Button to="/book-appointment" size="md">
                <CalendarCheck className="h-4 w-4" /> Book Appointment
              </Button>
              <Button href={`tel:${settings.phone.replace(/[^0-9+]/g, "")}`} variant="secondary" size="md">
                <Phone className="h-4 w-4" /> Call Us
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="container-clinic grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="font-display text-2xl text-brand-950">Who this service is for</h2>
            <p className="mt-3 leading-relaxed text-brand-700">
              This service suits people experiencing pain, stiffness or reduced movement
              related to this area, as well as those wanting to build strength and prevent
              future issues. Your practitioner will confirm whether it&rsquo;s the right fit during
              your initial assessment.
            </p>

            <h2 className="mt-10 font-display text-2xl text-brand-950">How treatment works</h2>
            <p className="mt-3 leading-relaxed text-brand-700">
              Every plan starts with a thorough assessment of your movement, history and goals.
              From there, your practitioner combines hands-on techniques with a tailored
              exercise plan, adjusting your treatment as you progress.
            </p>

            <h2 className="mt-10 font-display text-2xl text-brand-950">What to expect</h2>
            <p className="mt-3 leading-relaxed text-brand-700">{service.whatToExpect}</p>

            <h2 className="mt-10 font-display text-2xl text-brand-950">Frequently asked questions</h2>
            <div className="mt-4 divide-y divide-brand-100 rounded-xl2 border border-brand-100 bg-white">
              {faqItems.map((item) => (
                <details key={item.q} className="group p-5">
                  <summary className="focus-ring flex cursor-pointer list-none items-center justify-between font-medium text-brand-900">
                    {item.q}
                    <ChevronRight className="h-4 w-4 shrink-0 text-brand-400 transition-transform group-open:rotate-90" />
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-brand-600">{item.a}</p>
                </details>
              ))}
            </div>

            <p className="mt-8 rounded-xl border border-brand-100 bg-brand-50 p-4 text-xs leading-relaxed text-brand-600">
              This information is general in nature and does not replace individual medical
              advice. We do not guarantee specific outcomes — your practitioner will discuss
              what to realistically expect based on your individual assessment.
            </p>
          </div>

          <aside>
            <div className="rounded-xl2 border border-brand-100 bg-sand-50 p-7">
              <h3 className="font-display text-lg text-brand-950">Benefits</h3>
              <ul className="mt-4 space-y-3">
                {service.benefits?.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-2.5 text-sm text-brand-700">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                    {benefit}
                  </li>
                ))}
              </ul>
              <Button to="/book-appointment" size="md" className="mt-6 w-full">
                Book This Service
              </Button>
            </div>
          </aside>
        </div>
      </section>

      {related.length > 0 && (
        <section className="bg-white py-16 sm:py-20">
          <div className="container-clinic">
            <h2 className="font-display text-2xl text-brand-950">Related services</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((s) => (
                <ServiceCard key={s.slug} service={s} compact />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
