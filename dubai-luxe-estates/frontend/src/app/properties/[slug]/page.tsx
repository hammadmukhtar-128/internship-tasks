import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { HiOutlineLocationMarker, HiOutlineShare, HiOutlineHeart, HiOutlineScale } from "react-icons/hi";
import { BiBed, BiBath, BiArea } from "react-icons/bi";
import { FaWhatsapp } from "react-icons/fa";
import { api, formatPrice } from "@/lib/api";
import { Property } from "@/types";
import PropertyCard from "@/components/PropertyCard";
import InquiryForm from "@/components/InquiryForm";
import MortgageCalculator from "@/components/MortgageCalculator";
import { sampleProperties } from "@/lib/sampleProperties";

async function getProperty(slug: string) {
  try {
    const result = await api.get<{ data: Property; related: Property[] }>(`/properties/slug/${slug}`);
    if (result.data) return result;
  } catch {
    const property = sampleProperties.find((item) => item.slug === slug);
    if (!property) return null;
    return {
      data: property,
      related: sampleProperties.filter((item) => item.community === property.community && item.slug !== slug),
    };
  }
  return null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const result = await getProperty(slug);
  if (!result) return { title: "Property Not Found" };
  return {
    title: result.data.title,
    description: result.data.description.slice(0, 155),
    openGraph: { images: result.data.images },
  };
}

export default async function PropertyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = await getProperty(slug);
  if (!result) return notFound();

  const { data: property, related } = result;

  return (
    <div className="pt-28">
      <section className="container-luxury">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-4 md:grid-rows-2">
          <div className="relative h-72 overflow-hidden rounded-2xl md:col-span-2 md:row-span-2 md:h-full">
            <Image src={property.images[0]} alt={property.title} fill className="object-cover" priority />
          </div>
          {property.images.slice(1, 3).map((img, i) => (
            <div key={i} className="relative hidden h-full overflow-hidden rounded-2xl md:block">
              <Image src={img} alt={`${property.title} ${i + 2}`} fill className="object-cover" />
            </div>
          ))}
        </div>
      </section>

      <section className="container-luxury mt-12 grid grid-cols-1 gap-14 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <span className="eyebrow">{property.community}</span>
              <h1 className="mt-2 font-display text-3xl font-bold text-ink md:text-4xl">{property.title}</h1>
              <p className="mt-2 flex items-center gap-1.5 text-ink/60">
                <HiOutlineLocationMarker /> {property.location}
              </p>
            </div>
            <div className="text-right">
              <p className="font-display text-3xl font-bold text-gold-dark">
                {formatPrice(property.price, property.currency)}
              </p>
              <p className="text-xs uppercase tracking-wider text-ink/50">For {property.purpose}</p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button className="btn-outline text-xs"><HiOutlineHeart /> Save</button>
            <button className="btn-outline text-xs"><HiOutlineScale /> Compare</button>
            <button className="btn-outline text-xs"><HiOutlineShare /> Share</button>
          </div>

          <div className="card-luxury mt-8 grid grid-cols-3 divide-x divide-ink/5 p-6 text-center">
            <div>
              <BiBed className="mx-auto text-2xl text-gold-dark" />
              <p className="mt-2 font-semibold text-ink">{property.bedrooms}</p>
              <p className="text-xs text-ink/50">Bedrooms</p>
            </div>
            <div>
              <BiBath className="mx-auto text-2xl text-gold-dark" />
              <p className="mt-2 font-semibold text-ink">{property.bathrooms}</p>
              <p className="text-xs text-ink/50">Bathrooms</p>
            </div>
            <div>
              <BiArea className="mx-auto text-2xl text-gold-dark" />
              <p className="mt-2 font-semibold text-ink">{property.area.toLocaleString()}</p>
              <p className="text-xs text-ink/50">Sqft</p>
            </div>
          </div>

          <div className="mt-10">
            <h2 className="font-display text-2xl font-semibold text-ink">Overview</h2>
            <p className="mt-4 leading-relaxed text-ink/60">{property.description}</p>
          </div>

          <div className="mt-10">
            <h2 className="font-display text-2xl font-semibold text-ink">Amenities</h2>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {property.amenities.map((a) => (
                <span key={a} className="rounded-lg bg-ivory px-4 py-3 text-sm text-ink/70">
                  {a}
                </span>
              ))}
            </div>
          </div>

          {property.floorPlanImage && (
            <div className="mt-10">
              <h2 className="font-display text-2xl font-semibold text-ink">Floor Plan</h2>
              <div className="relative mt-4 h-96 overflow-hidden rounded-2xl border border-ink/10">
                <Image src={property.floorPlanImage} alt="Floor plan" fill className="object-cover" />
              </div>
            </div>
          )}

          <div className="mt-10">
            <h2 className="font-display text-2xl font-semibold text-ink">Location</h2>
            <div className="mt-4 flex h-80 items-center justify-center rounded-2xl bg-ivory text-ink/40">
              Google Map Placeholder &mdash; {property.location}
            </div>
            {property.nearby && (
              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
                <div>
                  <h4 className="text-sm font-semibold text-ink">Nearby Schools</h4>
                  <ul className="mt-2 space-y-1 text-sm text-ink/60">
                    {property.nearby.schools.map((s) => <li key={s}>{s}</li>)}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-ink">Nearby Hospitals</h4>
                  <ul className="mt-2 space-y-1 text-sm text-ink/60">
                    {property.nearby.hospitals.map((s) => <li key={s}>{s}</li>)}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-ink">Nearby Metro</h4>
                  <ul className="mt-2 space-y-1 text-sm text-ink/60">
                    {property.nearby.metro.map((s) => <li key={s}>{s}</li>)}
                  </ul>
                </div>
              </div>
            )}
          </div>

          <MortgageCalculator price={property.price} />
        </div>

        <aside className="space-y-8">
          {property.agent && (
            <div className="card-luxury p-6">
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-16 overflow-hidden rounded-full">
                  <Image src={property.agent.image} alt={property.agent.name} fill className="object-cover" />
                </div>
                <div>
                  <p className="font-semibold text-ink">{property.agent.name}</p>
                  <p className="text-xs text-ink/50">{property.agent.designation}</p>
                </div>
              </div>
              <div className="mt-5 flex gap-3">
                <a href={`https://wa.me/${property.agent.whatsapp}`} className="btn-gold flex-1 text-xs">
                  <FaWhatsapp /> WhatsApp
                </a>
                <a href={`tel:${property.agent.phone}`} className="btn-outline flex-1 text-xs">
                  Call
                </a>
              </div>
            </div>
          )}

          <div className="card-luxury p-6">
            <h3 className="font-display text-lg font-semibold text-ink">Book a Viewing</h3>
            <InquiryForm propertyId={property._id} />
          </div>
        </aside>
      </section>

      {related.length > 0 && (
        <section className="section-padding container-luxury">
          <h2 className="font-display text-2xl font-semibold text-ink">Related Properties</h2>
          <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <PropertyCard key={p._id} property={p} />
            ))}
          </div>
        </section>
      )}

      <div className="pb-24 text-center">
        <Link href="/properties" className="btn-outline">
          &larr; Back to All Properties
        </Link>
      </div>
    </div>
  );
}
