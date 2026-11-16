
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import DashboardPreview from "./DashboardPreview";

export default function HeroSection() {
  return (
    <section id="home" className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-blue-200/30 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 py-20 lg:grid-cols-2 lg:px-8 lg:py-28">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-4 py-2 text-sm font-medium text-blue-700">
            <ShieldCheck size={17} />
            Smart School Management Platform
          </div>

          <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Manage Your School
            <span className="block text-blue-600">
              Smarter & Easier
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
            Simplify student management, attendance, examinations,
            fees, staff records and school administration with
            SchoolERP — one complete school management solution.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-7 py-4 font-semibold text-white shadow-xl shadow-blue-600/20 transition hover:-translate-y-1 hover:bg-blue-700"
            >
              Get Started
              <ArrowRight size={19} />
            </Link>

            <Link
              href="#features"
              className="rounded-xl border border-slate-300 bg-white px-7 py-4 font-semibold text-slate-700 transition hover:border-blue-500 hover:text-blue-600"
            >
              Explore Features
            </Link>
          </div>

          <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-600">
            <span className="flex items-center gap-2">
              <CheckCircle2 size={17} className="text-green-600" />
              Easy Management
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 size={17} className="text-green-600" />
              Secure Access
            </span>
          </div>
        </div>

        <div className="relative">
          <DashboardPreview />
        </div>
      </div>
    </section>
  );
}



