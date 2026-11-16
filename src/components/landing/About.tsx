
import Link from "next/link";
import {
  Users,
  BookOpen,
  CalendarCheck,
  Wallet,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Student & Teacher Management",
  },
  {
    icon: BookOpen,
    title: "Academic Management",
  },
  {
    icon: CalendarCheck,
    title: "Attendance Management",
  },
  {
    icon: Wallet,
    title: "Fees & Financial Management",
  },
];

export default function AboutSection() {
  return (
    <section id="about" className="bg-white py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2">

        {/* About Content */}
        <div>
          <span className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            About SchoolERP
          </span>

          <h2 className="mt-4 text-3xl font-bold leading-tight text-slate-900 md:text-4xl">
            Everything Your School Needs in One Place
          </h2>

          <p className="mt-6 max-w-xl text-base leading-8 text-slate-600">
            SchoolERP is a school management application designed to
            simplify everyday school administration. It helps manage
            students, teachers, academic activities, attendance,
            examinations, fees, and financial records through one
            centralized platform.
          </p>

          <Link
            href="/login"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Explore SchoolERP
            <ArrowRight size={17} />
          </Link>
        </div>

        {/* Feature Highlights */}
        <div className="grid gap-4 sm:grid-cols-2">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50 p-5 transition hover:border-blue-200 hover:bg-blue-50"
              >
                <div className="rounded-lg bg-white p-3 text-blue-600 shadow-sm">
                  <Icon size={24} />
                </div>

                <h3 className="text-sm font-semibold leading-6 text-slate-800">
                  {feature.title}
                </h3>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
