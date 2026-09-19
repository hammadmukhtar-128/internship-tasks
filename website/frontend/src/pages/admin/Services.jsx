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
import { serviceSchema } from "../../utils/validations";
import { slugify } from "../../utils/format";
import { getAllServicesAdmin, createService, updateService, deleteService } from "../../services/serviceService";

const columns = [
  { key: "name", label: "Service" },
  { key: "price", label: "Price" },
  { key: "status", label: "Status" },
  { key: "actions", label: "Actions", className: "text-right" },
];

const emptyDefaults = {
  name: "",
  slug: "",
  shortDescription: "",
  description: "",
  duration: "",
  price: "",
  image: "/images/clinic/service-physiotherapy.jpg",
  isActive: true,
};

export default function Services() {
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
  } = useForm({ resolver: zodResolver(serviceSchema), defaultValues: emptyDefaults });

  const load = useCallback(async () => {
    setLoading(true);
    const { items, live } = await getAllServicesAdmin();
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

  function openEdit(service) {
    setEditing(service);
    reset({ ...emptyDefaults, ...service });
    setFormOpen(true);
  }

  async function onSubmit(data) {
    setSaving(true);
    try {
      if (editing) {
        await updateService(editing._id, data);
        showToast("Service updated.");
      } else {
        await createService(data);
        showToast("Service created.");
      }
      setFormOpen(false);
      load();
    } catch (err) {
      showToast(err.message || "Failed to save service. Is the backend connected?", "error");
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(service) {
    setBusyId(service._id);
    try {
      await updateService(service._id, { isActive: !service.isActive });
      load();
    } catch (err) {
      showToast(err.message || "Failed to update service.", "error");
    } finally {
      setBusyId(null);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget?._id) return;
    setBusyId(deleteTarget._id);
    try {
      await deleteService(deleteTarget._id);
      showToast("Service deleted.");
      setDeleteTarget(null);
      load();
    } catch (err) {
      showToast(err.message || "Failed to delete service.", "error");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-brand-950">Services</h1>
          <p className="mt-1 text-sm text-brand-500">Manage the services shown on your website.</p>
        </div>
        <Button size="md" onClick={openCreate}>
          <Plus className="h-4 w-4" /> Add Service
        </Button>
      </div>

      {!live && !loading && (
        <div className="mt-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
          <p>
            Showing demo services — the backend API isn&rsquo;t reachable yet, so create/edit/delete
            here won&rsquo;t persist until it&rsquo;s connected.
          </p>
        </div>
      )}

      <div className="mt-6">
        {loading ? (
          <LoadingSpinner label="Loading services..." />
        ) : (
          <AdminTable
            columns={columns}
            emptyTitle="No services yet"
            emptyDescription="Add your first service to get started."
            rows={items.map((s) => ({
              id: s._id,
              cells: {
                name: <p className="font-medium text-brand-950">{s.name}</p>,
                price: s.price || "—",
                status: <StatusBadge status={s.isActive ? "active" : "inactive"} />,
                actions: (
                  <div className="flex justify-end gap-1.5">
                    {busyId === s._id ? (
                      <Loader2 className="h-4 w-4 animate-spin text-brand-400" />
                    ) : (
                      <>
                        <button onClick={() => toggleActive(s)} className="focus-ring rounded-lg px-2 py-1 text-xs font-medium text-brand-600 hover:bg-brand-50">
                          {s.isActive ? "Deactivate" : "Activate"}
                        </button>
                        <button onClick={() => openEdit(s)} className="focus-ring rounded-lg p-1.5 text-brand-600 hover:bg-brand-50">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button onClick={() => setDeleteTarget(s)} className="focus-ring rounded-lg p-1.5 text-red-600 hover:bg-red-50">
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
        title={editing ? "Edit Service" : "Add Service"}
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
          <Textarea label="Short description" rows={2} error={errors.shortDescription?.message} {...register("shortDescription")} />
          <Textarea label="Full description" rows={4} error={errors.description?.message} {...register("description")} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Duration" placeholder="45–60 minutes" {...register("duration")} />
            <Input label="Price" placeholder="From $95" {...register("price")} />
          </div>
          <Input label="Image path" placeholder="/images/clinic/service-physiotherapy.jpg" {...register("image")} />
        </form>
      </Modal>

      <Modal
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Delete service?"
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
