import { Link, useLocation } from "react-router-dom";
import { Activity, Facebook, Instagram, MapPin, Phone, Mail } from "lucide-react";
import { NAV_LINKS } from "../../utils/constants";
import { useSettings } from "../../context/SettingsContext";

export default function Footer() {
  const settings = useSettings();
  const location = useLocation();
  const year = new Date().getFullYear();

  if (location.pathname.startsWith("/admin")) return null;

  return (
    <footer className="border-t border-brand-100 bg-brand-950 text-brand-100">
      <div className="container-clinic grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-white">
              <Activity className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="font-display text-lg text-white">{settings.clinicName}</span>
          </Link>
          <p className="mt-4 text-sm leading-relaxed text-brand-300">
            {settings.tagline}. Personalised, evidence-based care to help you move and feel
            your best.
          </p>
          <div className="mt-5 flex gap-3">
            {settings.facebook && (
              <a
                href={settings.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="focus-ring flex h-9 w-9 items-center justify-center rounded-full border border-brand-700 text-brand-200 hover:bg-brand-800"
              >
                <Facebook className="h-4 w-4" />
              </a>
            )}
            {settings.instagram && (
              <a
                href={settings.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="focus-ring flex h-9 w-9 items-center justify-center rounded-full border border-brand-700 text-brand-200 hover:bg-brand-800"
              >
                <Instagram className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>

        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-brand-300">
            Quick Links
          </p>
          <ul className="space-y-2.5 text-sm">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link to={link.href} className="text-brand-200 hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/book-appointment" className="text-brand-200 hover:text-white">
                Book Appointment
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-brand-300">
            Contact
          </p>
          <ul className="space-y-3 text-sm text-brand-200">
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
              <span>
                {settings.address}, {settings.suburb} {settings.state} {settings.postcode}
              </span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 shrink-0 text-brand-400" />
              <a href={`tel:${settings.phone.replace(/[^0-9+]/g, "")}`} className="hover:text-white">
                {settings.phone}
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 shrink-0 text-brand-400" />
              <a href={`mailto:${settings.email}`} className="hover:text-white">
                {settings.email}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-brand-300">
            Opening Hours
          </p>
          <ul className="space-y-2.5 text-sm text-brand-200">
            {settings.openingHours.map((h) => (
              <li key={h.day} className="flex justify-between gap-4">
                <span>{h.day}</span>
                <span className="text-brand-300">{h.hours}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-brand-800">
        <div className="container-clinic flex flex-col items-center justify-between gap-3 py-6 text-xs text-brand-400 sm:flex-row">
          <p>
            &copy; {year} {settings.clinicName}. All rights reserved.
          </p>
          <div className="flex gap-5">
            <Link to="/privacy-policy" className="hover:text-brand-200">
              Privacy Policy
            </Link>
            <Link to="/terms-conditions" className="hover:text-brand-200">
              Terms &amp; Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
