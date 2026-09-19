import StarRating from "../common/StarRating";
import SectionHeading from "../common/SectionHeading";
import { Quote } from "lucide-react";

export default function Testimonials({ testimonials }) {
  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="container-clinic">
        <SectionHeading
          eyebrow="Patient Testimonials"
          title="What our patients say"
          description="Demo testimonials shown below — replace with real patient feedback once available."
        />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.slice(0, 6).map((t, i) => (
            <figure key={t._id || i} className="flex flex-col rounded-xl2 border border-brand-100 bg-sand-50 p-7">
              <Quote className="h-6 w-6 text-brand-300" aria-hidden="true" />
              <StarRating rating={t.rating} className="mt-4" />
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-brand-700">
                &ldquo;{t.review}&rdquo;
              </blockquote>
              <figcaption className="mt-5 text-sm font-semibold text-brand-900">{t.patientName}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
