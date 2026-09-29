import Image from "next/image";

const gallery = ["/images/img16.jpg", "/images/img17.jpg", "/images/img18.jpg", "/images/img19.jpg", "/images/img20.jpg"];

export default function LifestyleSection() {
  return (
    <section className="section-padding bg-ivory">
      <div className="container-luxury">
        <div className="mb-14 max-w-2xl">
          <span className="eyebrow">Lahore Lifestyle</span>
          <h2 className="mt-3 font-display text-3xl font-bold text-ink md:text-4xl">
            Everyday Living, Elevated
          </h2>
          <p className="mt-4 text-ink/60">
            Green avenues, family-friendly communities, boutique cafés, upscale shopping, and secure neighbourhoods give Lahore an unmistakably premium urban rhythm.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          {gallery.map((img, i) => (
            <div key={img} className={`relative overflow-hidden rounded-2xl ${i === 0 ? "col-span-2 row-span-2 h-full" : "h-40 md:h-56"}`}>
              <Image src={img} alt="Lahore luxury lifestyle" fill className="object-cover transition-transform duration-700 hover:scale-110" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
