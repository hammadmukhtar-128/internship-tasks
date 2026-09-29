import { Metadata } from "next";
import PropertyCard from "@/components/PropertyCard";
import { api } from "@/lib/api";
import { Property, PaginatedResponse } from "@/types";
import Link from "next/link";
import { getSampleProperties } from "@/lib/sampleProperties";

export const metadata: Metadata = {
  title: "Properties for Sale & Rent in Lahore",
  description: "Browse houses, apartments, villas, plots, and commercial spaces across Lahore’s most desirable neighbourhoods.",
};

async function getProperties(searchParams: Record<string, string | undefined>) {
  const params = new URLSearchParams();
  Object.entries(searchParams).forEach(([k, v]) => {
    if (v) params.set(k, v);
  });
  try {
    return await api.get<PaginatedResponse<Property>>(`/properties?${params.toString()}`);
  } catch {
    return { success: false, count: 0, total: 0, page: 1, pages: 1, data: [] as Property[] };
  }
}

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const apiResult = await getProperties(sp);
  const result = apiResult.data.length > 0 ? apiResult : getSampleProperties(sp);

  const filterFields: { name: string; label: string; options?: string[] }[] = [
    { name: "purpose", label: "Purpose", options: ["Buy", "Rent"] },
    { name: "propertyType", label: "Type", options: ["House", "Apartment", "Villa", "Plot", "Commercial", "Office", "Shop"] },
    { name: "community", label: "Community", options: ["DHA Lahore", "Bahria Town Lahore", "Gulberg", "Johar Town", "Model Town", "Lake City", "Lahore Cantt", "Township"] },
    { name: "bedrooms", label: "Bedrooms", options: ["1", "2", "3", "4", "5"] },
  ];

  return (
    <div className="pt-32">
      <section className="container-luxury pb-10">
        <span className="eyebrow">Portfolio</span>
        <h1 className="mt-3 font-display text-4xl font-bold text-ink">Properties</h1>
        <p className="mt-3 max-w-xl text-ink/60">
          {result.total} properties matching your search across Lahore&apos;s premier communities.
        </p>
      </section>

      <section className="container-luxury pb-24">
        <form className="card-luxury mb-10 grid grid-cols-2 gap-4 p-6 md:grid-cols-5" method="GET">
          {filterFields.map((f) => (
            <div key={f.name}>
              <label className="mb-1 block text-xs uppercase tracking-wider text-ink/50">{f.label}</label>
              <select name={f.name} defaultValue={sp[f.name] || ""} className="w-full rounded-lg border border-ink/10 px-3 py-2.5 text-sm focus:border-gold focus:outline-none">
                <option value="">Any</option>
                {f.options?.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>
          ))}
          <div>
            <label className="mb-1 block text-xs uppercase tracking-wider text-ink/50">Sort</label>
            <select name="sort" defaultValue={sp.sort || ""} className="w-full rounded-lg border border-ink/10 px-3 py-2.5 text-sm focus:border-gold focus:outline-none">
              <option value="">Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="area_desc">Largest Area</option>
            </select>
          </div>
          <button type="submit" className="btn-primary col-span-2 md:col-span-1">
            Apply Filters
          </button>
        </form>

        {result.data.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {result.data.map((p) => (
              <PropertyCard key={p._id} property={p} />
            ))}
          </div>
        ) : (
          <div className="card-luxury p-16 text-center text-ink/50">
            No properties match your filters yet. Try adjusting your search, or seed the database with sample
            listings.
          </div>
        )}

        {result.pages > 1 && (
          <div className="mt-14 flex justify-center gap-2">
            {Array.from({ length: result.pages }).map((_, i) => (
              <Link
                key={i}
                href={`/properties?${new URLSearchParams({ ...sp, page: String(i + 1) } as Record<string, string>).toString()}`}
                className={`flex h-10 w-10 items-center justify-center rounded-full border text-sm ${
                  result.page === i + 1 ? "border-gold bg-gold-gradient text-ink" : "border-ink/10 text-ink/60"
                }`}
              >
                {i + 1}
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
