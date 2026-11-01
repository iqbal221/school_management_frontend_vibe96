
"use client";

import { useMemo, useState } from "react";
import type { ElementType } from "react";

import {
  CalendarDays,
  CheckCircle2,
  Users,
  UserCheck,
  GraduationCap,
  RefreshCw,
  XCircle,
  TrendingUp,
  CalendarX,
  ArrowUpRight,
  RotateCcw,
} from "lucide-react";

import {
  useGetAttendanceDashboardQuery,
} from "@/redux/api/attendance/attendanceDashboardApi";

import Loader from "@/components/Loader";

// =========================================================
// HELPERS
// =========================================================

const getToday = () => {
  const date = new Date();

  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
};

const getFirstDayOfMonth = () => {
  const date = new Date();

  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    "01",
  ].join("-");
};

const formatNumber = (value?: number) =>
  new Intl.NumberFormat("en-US").format(value ?? 0);

const formatPercentage = (value?: number) =>
  `${(value ?? 0).toFixed(1)}%`;

const formatDate = (date?: string) => {
  if (!date) return "";

  const parsed = new Date(`${date.slice(0, 10)}T00:00:00`);

  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

// =========================================================
// TYPES
// =========================================================

type AttendanceGroup = {
  total?: number;
  present?: number;
  absent?: number;
  late?: number;
  leave?: number;
  attendancePercentage?: number;
};

type DashboardData = {
  date?: string;
  startDate?: string;
  endDate?: string;

  totals?: {
    students?: number;
    teachers?: number;
    officials?: number;
  };

  students?: AttendanceGroup;
  teachers?: AttendanceGroup;
  officials?: AttendanceGroup;
};

type StatCardProps = {
  title: string;
  total: number;
  present: number;
  absent: number;
  percentage: number;
  icon: ElementType;
  gradient: string;
  iconColor: string;
};

// =========================================================
// ATTENDANCE CALCULATION
// =========================================================

const calculateAttendance = (group?: AttendanceGroup) => {
  const present = Math.max(0, Number(group?.present ?? 0));
  const absent = Math.max(0, Number(group?.absent ?? 0));

  // Total attendance records, not registered members.
  const total = present + absent;

  const percentage =
    total > 0
      ? Number(((present / total) * 100).toFixed(1))
      : 0;

  return {
    total,
    present,
    absent,
    percentage,
  };
};

// =========================================================
// STAT CARD
// =========================================================

function StatCard({
  title,
  total,
  present,
  absent,
  percentage,
  icon: Icon,
  gradient,
  iconColor,
}: StatCardProps) {
  const progress = Math.min(Math.max(percentage, 0), 100);

  const items = [
    {
      label: "Present",
      value: present,
      icon: CheckCircle2,
      bg: "bg-slate-100",
      iconBg: "bg-white",
      color: "text-slate-900",
    },
    {
      label: "Absent",
      value: absent,
      icon: CalendarX,
      bg: "bg-slate-100",
      iconBg: "bg-white",
      color: "text-slate-900",
    },
  ];

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow duration-200 hover:shadow-md">
      <div className={`h-1`} />

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-slate-500">
              {title} Attendance Records
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              {formatNumber(total)}
            </h2>
          </div>

          <div
            className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconColor}`}
          >
            <Icon className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          {items.map((item) => {
            const StatusIcon = item.icon;

            return (
              <div
                key={item.label}
                className={`rounded-lg p-3 ${item.bg}`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-md ${item.iconBg}`}
                  >
                    <StatusIcon className={`h-4 w-4 ${item.color}`} />
                  </div>

                  <span className="text-xs font-medium text-slate-600">
                    {item.label}
                  </span>
                </div>

                <p className={`mt-2 text-xl font-bold ${item.color}`}>
                  {formatNumber(item.value)}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between gap-3">
            <span className="flex items-center gap-2 text-sm text-slate-500">
              <TrendingUp className="h-4 w-4" />
              Attendance rate
            </span>

            <span className="text-sm font-semibold text-slate-800">
              {formatPercentage(percentage)}
            </span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full transition-all duration-500 ${gradient}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// =========================================================
// PAGE
// =========================================================

export default function AttendanceDashboardPage() {
  const today = useMemo(() => getToday(), []);
  const firstDayOfMonth = useMemo(() => getFirstDayOfMonth(), []);

  // Default: current month
  const [startDate, setStartDate] = useState(firstDayOfMonth);
  const [endDate, setEndDate] = useState(today);

  const validRange =
    Boolean(startDate) &&
    Boolean(endDate) &&
    startDate <= endDate &&
    endDate <= today;

  // =======================================================
  // ATTENDANCE DASHBOARD QUERY
  // Automatically refetches when dates change.
  // =======================================================

  const {
    data: response,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetAttendanceDashboardQuery(
    {
      startDate,
      endDate,
    },
    {
      skip: !validRange,
    }
  );

  // =======================================================
  // RESPONSE DATA
  // =======================================================

  const dashboard: DashboardData | undefined = useMemo(() => {
    if (!response || typeof response !== "object") {
      return undefined;
    }

    const result = response as {
      data?: DashboardData;
      result?: DashboardData;
    } & DashboardData;

    if (result.data) return result.data;
    if (result.result) return result.result;

    return result;
  }, [response]);

  // =======================================================
  // RESET DATE RANGE
  // =======================================================

  const handleReset = () => {
    setStartDate(firstDayOfMonth);
    setEndDate(today);
  };

  // =======================================================
  // LOADING
  // =======================================================

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <Loader />
      </div>
    );
  }

  // =======================================================
  // INVALID DATE RANGE
  // =======================================================

  if (!validRange) {
    return (
      <div className="min-h-[60vh] bg-slate-50 p-4 sm:p-6">
        <div className="rounded-xl border border-amber-200 bg-white p-6">
          <h2 className="font-semibold text-slate-800">
            Invalid attendance date range
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Please select a valid date range up to today.
          </p>

          <button
            type="button"
            onClick={handleReset}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
          >
            <RotateCcw className="h-4 w-4" />
            Reset Dates
          </button>
        </div>
      </div>
    );
  }

  // =======================================================
  // ERROR
  // =======================================================

  if (isError || !dashboard) {
    const errorMessage =
      typeof error === "object" &&
      error &&
      "data" in error
        ? JSON.stringify((error as { data?: unknown }).data)
        : "Unable to load attendance records.";

    return (
      <div className="min-h-[60vh] bg-slate-50 p-4 sm:p-6">
        <div className="rounded-xl border border-rose-200 bg-white p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <XCircle className="h-6 w-6 shrink-0 text-rose-600" />

            <div className="min-w-0">
              <h2 className="font-semibold text-slate-900">
                Failed to load attendance
              </h2>

              <p className="mt-2 break-words text-sm text-slate-500">
                {errorMessage}
              </p>

              <button
                type="button"
                onClick={() => refetch()}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =======================================================
  // DATA
  // =======================================================

  const totals = dashboard.totals ?? {};

  const students = calculateAttendance(dashboard.students);
  const teachers = calculateAttendance(dashboard.teachers);
  const officials = calculateAttendance(dashboard.officials);

  // Registered member totals are separate from attendance records.
  const cards: StatCardProps[] = [
    {
      title: "Students",
      ...students,
      icon: GraduationCap,
      gradient: "bg-gradient-to-r from-indigo-500 to-blue-500",
      iconColor: "bg-indigo-50 text-indigo-600",
    },
    {
      title: "Teachers",
      ...teachers,
      icon: UserCheck,
      gradient: "bg-gradient-to-r from-emerald-500 to-teal-500",
      iconColor: "bg-emerald-50 text-emerald-600",
    },
    {
      title: "Officials",
      ...officials,
      icon: Users,
      gradient: "bg-gradient-to-r from-violet-500 to-purple-500",
      iconColor: "bg-violet-50 text-violet-600",
    },
  ];

  const people = [
    {
      title: "Total Students",
      value: totals.students ?? 0,
      icon: GraduationCap,
      color: "text-slate-800",
    },
    {
      title: "Total Teachers",
      value: totals.teachers ?? 0,
      icon: UserCheck,
      color: "text-slate-800",
    },
    {
      title: "Total Officials",
      value: totals.officials ?? 0,
      icon: Users,
      color: "text-slate-800",
    },
  ];

  // =======================================================
  // UI
  // =======================================================

  return (
    <div className="min-h-screen bg-slate-50/70 p-4 sm:p-6">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* SIMPLE HEADER */}

        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-slate-800 sm:text-2xl">
                Attendance Dashboard
              </h1>

              <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-slate-600">
                <CalendarDays className="h-4 w-4 text-slate-400" />

                <span>
                  {formatDate(startDate)} – {formatDate(endDate)}
                </span>

                {isFetching && (
                  <span className="ml-1 inline-flex items-center gap-1 text-xs text-indigo-600">
                    <RefreshCw className="h-3 w-3 animate-spin" />
                    Updating...
                  </span>
                )}
              </div>
            </div>

            {/* AUTOMATIC DATE RANGE FILTER */}

            <div className="w-full lg:max-w-lg">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="start-date"
                    className="mb-1.5 block text-xs font-medium text-slate-600"
                  >
                    From Date
                  </label>

                  <input
                    id="start-date"
                    type="date"
                    value={startDate}
                    max={today}
                    onChange={(event) => {
                      const value = event.target.value;

                      setStartDate(value);

                      if (value && endDate && value > endDate) {
                        setEndDate(value);
                      }
                    }}
                    className="w-full border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="end-date"
                    className="mb-1.5 block text-xs font-medium text-slate-600"
                  >
                    To Date
                  </label>

                  <input
                    id="end-date"
                    type="date"
                    value={endDate}
                    min={startDate || undefined}
                    max={today}
                    onChange={(event) =>
                      setEndDate(event.target.value)
                    }
                    className="w-full border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between gap-3">
                <p className="text-xs text-slate-400">
                  Attendance updates automatically when dates change.
                </p>

                <button
                  type="button"
                  onClick={handleReset}
                  disabled={
                    startDate === firstDayOfMonth &&
                    endDate === today
                  }
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ATTENDANCE STATISTICS */}

        <section className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-slate-800 sm:text-xl">
              Attendance Statistics
            </h2>
          </div>

          <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {cards.map((card) => (
              <StatCard key={card.title} {...card} />
            ))}
          </div>
        </section>

        {/* SCHOOL OVERVIEW */}

        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-800 sm:text-xl">
              School Overview
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Total registered members in your school.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {people.map((person) => {
              const Icon = person.icon;

              return (
                <div
                  key={person.title}
                  className="group flex items-center justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl ${person.color}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    <div>
                      <p className="text-sm font-medium text-slate-500">
                        {person.title}
                      </p>

                      <p className="mt-1 text-2xl font-bold text-slate-900">
                        {formatNumber(person.value)}
                      </p>
                    </div>
                  </div>

                  <ArrowUpRight className="h-5 w-5 text-slate-300 transition-colors group-hover:text-indigo-600" />
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
