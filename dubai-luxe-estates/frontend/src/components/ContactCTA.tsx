import Link from "next/link";

export default function ContactCTA() {
  return (
    <section className="relative overflow-hidden bg-white py-24">
      <div className="container-luxury">
        <div className="rounded-3xl bg-gold-gradient p-12 text-center md:p-20">
          <h2 className="font-display text-3xl font-bold text-ink md:text-4xl">
            Ready to Find Your Dream Property?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-ink/70">
            Book a private consultation with one of our senior advisors and receive a curated shortlist within 24
            hours.
          </p>
          <Link href="/contact" className="btn-primary mt-8 inline-flex">
            Book Consultation
          </Link>
        </div>
      </div>
    </section>
  );
}
