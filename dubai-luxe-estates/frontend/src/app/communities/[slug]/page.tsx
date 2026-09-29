import Image from "next/image";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import PropertyCard from "@/components/PropertyCard";
import { api } from "@/lib/api";
import { Property, PaginatedResponse } from "@/types";

const communityData: Record<string, { name: string; image: string; description: string; investment: string }> = {
  "dha-lahore": {
    name: "DHA Lahore",
    image: "/images/img28.jpg",
    description: "DHA Lahore is one of the city’s most established and desirable residential communities, known for secure living, premium road networks, and long-term value appreciation.",
    investment: "DHA Lahore remains a top choice for families and investors thanks to strong resale demand, premium amenities, and a reputation for quality development.",
  },
  "bahria-town-lahore": {
    name: "Bahria Town Lahore",
    image: "/images/img29.jpg",
    description: "Bahria Town Lahore offers a self-sustained urban lifestyle with parks, schools, healthcare, commercial zones, and a broad mix of residential properties.",
    investment: "Bahria Town remains one of the strongest options for long-term appreciation and rental demand in Lahore’s broader property market.",
  },
  "gulberg": {
    name: "Gulberg",
    image: "/images/img30.jpg",
    description: "Gulberg combines central access, premium retail spaces, and a wide range of homes, making it one of Lahore’s most recognizable neighbourhoods.",
    investment: "Gulberg properties are highly sought after for their lifestyle appeal, commercial proximity, and steady long-term value.",
  },
  "johar-town": {
    name: "Johar Town",
    image: "/images/img31.jpg",
    description: "Johar Town is a popular residential district offering excellent convenience, community amenities, and practical family-oriented living.",
    investment: "Johar Town continues to attract buyers and renters seeking value, accessibility, and community-focused surroundings.",
  },
  "lake-city": {
    name: "Lake City",
    image: "/images/img32.jpg",
    description: "Lake City offers a modern lifestyle with landscaped surroundings, premium villas, and a strong family-oriented residential focus.",
    investment: "Lake City stands out for its modern design appeal and strong demand among buyers seeking premium but well-connected residence options.",
  },
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = communityData[slug];
  return c ? { title: c.name, description: c.description } : { title: "Community Not Found" };
}

export default async function CommunityDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const community = communityData[slug];
  if (!community) return notFound();

  let properties: Property[] = [];
  try {
    const res = await api.get<PaginatedResponse<Property>>(`/properties?community=${encodeURIComponent(community.name)}&limit=6`);
    properties = res.data;
  } catch {
    properties = [];
  }

  return (
    <div className="pt-24">
      <section className="relative h-[50vh] min-h-[400px] w-full">
        <Image src={community.image} alt={community.name} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 to-ink/20" />
        <div className="container-luxury absolute bottom-12 left-0 right-0 text-ivory">
          <h1 className="font-display text-4xl font-bold md:text-5xl">{community.name}</h1>
        </div>
      </section>

      <section className="container-luxury section-padding grid grid-cols-1 gap-14 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="font-display text-2xl font-semibold text-ink">About the Community</h2>
          <p className="mt-4 leading-relaxed text-ink/60">{community.description}</p>
        </div>
        <div className="card-luxury p-6">
          <h3 className="font-display text-lg font-semibold text-ink">Investment Snapshot</h3>
          <p className="mt-3 text-sm leading-relaxed text-ink/60">{community.investment}</p>
        </div>
      </section>

      <section className="container-luxury pb-24">
        <h2 className="font-display text-2xl font-semibold text-ink">Available Properties in {community.name}</h2>
        {properties.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((p) => (
              <PropertyCard key={p._id} property={p} />
            ))}
          </div>
        ) : (
          <p className="mt-8 text-ink/50">No listings currently available in this community.</p>
        )}
      </section>
    </div>
  );
}
