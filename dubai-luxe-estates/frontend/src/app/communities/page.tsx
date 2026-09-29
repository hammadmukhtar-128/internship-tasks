import { Metadata } from "next";
import CommunityCard from "@/components/CommunityCard";

export const metadata: Metadata = {
  title: "Lahore Communities",
  description: "Explore Lahore’s most in-demand residential communities including DHA Lahore, Bahria Town Lahore, Gulberg, Johar Town, and Lake City.",
};

const communities = [
  { name: "DHA Lahore", image: "/images/img28.jpg", description: "Premium, secure living with family-friendly amenities and strong resale value." },
  { name: "Bahria Town Lahore", image: "/images/img29.jpg", description: "A modern, planned community with lifestyle facilities, schools, and green spaces." },
  { name: "Gulberg", image: "/images/img30.jpg", description: "A central, vibrant district known for commercial activity, dining, and urban convenience." },
  { name: "Johar Town", image: "/images/img31.jpg", description: "A growing residential choice with excellent access to schools, shopping, and daily essentials." },
  { name: "Lake City", image: "/images/img32.jpg", description: "Luxury villas and peaceful living in a premium Lahore neighbourhood." },
];

export default function CommunitiesPage() {
  return (
    <div className="pt-32">
      <section className="container-luxury pb-14 text-center">
        <span className="eyebrow">Communities</span>
        <h1 className="mt-3 font-display text-4xl font-bold text-ink">Lahore’s Finest Addresses</h1>
        <p className="mx-auto mt-3 max-w-xl text-ink/60">
          Each community offers a distinct lifestyle, from premium gated villas to vibrant urban neighbourhoods.
        </p>
      </section>
      <section className="container-luxury pb-24">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {communities.map((c) => (
            <CommunityCard key={c.name} {...c} />
          ))}
        </div>
      </section>
    </div>
  );
}
