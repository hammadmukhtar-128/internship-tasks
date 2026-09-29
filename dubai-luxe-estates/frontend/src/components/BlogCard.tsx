import Image from "next/image";
import Link from "next/link";
import { Blog } from "@/types";

export default function BlogCard({ blog }: { blog: Blog }) {
  return (
    <Link href={`/blog/${blog.slug}`} className="card-luxury group block overflow-hidden">
      <div className="relative h-56 w-full overflow-hidden">
        <Image src={blog.image} alt={blog.title} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
        <span className="absolute left-4 top-4 rounded-full bg-ink/80 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-ivory">
          {blog.category}
        </span>
      </div>
      <div className="p-6">
        <h3 className="line-clamp-2 font-display text-lg font-semibold text-ink group-hover:text-gold-dark">
          {blog.title}
        </h3>
        <p className="mt-3 line-clamp-2 text-sm text-ink/60">{blog.excerpt}</p>
        <span className="mt-4 inline-block text-xs font-semibold uppercase tracking-wider text-gold-dark">
          Read Article &rarr;
        </span>
      </div>
    </Link>
  );
}
