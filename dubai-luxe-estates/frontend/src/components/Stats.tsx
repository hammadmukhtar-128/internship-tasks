const stats = [
  { value: "2,400+", label: "Properties Sold" },
  { value: "PKR 8.2B+", label: "Transaction Volume" },
  { value: "18", label: "Years of Excellence" },
  { value: "97%", label: "Client Satisfaction" },
];

export default function Stats() {
  return (
    <section className="bg-ink py-16 text-ivory">
      <div className="container-luxury grid grid-cols-2 gap-8 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <p className="font-display text-3xl font-bold gold-text md:text-4xl">{s.value}</p>
            <p className="mt-2 text-xs uppercase tracking-wider text-ivory/60">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
