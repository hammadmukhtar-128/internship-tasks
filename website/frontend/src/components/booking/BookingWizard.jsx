import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  User,
  Calendar,
  Clock3,
  Stethoscope,
} from "lucide-react";
import { appointmentSchema } from "../../utils/validations";
import { TIME_SLOTS } from "../../utils/constants";
import { formatDate } from "../../utils/format";
import { cn } from "../../utils/cn";
import Input from "../common/Input";
import Textarea from "../common/Textarea";
import Button from "../common/Button";
import { useToast } from "../common/Toast";
import { createAppointment } from "../../services/appointmentService";

const steps = ["Select Service", "Select Practitioner", "Select Date", "Select Time", "Your Details", "Review & Confirm"];

export default function BookingWizard({ services, practitioners }) {
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const { showToast } = useToast();

  const {
    register,
    watch,
    trigger,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      patientName: "",
      email: "",
      phone: "",
      service: "",
      practitioner: "",
      preferredDate: "",
      preferredTime: "",
      message: "",
    },
    mode: "onChange",
  });

  const values = watch();
  const today = new Date().toISOString().split("T")[0];

  const availablePractitioners = useMemo(() => {
    if (!values.service) return practitioners;
    const withService = practitioners.filter((p) => p.services?.includes(values.service));
    return withService.length > 0 ? withService : practitioners;
  }, [values.service, practitioners]);

  const selectedService = services.find((s) => s.slug === values.service);
  const selectedPractitioner = practitioners.find((p) => p.slug === values.practitioner);

  async function goNext() {
    const fieldsPerStep = [["service"], [], ["preferredDate"], ["preferredTime"], ["patientName", "email", "phone"], []];
    const fields = fieldsPerStep[step];
    if (fields.length > 0) {
      const valid = await trigger(fields);
      if (!valid) return;
    }
    setStep((s) => Math.min(s + 1, steps.length - 1));
  }

  function goBack() {
    setStep((s) => Math.max(s - 1, 0));
  }

  async function onSubmit(data) {
    setSubmitting(true);
    try {
      await createAppointment(data);
      setSuccess(true);
    } catch (err) {
      showToast(err.message || "Something went wrong. Please try again.", "error");
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="rounded-xl2 border border-brand-100 bg-white p-8 text-center shadow-soft sm:p-12">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h2 className="mt-6 font-display text-2xl text-brand-950">Your appointment request has been received.</h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-brand-600">
          Our team will contact you shortly to confirm your appointment. If anything below
          needs to change, just let us know when we call or email you.
        </p>
        <div className="mx-auto mt-8 max-w-sm space-y-3 rounded-xl bg-sand-50 p-6 text-left text-sm">
          <div className="flex justify-between">
            <span className="text-brand-500">Service</span>
            <span className="font-medium text-brand-900">{selectedService?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-brand-500">Preferred date</span>
            <span className="font-medium text-brand-900">{formatDate(values.preferredDate)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-brand-500">Preferred time</span>
            <span className="font-medium text-brand-900">{values.preferredTime}</span>
          </div>
        </div>
        <Button to="/" variant="secondary" size="md" className="mt-8">
          Back to Home
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-xl2 border border-brand-100 bg-white p-6 shadow-soft sm:p-10">
      <ol className="mb-8 flex items-center gap-1.5 sm:gap-2" aria-label="Booking steps">
        {steps.map((label, i) => (
          <li key={label} className="flex flex-1 flex-col items-center gap-1.5">
            <div className={cn("h-1.5 w-full rounded-full transition-colors", i <= step ? "bg-brand-700" : "bg-brand-100")} />
            <span className={cn("hidden text-[11px] font-medium sm:block", i === step ? "text-brand-800" : "text-brand-400")}>
              {label}
            </span>
          </li>
        ))}
      </ol>

      <form onSubmit={handleSubmit(onSubmit)}>
        {step === 0 && (
          <fieldset>
            <legend className="font-display text-xl text-brand-950">Select a service</legend>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {services.map((s) => (
                <label
                  key={s.slug}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-colors focus-within:ring-2 focus-within:ring-brand-500",
                    values.service === s.slug ? "border-brand-600 bg-brand-50" : "border-brand-100 hover:bg-sand-50"
                  )}
                >
                  <input type="radio" value={s.slug} className="sr-only" {...register("service")} />
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg">
                    <img src={s.image} alt="" className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-brand-900">{s.name}</p>
                    <p className="text-xs text-brand-500">{s.duration}</p>
                  </div>
                </label>
              ))}
            </div>
            {errors.service && <p className="mt-2 text-sm text-red-600">{errors.service.message}</p>}
          </fieldset>
        )}

        {step === 1 && (
          <fieldset>
            <legend className="font-display text-xl text-brand-950">Select a practitioner</legend>
            <p className="mt-1 text-sm text-brand-500">Optional — we&rsquo;re happy to match you with the best fit.</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <label
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-colors",
                  !values.practitioner ? "border-brand-600 bg-brand-50" : "border-brand-100 hover:bg-sand-50"
                )}
              >
                <input type="radio" value="" className="sr-only" {...register("practitioner")} />
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-brand-600">
                  <User className="h-5 w-5" />
                </span>
                <span className="text-sm font-semibold text-brand-900">No preference</span>
              </label>
              {availablePractitioners.map((p) => (
                <label
                  key={p.slug}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-colors",
                    values.practitioner === p.slug ? "border-brand-600 bg-brand-50" : "border-brand-100 hover:bg-sand-50"
                  )}
                >
                  <input type="radio" value={p.slug} className="sr-only" {...register("practitioner")} />
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-800 text-xs font-semibold text-white">
                    {p.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </span>
                  <span>
                    <p className="text-sm font-semibold text-brand-900">{p.name}</p>
                    <p className="text-xs text-brand-500">{p.specialization}</p>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        )}

        {step === 2 && (
          <fieldset>
            <legend className="font-display text-xl text-brand-950">Select a date</legend>
            <div className="mt-5 max-w-xs">
              <Input label="Preferred date" type="date" min={today} error={errors.preferredDate?.message} {...register("preferredDate")} />
            </div>
          </fieldset>
        )}

        {step === 3 && (
          <fieldset>
            <legend className="font-display text-xl text-brand-950">Select a preferred time</legend>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {TIME_SLOTS.map((slot) => (
                <label
                  key={slot}
                  className={cn(
                    "cursor-pointer rounded-xl border px-3 py-2.5 text-center text-sm font-medium transition-colors",
                    values.preferredTime === slot ? "border-brand-600 bg-brand-50 text-brand-800" : "border-brand-100 text-brand-700 hover:bg-sand-50"
                  )}
                >
                  <input type="radio" value={slot} className="sr-only" {...register("preferredTime")} />
                  {slot}
                </label>
              ))}
            </div>
            {errors.preferredTime && <p className="mt-2 text-sm text-red-600">{errors.preferredTime.message}</p>}
          </fieldset>
        )}

        {step === 4 && (
          <fieldset className="space-y-5">
            <legend className="font-display text-xl text-brand-950">Your details</legend>
            <Input label="Full name" placeholder="Jane Smith" error={errors.patientName?.message} {...register("patientName")} />
            <div className="grid gap-5 sm:grid-cols-2">
              <Input label="Email" type="email" placeholder="jane@example.com" error={errors.email?.message} {...register("email")} />
              <Input label="Phone" type="tel" placeholder="0400 000 000" error={errors.phone?.message} {...register("phone")} />
            </div>
            <Textarea
              label="Additional message (optional)"
              rows={4}
              placeholder="Let us know anything else that might help — no medical history needed."
              error={errors.message?.message}
              {...register("message")}
            />
          </fieldset>
        )}

        {step === 5 && (
          <fieldset>
            <legend className="font-display text-xl text-brand-950">Review &amp; confirm</legend>
            <div className="mt-5 space-y-4 rounded-xl bg-sand-50 p-6">
              <ReviewRow icon={Stethoscope} label="Service" value={selectedService?.name || "—"} />
              <ReviewRow icon={User} label="Practitioner" value={selectedPractitioner?.name || "No preference"} />
              <ReviewRow icon={Calendar} label="Date" value={formatDate(values.preferredDate)} />
              <ReviewRow icon={Clock3} label="Time" value={values.preferredTime} />
              <div className="border-t border-brand-100 pt-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-400">Patient</p>
                <p className="mt-1 text-sm text-brand-900">{values.patientName}</p>
                <p className="text-sm text-brand-600">{values.email}</p>
                <p className="text-sm text-brand-600">{values.phone}</p>
                {values.message && <p className="mt-2 text-sm italic text-brand-600">&ldquo;{values.message}&rdquo;</p>}
              </div>
            </div>
          </fieldset>
        )}

        <div className="mt-8 flex items-center justify-between gap-4">
          <Button type="button" variant="ghost" size="md" onClick={goBack} disabled={step === 0} className={step === 0 ? "invisible" : ""}>
            <ChevronLeft className="h-4 w-4" /> Back
          </Button>

          {step < steps.length - 1 ? (
            <Button type="button" size="md" onClick={goNext}>
              Continue <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button type="submit" size="md" disabled={submitting}>
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Confirm Appointment
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}

function ReviewRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-brand-600 shadow-sm">
        <Icon className="h-4 w-4" />
      </span>
      <div className="flex flex-1 justify-between text-sm">
        <span className="text-brand-500">{label}</span>
        <span className="font-medium text-brand-900">{value}</span>
      </div>
    </div>
  );
}
