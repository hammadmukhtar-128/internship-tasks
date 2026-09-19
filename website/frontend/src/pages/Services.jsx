import { useEffect, useState } from "react";
import Seo from "../components/common/Seo";
import SectionHeading from "../components/common/SectionHeading";
import ServiceCard from "../components/services/ServiceCard";
import FinalCta from "../components/home/FinalCta";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { getServices } from "../services/serviceService";

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getServices().then(({ items }) => {
      if (mounted) {
        setServices(items);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <>
      <Seo
        title="Our Services"
        description="Physiotherapy, chiropractic care and rehabilitation services tailored to you."
        path="/services"
      />
      <section className="bg-brand-50 py-16 sm:py-20">
        <div className="container-clinic">
          <SectionHeading
            eyebrow="Our Services"
            title="Physiotherapy & chiropractic care, tailored to you"
            description="Explore our full range of services below, or book an appointment directly with the practitioner best suited to your needs."
          />
        </div>
      </section>
      <section className="bg-sand-50 py-16 sm:py-24">
        <div className="container-clinic">
          {loading ? (
            <LoadingSpinner label="Loading services..." />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <ServiceCard key={service.slug} service={service} />
              ))}
            </div>
          )}
        </div>
      </section>
      <FinalCta />
    </>
  );
}
