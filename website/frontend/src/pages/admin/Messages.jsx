import { useEffect, useState, useCallback } from "react";
import { Trash2, Mail, MailOpen, Reply, Loader2, AlertTriangle } from "lucide-react";
import AdminTable from "../../components/admin/AdminTable";
import StatusBadge from "../../components/common/StatusBadge";
import Modal from "../../components/common/Modal";
import Button from "../../components/common/Button";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { useToast } from "../../components/common/Toast";
import { formatDate } from "../../utils/format";
import { getContactMessages, updateContactMessageStatus, deleteContactMessage } from "../../services/contactService";

const columns = [
  { key: "from", label: "From" },
  { key: "message", label: "Message" },
  { key: "date", label: "Received" },
  { key: "status", label: "Status" },
  { key: "actions", label: "Actions", className: "text-right" },
];

export default function Messages() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const { showToast } = useToast();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getContactMessages();
      setItems(data);
      setError(false);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleStatusChange(id, status) {
    setBusyId(id);
    try {
      await updateContactMessageStatus(id, status);
      load();
    } catch (err) {
      showToast(err.message || "Failed to update message.", "error");
    } finally {
      setBusyId(null);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget?._id) return;
    setBusyId(deleteTarget._id);
    try {
      await deleteContactMessage(deleteTarget._id);
      showToast("Message deleted.");
      setDeleteTarget(null);
      load();
    } catch (err) {
      showToast(err.message || "Failed to delete message.", "error");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl text-brand-950">Contact Messages</h1>
      <p className="mt-1 text-sm text-brand-500">Messages submitted through the contact form.</p>

      {error && (
        <div className="mt-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
          <p>Couldn&rsquo;t reach the backend API. Connect your Express backend to manage messages here.</p>
        </div>
      )}

      <div className="mt-6">
        {loading ? (
          <LoadingSpinner label="Loading messages..." />
        ) : (
          <AdminTable
            columns={columns}
            emptyTitle="No messages yet"
            emptyDescription="Messages from the Contact page will appear here."
            rows={items.map((m) => ({
              id: m._id,
              cells: {
                from: (
                  <div>
                    <p className="font-medium text-brand-950">{m.name}</p>
                    <p className="text-xs text-brand-500">{m.email}</p>
                    {m.phone && <p className="text-xs text-brand-500">{m.phone}</p>}
                  </div>
                ),
                message: <p className="max-w-xs truncate text-brand-700">{m.message}</p>,
                date: m.createdAt ? formatDate(m.createdAt) : "—",
                status: <StatusBadge status={m.status} />,
                actions: (
                  <div className="flex justify-end gap-1.5">
                    {busyId === m._id ? (
                      <Loader2 className="h-4 w-4 animate-spin text-brand-400" />
                    ) : (
                      <>
                        {m.status === "new" && (
                          <button title="Mark as read" onClick={() => handleStatusChange(m._id, "read")} className="focus-ring rounded-lg p-1.5 text-brand-600 hover:bg-brand-50">
                            <MailOpen className="h-4 w-4" />
                          </button>
                        )}
                        {m.status !== "replied" && (
                          <button title="Mark as replied" onClick={() => handleStatusChange(m._id, "replied")} className="focus-ring rounded-lg p-1.5 text-emerald-600 hover:bg-emerald-50">
                            <Reply className="h-4 w-4" />
                          </button>
                        )}
                        <a href={`mailto:${m.email}`} title="Email" className="focus-ring rounded-lg p-1.5 text-brand-600 hover:bg-brand-50">
                          <Mail className="h-4 w-4" />
                        </a>
                        <button title="Delete" onClick={() => setDeleteTarget(m)} className="focus-ring rounded-lg p-1.5 text-red-600 hover:bg-red-50">
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
        title="Delete message?"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button variant="primary" size="sm" onClick={confirmDelete}>Delete</Button>
          </>
        }
      >
        This will permanently delete the message from {deleteTarget?.name}. This action cannot be undone.
      </Modal>
    </div>
  );
}
