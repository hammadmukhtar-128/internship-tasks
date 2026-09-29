import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <span className="eyebrow">404</span>
      <h1 className="mt-3 font-display text-4xl font-bold text-ink">Page Not Found</h1>
      <p className="mt-3 max-w-md text-ink/60">
        The page you&apos;re looking for doesn&apos;t exist or may have been moved.
      </p>
      <Link href="/" className="btn-gold mt-8">
        Back to Home
      </Link>
    </div>
  );
}
