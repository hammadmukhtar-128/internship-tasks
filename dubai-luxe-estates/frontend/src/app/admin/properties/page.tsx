"use client";

import { useEffect, useState } from "react";
import AdminGuard from "@/components/AdminGuard";
import { api, formatPrice } from "@/lib/api";
import { getSession } from "@/lib/authClient";
import { Property, PaginatedResponse } from "@/types";
import { HiOutlineTrash, HiOutlinePlus } from "react-icons/hi";

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    propertyType: "House",
    purpose: "Buy",
    bedrooms: "",
    bathrooms: "",
    area: "",
    location: "",
    community: "DHA Lahore",
    images: "/images/img4.jpg",
  });
  const [saving, setSaving] = useState(false);

  const load = () => {
    api.get<PaginatedResponse<Property>>("/properties?limit=50").then((r) => setProperties(r.data)).catch(() => {});
  };

  useEffect(load, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const session = getSession();
    if (!session) return;
    setSaving(true);
    try {
      await api.post(
        "/properties",
        {
          ...form,
          price: Number(form.price),
          bedrooms: Number(form.bedrooms),
          bathrooms: Number(form.bathrooms),
          area: Number(form.area),
          images: form.images.split(",").map((s) => s.trim()),
          amenities: [],
        },
        session.token
      );
      setShowForm(false);
      load();
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const session = getSession();
    if (!session || !confirm("Delete this property?")) return;
    await api.delete(`/properties/${id}`, session.token);
    load();
  };

  return (
    <AdminGuard>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-ink">Properties</h1>
        <button onClick={() => setShowForm((v) => !v)} className="btn-gold text-xs">
          <HiOutlinePlus /> {showForm ? "Cancel" : "Add Property"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="card-luxury mt-6 grid grid-cols-1 gap-4 p-6 md:grid-cols-3">
          <input required placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="rounded-lg border border-ink/10 px-3 py-2.5 text-sm md:col-span-2" />
          <input required type="number" placeholder="Price (PKR)" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="rounded-lg border border-ink/10 px-3 py-2.5 text-sm" />
          <select value={form.propertyType} onChange={(e) => setForm({ ...form, propertyType: e.target.value })} className="rounded-lg border border-ink/10 px-3 py-2.5 text-sm">
            {["House", "Apartment", "Villa", "Plot", "Commercial", "Office", "Shop"].map((t) => <option key={t}>{t}</option>)}
          </select>
          <select value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })} className="rounded-lg border border-ink/10 px-3 py-2.5 text-sm">
            <option>Buy</option>
            <option>Rent</option>
          </select>
          <select value={form.community} onChange={(e) => setForm({ ...form, community: e.target.value })} className="rounded-lg border border-ink/10 px-3 py-2.5 text-sm">
            {["DHA Lahore", "Bahria Town Lahore", "Gulberg", "Johar Town", "Model Town", "Lake City", "Lahore Cantt", "Township"].map((c) => <option key={c}>{c}</option>)}
          </select>
          <input required type="number" placeholder="Bedrooms" value={form.bedrooms} onChange={(e) => setForm({ ...form, bedrooms: e.target.value })} className="rounded-lg border border-ink/10 px-3 py-2.5 text-sm" />
          <input required type="number" placeholder="Bathrooms" value={form.bathrooms} onChange={(e) => setForm({ ...form, bathrooms: e.target.value })} className="rounded-lg border border-ink/10 px-3 py-2.5 text-sm" />
          <input required type="number" placeholder="Area (sqft)" value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} className="rounded-lg border border-ink/10 px-3 py-2.5 text-sm" />
          <input required placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="rounded-lg border border-ink/10 px-3 py-2.5 text-sm md:col-span-2" />
          <input placeholder="Image paths (comma separated)" value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })} className="rounded-lg border border-ink/10 px-3 py-2.5 text-sm md:col-span-3" />
          <textarea required placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="rounded-lg border border-ink/10 px-3 py-2.5 text-sm md:col-span-3" />
          <button type="submit" disabled={saving} className="btn-primary md:col-span-3">
            {saving ? "Saving..." : "Create Property"}
          </button>
        </form>
      )}

      <div className="card-luxury mt-6 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-ink/5 text-xs uppercase tracking-wider text-ink/50">
            <tr>
              <th className="px-6 py-4">Title</th>
              <th className="px-6 py-4">Community</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4" />
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/5">
            {properties.map((p) => (
              <tr key={p._id}>
                <td className="px-6 py-4 font-medium text-ink">{p.title}</td>
                <td className="px-6 py-4 text-ink/60">{p.community}</td>
                <td className="px-6 py-4 text-ink/60">{formatPrice(p.price, p.currency)}</td>
                <td className="px-6 py-4 text-ink/60">{p.status}</td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => handleDelete(p._id)} className="text-red-500 hover:text-red-700">
                    <HiOutlineTrash />
                  </button>
                </td>
              </tr>
            ))}
            {properties.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-ink/40">
                  No properties yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminGuard>
  );
}
