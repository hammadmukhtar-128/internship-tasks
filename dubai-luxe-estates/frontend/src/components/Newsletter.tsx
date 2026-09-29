export default function Newsletter() {
  return (
    <section className="section-padding bg-ink text-ivory">
      <div className="container-luxury flex flex-col items-center gap-6 text-center">
        <span className="eyebrow text-gold-light">Stay Informed</span>
        <h2 className="max-w-xl font-display text-3xl font-bold md:text-4xl">
          Get New Listings &amp; Market Insights First
        </h2>
        <form className="flex w-full max-w-md overflow-hidden rounded-full border border-ivory/20">
          <input
            type="email"
            required
            placeholder="Enter your email"
            className="w-full bg-transparent px-5 py-4 text-sm text-ivory placeholder:text-ivory/40 focus:outline-none"
          />
          <button type="submit" className="bg-gold-gradient px-6 text-xs font-bold uppercase text-ink">
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}
