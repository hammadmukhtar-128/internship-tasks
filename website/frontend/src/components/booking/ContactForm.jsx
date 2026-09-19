import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send, CheckCircle2 } from "lucide-react";
import { contactSchema } from "../../utils/validations";
import Input from "../common/Input";
import Textarea from "../common/Textarea";
import Button from "../common/Button";
import { useToast } from "../common/Toast";
import { sendContactMessage } from "../../services/contactService";

export default function ContactForm() {
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", phone: "", message: "" },
  });

  async function onSubmit(data) {
    setSubmitting(true);
    try {
      await sendContactMessage(data);
      setSent(true);
      reset();
    } catch (err) {
      showToast(err.message || "Something went wrong. Please try again.", "error");
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <div className="rounded-xl2 border border-brand-100 bg-white p-8 text-center shadow-soft">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <h3 className="mt-5 font-display text-xl text-brand-950">Message sent</h3>
        <p className="mt-2 text-sm text-brand-600">
          Thanks for reaching out — we&rsquo;ll get back to you as soon as we can.
        </p>
        <Button variant="secondary" size="sm" className="mt-6" onClick={() => setSent(false)}>
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 rounded-xl2 border border-brand-100 bg-white p-6 shadow-soft sm:p-8">
      <Input label="Full name" placeholder="Jane Smith" error={errors.name?.message} {...register("name")} />
      <div className="grid gap-5 sm:grid-cols-2">
        <Input label="Email" type="email" placeholder="jane@example.com" error={errors.email?.message} {...register("email")} />
        <Input label="Phone (optional)" type="tel" placeholder="0400 000 000" error={errors.phone?.message} {...register("phone")} />
      </div>
      <Textarea label="Message" rows={5} placeholder="How can we help?" error={errors.message?.message} {...register("message")} />
      <Button type="submit" size="md" disabled={submitting} className="w-full sm:w-auto">
        {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        Send Message
      </Button>
    </form>
  );
}
