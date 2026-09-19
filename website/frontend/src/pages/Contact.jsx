import { MapPin, Phone, Mail, Clock, PhoneCall } from "lucide-react";
import Seo from "../components/common/Seo";
import SectionHeading from "../components/common/SectionHeading";
import ContactForm from "../components/booking/ContactForm";
import Button from "../components/common/Button";
import { useSettings } from "../context/SettingsContext";

export default function Contact() {
  const settings = useSettings();

  return (
    <>
      <Seo title="Contact Us" description={`Get in touch with ${settings.clinicName}.`} path="/contact" />

      <section className="bg-brand-50 py-16 sm:py-20">
        <div className="container-clinic">
          <SectionHeading eyebrow="Contact Us" title="We'd love to hear from you" description="Have a question before booking? Send us a message or give us a call." />
        </div>
      </section>

      <section className="bg-sand-50 py-16 sm:py-24">
        <div className="container-clinic grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div className="space-y-6">
            <div className="rounded-xl2 border border-brand-100 bg-white p-7">
              <div className="space-y-5 text-sm">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
                  <div>
                    <p className="font-medium text-brand-950">Address</p>
                    <p className="text-brand-600">
                      {settings.address}, {settings.suburb} {settings.state} {settings.postcode}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
                  <div>
                    <p className="font-medium text-brand-950">Phone</p>
                    <a href={`tel:${settings.phone.replace(/[^0-9+]/g, "")}`} className="text-brand-600 hover:text-brand-800">
                      {settings.phone}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
                  <div>
                    <p className="font-medium text-brand-950">Email</p>
                    <a href={`mailto:${settings.email}`} className="text-brand-600 hover:text-brand-800">
                      {settings.email}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
                  <div>
                    <p className="font-medium text-brand-950">Opening Hours</p>
                    <ul className="mt-1 space-y-0.5 text-brand-600">
                      {settings.openingHours.map((h) => (
                        <li key={h.day}>{h.day}: {h.hours}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <Button href={`tel:${settings.phone.replace(/[^0-9+]/g, "")}`} variant="secondary" size="md" className="mt-6 w-full">
                <PhoneCall className="h-4 w-4" /> Call Us
              </Button>
            </div>
            {settings.googleMapsUrl && (
              <div className="overflow-hidden rounded-xl2 border border-brand-100">
                <iframe
                  title="Clinic location map"
                  className="h-64 w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.google.com/maps?q=${encodeURIComponent(
                    `${settings.address}, ${settings.suburb} ${settings.state} ${settings.postcode}`
                  )}&output=embed`}
                />
              </div>
            )}
          </div>

          <ContactForm />
        </div>
      </section>
    </>
  );
}
