import { Metadata } from "next";
import { HiOutlineLocationMarker, HiOutlinePhone, HiOutlineMail, HiOutlineClock } from "react-icons/hi";
import InquiryForm from "@/components/InquiryForm";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Lahore Estate Hub to book a consultation or start your Lahore property search.",
};

const info = [
  { icon: HiOutlineLocationMarker, label: "Office", value: "Gulberg Main Boulevard, Lahore, Pakistan" },
  { icon: HiOutlinePhone, label: "Phone", value: "+92 300 1234567" },
  { icon: HiOutlineMail, label: "Email", value: "hello@lahoreestatehub.com" },
  { icon: HiOutlineClock, label: "Business Hours", value: "Mon-Sat: 9am-7pm" },
];

export default function ContactPage() {
  return (
    <div className="pt-32">
      <section className="container-luxury pb-14 text-center">
        <span className="eyebrow">Get in Touch</span>
        <h1 className="mt-3 font-display text-4xl font-bold text-ink">Contact Lahore Estate Hub</h1>
        <p className="mx-auto mt-3 max-w-xl text-ink/60">
          Whether you're buying, renting, or exploring investment opportunities, our advisors are here to help across Lahore.
        </p>
      </section>

      <section className="container-luxury grid grid-cols-1 gap-14 pb-24 lg:grid-cols-2">
        <div>
          <div className="flex h-80 items-center justify-center rounded-2xl bg-ivory text-ink/40">
            Lahore City Map &mdash; Gulberg, Lahore
          </div>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {info.map((i) => (
              <div key={i.label} className="flex gap-4">
                <i.icon className="mt-1 shrink-0 text-2xl text-gold-dark" />
                <div>
                  <h4 className="text-sm font-semibold text-ink">{i.label}</h4>
                  <p className="mt-1 text-sm text-ink/60">{i.value}</p>
                </div>
              </div>
            ))}
          </div>
          <a
            href="https://wa.me/923001234567"
            className="btn-gold mt-8 inline-flex"
          >
            Chat With Us on WhatsApp
          </a>
        </div>

        <div className="card-luxury p-8">
          <h2 className="font-display text-2xl font-semibold text-ink">Send Us a Message</h2>
          <InquiryForm />
        </div>
      </section>
    </div>
  );
}
