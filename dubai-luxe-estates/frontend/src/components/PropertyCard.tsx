import Image from "next/image";
import Link from "next/link";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { BiBed, BiBath, BiArea } from "react-icons/bi";
import { Property } from "@/types";
import { formatPrice } from "@/lib/api";

export default function PropertyCard({ property }: { property: Property }) {
  const priceLabel =
    property.purpose === "Rent"
      ? `${formatPrice(property.price, property.currency)} / month`
      : formatPrice(property.price, property.currency);

  return (
    <Link href={`/properties/${property.slug}`} className="card-luxury group block overflow-hidden">
      <div className="relative h-64 w-full overflow-hidden">
        <Image
          src={property.images[0]}
          alt={property.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute left-4 top-4 flex gap-2">
          {property.featured && (
            <span className="rounded-full bg-gold-gradient px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-ink">
              Featured
            </span>
          )}
          <span className="rounded-full bg-ink/80 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-ivory">
            For {property.purpose}
          </span>
        </div>
      </div>
      <div className="p-6">
        <p className="font-display text-xl font-semibold text-ink group-hover:text-gold-dark">{priceLabel}</p>
        <h3 className="mt-2 line-clamp-1 text-base font-medium text-ink/90">{property.title}</h3>
        <p className="mt-1 flex items-center gap-1 text-sm text-ink/50">
          <HiOutlineLocationMarker /> {property.location}
        </p>
        <div className="mt-5 flex items-center gap-5 border-t border-ink/5 pt-4 text-sm text-ink/60">
          <span className="flex items-center gap-1.5">
            <BiBed /> {property.bedrooms} Beds
          </span>
          <span className="flex items-center gap-1.5">
            <BiBath /> {property.bathrooms} Baths
          </span>
          <span className="flex items-center gap-1.5">
            <BiArea /> {property.area.toLocaleString()} sqft
          </span>
        </div>
      </div>
    </Link>
  );
}
