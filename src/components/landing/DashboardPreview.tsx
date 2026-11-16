
import {
  Users,
  GraduationCap,
  UserCheck,
  Wallet,
  TrendingUp,
  CalendarDays,
} from "lucide-react";

const stats = [
  {
    title: "Total Students",
    value: "1,250",
    icon: Users,
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "Total Teachers",
    value: "85",
    icon: GraduationCap,
    color: "bg-purple-100 text-purple-600",
  },
  {
    title: "Present Today",
    value: "1,180",
    icon: UserCheck,
    color: "bg-green-100 text-green-600",
  },
  {
    title: "Monthly Revenue",
    value: "৳4,50,000",
    icon: Wallet,
    color: "bg-orange-100 text-orange-600",
  },
];

export default function DashboardPreview() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl shadow-blue-900/10 sm:p-7">
      <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">Overview</p>
          <h3 className="text-xl font-bold text-slate-900">
            School Dashboard
          </h3>
        </div>

        <span className="rounded-lg bg-green-50 px-3 py-2 text-xs font-semibold text-green-700">
          ● Live Preview
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-xl border border-slate-100 bg-slate-50 p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">
                    {stat.title}
                  </p>
                  <h4 className="mt-2 text-xl font-bold text-slate-900">
                    {stat.value}
                  </h4>
                </div>

                <div className={`rounded-xl p-3 ${stat.color}`}>
                  <Icon size={23} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 rounded-xl bg-blue-50 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-700">
              School Performance
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Sample monthly overview
            </p>
          </div>
          <TrendingUp className="text-blue-600" size={24} />
        </div>

        <div className="mt-5 flex h-28 items-end gap-3">
          {[45, 65, 52, 80, 60, 90, 72, 100, 78, 88, 65, 95].map(
            (height, index) => (
              <div
                key={index}
                className="flex-1 rounded-t-md bg-blue-500/80"
                style={{ height: `${height}%` }}
              />
            )
          )}
        </div>

        <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
          <CalendarDays size={14} />
          Monthly statistics (illustrative data)
        </div>
      </div>
    </div>
  );
}



