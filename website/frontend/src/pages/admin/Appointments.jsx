import { useEffect, useState, useCallback } from "react";
import { Search, Trash2, CheckCircle2, XCircle, Loader2, AlertTriangle } from "lucide-react";
import AdminTable from "../../components/admin/AdminTable";
import StatusBadge from "../../components/common/StatusBadge";
import Select from "../../components/common/Select";
import Modal from "../../components/common/Modal";
import Button from "../../components/common/Button";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { useToast } from "../../components/common/Toast";
import { formatDate } from "../../utils/format";
import { getAppointments, updateAppointmentStatus, deleteAppointment } from "../../services/appointmentService";

const columns = [
  { key: "patient", label: "Patient" },
  { key: "service", label: "Service" },
  { key: "date", label: "Preferred Date/Time" },
  { key: "status", label: "Status" },
  { key: "actions", label: "Actions", className: "text-right" },
];

export default function Appointments() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const { showToast } = useToast();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (status !== "all") params.status = status;
      if (search) params.search = search;
      const data = await getAppointments(params);
      setItems(data);
      setError(false);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [status, search]);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load]);

  async function handleStatusChange(id, newStatus) {
    setBusyId(id);
    try {
      await updateAppointmentStatus(id, newStatus);
      showToast("Appointment updated.");
      load();
    } catch (err) {
      showToast(err.message || "Failed to update appointment.", "error");
    } finally {
      setBusyId(null);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget?._id) return;
    setBusyId(deleteTarget._id);
    try {
      await deleteAppointment(deleteTarget._id);
      showToast("Appointment deleted.");
      setDeleteTarget(null);
      load();
    } catch (err) {
      showToast(err.message || "Failed to delete appointment.", "error");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl text-brand-950">Appointments</h1>
      <p className="mt-1 text-sm text-brand-500">Manage incoming appointment requests.</p>

      {error && (
        <div className="mt-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
          <p>Couldn&rsquo;t reach the backend API. Connect your Express backend to manage appointments here.</p>
        </div>
      )}

      <div className="mt-6 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email or phone"
            className="w-full rounded-xl border border-brand-200 bg-white py-2.5 pl-10 pr-4 text-sm focus-ring"
          />
        </div>
        <div className="w-full sm:w-56">
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            options={[
              { value: "all", label: "All statuses" },
              { value: "pending", label: "Pending" },
              { value: "confirmed", label: "Confirmed" },
              { value: "completed", label: "Completed" },
              { value: "cancelled", label: "Cancelled" },
            ]}
          />
        </div>
      </div>

      <div className="mt-6">
        {loading ? (
          <LoadingSpinner label="Loading appointments..." />
        ) : (
          <AdminTable
            columns={columns}
            emptyTitle="No appointments found"
            emptyDescription="New booking requests will appear here."
            rows={items.map((a) => ({
              id: a._id,
              cells: {
                patient: (
                  <div>
                    <p className="font-medium text-brand-950">{a.patientName}</p>
                    <p className="text-xs text-brand-500">{a.email}</p>
                    <p className="text-xs text-brand-500">{a.phone}</p>
                  </div>
                ),
                service: (
                  <div>
                    <p className="capitalize text-brand-900">{a.service?.replace(/-/g, " ")}</p>
                    {a.practitioner && <p className="text-xs capitalize text-brand-500">{a.practitioner.replace(/-/g, " ")}</p>}
                  </div>
                ),
                date: (
                  <div>
                    <p>{formatDate(a.preferredDate)}</p>
                    <p className="text-xs text-brand-500">{a.preferredTime}</p>
                  </div>
                ),
                status: <StatusBadge status={a.status} />,
                actions: (
                  <div className="flex justify-end gap-1.5">
                    {busyId === a._id ? (
                      <Loader2 className="h-4 w-4 animate-spin text-brand-400" />
                    ) : (
                      <>
                        {a.status !== "confirmed" && (
                          <button title="Confirm" onClick={() => handleStatusChange(a._id, "confirmed")} className="focus-ring rounded-lg p-1.5 text-emerald-600 hover:bg-emerald-50">
                            <CheckCircle2 className="h-4 w-4" />
                          </button>
                        )}
                        {a.status !== "completed" && (
                          <button title="Mark completed" onClick={() => handleStatusChange(a._id, "completed")} className="focus-ring rounded-lg p-1.5 text-brand-600 hover:bg-brand-50">
                            <CheckCircle2 className="h-4 w-4" />
                          </button>
                        )}
                        {a.status !== "cancelled" && (
                          <button title="Cancel" onClick={() => handleStatusChange(a._id, "cancelled")} className="focus-ring rounded-lg p-1.5 text-amber-600 hover:bg-amber-50">
                            <XCircle className="h-4 w-4" />
                          </button>
                        )}
                        <button title="Delete" onClick={() => setDeleteTarget(a)} className="focus-ring rounded-lg p-1.5 text-red-600 hover:bg-red-50">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                ),
              },
            }))}
          />
        )}
      </div>

      <Modal
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Delete appointment?"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button variant="primary" size="sm" onClick={confirmDelete}>Delete</Button>
          </>
        }
      >
        This will permanently remove {deleteTarget?.patientName}&rsquo;s appointment request. This action cannot be undone.
      </Modal>
    </div>
  );
}
