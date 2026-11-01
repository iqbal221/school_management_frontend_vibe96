
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useStudentsQuery } from "@/redux/api/studentApi";
import { useStudentResultQuery } from "@/redux/api/studentApi";
import { useTeachersQuery } from "@/redux/api/teacherApi";
import { useOfficialsQuery } from "@/redux/api/officialApi";
import { useEntryFeessQuery } from "@/redux/api/entryFeesApi";
import Loader from "@/components/Loader";
import { useGetAttendanceDashboardQuery } from "@/redux/api/attendance/attendanceDashboardApi";

const MARKSHEET_URL = "/resultManagement/studentMarksheet";


// =========================================================
// TYPES
// =========================================================

const SUBJECT_MARK_FIELDS = [
  "banglaMarks",
  "englishMarks",
  "mathematicsMarks",
  "scienceMarks",
  "religiousMarks",
] as const;


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



const DashboardPage = () => {
  const [page] = useState<number>(1);
  const [size] = useState<number>(10);
  const [sortBy] = useState<string>("");
  const [sortOrder] = useState<string>("");

  const query = {
    limit: size,
    page,
    sortBy,
    sortOrder,
  };

  // =========================
  // STUDENTS, TEACHERS, OFFICIALS
  // =========================

  const { data: studentResponse, isLoading: studentsLoading } =
    useStudentsQuery(query);

  const { data: teacherResponse, isLoading: teachersLoading } =
    useTeachersQuery(query);

  const { data: officialResponse, isLoading: officialsLoading } =
    useOfficialsQuery(query);

  const studentData = studentResponse?.students ?? [];
  const teachersData = teacherResponse?.teachers ?? [];
  const officialsData = officialResponse?.officials ?? [];

  // =========================
  // FEES
  // =========================

  const { data: feeResponse } = useEntryFeessQuery(query);

  const allFees = feeResponse?.entryFees ?? [];

  const totalFees = allFees.reduce(
    (total: number, fee: any) =>
      total + Number(fee?.amount || 0),
    0,
  );

  // =========================
  // STUDENT EXAM RESULTS
  // =========================

  const {
    data: resultResponse,
    isLoading: resultsLoading,
    isError: resultsError,
  } = useStudentResultQuery({
    limit: 100,
    page: 1,
    sortBy: "",
    sortOrder: "",
  });

  const results = resultResponse?.studentResult ?? [];

   // =========================
  // Attendance calculation
  // =========================
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

  
  let totalObtainedMarks = 0;
  let totalPossibleMarks = 0;

  results.forEach((result: any) => {
    SUBJECT_MARK_FIELDS.forEach((field) => {
      const rawMark = result?.[field];

      // Ignore missing marks instead of treating them as zero.
      if (
        rawMark === null ||
        rawMark === undefined ||
        String(rawMark).trim() === ""
      ) {
        return;
      }

      const mark = Number(rawMark);

      // Ignore invalid values and marks outside the 0–100 range.
      if (!Number.isFinite(mark) || mark < 0 || mark > 100) {
        return;
      }

      totalObtainedMarks += mark;
      totalPossibleMarks += 100;
    });
  });

  const resultPercentage =
    totalPossibleMarks > 0
      ? Number(
        ((totalObtainedMarks / totalPossibleMarks) * 100).toFixed(2),
      )
      : 0;

  const resultDescription = resultsError
    ? "Unable to load results"
    : resultsLoading
      ? "Calculating result performance..."
      : totalPossibleMarks === 0
        ? "No marks available"
        : `${totalObtainedMarks.toLocaleString()} out of ${totalPossibleMarks.toLocaleString()} marks`;

  const performanceLabel =
    totalPossibleMarks === 0
      ? "No data"
      : resultPercentage >= 80
        ? "Excellent"
        : resultPercentage >= 60
          ? "Good"
          : resultPercentage >= 40
            ? "Average"
            : "Needs improvement";

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

  // Current month's student attendance
const studentMonthlyAttendance = calculateAttendance(
  dashboard?.students
);

  // =========================
  // DASHBOARD STATISTICS
  // =========================

  const stats = [
    {
      title: "Total Students",
      value: studentData.length,
      description: "Students on the current page",
      color: "from-blue-500 to-cyan-500",
      lightBg: "bg-blue-50 dark:bg-blue-950/30",
      iconColor: "text-blue-600 dark:text-blue-400",
      href: "/instituteInfo/studentInfo",
      icon: "♟",
    },
    {
      title: "Total Teachers",
      value: teachersData.length,
      description: "Teaching staff on the current page",
      color: "from-violet-500 to-purple-600",
      lightBg: "bg-violet-50 dark:bg-violet-950/30",
      iconColor: "text-violet-600 dark:text-violet-400",
      href: "/instituteInfo/teacherInfo",
      icon: "♙",
    },
    {
      title: "Total Officials",
      value: officialsData.length,
      description: "Officials on the current page",
      color: "from-emerald-500 to-teal-500",
      lightBg: "bg-emerald-50 dark:bg-emerald-950/30",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      href: "/instituteInfo/officialInfo",
      icon: "♙",
    },
    {
      title: "Attendance",
      value: `${studentMonthlyAttendance.percentage}%`,
      description: "Today's attendance",
      color: "from-orange-500 to-amber-500",
      lightBg: "bg-orange-50 dark:bg-orange-950/30",
      iconColor: "text-orange-600 dark:text-orange-400",
      href: "/attendance/attendanceDashboard",
      progress: studentMonthlyAttendance.percentage,
      icon: "◷",
    },
    {
      title: "Result",
      value: resultsLoading
        ? "..."
        : resultsError
          ? "N/A"
          : `${resultPercentage}%`,
      description: resultDescription,
      color: "from-pink-500 to-rose-500",
      lightBg: "bg-pink-50 dark:bg-pink-950/30",
      iconColor: "text-pink-600 dark:text-pink-400",
      href: MARKSHEET_URL,
      progress: resultPercentage,
      icon: "▤",
    },
    {
      title: "Total Fees",
      value: `
      ${new Intl.NumberFormat("en-US", {
        maximumFractionDigits: 0,
      }).format(totalFees)}`,
      description: "Collected fees in loaded records",
      color: "from-cyan-500 to-sky-600",
      lightBg: "bg-cyan-50 dark:bg-cyan-950/30",
      iconColor: "text-cyan-600 dark:text-cyan-400",
      href: "/feesManagement/paymentHistory",
      icon: "$",
    },
  ];

  if (studentsLoading || teachersLoading || officialsLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-3 dark:bg-slate-950 md:p-5 lg:p-6">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}

        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-1 text-sm font-medium text-blue-600 dark:text-blue-400">
              School Management System
            </p>

            <h1 className="text-2xl font-bold text-slate-900 dark:text-white md:text-3xl">
              Dashboard
            </h1>
          </div>

          <Link
            href="/student/addNewStudent"
            className="sm:flex hidden items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.02]"
          >
            <span className="text-lg">+</span>
            Add Student
          </Link>
        </div>

        {/* STAT CARDS */}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {stats.map((stat) => (
            <Link
              key={stat.title}
              href={stat.href}
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
            >
              <div
                className={`absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gradient-to-br ${stat.color} opacity-10 transition-transform duration-500 group-hover:scale-150`}
              />

              <div className="relative">
                <div className="flex items-start justify-between">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl text-2xl ${stat.lightBg} ${stat.iconColor}`}
                  >
                    {stat.icon}
                  </div>

                  {stat.title === "Result" ? (
                    <span className="rounded-full bg-pink-50 px-3 py-1 text-xs font-semibold text-pink-600 dark:bg-pink-950/40 dark:text-pink-400">
                      Academic
                    </span>
                  ) : (
                    <span className="text-xs font-medium text-emerald-500">
                      Overview
                    </span>
                  )}
                </div>

                <div className="mt-5">
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    {stat.title}
                  </p>

                  <h2 className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">
                    {stat.value}
                  </h2>

                  <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                    {stat.description}
                  </p>
                </div>

                {stat.progress !== undefined && (
                  <div className="mt-4">
                    <div className="mb-1.5 flex justify-between">
                      <span className="text-xs text-slate-400">
                        {stat.title === "Result"
                          ? "Academic performance"
                          : "Attendance"}
                      </span>

                      <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                        {stat.title === "Result" && resultsError
                          ? "Unavailable"
                          : `${stat.progress}%`}
                      </span>
                    </div>

                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${stat.color} transition-all duration-700`}
                        style={{
                          width: `${Math.min(
                            100,
                            Math.max(0, stat.progress),
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                )}

                <div className="mt-5 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-400 transition group-hover:text-blue-500">
                    {stat.title === "Result"
                      ? "View student marksheets"
                      : "View details"}
                  </span>

                  <span className="text-xl text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-500">
                    →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* LOWER SECTION */}

        <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">

          {/* QUICK ACTIONS */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-6 lg:col-span-2">
            <div className="mb-5">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Quick Actions
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Frequently used management tools
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Link
                href="/student/addNewStudent"
                className="rounded-xl bg-blue-50 p-4 transition hover:bg-blue-100 dark:bg-blue-950/30 dark:hover:bg-blue-950/50"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500 text-xl text-white">
                  +
                </div>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Add Student
                </p>
              </Link>

              <Link
                href="/instituteInfo/teacherInfo/addNewTeacher"
                className="rounded-xl bg-violet-50 p-4 transition hover:bg-violet-100 dark:bg-violet-950/30 dark:hover:bg-violet-950/50"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500 text-xl text-white">
                  +
                </div>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Add Teacher
                </p>
              </Link>

              <Link
                href="#"
                className="rounded-xl bg-emerald-50 p-4 transition hover:bg-emerald-100 dark:bg-emerald-950/30 dark:hover:bg-emerald-950/50"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500 text-xl text-white">
                  ✓
                </div>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Attendance
                </p>
              </Link>

              <Link
                href={MARKSHEET_URL}
                className="rounded-xl bg-pink-50 p-4 transition hover:bg-pink-100 dark:bg-pink-950/30 dark:hover:bg-pink-950/50"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-pink-500 text-xl text-white">
                  %
                </div>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Student Results
                </p>
              </Link>
            </div>
          </div>

          {/* SCHOOL PERFORMANCE */}

          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white shadow-xl">
            <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-blue-500/20" />

            <div className="relative">
              <p className="text-sm text-slate-400">
                Academic Overview
              </p>

              <h2 className="mt-1 text-xl font-bold">
                School Performance
              </h2>

              <div className="mt-7">
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-bold">
                    {resultsLoading
                      ? "..."
                      : resultsError
                        ? "N/A"
                        : `${resultPercentage}%`}
                  </span>

                  <span className="mb-1 text-sm text-emerald-400">
                    {resultsLoading
                      ? "Loading"
                      : resultsError
                        ? "Unavailable"
                        : performanceLabel}
                  </span>
                </div>

                <p className="mt-2 text-sm text-slate-400">
                  Overall performance based on available subject marks
                </p>
              </div>

              <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 transition-all duration-700"
                  style={{
                    width: `${resultsLoading || resultsError ? 0 : resultPercentage}%`,
                  }}
                />
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500">
                    Attendance
                  </p>
                  <p className="mt-1 text-lg font-bold">
                    {studentMonthlyAttendance.percentage}%
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">
                    Result records
                  </p>
                  <p className="mt-1 text-lg font-bold">
                    {resultsLoading ? "..." : resultsError ? "N/A" : results.length}
                  </p>
                </div>
              </div>

              <Link
                href={MARKSHEET_URL}
                className="mt-6 flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold transition hover:bg-white/10"
              >
                View Student Marksheet
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
