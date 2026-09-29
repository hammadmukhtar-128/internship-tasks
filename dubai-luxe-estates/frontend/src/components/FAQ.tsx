"use client";

import { useState } from "react";
import { HiChevronDown } from "react-icons/hi";
import SectionHeading from "./SectionHeading";

const faqs = [
  {
    q: "What are the best neighbourhoods to buy property in Lahore?",
    a: "DHA Lahore, Bahria Town Lahore, Gulberg, Model Town, and Lake City are among the most sought-after residential communities for families and investors.",
  },
  {
    q: "Can I rent a property in Lahore without visiting in person?",
    a: "Yes. We can arrange virtual tours, document review, and guided shortlisting to help you find the right rental property from anywhere.",
  },
  {
    q: "Are there recurring costs after purchase?",
    a: "Most properties may require maintenance, security, or society charges depending on the neighbourhood and property type. We outline the total cost before you commit.",
  },
  {
    q: "Which Lahore areas are best for investment?",
    a: "DHA Lahore, Bahria Town Lahore, Gulberg, Johar Town, and Lake City remain popular for long-term value, rental demand, and lifestyle convenience.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="section-padding bg-ivory">
      <div className="container-luxury max-w-3xl">
        <SectionHeading eyebrow="FAQs" title="Frequently Asked Questions" />
        <div className="space-y-4">
          {faqs.map((f, i) => (
            <div key={f.q} className="card-luxury overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="flex w-full items-center justify-between p-6 text-left"
              >
                <span className="font-medium text-ink">{f.q}</span>
                <HiChevronDown
                  className={`shrink-0 text-xl text-gold-dark transition-transform ${openIndex === i ? "rotate-180" : ""}`}
                />
              </button>
              {openIndex === i && <p className="px-6 pb-6 text-sm leading-relaxed text-ink/60">{f.a}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
