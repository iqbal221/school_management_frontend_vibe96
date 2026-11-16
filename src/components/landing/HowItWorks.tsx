
import {
  UserCheck,
  Settings,
  Users,
  BarChart3,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

const steps = [
  {
    number: "01",
    icon: UserCheck,
    title: "Get Administrator Access",
    description:
      "The authorized administrator receives an account to access the SchoolERP application securely.",
  },
  {
    number: "02",
    icon: Settings,
    title: "Configure School Information",
    description:
      "Set up the necessary school information, academic sessions, classes, and administrative details.",
  },
  {
    number: "03",
    icon: Users,
    title: "Manage School Records",
    description:
      "Add students, teachers, officials, and manage attendance, examinations, fees, and other records.",
  },
  {
    number: "04",
    icon: BarChart3,
    title: "Manage Daily Operations",
    description:
      "Use the dashboard and available management modules to monitor school activities and maintain organized records.",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="bg-white py-20 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-6">

        {/* Heading */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <span className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600">
            Simple Process
          </span>

          <h2 className="mt-5 text-3xl font-extrabold text-slate-900 md:text-4xl">
            How SchoolERP Works
          </h2>

          <p className="mt-5 text-lg leading-8 text-slate-600">
            Get started with SchoolERP and organize your school&apos;s
            administrative and academic activities through a simple workflow.
          </p>
        </div>

        {/* Steps */}
        <div className="relative grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div key={step.number} className="relative text-center">
                <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <Icon size={34} />

                  <span className="absolute -right-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                    {step.number}
                  </span>
                </div>

                <h3 className="mb-3 text-lg font-bold text-slate-900">
                  {step.title}
                </h3>

                <p className="text-sm leading-7 text-slate-600">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white transition hover:bg-blue-700"
          >
            Get Started
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
