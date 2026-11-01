
"use client";

import Loader from "@/components/Loader";
import PrintButton from "@/components/PrintButton";
import { useStudentsQuery } from "@/redux/api/studentApi";
import React, { useMemo, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { toast } from "react-toastify";

// Keep classes outside the component to avoid recreating the array.
const CLASSES = [
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
];

const StudentInfoPage = () => {
  // IMPORTANT: The printable element is a DIV, not a TABLE.
  const componentRef = useRef<HTMLDivElement>(null);

  // --------------------------------------------------
  // Query
  // --------------------------------------------------

  const [page] = useState<number>(1);
  const [size] = useState<number>(100);
  const [sortBy] = useState<string>("");
  const [sortOrder] = useState<string>("");

  const query: Record<string, any> = {
    limit: size,
    page,
    sortBy,
    sortOrder,
  };

  const { data, isLoading, isError } = useStudentsQuery(query);

  const studentData: any[] = data?.students || [];

  // --------------------------------------------------
  // Class Statistics
  // --------------------------------------------------

  const classStatistics = useMemo(() => {
    return CLASSES.map((className) => {
      const studentsInClass = studentData.filter(
        (student: any) => student?.admission === className
      );

      const male = studentsInClass.filter(
        (student: any) =>
          String(student?.gender || "").toLowerCase() === "male"
      ).length;

      const female = studentsInClass.filter(
        (student: any) =>
          String(student?.gender || "").toLowerCase() === "female"
      ).length;

      return {
        className,
        male,
        female,
        total: male + female,
      };
    });
  }, [studentData]);

  // --------------------------------------------------
  // Overall Statistics
  // --------------------------------------------------

  const totalMale = classStatistics.reduce(
    (sum, item) => sum + item.male,
    0
  );

  const totalFemale = classStatistics.reduce(
    (sum, item) => sum + item.female,
    0
  );

  const totalStudents = totalMale + totalFemale;

  // --------------------------------------------------
  // Print Configuration
  // --------------------------------------------------
const handlePrint = useReactToPrint({
  contentRef: componentRef,
  documentTitle: "Student-Information-Report",

  onBeforePrint: async () => {
    if (!componentRef.current) {
      throw new Error("Print content not found");
    }
  },

  onPrintError: (location, error) => {
    console.error(`Print error at ${location}:`, error);
    toast.error("Failed to print student information.");
  },
});
  // --------------------------------------------------
  // Loading
  // --------------------------------------------------

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center px-4">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <h2 className="text-lg font-semibold text-red-700">
            Failed to load students
          </h2>
          <p className="mt-2 text-sm text-red-600">
            Please refresh the page and try again.
          </p>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // Page
  // --------------------------------------------------

  return (
    <div className="min-h-screen w-full bg-slate-50 px-2 py-4 sm:px-3 lg:px-4">
      <div className="mx-auto w-full max-w-[1600px]">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          {/* =====================================================
              PAGE HEADER
          ===================================================== */}

          <div className="border-b border-slate-200 bg-gradient-to-r from-sky-50 via-white to-cyan-50 px-3 py-5 sm:px-5 lg:px-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.7}
                    stroke="currentColor"
                    className="h-6 w-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.38 9.38 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M9 19.128a9.38 9.38 0 0 1-2.625.372 9.337 9.337 0 0 1-4.121-.952 4.125 4.125 0 0 1 7.533-2.493"
                    />
                  </svg>
                </div>

                <div>
                  <h1 className="text-xl font-bold text-slate-800 sm:text-2xl">
                    Student Information
                  </h1>
                  <p className="mt-0.5 text-sm text-slate-500">
                    Overview of students by class and gender
                  </p>
                </div>
              </div>

              {/* Desktop Print */}
              <div className="hidden sm:block">
                <PrintButton handlePrint={handlePrint} />
              </div>
            </div>

            {/* Mobile Print */}
            <div className="mt-4 sm:hidden">
              <PrintButton handlePrint={handlePrint} />
            </div>
          </div>

          {/* =====================================================
              CONTENT
          ===================================================== */}

          <div className="p-3 sm:p-4 lg:p-6">

            {/* =================================================
                STATISTICS CARDS
            ================================================= */}

            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

              {/* Total Students */}

              <div className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-md">
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-500">
                      Total Students
                    </p>
                    <p className="mt-2 text-3xl font-bold text-slate-800">
                      {totalStudents}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      All classes
                    </p>
                  </div>

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.7}
                      stroke="currentColor"
                      className="h-6 w-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128a4.5 4.5 0 0 1-9 0"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Male */}

              <div className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan-200 hover:shadow-md">
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-500">
                      Male Students
                    </p>
                    <p className="mt-2 text-3xl font-bold text-slate-800">
                      {totalMale}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      Male enrollment
                    </p>
                  </div>

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 transition-colors group-hover:bg-cyan-600 group-hover:text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.7}
                      stroke="currentColor"
                      className="h-6 w-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Female */}

              <div className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-md">
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-500">
                      Female Students
                    </p>
                    <p className="mt-2 text-3xl font-bold text-slate-800">
                      {totalFemale}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      Female enrollment
                    </p>
                  </div>

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600 transition-colors group-hover:bg-violet-600 group-hover:text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.7}
                      stroke="currentColor"
                      className="h-6 w-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 6a3.75 3.75 0 1 1-7.5 0M4.501 20.118a7.5 7.5 0 0 1 14.998 0"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* =================================================
                PRINTABLE REPORT SECTION

                Everything inside this div will be printed.
            ================================================= */}

            <div
              ref={componentRef}
              className="student-print-content w-full rounded-xl border border-slate-200 bg-white"
            >

              {/* Report Header */}

              <div className="border-b border-slate-200 bg-white px-4 py-5 sm:px-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-base font-semibold text-slate-800">
                      Class-wise Student Statistics
                    </h2>

                    <p className="mt-0.5 text-sm text-slate-500">
                      Student distribution from Class One to Class Ten
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                      {CLASSES.length} Classes
                    </span>

                    <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-600">
                      {totalStudents} Students
                    </span>
                  </div>
                </div>
              </div>

              {/* Responsive Table */}

              <div className="w-full overflow-x-auto">
                <table className="w-full min-w-[600px] table-auto border-collapse">

                  {/* Table Head */}

                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="w-[35%] px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 sm:px-5">
                        Class
                      </th>

                      <th className="w-[20%] px-4 py-4 text-center text-xs font-semibold uppercase tracking-wide text-slate-500 sm:px-5">
                        Male
                      </th>

                      <th className="w-[20%] px-4 py-4 text-center text-xs font-semibold uppercase tracking-wide text-slate-500 sm:px-5">
                        Female
                      </th>

                      <th className="w-[25%] px-4 py-4 text-center text-xs font-semibold uppercase tracking-wide text-slate-500 sm:px-5">
                        Total
                      </th>
                    </tr>
                  </thead>

                  {/* Table Body */}

                  <tbody className="divide-y divide-slate-100">
                    {classStatistics.map((item, index) => (
                      <tr
                        key={item.className}
                        className="group transition-colors duration-150 hover:bg-sky-50/40"
                      >
                        {/* Class */}

                        <td className="px-4 py-4 sm:px-5">
                          <div className="flex items-center gap-3">
                            <span className="print-number flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600 transition-colors group-hover:bg-sky-100 group-hover:text-sky-600">
                              {index + 1}
                            </span>

                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-slate-700">
                                Class {item.className}
                              </p>

                              <p className="text-xs text-slate-400">
                                Academic class
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Male */}

                        <td className="px-4 py-4 text-center sm:px-5">
                          <span className="inline-flex min-w-10 items-center justify-center rounded-lg bg-cyan-50 px-3 py-1.5 text-sm font-semibold text-cyan-700">
                            {item.male}
                          </span>
                        </td>

                        {/* Female */}

                        <td className="px-4 py-4 text-center sm:px-5">
                          <span className="inline-flex min-w-10 items-center justify-center rounded-lg bg-violet-50 px-3 py-1.5 text-sm font-semibold text-violet-700">
                            {item.female}
                          </span>
                        </td>

                        {/* Total */}

                        <td className="px-4 py-4 text-center sm:px-5">
                          <span className="inline-flex min-w-12 items-center justify-center rounded-lg bg-sky-500 px-3 py-1.5 text-sm font-semibold text-white shadow-sm">
                            {item.total}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>

                  {/* Table Footer */}

                  <tfoot>
                    <tr className="border-t-2 border-slate-200 bg-slate-50">
                      <td className="px-4 py-5 sm:px-5">
                        <span className="text-sm font-bold uppercase tracking-wide text-slate-700">
                          Grand Total
                        </span>
                      </td>

                      <td className="px-4 py-5 text-center sm:px-5">
                        <span className="text-lg font-bold text-cyan-700">
                          {totalMale}
                        </span>
                      </td>

                      <td className="px-4 py-5 text-center sm:px-5">
                        <span className="text-lg font-bold text-violet-700">
                          {totalFemale}
                        </span>
                      </td>

                      <td className="px-4 py-5 text-center sm:px-5">
                        <span className="inline-flex min-w-14 items-center justify-center rounded-lg bg-sky-500 px-4 py-2 text-lg font-bold text-white shadow-sm">
                          {totalStudents}
                        </span>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Report Footer */}

              <div className="border-t border-slate-200 px-4 py-3 sm:px-6">
                <p className="text-right text-xs text-slate-400">
                  Total Classes: {CLASSES.length} | Total Students:{" "}
                  {totalStudents}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentInfoPage;
