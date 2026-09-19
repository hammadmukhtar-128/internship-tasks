import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X, Phone, Activity } from "lucide-react";
import { NAV_LINKS } from "../../utils/constants";
import Button from "../common/Button";
import { cn } from "../../utils/cn";
import { useSettings } from "../../context/SettingsContext";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const settings = useSettings();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  if (location.pathname.startsWith("/admin")) return null;

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled ? "bg-white/95 shadow-card backdrop-blur" : "bg-white/70 backdrop-blur-sm"
      )}
    >
      <div className="container-clinic flex h-18 items-center justify-between py-3">
        <Link to="/" className="flex items-center gap-2 focus-ring rounded-lg">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-700 text-white">
            <Activity className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="font-display text-lg leading-none text-brand-950 sm:text-xl">
            {settings.clinicName}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              end={link.href === "/"}
              className={({ isActive }) =>
                cn(
                  "focus-ring rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  isActive ? "bg-brand-50 text-brand-800" : "text-brand-700 hover:bg-brand-50"
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={`tel:${settings.phone.replace(/[^0-9+]/g, "")}`}
            className="focus-ring flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-brand-700 hover:bg-brand-50"
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            {settings.phone}
          </a>
          <Button to="/book-appointment" size="md">
            Book Appointment
          </Button>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="focus-ring rounded-lg p-2 text-brand-800 lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-brand-100 bg-white px-5 pb-6 pt-2 lg:hidden">
          <nav className="flex flex-col gap-1" aria-label="Mobile">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                end={link.href === "/"}
                className={({ isActive }) =>
                  cn(
                    "focus-ring rounded-lg px-3 py-3 text-base font-medium",
                    isActive ? "bg-brand-50 text-brand-800" : "text-brand-800 hover:bg-brand-50"
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-4 flex flex-col gap-3">
            <a
              href={`tel:${settings.phone.replace(/[^0-9+]/g, "")}`}
              className="focus-ring flex items-center justify-center gap-2 rounded-full border border-brand-200 px-4 py-3 text-sm font-medium text-brand-800"
            >
              <Phone className="h-4 w-4" /> Call {settings.phone}
            </a>
            <Button to="/book-appointment" size="md" className="w-full">
              Book Appointment
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
