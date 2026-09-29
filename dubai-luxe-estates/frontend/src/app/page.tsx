import Hero from "@/components/Hero";
import SectionHeading from "@/components/SectionHeading";
import PropertyCard from "@/components/PropertyCard";
import CommunityCard from "@/components/CommunityCard";
import WhyChooseUs from "@/components/WhyChooseUs";
import InvestmentSection from "@/components/InvestmentSection";
import LifestyleSection from "@/components/LifestyleSection";
import Stats from "@/components/Stats";
import Testimonials from "@/components/Testimonials";
import AgentCard from "@/components/AgentCard";
import BlogCard from "@/components/BlogCard";
import FAQ from "@/components/FAQ";
import Newsletter from "@/components/Newsletter";
import ContactCTA from "@/components/ContactCTA";
import Link from "next/link";
import { api } from "@/lib/api";
import { Property, Agent, Blog, PaginatedResponse } from "@/types";
import { sampleProperties } from "@/lib/sampleProperties";

const communities = [
  { name: "DHA Lahore", image: "/images/img28.jpg", description: "Prestigious family living with secure communities and premium amenities." },
  { name: "Bahria Town Lahore", image: "/images/img29.jpg", description: "Planned residential living with schools, parks, and a modern urban lifestyle." },
  { name: "Gulberg", image: "/images/img30.jpg", description: "A vibrant commercial and residential hub near Lahore’s key destinations." },
  { name: "Johar Town", image: "/images/img31.jpg", description: "A growing residential neighbourhood known for convenience and family appeal." },
  { name: "Lake City", image: "/images/img32.jpg", description: "Modern villas and gated living in one of Lahore’s premium addresses." },
];

async function safe<T>(promise: Promise<T>, fallback: T): Promise<T> {
  try {
    return await promise;
  } catch {
    return fallback;
  }
}

export default async function HomePage() {
  const [featured, agents, blogs] = await Promise.all([
    safe(api.get<PaginatedResponse<Property>>("/properties?featured=true&limit=6"), {
      success: false,
      count: 0,
      total: 0,
      page: 1,
      pages: 1,
      data: [] as Property[],
    }),
    safe(api.get<{ data: Agent[] }>("/agents"), { data: [] as Agent[] }),
    safe(api.get<PaginatedResponse<Blog>>("/blogs?limit=3"), {
      success: false,
      count: 0,
      total: 0,
      page: 1,
      pages: 1,
      data: [] as Blog[],
    }),
  ]);
  const featuredProperties = featured.data.length > 0
    ? featured.data
    : sampleProperties.filter((property) => property.featured).slice(0, 6);

  return (
    <>
      <Hero />

      <section className="section-padding bg-white">
        <div className="container-luxury">
          <SectionHeading
            eyebrow="Featured Listings"
            title="Handpicked Properties"
            description="A curated selection of Lahore’s most desirable homes, refreshed weekly by our advisory team."
          />
          {featuredProperties.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {featuredProperties.map((p) => (
                <PropertyCard key={p._id} property={p} />
              ))}
            </div>
          ) : (
            <p className="text-center text-ink/50">
              No listings yet &mdash; connect the database and run the seed script to populate properties.
            </p>
          )}
          <div className="mt-14 text-center">
            <Link href="/properties" className="btn-outline">
              View All Properties
            </Link>
          </div>
        </div>
      </section>

      <section className="section-padding bg-ivory">
        <div className="container-luxury">
          <SectionHeading eyebrow="Communities" title="Explore Lahore’s Finest Addresses" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {communities.map((c) => (
              <CommunityCard key={c.name} {...c} />
            ))}
          </div>
        </div>
      </section>

      <WhyChooseUs />
      <InvestmentSection />
      <Stats />
      <LifestyleSection />
      <Testimonials />

      <section className="section-padding bg-white">
        <div className="container-luxury">
          <SectionHeading eyebrow="Our Advisors" title="Meet the Team Behind Every Transaction" />
          {agents.data.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {agents.data.map((a) => (
                <AgentCard key={a._id} agent={a} />
              ))}
            </div>
          ) : (
            <p className="text-center text-ink/50">Agent profiles will appear here once the database is seeded.</p>
          )}
        </div>
      </section>

      <section className="section-padding bg-ivory">
        <div className="container-luxury">
          <SectionHeading eyebrow="Insights" title="Latest From the Journal" />
          {blogs.data.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {blogs.data.map((b) => (
                <BlogCard key={b._id} blog={b} />
              ))}
            </div>
          ) : (
            <p className="text-center text-ink/50">Articles will appear here once the database is seeded.</p>
          )}
        </div>
      </section>

      <FAQ />
      <Newsletter />
      <ContactCTA />
    </>
  );
}
