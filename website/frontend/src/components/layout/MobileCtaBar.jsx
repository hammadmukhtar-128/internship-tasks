import { useLocation } from "react-router-dom";
import { Phone, CalendarCheck } from "lucide-react";
import Button from "../common/Button";
import { useSettings } from "../../context/SettingsContext";

export default function MobileCtaBar() {
  const location = useLocation();
  const settings = useSettings();
  if (location.pathname.startsWith("/admin")) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-2 border-t border-brand-100 bg-white/95 p-3 backdrop-blur lg:hidden">
      <a
        href={`tel:${settings.phone.replace(/[^0-9+]/g, "")}`}
        className="focus-ring flex flex-1 items-center justify-center gap-2 rounded-full border border-brand-200 py-3 text-sm font-medium text-brand-800"
      >
        <Phone className="h-4 w-4" /> Call Us
      </a>
      <Button to="/book-appointment" size="md" className="flex-1">
        <CalendarCheck className="h-4 w-4" /> Book Appointment
      </Button>
    </div>
  );
}
