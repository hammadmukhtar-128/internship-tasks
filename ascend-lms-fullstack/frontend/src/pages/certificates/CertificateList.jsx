import { useEffect, useState } from 'react';
import { Award, Download } from 'lucide-react';
import { format } from 'date-fns';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import EmptyState from '../../components/EmptyState';
import { Skeleton } from '../../components/Loader';
import toast from 'react-hot-toast';

const CertificateCard = ({ cert, studentName }) => (
  <div className="card overflow-hidden">
    <div className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-ink p-6 text-white">
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-accent-400/20" />
      <Award size={28} className="text-accent-400" />
      <p className="mt-3 text-xs uppercase tracking-wide text-white/50">Certificate of Completion</p>
      <p className="mt-1 font-display text-lg font-semibold">{cert.course?.title}</p>
    </div>
    <div className="p-5">
      <p className="text-sm text-ink/50">Awarded to</p>
      <p className="font-medium text-ink">{studentName || cert.student?.fullName}</p>
      <div className="mt-3 flex items-center justify-between border-t border-black/5 pt-3 text-xs text-ink/40">
        <span>{format(new Date(cert.completionDate), 'MMM d, yyyy')}</span>
        <span className="font-mono">{cert.certificateId}</span>
      </div>
    </div>
  </div>
);

const CertificateList = () => {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const endpoint = user.role === 'student' ? '/certificates/my-certificates' : '/certificates';
    api
      .get(endpoint)
      .then(({ data }) => setCertificates(data.data))
      .catch(() => toast.error('Failed to load certificates'))
      .finally(() => setLoading(false));
  }, [user.role]);

  const handlePrint = () => window.print();

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-56" />)}
      </div>
    );
  }

  if (certificates.length === 0) {
    return (
      <EmptyState
        icon={Award}
        title="No certificates yet"
        description={user.role === 'student' ? 'Complete a course to earn your first certificate.' : 'No certificates have been issued yet.'}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={handlePrint} className="btn-secondary !py-1.5 !px-3 text-xs">
          <Download size={14} /> Print / Save as PDF
        </button>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {certificates.map((c) => (
          <CertificateCard key={c._id} cert={c} studentName={user.role === 'student' ? user.fullName : null} />
        ))}
      </div>
    </div>
  );
};

export default CertificateList;
