import { useEffect, useState, useCallback } from "react";
import { Plus, Pencil, Trash2, Loader2, AlertTriangle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AdminTable from "../../components/admin/AdminTable";
import StatusBadge from "../../components/common/StatusBadge";
import StarRating from "../../components/common/StarRating";
import Modal from "../../components/common/Modal";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import Textarea from "../../components/common/Textarea";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { useToast } from "../../components/common/Toast";
import { testimonialSchema } from "../../utils/validations";
import { getAllTestimonialsAdmin, createTestimonial, updateTestimonial, deleteTestimonial } from "../../services/testimonialService";

const columns = [
  { key: "patient", label: "Patient" },
  { key: "rating", label: "Rating" },
  { key: "review", label: "Review" },
  { key: "status", label: "Status" },
  { key: "actions", label: "Actions", className: "text-right" },
];

const emptyDefaults = { patientName: "", rating: 5, review: "", isPublished: true };

export default function Testimonials() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [live, setLive] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(testimonialSchema), defaultValues: emptyDefaults });

  const load = useCallback(async () => {
    setLoading(true);
    const { items, live } = await getAllTestimonialsAdmin();
    setItems(items);
    setLive(live);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function openCreate() {
    setEditing(null);
    reset(emptyDefaults);
    setFormOpen(true);
  }

  function openEdit(t) {
    setEditing(t);
    reset({ patientName: t.patientName, rating: t.rating, review: t.review, isPublished: t.isPublished });
    setFormOpen(true);
  }

  async function onSubmit(data) {
    setSaving(true);
    try {
      if (editing) {
        await updateTestimonial(editing._id, data);
        showToast("Testimonial updated.");
      } else {
        await createTestimonial(data);
        showToast("Testimonial created.");
      }
      setFormOpen(false);
      load();
    } catch (err) {
      showToast(err.message || "Failed to save testimonial. Is the backend connected?", "error");
    } finally {
      setSaving(false);
    }
  }

  async function togglePublished(t) {
    setBusyId(t._id);
    try {
      await updateTestimonial(t._id, { isPublished: !t.isPublished });
      load();
    } catch (err) {
      showToast(err.message || "Failed to update testimonial.", "error");
    } finally {
      setBusyId(null);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget?._id) return;
    setBusyId(deleteTarget._id);
    try {
      await deleteTestimonial(deleteTarget._id);
      showToast("Testimonial deleted.");
      setDeleteTarget(null);
      load();
    } catch (err) {
      showToast(err.message || "Failed to delete testimonial.", "error");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-brand-950">Testimonials</h1>
          <p className="mt-1 text-sm text-brand-500">Manage patient testimonials shown on the site.</p>
        </div>
        <Button size="md" onClick={openCreate}>
          <Plus className="h-4 w-4" /> Add Testimonial
        </Button>
      </div>

      {!live && !loading && (
        <div className="mt-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
          <p>
            Showing demo testimonials — the backend API isn&rsquo;t reachable yet, so create/edit/delete
            here won&rsquo;t persist until it&rsquo;s connected.
          </p>
        </div>
      )}

      <div className="mt-6">
        {loading ? (
          <LoadingSpinner label="Loading testimonials..." />
        ) : (
          <AdminTable
            columns={columns}
            emptyTitle="No testimonials yet"
            emptyDescription="Add your first testimonial to get started."
            rows={items.map((t) => ({
              id: t._id,
              cells: {
                patient: <p className="font-medium text-brand-950">{t.patientName}</p>,
                rating: <StarRating rating={t.rating} size={14} />,
                review: <p className="max-w-xs truncate text-brand-700">{t.review}</p>,
                status: <StatusBadge status={t.isPublished ? "active" : "inactive"} />,
                actions: (
                  <div className="flex justify-end gap-1.5">
                    {busyId === t._id ? (
                      <Loader2 className="h-4 w-4 animate-spin text-brand-400" />
                    ) : (
                      <>
                        <button onClick={() => togglePublished(t)} className="focus-ring rounded-lg px-2 py-1 text-xs font-medium text-brand-600 hover:bg-brand-50">
                          {t.isPublished ? "Unpublish" : "Publish"}
                        </button>
                        <button onClick={() => openEdit(t)} className="focus-ring rounded-lg p-1.5 text-brand-600 hover:bg-brand-50">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button onClick={() => setDeleteTarget(t)} className="focus-ring rounded-lg p-1.5 text-red-600 hover:bg-red-50">
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
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? "Edit Testimonial" : "Add Testimonial"}
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setFormOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={handleSubmit(onSubmit)} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              Save
            </Button>
          </>
        }
      >
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <Input label="Patient name" error={errors.patientName?.message} {...register("patientName")} />
          <Select
            label="Rating"
            error={errors.rating?.message}
            options={[5, 4, 3, 2, 1].map((n) => ({ value: String(n), label: `${n} star${n > 1 ? "s" : ""}` }))}
            {...register("rating", { valueAsNumber: true })}
          />
          <Textarea label="Review" rows={4} error={errors.review?.message} {...register("review")} />
        </form>
      </Modal>

      <Modal
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Delete testimonial?"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button size="sm" onClick={confirmDelete}>Delete</Button>
          </>
        }
      >
        This will permanently delete this testimonial from {deleteTarget?.patientName}. This action cannot be undone.
      </Modal>
    </div>
  );
}
