import { useState } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Lock, Activity } from "lucide-react";
import { adminLoginSchema } from "../../utils/validations";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import Seo from "../../components/common/Seo";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, loading: authLoading } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: { email: "", password: "" },
  });

  if (!authLoading && isAuthenticated) {
    return <Navigate to={location.state?.from || "/admin/dashboard"} replace />;
  }

  async function onSubmit(data) {
    setSubmitting(true);
    setError("");
    try {
      await login(data.email, data.password);
      navigate(location.state?.from || "/admin/dashboard");
    } catch (err) {
      setError(err.message || "Login failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-950 p-4">
      <Seo title="Admin Login" description="Sign in to the clinic admin dashboard." path="/admin/login" />
      <div className="w-full max-w-sm rounded-xl2 bg-white p-8 shadow-soft">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-700 text-white">
          <Activity className="h-6 w-6" />
        </div>
        <h1 className="mt-5 text-center font-display text-2xl text-brand-950">Admin Login</h1>
        <p className="mt-1.5 text-center text-sm text-brand-500">
          Sign in to manage appointments, services and content.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-7 space-y-5">
          <Input label="Email" type="email" autoComplete="username" error={errors.email?.message} {...register("email")} />
          <Input label="Password" type="password" autoComplete="current-password" error={errors.password?.message} {...register("password")} />
          {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
          <Button type="submit" size="md" disabled={submitting} className="w-full">
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
            Sign In
          </Button>
        </form>
        <p className="mt-6 text-center text-xs text-brand-400">
          Secure authentication is handled by the Express backend.
        </p>
      </div>
    </div>
  );
}
