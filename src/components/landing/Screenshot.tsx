
import Image from "next/image";
import { Maximize2, Monitor } from "lucide-react";


const screenshots = [
  {
    title: "Dashboard Overview",
    description:
      "Get an overview of important school activities and statistics.",
    image: "/dashboard.png",
    category: "Dashboard",
    featured: true,
  },
  {
    title: "Student Management",
    description:
      "Manage student profiles and academic information.",
    image: "/student.png",
    category: "Students",
  },
  {
    title: "Result Management",
    description:
      "Record and review daily student attendance.",
    image: "/result.png",
    category: "Result",
  },
  {
    title: "Financial Management",
    description:
      "Organize fee collection, revenue, and expenses.",
    image: "/financial.png",
    category: "Finance",
  },
];

export default function ScreenshotsSection() {
  return (
    <section
      id="screenshots"
      className="overflow-hidden bg-slate-50 py-20 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-6">

        {/* Section heading */}
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-600">
            <Monitor size={16} />
            Application Preview
          </span>

          <h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Explore the SchoolERP Interface
          </h2>

          <p className="mt-4 text-base leading-7 text-slate-600">
            Take a closer look at the tools that help organize
            your school&apos;s daily operations.
          </p>
        </div>

        {/* Screenshot gallery */}
        <div className="grid gap-8 md:grid-cols-2">

          {screenshots.map((item) => (
            <div
              key={item.title}
              className={`group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl ${
                item.featured ? "md:col-span-1" : ""
              }`}
            >
              {/* Image */}
              <div
                className={`relative overflow-hidden bg-slate-200 ${
                  item.featured
                    ? "aspect-[16/8]"
                    : "aspect-[16/10]"
                }`}
              >
                <Image
                  src={item.image}
                  alt={`SchoolERP ${item.title} screenshot`}
                  fill
                  sizes={
                    item.featured
                      ? "100vw"
                      : "(max-width: 768px) 100vw, 50vw"
                  }
                  className="object-contain object-top transition duration-700 group-hover:scale-[1.02]"
                />

                <div className="absolute inset-0 flex items-center justify-center bg-slate-950/0 transition group-hover:bg-slate-950/10">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-indigo-600 opacity-0 shadow-lg transition group-hover:opacity-100">
                    <Maximize2 size={19} />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="flex items-start justify-between gap-4 p-6">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                    {item.category}
                  </span>

                  <h3 className="mt-2 text-lg font-bold text-slate-900">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}

        </div>

        {/* Bottom CTA */}
        <div className="mt-14 text-center">
          <p className="mb-5 text-sm text-slate-600">
            Want to explore the application yourself?
          </p>

          <a
            href="/login"
            className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700"
          >
            Explore Live Demo
          </a>
        </div>

      </div>
    </section>
  );
}
