
import Link from "next/link";
import {
  GraduationCap,
  ArrowUpRight,
  Mail,
  MapPin,
  ShieldCheck,
  LayoutDashboard,
  Users,
  BookOpen,
  Wallet,
} from "lucide-react";

const productLinks = [
  { label: "Student Management", href: "#features" },
  { label: "Teacher Management", href: "#features" },
  { label: "Attendance Management", href: "#features" },
  { label: "Examination Management", href: "#features" },
  { label: "Fees Management", href: "#features" },
];

const platformLinks = [
  { label: "About SchoolERP", href: "#about" },
  { label: "Why Choose Us", href: "#why-choose-us" },
  { label: "Security & Access", href: "#security" },
  { label: "Dashboard", href: "/login" },
];

const accountLinks = [
  { label: "Login", href: "/login" },
  { label: "Get Started", href: "/login" },
  { label: "Contact", href: "#contact" },
];

export default function Footer() {
  return (
    <footer
      id="contact"
      className="relative overflow-hidden bg-[#07152e] text-white"
    >
      {/* Decorative background */}
      <div className="pointer-events-none absolute -right-32 -top-40 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5">

  
      

        {/* Footer Columns */}
        <div className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="rounded-xl bg-blue-600 p-3">
                <GraduationCap size={29} />
              </div>

              <div>
                <h3 className="text-2xl font-extrabold">
                  SchoolERP
                </h3>
                <p className="text-xs tracking-wide text-slate-400">
                  SCHOOL MANAGEMENT SYSTEM
                </p>
              </div>
            </Link>

            <p className="mt-6 text-sm leading-7 text-slate-400">
              A centralized school management platform designed
              to organize student records, staff information,
              attendance, examinations and financial operations.
            </p>

            <div className="mt-6 flex items-center gap-2 text-sm text-slate-400">
              <ShieldCheck size={17} className="text-blue-400" />
              Smarter School Administration
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-base font-bold text-white">
              Product
            </h4>

            <ul className="mt-7 space-y-4">
              {productLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 transition hover:text-blue-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-base font-bold text-white">
              Platform
            </h4>

            <ul className="mt-7 space-y-4">
              {platformLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 transition hover:text-blue-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-base font-bold text-white">
              Account & Contact
            </h4>

            <ul className="mt-7 space-y-4">
              {accountLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 transition hover:text-blue-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-8 border-t border-white/10 pt-6">
              <div className="flex items-start gap-3 text-sm text-slate-400">
                <LayoutDashboard
                  size={18}
                  className="shrink-0 text-blue-400"
                />
                <span>
                  One platform for organized school administration.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="flex flex-col items-center justify-between gap-5 border-t border-white/10 py-7 text-center sm:flex-row sm:text-left">
          <p className="text-sm text-slate-500">
            © 2026 SchoolERP. All rights reserved.
          </p>

          <div className="flex items-center gap-2 text-sm text-slate-400">
            <span>Built for smarter school management</span>
            <GraduationCap size={18} className="text-blue-400" />
          </div>

          <Link
            href="/"
            className="text-sm font-semibold text-blue-400 transition hover:text-blue-300"
          >
            Back to top ↑
          </Link>
        </div>

      </div>
    </footer>
  );
}
