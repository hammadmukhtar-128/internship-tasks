import { useEffect, useState } from "react";
import Seo from "../components/common/Seo";
import SectionHeading from "../components/common/SectionHeading";
import PractitionerCard from "../components/team/PractitionerCard";
import FinalCta from "../components/home/FinalCta";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { getPractitioners } from "../services/practitionerService";

export default function Team() {
  const [practitioners, setPractitioners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getPractitioners().then(({ items }) => {
      if (mounted) {
        setPractitioners(items);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <>
      <Seo title="Our Team" description="Meet the physiotherapy and chiropractic practitioners on our team." path="/team" />
      <section className="bg-brand-50 py-16 sm:py-20">
        <div className="container-clinic">
          <SectionHeading
            eyebrow="Our Team"
            title="Meet the practitioners behind your care"
            description="A qualified, approachable team across physiotherapy and chiropractic care."
          />
        </div>
      </section>
      <section className="bg-sand-50 py-16 sm:py-24">
        <div className="container-clinic">
          {loading ? (
            <LoadingSpinner label="Loading team..." />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {practitioners.map((p, i) => (
                <PractitionerCard key={p.slug} practitioner={p} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>
      <FinalCta />
    </>
  );
}
