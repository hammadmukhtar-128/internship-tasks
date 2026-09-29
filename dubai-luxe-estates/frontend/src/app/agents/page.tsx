import { Metadata } from "next";
import AgentCard from "@/components/AgentCard";
import { api } from "@/lib/api";
import { Agent } from "@/types";

export const metadata: Metadata = {
  title: "Our Agents",
  description: "Meet the advisors behind Lahore Estate Hub’s residential, commercial, and investment property transactions across Lahore.",
};

export default async function AgentsPage() {
  let agents: Agent[] = [];
  try {
    const res = await api.get<{ data: Agent[] }>("/agents");
    agents = res.data;
  } catch {
    agents = [];
  }

  return (
    <div className="pt-32">
      <section className="container-luxury pb-14 text-center">
        <span className="eyebrow">Our Team</span>
        <h1 className="mt-3 font-display text-4xl font-bold text-ink">Meet Our Agents</h1>
        <p className="mx-auto mt-3 max-w-xl text-ink/60">
          Senior advisors with deep expertise across DHA Lahore, Bahria Town, Gulberg, Johar Town, and Lahore’s top residential sectors.
        </p>
      </section>
      <section className="container-luxury pb-24">
        {agents.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {agents.map((a) => (
              <AgentCard key={a._id} agent={a} />
            ))}
          </div>
        ) : (
          <p className="text-center text-ink/50">Agent profiles will appear here once the database is seeded.</p>
        )}
      </section>
    </div>
  );
}
