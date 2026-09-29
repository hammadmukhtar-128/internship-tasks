import Image from "next/image";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { FaWhatsapp } from "react-icons/fa";
import PropertyCard from "@/components/PropertyCard";
import { api } from "@/lib/api";
import { Agent, Property } from "@/types";

async function getAgent(id: string) {
  try {
    return await api.get<{ data: Agent; listings: Property[] }>(`/agents/${id}`);
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const result = await getAgent(id);
  return result ? { title: result.data.name, description: result.data.bio } : { title: "Agent Not Found" };
}

export default async function AgentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await getAgent(id);
  if (!result) return notFound();
  const { data: agent, listings } = result;

  return (
    <div className="pt-32">
      <section className="container-luxury grid grid-cols-1 gap-12 pb-20 lg:grid-cols-3">
        <div className="card-luxury p-8 text-center lg:col-span-1">
          <div className="relative mx-auto h-40 w-40 overflow-hidden rounded-full">
            <Image src={agent.image} alt={agent.name} fill className="object-cover" />
          </div>
          <h1 className="mt-5 font-display text-2xl font-bold text-ink">{agent.name}</h1>
          <p className="mt-1 text-sm uppercase tracking-wider text-gold-dark">{agent.designation}</p>
          <div className="mt-6 space-y-2 text-sm text-ink/60">
            <p>{agent.phone}</p>
            <p>{agent.email}</p>
            {agent.experience && <p>{agent.experience}+ years experience</p>}
            {agent.languages && <p>Speaks {agent.languages.join(", ")}</p>}
          </div>
          <a href={`https://wa.me/${agent.whatsapp}`} className="btn-gold mt-6 w-full text-xs">
            <FaWhatsapp /> Contact on WhatsApp
          </a>
        </div>
        <div className="lg:col-span-2">
          <h2 className="font-display text-2xl font-semibold text-ink">About {agent.name.split(" ")[0]}</h2>
          <p className="mt-4 leading-relaxed text-ink/60">{agent.bio}</p>

          <h2 className="mt-12 font-display text-2xl font-semibold text-ink">Current Listings</h2>
          {listings.length > 0 ? (
            <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2">
              {listings.map((p) => (
                <PropertyCard key={p._id} property={p} />
              ))}
            </div>
          ) : (
            <p className="mt-6 text-ink/50">No active listings at the moment.</p>
          )}
        </div>
      </section>
    </div>
  );
}
