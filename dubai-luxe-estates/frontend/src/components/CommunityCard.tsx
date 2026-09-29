import Image from "next/image";
import Link from "next/link";

export default function CommunityCard({
  name,
  image,
  description,
}: {
  name: string;
  image: string;
  description: string;
}) {
  return (
    <Link
      href={`/communities/${name.toLowerCase().replace(/\s+/g, "-")}`}
      className="group relative block h-96 overflow-hidden rounded-2xl"
    >
      <Image src={image} alt={name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent" />
      <div className="absolute bottom-0 left-0 p-7 text-ivory">
        <h3 className="font-display text-2xl font-bold">{name}</h3>
        <p className="mt-2 max-w-xs text-sm text-ivory/70 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          {description}
        </p>
        <span className="mt-3 inline-block text-xs font-semibold uppercase tracking-wider text-gold-light">
          Explore &rarr;
        </span>
      </div>
    </Link>
  );
}
