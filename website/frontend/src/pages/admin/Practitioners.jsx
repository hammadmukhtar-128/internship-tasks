import { useEffect, useState, useCallback } from "react";
import { Plus, Pencil, Trash2, Loader2, AlertTriangle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AdminTable from "../../components/admin/AdminTable";
import StatusBadge from "../../components/common/StatusBadge";
import Modal from "../../components/common/Modal";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Textarea from "../../components/common/Textarea";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { useToast } from "../../components/common/Toast";
import { practitionerSchema } from "../../utils/validations";
import { slugify } from "../../utils/format";
import { getAllPractitionersAdmin, createPractitioner, updatePractitioner, deletePractitioner } from "../../services/practitionerService";

const columns = [
  { key: "name", label: "Practitioner" },
  { key: "specialization", label: "Specialization" },
  { key: "status", label: "Status" },
  { key: "actions", label: "Actions", className: "text-right" },
];

const emptyDefaults = {
  name: "",
  slug: "",
  specialization: "",
  experience: "",
  bio: "",
  shortBio: "",
  isActive: true,
};

export default function Practitioners() {
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
    setValue,
    formState: { errors },
  } = useForm({ resolver: zodResolver(practitionerSchema), defaultValues: emptyDefaults });

  const load = useCallback(async () => {
    setLoading(true);
    const { items, live } = await getAllPractitionersAdmin();
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

  function openEdit(p) {
    setEditing(p);
    reset({ ...emptyDefaults, ...p });
    setFormOpen(true);
  }

  async function onSubmit(data) {
    setSaving(true);
    try {
      if (editing) {
        await updatePractitioner(editing._id, data);
        showToast("Practitioner updated.");
      } else {
        await createPractitioner(data);
        showToast("Practitioner created.");
      }
      setFormOpen(false);
      load();
    } catch (err) {
      showToast(err.message || "Failed to save practitioner. Is the backend connected?", "error");
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(p) {
    setBusyId(p._id);
    try {
      await updatePractitioner(p._id, { isActive: !p.isActive });
      load();
    } catch (err) {
      showToast(err.message || "Failed to update practitioner.", "error");
    } finally {
      setBusyId(null);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget?._id) return;
    setBusyId(deleteTarget._id);
    try {
      await deletePractitioner(deleteTarget._id);
      showToast("Practitioner deleted.");
      setDeleteTarget(null);
      load();
    } catch (err) {
      showToast(err.message || "Failed to delete practitioner.", "error");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-brand-950">Practitioners</h1>
          <p className="mt-1 text-sm text-brand-500">Manage your team&rsquo;s profiles.</p>
        </div>
        <Button size="md" onClick={openCreate}>
          <Plus className="h-4 w-4" /> Add Practitioner
        </Button>
      </div>

      {!live && !loading && (
        <div className="mt-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
          <p>
            Showing demo practitioners — the backend API isn&rsquo;t reachable yet, so create/edit/delete
            here won&rsquo;t persist until it&rsquo;s connected.
          </p>
        </div>
      )}

      <div className="mt-6">
        {loading ? (
          <LoadingSpinner label="Loading practitioners..." />
        ) : (
          <AdminTable
            columns={columns}
            emptyTitle="No practitioners yet"
            emptyDescription="Add your first team member to get started."
            rows={items.map((p) => ({
              id: p._id,
              cells: {
                name: <p className="font-medium text-brand-950">{p.name}</p>,
                specialization: p.specialization,
                status: <StatusBadge status={p.isActive ? "active" : "inactive"} />,
                actions: (
                  <div className="flex justify-end gap-1.5">
                    {busyId === p._id ? (
                      <Loader2 className="h-4 w-4 animate-spin text-brand-400" />
                    ) : (
                      <>
                        <button onClick={() => toggleActive(p)} className="focus-ring rounded-lg px-2 py-1 text-xs font-medium text-brand-600 hover:bg-brand-50">
                          {p.isActive ? "Deactivate" : "Activate"}
                        </button>
                        <button onClick={() => openEdit(p)} className="focus-ring rounded-lg p-1.5 text-brand-600 hover:bg-brand-50">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button onClick={() => setDeleteTarget(p)} className="focus-ring rounded-lg p-1.5 text-red-600 hover:bg-red-50">
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
        title={editing ? "Edit Practitioner" : "Add Practitioner"}
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
        <form className="max-h-[60vh] space-y-4 overflow-y-auto pr-1" onSubmit={(e) => e.preventDefault()}>
          <Input
            label="Name"
            error={errors.name?.message}
            {...register("name")}
            onChange={(e) => {
              register("name").onChange(e);
              if (!editing) setValue("slug", slugify(e.target.value));
            }}
          />
          <Input label="Slug" error={errors.slug?.message} {...register("slug")} />
          <Input label="Specialization" error={errors.specialization?.message} {...register("specialization")} />
          <Input label="Experience" placeholder="8+ years experience" {...register("experience")} />
          <Textarea label="Short bio" rows={2} error={errors.shortBio?.message} {...register("shortBio")} />
          <Textarea label="Full biography" rows={4} error={errors.bio?.message} {...register("bio")} />
        </form>
      </Modal>

      <Modal
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Delete practitioner?"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button size="sm" onClick={confirmDelete}>Delete</Button>
          </>
        }
      >
        This will permanently delete &ldquo;{deleteTarget?.name}&rdquo;. This action cannot be undone.
      </Modal>
    </div>
  );
}
