import { MapPin, Phone, Clock, Navigation } from "lucide-react";
import SectionHeading from "../common/SectionHeading";
import Button from "../common/Button";

export default function LocationSection({ settings }) {
  return (
    <section className="bg-sand-50 py-20 sm:py-28">
      <div className="container-clinic">
        <SectionHeading eyebrow="Visit Us" title="Find our clinic" />
        <div className="mt-14 grid gap-8 overflow-hidden rounded-xl2 border border-brand-100 bg-white shadow-card lg:grid-cols-2">
          <div className="flex flex-col justify-center p-8 sm:p-12">
            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
                <div>
                  <p className="font-medium text-brand-950">Address</p>
                  <p className="text-sm text-brand-600">
                    {settings.address}, {settings.suburb} {settings.state} {settings.postcode}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
                <div>
                  <p className="font-medium text-brand-950">Phone</p>
                  <a href={`tel:${settings.phone.replace(/[^0-9+]/g, "")}`} className="text-sm text-brand-600 hover:text-brand-800">
                    {settings.phone}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
                <div>
                  <p className="font-medium text-brand-950">Opening Hours</p>
                  <ul className="mt-1 space-y-0.5 text-sm text-brand-600">
                    {settings.openingHours.map((h) => (
                      <li key={h.day}>
                        {h.day}: {h.hours}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            {settings.googleMapsUrl && (
              <Button href={settings.googleMapsUrl} target="_blank" rel="noopener noreferrer" variant="secondary" size="md" className="mt-8 w-fit">
                <Navigation className="h-4 w-4" /> Get Directions
              </Button>
            )}
          </div>
          <div className="min-h-[280px] bg-brand-100">
            {settings.googleMapsUrl ? (
              <iframe
                title="Clinic location map"
                className="h-full w-full min-h-[280px] border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps?q=${encodeURIComponent(
                  `${settings.address}, ${settings.suburb} ${settings.state} ${settings.postcode}`
                )}&output=embed`}
              />
            ) : (
              <div className="flex h-full min-h-[280px] items-center justify-center text-sm text-brand-500">
                Map unavailable — add a Google Maps URL in clinic settings.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
