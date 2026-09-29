import Link from "next/link";
import { FaInstagram, FaFacebookF, FaLinkedinIn, FaTwitter } from "react-icons/fa";

const communities = ["DHA Lahore", "Bahria Town Lahore", "Gulberg", "Johar Town", "Model Town"];
const quickLinks = [
  { href: "/properties", label: "Properties" },
  { href: "/agents", label: "Agents" },
  { href: "/about", label: "About Us" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export default function Footer() {
  return (
    <footer className="bg-ink text-ivory">
      <div className="container-luxury grid grid-cols-1 gap-12 py-20 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <h3 className="font-display text-2xl font-bold">
            Lahore <span className="gold-text">Estate</span> Hub
          </h3>
          <p className="mt-4 text-sm leading-relaxed text-ivory/60">
            A premium Lahore real estate advisory connecting buyers, renters, and investors with homes across the city’s most sought-after neighbourhoods.
          </p>
          <div className="mt-6 flex gap-3">
            {[FaInstagram, FaFacebookF, FaLinkedinIn, FaTwitter].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-ivory/15 transition-colors hover:border-gold hover:text-gold"
              >
                <Icon size={14} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="eyebrow text-ivory/50">Quick Links</h4>
          <ul className="mt-5 space-y-3">
            {quickLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-sm text-ivory/70 transition-colors hover:text-gold">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="eyebrow text-ivory/50">Communities</h4>
          <ul className="mt-5 space-y-3">
            {communities.map((c) => (
              <li key={c}>
                <Link
                  href={`/communities/${c.toLowerCase().replace(/\s+/g, "-")}`}
                  className="text-sm text-ivory/70 transition-colors hover:text-gold"
                >
                  {c}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="eyebrow text-ivory/50">Newsletter</h4>
          <p className="mt-5 text-sm text-ivory/60">
            Subscribe for new listings and market insights delivered monthly.
          </p>
          <form className="mt-4 flex overflow-hidden rounded-full border border-ivory/15">
            <input
              type="email"
              placeholder="Your email"
              className="w-full bg-transparent px-4 py-3 text-sm text-ivory placeholder:text-ivory/40 focus:outline-none"
            />
            <button type="submit" className="bg-gold-gradient px-5 text-xs font-semibold uppercase text-ink">
              Join
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-ivory/10 py-6">
        <div className="container-luxury flex flex-col items-center justify-between gap-3 text-xs text-ivory/50 md:flex-row">
          <p>&copy; {new Date().getFullYear()} Lahore Estate Hub. All rights reserved.</p>
          <p>Property solutions for Lahore, Pakistan</p>
        </div>
      </div>
    </footer>
  );
}
