import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save, Plus, Trash2, AlertTriangle } from "lucide-react";
import Input from "../../components/common/Input";
import Textarea from "../../components/common/Textarea";
import Button from "../../components/common/Button";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { useToast } from "../../components/common/Toast";
import { clinicSettingsSchema } from "../../utils/validations";
import { getClinicSettings, updateClinicSettings } from "../../services/settingsService";

export default function Settings() {
  const [loading, setLoading] = useState(true);
  const [live, setLive] = useState(true);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(clinicSettingsSchema),
    defaultValues: {
      clinicName: "",
      tagline: "",
      phone: "",
      email: "",
      address: "",
      suburb: "",
      state: "",
      postcode: "",
      openingHours: [],
      googleMapsUrl: "",
      instagram: "",
      facebook: "",
      emergencyMessage: "",
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "openingHours" });

  useEffect(() => {
    (async () => {
      const { item, live } = await getClinicSettings();
      reset(item);
      setLive(live);
      setLoading(false);
    })();
  }, [reset]);

  async function onSubmit(data) {
    setSaving(true);
    try {
      await updateClinicSettings(data);
      showToast("Clinic settings updated.");
    } catch (err) {
      showToast(err.message || "Failed to save settings. Is the backend connected?", "error");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <LoadingSpinner label="Loading settings..." />;

  return (
    <div>
      <h1 className="font-display text-2xl text-brand-950">Clinic Settings</h1>
      <p className="mt-1 text-sm text-brand-500">
        These details power your contact info, footer and structured data across the site.
      </p>

      {!live && (
        <div className="mt-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
          <p>
            Showing demo settings — the backend API isn&rsquo;t reachable yet, so saving here
            won&rsquo;t persist until it&rsquo;s connected.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 max-w-2xl space-y-8">
        <div className="rounded-xl2 border border-brand-100 bg-white p-6">
          <h2 className="font-display text-lg text-brand-950">General</h2>
          <div className="mt-4 space-y-4">
            <Input label="Clinic name" error={errors.clinicName?.message} {...register("clinicName")} />
            <Input label="Tagline" {...register("tagline")} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Phone" error={errors.phone?.message} {...register("phone")} />
              <Input label="Email" type="email" error={errors.email?.message} {...register("email")} />
            </div>
          </div>
        </div>

        <div className="rounded-xl2 border border-brand-100 bg-white p-6">
          <h2 className="font-display text-lg text-brand-950">Address</h2>
          <div className="mt-4 space-y-4">
            <Input label="Street address" error={errors.address?.message} {...register("address")} />
            <div className="grid gap-4 sm:grid-cols-3">
              <Input label="Suburb" error={errors.suburb?.message} {...register("suburb")} />
              <Input label="State" placeholder="VIC" error={errors.state?.message} {...register("state")} />
              <Input label="Postcode" error={errors.postcode?.message} {...register("postcode")} />
            </div>
            <Input label="Google Maps URL" placeholder="https://maps.google.com/..." {...register("googleMapsUrl")} />
          </div>
        </div>

        <div className="rounded-xl2 border border-brand-100 bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg text-brand-950">Opening Hours</h2>
            <Button type="button" variant="ghost" size="sm" onClick={() => append({ day: "", hours: "" })}>
              <Plus className="h-4 w-4" /> Add row
            </Button>
          </div>
          <div className="mt-4 space-y-3">
            {fields.map((field, i) => (
              <div key={field.id} className="flex items-end gap-3">
                <Input label="Day(s)" placeholder="Monday – Friday" {...register(`openingHours.${i}.day`)} />
                <Input label="Hours" placeholder="8:00 AM – 6:00 PM" {...register(`openingHours.${i}.hours`)} />
                <button type="button" onClick={() => remove(i)} className="focus-ring mb-0.5 rounded-lg p-2.5 text-red-600 hover:bg-red-50" aria-label="Remove row">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl2 border border-brand-100 bg-white p-6">
          <h2 className="font-display text-lg text-brand-950">Social &amp; Other</h2>
          <div className="mt-4 space-y-4">
            <Input label="Instagram URL" {...register("instagram")} />
            <Input label="Facebook URL" {...register("facebook")} />
            <Textarea label="Emergency message" rows={2} {...register("emergencyMessage")} />
          </div>
        </div>

        <Button type="submit" size="md" disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Settings
        </Button>
      </form>
    </div>
  );
}
