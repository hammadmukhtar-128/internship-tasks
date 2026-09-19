import Button from "../common/Button";

export default function FinalCta() {
  return (
    <section className="bg-brand-700 py-16 sm:py-20">
      <div className="container-clinic flex flex-col items-center gap-6 text-center">
        <h2 className="max-w-xl font-display text-3xl leading-tight text-white sm:text-4xl">
          Ready to take the next step?
        </h2>
        <p className="max-w-xl text-base leading-relaxed text-brand-100 sm:text-lg">
          Book your appointment today and start working towards better movement and
          long-term wellbeing.
        </p>
        <Button to="/book-appointment" variant="secondary" size="lg">
          Book an Appointment
        </Button>
      </div>
    </section>
  );
}
