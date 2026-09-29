"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { api } from "@/lib/api";

interface FormData {
  name: string;
  phone: string;
  email: string;
  message: string;
}

export default function InquiryForm({ propertyId }: { propertyId?: string }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const onSubmit = async (data: FormData) => {
    setStatus("sending");
    try {
      await api.post("/inquiries", { ...data, propertyId, type: "Viewing" });
      setStatus("sent");
      reset();
    } catch {
      setStatus("error");
    }
  };

  if (status === "sent") {
    return <p className="mt-4 text-sm text-gold-dark">Thank you — an advisor will contact you shortly.</p>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-3">
      <input
        {...register("name", { required: true })}
        placeholder="Full Name"
        className="w-full rounded-lg border border-ink/10 px-4 py-3 text-sm focus:border-gold focus:outline-none"
      />
      {errors.name && <p className="text-xs text-red-500">Name is required</p>}

      <input
        {...register("phone", { required: true })}
        placeholder="Phone Number"
        className="w-full rounded-lg border border-ink/10 px-4 py-3 text-sm focus:border-gold focus:outline-none"
      />
      {errors.phone && <p className="text-xs text-red-500">Phone is required</p>}

      <input
        type="email"
        {...register("email", { required: true })}
        placeholder="Email Address"
        className="w-full rounded-lg border border-ink/10 px-4 py-3 text-sm focus:border-gold focus:outline-none"
      />
      {errors.email && <p className="text-xs text-red-500">A valid email is required</p>}

      <textarea
        {...register("message", { required: true })}
        placeholder="I'd like to schedule a viewing..."
        rows={4}
        className="w-full rounded-lg border border-ink/10 px-4 py-3 text-sm focus:border-gold focus:outline-none"
      />
      {errors.message && <p className="text-xs text-red-500">Message is required</p>}

      <button type="submit" disabled={status === "sending"} className="btn-gold w-full text-xs">
        {status === "sending" ? "Sending..." : "Send Inquiry"}
      </button>
      {status === "error" && <p className="text-xs text-red-500">Something went wrong. Please try again.</p>}
    </form>
  );
}
