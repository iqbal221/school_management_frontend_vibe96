


import {
  Users,
  GraduationCap,
  BookOpen,
  CalendarCheck,
  ClipboardList,
  Wallet,
  TrendingUp,
  UserCog,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";

const features = [
  {
    number: "01",
    title: "Student Management",
    description:
      "Maintain student profiles, admission details, contact information and academic records in one organized place.",
    icon: Users,
    color: "bg-blue-100 text-blue-600",
  },
  {
    number: "02",
    title: "Teacher Management",
    description:
      "Organize teacher profiles, professional information and related school records efficiently.",
    icon: GraduationCap,
    color: "bg-purple-100 text-purple-600",
  },
  {
    number: "03",
    title: "Class & Academic Management",
    description:
      "Manage classes, academic sessions and essential academic information through a centralized system.",
    icon: BookOpen,
    color: "bg-indigo-100 text-indigo-600",
  },
  {
    number: "04",
    title: "Attendance Management",
    description:
      "Record daily student attendance manually using simple Present and Absent statuses.",
    icon: CalendarCheck,
    color: "bg-green-100 text-green-600",
  },
  {
    number: "05",
    title: "Examination Management",
    description:
      "Organize examination information, student results and academic performance records.",
    icon: ClipboardList,
    color: "bg-orange-100 text-orange-600",
  },
  {
    number: "06",
    title: "Fee Management",
    description:
      "Maintain student fee records, entry fees and payment-related information in an organized workflow.",
    icon: Wallet,
    color: "bg-pink-100 text-pink-600",
  },
  {
    number: "07",
    title: "Financial Management",
    description:
      "Keep track of school revenue and expenses to support better financial record management.",
    icon: TrendingUp,
    color: "bg-teal-100 text-teal-600",
  },
  {
    number: "08",
    title: "Official & Staff Management",
    description:
      "Maintain official and staff information to keep important school records accessible.",
    icon: UserCog,
    color: "bg-amber-100 text-amber-600",
  },
];

export default function FeaturesSection() {
  return (
    <section
      id="features"
      className="relative overflow-hidden bg-white py-20 sm:py-24"
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute -right-40 top-20 h-80 w-80 rounded-full bg-blue-100/60 blur-3xl" />
      <div className="pointer-events-none absolute -left-40 bottom-0 h-80 w-80 rounded-full bg-indigo-100/50 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        {/* Section heading */}
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
            <CheckCircle2 size={16} />
            Powerful Features
          </span>

          <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Everything Your School Needs,{" "}
            <span className="text-blue-600">In One Platform</span>
          </h2>

          <p className="mt-5 text-base leading-8 text-slate-600 sm:text-lg">
            SchoolERP brings essential school administration tools together
            to help manage academic activities, student information and
            financial records more efficiently.
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <article
                key={feature.number}
                className="group relative rounded-2xl border border-slate-200 bg-white p-6 transition duration-300 hover:-translate-y-2 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/5"
              >
                <div className="flex items-start justify-between">
                  <div
                    className={`inline-flex rounded-xl p-3 ${feature.color}`}
                  >
                    <Icon size={25} strokeWidth={1.8} />
                  </div>

                  <span className="text-sm font-bold text-slate-300 transition group-hover:text-blue-500">
                    {feature.number}
                  </span>
                </div>

                <h3 className="mt-6 text-lg font-bold text-slate-900">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {feature.description}
                </p>

                <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-blue-600">
                  <span>Built into SchoolERP</span>
                  <ArrowUpRight
                    size={16}
                    className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
                  />
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
