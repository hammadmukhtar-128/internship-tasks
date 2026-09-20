import { useEffect, useState } from "react";
import { CalendarCheck, Check, X } from "lucide-react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import MobileCtaBar from "./components/layout/MobileCtaBar";
import Button from "./components/common/Button";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import AdminLayout from "./components/admin/AdminLayout";

import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import ServiceDetails from "./pages/ServiceDetails";
import Team from "./pages/Team";
import PractitionerDetails from "./pages/PractitionerDetails";
import BookAppointment from "./pages/BookAppointment";
import Contact from "./pages/Contact";
import FAQs from "./pages/FAQs";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";

import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminAppointments from "./pages/admin/Appointments";
import AdminServices from "./pages/admin/Services";
import AdminPractitioners from "./pages/admin/Practitioners";
import AdminTestimonials from "./pages/admin/Testimonials";
import AdminMessages from "./pages/admin/Messages";
import AdminSettings from "./pages/admin/Settings";

export default function App() {
  const location = useLocation();
  const [showCookiePrompt, setShowCookiePrompt] = useState(false);
  const [showBookingPrompt, setShowBookingPrompt] = useState(false);
  const isAdmin = location.pathname.startsWith("/admin");
  const isBookingPage = location.pathname === "/book-appointment";

  useEffect(() => {
    if (isAdmin || window.localStorage.getItem("clinic-cookie-consent")) return undefined;

    const timer = window.setTimeout(() => setShowCookiePrompt(true), 5000);
    return () => window.clearTimeout(timer);
  }, [isAdmin]);

  useEffect(() => {
    if (isAdmin || isBookingPage) return undefined;

    const timer = window.setTimeout(() => setShowBookingPrompt(true), 15000);
    return () => window.clearTimeout(timer);
  }, [isAdmin, isBookingPage]);

  const acceptCookies = () => {
    window.localStorage.setItem("clinic-cookie-consent", "accepted");
    setShowCookiePrompt(false);
  };

  return (
    <>
      <Navbar />
      <main className="pb-20 lg:pb-0">
        <Routes>
          {/* Public site */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:slug" element={<ServiceDetails />} />
          <Route path="/team" element={<Team />} />
          <Route path="/team/:slug" element={<PractitionerDetails />} />
          <Route path="/book-appointment" element={<BookAppointment />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faqs" element={<FAQs />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-conditions" element={<Terms />} />

          {/* Admin */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/appointments" element={<AdminAppointments />} />
              <Route path="/admin/services" element={<AdminServices />} />
              <Route path="/admin/practitioners" element={<AdminPractitioners />} />
              <Route path="/admin/testimonials" element={<AdminTestimonials />} />
              <Route path="/admin/messages" element={<AdminMessages />} />
              <Route path="/admin/settings" element={<AdminSettings />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <MobileCtaBar />

      {!isAdmin && showCookiePrompt && (
        <div className="fixed inset-x-4 bottom-24 z-[60] mx-auto max-w-lg rounded-2xl border border-brand-100 bg-white p-5 shadow-2xl sm:inset-x-auto sm:bottom-8 sm:right-8">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700">
              <Check className="h-5 w-5" aria-hidden="true" />
            </div>
            <div className="flex-1">
              <h2 className="font-display text-xl text-brand-950">We value your privacy</h2>
              <p className="mt-1 text-sm leading-6 text-brand-700">
                We use cookies to keep this website working smoothly and improve your experience.
              </p>
              <button
                type="button"
                onClick={acceptCookies}
                className="focus-ring mt-4 rounded-full bg-brand-700 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-800"
              >
                Accept all cookies
              </button>
            </div>
            <button
              type="button"
              onClick={() => setShowCookiePrompt(false)}
              className="focus-ring rounded-full p-1 text-brand-500 hover:bg-brand-50"
              aria-label="Close cookie notice"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}

      {!isAdmin && !isBookingPage && showBookingPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-950/45 px-5 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-2xl">
            <button
              type="button"
              onClick={() => setShowBookingPrompt(false)}
              className="focus-ring absolute right-4 top-4 rounded-full p-2 text-brand-500 hover:bg-brand-50"
              aria-label="Close appointment prompt"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand-700">
              <CalendarCheck className="h-7 w-7" aria-hidden="true" />
            </div>
            <h2 className="mt-5 font-display text-3xl text-brand-950">Ready to feel your best?</h2>
            <p className="mt-2 text-brand-700">Take the next step with personalised care from our team.</p>
            <Button to="/book-appointment" size="lg" className="mt-6 w-full">
              Book an Appointment
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
