import { Metadata } from "next";
import BlogCard from "@/components/BlogCard";
import { api } from "@/lib/api";
import { Blog, PaginatedResponse } from "@/types";

export const metadata: Metadata = {
  title: "Blog & Market Insights",
  description: "Lahore real estate market insights, buying guides, and investment analysis from Lahore Estate Hub.",
};

const categories = ["Investment", "Buying Guide", "Lifestyle"];

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  let result: PaginatedResponse<Blog> = { success: false, count: 0, total: 0, page: 1, pages: 1, data: [] };
  try {
    const q = category ? `?category=${encodeURIComponent(category)}` : "";
    result = await api.get<PaginatedResponse<Blog>>(`/blogs${q}`);
  } catch {
    // fallback stays empty
  }

  return (
    <div className="pt-32">
      <section className="container-luxury pb-14 text-center">
        <span className="eyebrow">Journal</span>
        <h1 className="mt-3 font-display text-4xl font-bold text-ink">Market Insights &amp; Guides</h1>
      </section>

      <section className="container-luxury pb-6">
        <div className="flex flex-wrap justify-center gap-3">
          <a href="/blog" className={`rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-wide ${!category ? "bg-gold-gradient text-ink" : "border border-ink/10 text-ink/60"}`}>
            All
          </a>
          {categories.map((c) => (
            <a
              key={c}
              href={`/blog?category=${encodeURIComponent(c)}`}
              className={`rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-wide ${category === c ? "bg-gold-gradient text-ink" : "border border-ink/10 text-ink/60"}`}
            >
              {c}
            </a>
          ))}
        </div>
      </section>

      <section className="container-luxury pb-24 pt-10">
        {result.data.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {result.data.map((b) => (
              <BlogCard key={b._id} blog={b} />
            ))}
          </div>
        ) : (
          <p className="text-center text-ink/50">Articles will appear here once the database is seeded.</p>
        )}
      </section>
    </div>
  );
}
