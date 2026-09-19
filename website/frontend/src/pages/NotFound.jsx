import Seo from "../components/common/Seo";
import Button from "../components/common/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <Seo title="Page not found" description="The page you're looking for doesn't exist or may have moved." />
      <p className="font-display text-6xl text-brand-200">404</p>
      <h1 className="mt-4 font-display text-2xl text-brand-950">Page not found</h1>
      <p className="mt-2 max-w-sm text-sm text-brand-600">
        The page you&rsquo;re looking for doesn&rsquo;t exist or may have moved.
      </p>
      <div className="mt-6 flex gap-3">
        <Button to="/" variant="secondary" size="md">Back to Home</Button>
        <Button to="/book-appointment" size="md">Book an Appointment</Button>
      </div>
    </div>
  );
}
