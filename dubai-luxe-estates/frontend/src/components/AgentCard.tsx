import Image from "next/image";
import Link from "next/link";
import { FaWhatsapp, FaLinkedinIn, FaInstagram } from "react-icons/fa";
import { Agent } from "@/types";

export default function AgentCard({ agent }: { agent: Agent }) {
  return (
    <div className="card-luxury group overflow-hidden text-center">
      <div className="relative h-72 w-full overflow-hidden">
        <Image src={agent.image} alt={agent.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
      </div>
      <div className="p-6">
        <h3 className="font-display text-lg font-semibold text-ink">{agent.name}</h3>
        <p className="mt-1 text-xs uppercase tracking-wider text-gold-dark">{agent.designation}</p>
        {agent.experience && <p className="mt-2 text-sm text-ink/50">{agent.experience}+ years experience</p>}
        <div className="mt-5 flex justify-center gap-3">
          <a href={`https://wa.me/${agent.whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/10 hover:border-gold hover:text-gold-dark">
            <FaWhatsapp size={14} />
          </a>
          <a href={agent.social?.linkedin || "#"} className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/10 hover:border-gold hover:text-gold-dark">
            <FaLinkedinIn size={14} />
          </a>
          <a href={agent.social?.instagram || "#"} className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/10 hover:border-gold hover:text-gold-dark">
            <FaInstagram size={14} />
          </a>
        </div>
        <Link href={`/agents/${agent._id}`} className="mt-5 inline-block text-xs font-semibold uppercase tracking-wider text-ink underline decoration-gold underline-offset-4">
          View Profile
        </Link>
      </div>
    </div>
  );
}
