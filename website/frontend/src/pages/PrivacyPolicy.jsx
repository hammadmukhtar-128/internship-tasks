import Seo from "../components/common/Seo";
import { useSettings } from "../context/SettingsContext";

export default function PrivacyPolicy() {
  const settings = useSettings();

  return (
    <section className="py-16 sm:py-20">
      <Seo title="Privacy Policy" description="How we collect, use and protect your information." path="/privacy-policy" />
      <div className="container-clinic mx-auto max-w-3xl">
        <h1 className="font-display text-3xl text-brand-950 sm:text-4xl">Privacy Policy</h1>
        <p className="mt-4 text-sm text-brand-500">Last updated: [add date]</p>

        <div className="prose prose-brand mt-8 max-w-none space-y-6 text-brand-700">
          <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            This is a template privacy policy provided for demonstration purposes. It is not
            legal advice and has not been reviewed against the Australian Privacy Act 1988 or
            the Australian Privacy Principles. Please have this content reviewed by a
            qualified professional before publishing it on a live website.
          </p>

          <h2 className="font-display text-xl text-brand-950">Information we collect</h2>
          <p>
            When you use our website to make a booking or contact us, we may collect your
            name, email address, phone number, and the details you choose to include in your
            message. We only ask for the minimum information needed to respond to your
            enquiry or confirm an appointment — we do not collect medical history, diagnoses
            or Medicare details through this website.
          </p>

          <h2 className="font-display text-xl text-brand-950">How we use your information</h2>
          <p>
            We use the information you provide to respond to enquiries, confirm and manage
            appointments, and improve our services. We do not sell your personal information
            to third parties.
          </p>

          <h2 className="font-display text-xl text-brand-950">Data storage and security</h2>
          <p>
            Information submitted through this website is stored securely and access is
            limited to authorised staff. As with any online system, no method of transmission
            or storage is completely secure, and we encourage you to avoid sending sensitive
            personal or medical information through the contact or booking forms.
          </p>

          <h2 className="font-display text-xl text-brand-950">Your rights</h2>
          <p>
            You may request access to, correction of, or deletion of the personal information
            we hold about you by contacting us at{" "}
            <a href={`mailto:${settings.email}`} className="text-brand-800 underline">{settings.email}</a>.
          </p>

          <h2 className="font-display text-xl text-brand-950">Contact us</h2>
          <p>
            If you have questions about this policy, please contact {settings.clinicName} at{" "}
            {settings.phone} or {settings.email}.
          </p>
        </div>
      </div>
    </section>
  );
}
