
import {
  Building2,
  Clock,
  Database,
  ShieldCheck,
  Users,
  TrendingUp,
} from "lucide-react";

const benefits = [
  {
    icon: Building2,
    title: "Centralized Management",
    description:
      "Manage your school&apos;s daily activities from one organized platform.",
  },
  {
    icon: Clock,
    title: "Save Time and Effort",
    description:
      "Simplify administrative tasks and reduce repetitive paperwork.",
  },
  {
    icon: Database,
    title: "Organized Records",
    description:
      "Keep student, teacher, academic, and financial records organized.",
  },
  {
    icon: ShieldCheck,
    title: "Role-Based Access",
    description:
      "Manage administrator access through SUPER_ADMIN and ADMIN roles.",
  },
  {
    icon: Users,
    title: "Easy Record Management",
    description:
      "Maintain student, teacher, official, and staff information easily.",
  },
  {
    icon: TrendingUp,
    title: "Better School Operations",
    description:
      "Manage attendance, examinations, fee collection, and expenses efficiently.",
  },
];

export default function WhyChooseSchoolERP() {
  return (
    <section id="why-choose-us" className="bg-white py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-6">

        {/* Heading */}
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Why Choose SchoolERP?
          </span>

          <h2 className="mt-4 text-3xl font-extrabold text-slate-900 md:text-4xl">
            Designed to Make School Management Easier
          </h2>

          <p className="mt-4 text-base leading-7 text-slate-600">
            Manage your school&apos;s important activities with simple, <br></br>
            organized, and convenient management tools.
          </p>
        </div>

        {/* Benefits */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;

            return (
              <div
                key={benefit.title}
                className="rounded-xl border border-slate-200 p-6 transition hover:border-blue-200 hover:shadow-md"
              >
                <div className="mb-4 inline-flex rounded-lg bg-blue-50 p-3 text-blue-600">
                  <Icon size={24} />
                </div>

                <h3 className="mb-2 text-lg font-semibold text-slate-900">
                  {benefit.title}
                </h3>

                <p className="text-sm leading-7 text-slate-600">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
