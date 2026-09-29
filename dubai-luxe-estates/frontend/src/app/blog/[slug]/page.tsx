import Image from "next/image";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import BlogCard from "@/components/BlogCard";
import { api } from "@/lib/api";
import { Blog } from "@/types";

async function getBlog(slug: string) {
  try {
    return await api.get<{ data: Blog; recent: Blog[] }>(`/blogs/slug/${slug}`);
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const result = await getBlog(slug);
  return result ? { title: result.data.title, description: result.data.excerpt } : { title: "Article Not Found" };
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = await getBlog(slug);
  if (!result) return notFound();
  const { data: blog, recent } = result;

  return (
    <div className="pt-28">
      <section className="container-luxury max-w-3xl pb-10">
        <span className="eyebrow">{blog.category}</span>
        <h1 className="mt-3 font-display text-4xl font-bold text-ink">{blog.title}</h1>
        <p className="mt-3 text-sm text-ink/50">
          By {blog.author} {blog.createdAt && `· ${new Date(blog.createdAt).toLocaleDateString()}`}
        </p>
      </section>

      <section className="container-luxury max-w-4xl pb-14">
        <div className="relative h-[420px] overflow-hidden rounded-3xl">
          <Image src={blog.image} alt={blog.title} fill className="object-cover" priority />
        </div>
      </section>

      <section className="container-luxury max-w-3xl pb-24">
        <p className="text-lg leading-relaxed text-ink/70">{blog.content}</p>
      </section>

      {recent.length > 0 && (
        <section className="section-padding container-luxury">
          <h2 className="font-display text-2xl font-semibold text-ink">More Articles</h2>
          <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {recent.map((b) => (
              <BlogCard key={b._id} blog={b} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
