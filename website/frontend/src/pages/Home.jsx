import { useEffect, useState } from "react";
import Seo from "../components/common/Seo";
import Hero from "../components/home/Hero";
import TrustSection from "../components/home/TrustSection";
import ServicesSection from "../components/home/ServicesSection";
import WhyChooseUs from "../components/home/WhyChooseUs";
import HowItWorks from "../components/home/HowItWorks";
import AboutPreview from "../components/home/AboutPreview";
import Testimonials from "../components/home/Testimonials";
import LocationSection from "../components/home/LocationSection";
import FinalCta from "../components/home/FinalCta";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { getServices } from "../services/serviceService";
import { getTestimonials } from "../services/testimonialService";
import { useSettings } from "../context/SettingsContext";

export default function Home() {
  const settings = useSettings();
  const [services, setServices] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    Promise.all([getServices(), getTestimonials()]).then(([s, t]) => {
      if (!mounted) return;
      setServices(s.items);
      setTestimonials(t.items);
      setLoading(false);
    });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <>
      <Seo
        title="Home"
        description="Personalised physiotherapy and chiropractic care designed to help you recover, move confidently and get back to doing what you love."
        path="/"
      />
      <Hero />
      <TrustSection />
      {loading ? <LoadingSpinner label="Loading services..." /> : <ServicesSection services={services} />}
      <WhyChooseUs />
      <HowItWorks />
      <AboutPreview />
      {!loading && <Testimonials testimonials={testimonials} />}
      <LocationSection settings={settings} />
      <FinalCta />
    </>
  );
}
