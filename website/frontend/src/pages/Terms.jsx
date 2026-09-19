import Seo from "../components/common/Seo";
import { useSettings } from "../context/SettingsContext";

export default function Terms() {
  const settings = useSettings();

  return (
    <section className="py-16 sm:py-20">
      <Seo title="Terms & Conditions" description="The terms that apply to using our website and booking an appointment." path="/terms-conditions" />
      <div className="container-clinic mx-auto max-w-3xl">
        <h1 className="font-display text-3xl text-brand-950 sm:text-4xl">Terms &amp; Conditions</h1>
        <p className="mt-4 text-sm text-brand-500">Last updated: [add date]</p>

        <div className="prose prose-brand mt-8 max-w-none space-y-6 text-brand-700">
          <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            This is a template terms &amp; conditions page provided for demonstration
            purposes. It is not legal advice. Please have this content reviewed by a
            qualified professional before publishing it on a live website.
          </p>

          <h2 className="font-display text-xl text-brand-950">Use of this website</h2>
          <p>
            This website provides general information about {settings.clinicName} and allows
            you to request an appointment or contact our team. Submitting a booking request
            through this website does not guarantee an appointment time — our team will
            contact you to confirm.
          </p>

          <h2 className="font-display text-xl text-brand-950">No medical advice</h2>
          <p>
            Content on this website is general in nature and does not constitute individual
            medical advice. It should not be used as a substitute for consultation with a
            qualified healthcare professional. {settings.emergencyMessage}
          </p>

          <h2 className="font-display text-xl text-brand-950">Appointments and cancellations</h2>
          <p>
            Appointment times requested through this website are subject to confirmation.
            Cancellation policies, fees and rescheduling terms are set by the clinic — please
            confirm current policies with our reception team.
          </p>

          <h2 className="font-display text-xl text-brand-950">Limitation of liability</h2>
          <p>
            To the extent permitted by law, {settings.clinicName} is not liable for any loss
            or damage arising from your use of this website, including reliance on general
            information provided on it.
          </p>

          <h2 className="font-display text-xl text-brand-950">Contact us</h2>
          <p>Questions about these terms can be directed to {settings.email} or {settings.phone}.</p>
        </div>
      </div>
    </section>
  );
}
