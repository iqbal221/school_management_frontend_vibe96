
import {
  ShieldCheck,
  UserCog,
  Users,
  LockKeyhole,
  CheckCircle2,
} from "lucide-react";

const roles = [
  {
    icon: ShieldCheck,
    name: "SUPER_ADMIN",
    subtitle: "System Administrator",
    description:
      "Has higher-level administrative permissions to manage administrator accounts and access authorized system-level functions.",
    permissions: [
      "Manage administrator accounts",
      "Update administrator information",
      "Access permitted system settings",
    ],
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: UserCog,
    name: "ADMIN",
    subtitle: "School Administrator",
    description:
      "Manages the school's regular academic, administrative, and financial activities within assigned permissions.",
    permissions: [
      "Manage students and teachers",
      "Manage classes and attendance",
      "Manage examinations and fees",
      "Manage financial and official records",
    ],
    color: "bg-indigo-100 text-indigo-600",
  },
];

export default function SecuritySection() {
  return (
    <section
      id="security"
      className="bg-slate-50 py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-6">

        {/* Section Heading */}
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
            <LockKeyhole size={16} />
            Security & Administration
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Controlled Access for Better School Management
          </h2>

          <p className="mt-5 text-base leading-7 text-slate-600">
            SchoolERP provides two administrator roles to organize
            administrative responsibilities and manage access to
            application features.
          </p>
        </div>

        {/* Administrator Roles */}
        <div className="grid gap-6 md:grid-cols-2">
          {roles.map((role) => {
            const Icon = role.icon;

            return (
              <div
                key={role.name}
                className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition hover:shadow-lg"
              >
                <div className="flex items-center gap-4">
                  <div className={`rounded-xl p-3 ${role.color}`}>
                    <Icon size={28} />
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-slate-900">
                      {role.name}
                    </h3>
                    <p className="text-sm text-slate-500">
                      {role.subtitle}
                    </p>
                  </div>
                </div>

                <p className="mt-6 text-sm leading-7 text-slate-600">
                  {role.description}
                </p>

                <div className="mt-6 border-t border-slate-100 pt-5">
                  <h4 className="mb-4 text-sm font-semibold text-slate-900">
                    Responsibilities
                  </h4>

                  <ul className="space-y-3">
                    {role.permissions.map((permission) => (
                      <li
                        key={permission}
                        className="flex items-start gap-3 text-sm text-slate-600"
                      >
                        <CheckCircle2
                          size={18}
                          className="mt-0.5 shrink-0 text-green-600"
                        />
                        {permission}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Security Note */}
        <div className="mt-8 flex items-start gap-4 rounded-xl border border-blue-100 bg-blue-50 p-5">
          <ShieldCheck
            size={24}
            className="mt-0.5 shrink-0 text-blue-600"
          />
        </div>
      </div>
    </section>
  );
}
