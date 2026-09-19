import { useEffect, useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { ChevronRight, GraduationCap, Languages, Clock, User } from "lucide-react";
import Seo from "../components/common/Seo";
import Button from "../components/common/Button";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { getPractitionerById } from "../services/practitionerService";
import { getServices } from "../services/serviceService";

export default function PractitionerDetails() {
  const { slug } = useParams();
  const [practitioner, setPractitioner] = useState(null);
  const [theirServices, setTheirServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    Promise.all([getPractitionerById(slug), getServices()]).then(([p, all]) => {
      if (!mounted) return;
      if (!p) {
        setNotFound(true);
      } else {
        setPractitioner(p);
        setTheirServices(all.items.filter((s) => p.services?.includes(s.slug)));
      }
      setLoading(false);
    });
    return () => {
      mounted = false;
    };
  }, [slug]);

  if (notFound) return <Navigate to="/team" replace />;
  if (loading || !practitioner) return <LoadingSpinner label="Loading profile..." className="min-h-[50vh]" />;

  const initials = practitioner.name.split(" ").map((n) => n[0]).join("").slice(0, 2);

  return (
    <>
      <Seo title={practitioner.name} description={`${practitioner.name} — ${practitioner.specialization}. ${practitioner.shortBio}`} path={`/team/${practitioner.slug}`} />

      <nav aria-label="Breadcrumb" className="border-b border-brand-100 bg-white">
        <div className="container-clinic flex items-center gap-1.5 py-4 text-sm text-brand-500">
          <Link to="/" className="hover:text-brand-800">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link to="/team" className="hover:text-brand-800">Our Team</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-brand-800">{practitioner.name}</span>
        </div>
      </nav>

      <section className="bg-brand-50 py-16 sm:py-20">
        <div className="container-clinic grid gap-10 sm:grid-cols-[220px_1fr] sm:items-center">
          <div className="mx-auto flex h-40 w-40 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-800 font-display text-4xl text-white ring-8 ring-white sm:mx-0">
            {initials || <User className="h-10 w-10" />}
          </div>
          <div>
            <h1 className="font-display text-3xl text-brand-950 sm:text-4xl">{practitioner.name}</h1>
            <p className="mt-2 text-base font-medium text-brand-600">{practitioner.specialization}</p>
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-brand-600">
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-brand-500" /> {practitioner.experience}
              </span>
              <span className="flex items-center gap-1.5">
                <Languages className="h-4 w-4 text-brand-500" /> {practitioner.languages?.join(", ")}
              </span>
            </div>
            <Button to="/book-appointment" size="md" className="mt-6">
              Book Appointment
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="container-clinic grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="font-display text-2xl text-brand-950">Biography</h2>
            <p className="mt-3 leading-relaxed text-brand-700">{practitioner.bio}</p>
          </div>
          <aside className="space-y-8">
            <div className="rounded-xl2 border border-brand-100 bg-sand-50 p-7">
              <h3 className="flex items-center gap-2 font-display text-lg text-brand-950">
                <GraduationCap className="h-5 w-5 text-brand-600" /> Qualifications
              </h3>
              <ul className="mt-4 space-y-2 text-sm text-brand-700">
                {practitioner.qualifications?.map((q) => <li key={q}>{q}</li>)}
              </ul>
            </div>
            {theirServices.length > 0 && (
              <div className="rounded-xl2 border border-brand-100 bg-sand-50 p-7">
                <h3 className="font-display text-lg text-brand-950">Services offered</h3>
                <ul className="mt-4 space-y-2">
                  {theirServices.map((s) => (
                    <li key={s.slug}>
                      <Link to={`/services/${s.slug}`} className="text-sm font-medium text-brand-700 hover:text-brand-900">
                        {s.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </section>
    </>
  );
}
