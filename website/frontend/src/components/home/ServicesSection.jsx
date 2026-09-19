import SectionHeading from "../common/SectionHeading";
import ServiceCard from "../services/ServiceCard";
import Button from "../common/Button";

export default function ServicesSection({ services }) {
  return (
    <section className="bg-sand-50 py-20 sm:py-28">
      <div className="container-clinic">
        <SectionHeading
          eyebrow="What We Offer"
          title="Care built around your recovery"
          description="From acute injuries to long-term management, our team offers a full range of physiotherapy and chiropractic services."
        />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.slice(0, 8).map((service) => (
            <ServiceCard key={service.slug} service={service} compact />
          ))}
        </div>
        <div className="mt-12 flex justify-center">
          <Button to="/services" variant="secondary" size="lg">
            View All Services
          </Button>
        </div>
      </div>
    </section>
  );
}
