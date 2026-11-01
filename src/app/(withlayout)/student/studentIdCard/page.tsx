"use client";

import PrintButton from "@/components/PrintButton";
import StudentIdCard from "@/components/StudentIdCard/StudentIdCard";
import { useStudentsQuery } from "@/redux/api/studentApi";
import {
  BadgeCheck,
  BookOpen,
  ChevronDown,
  IdCard,
  Printer,
  RotateCcw,
  Search,
  UserRound,
  Users,
} from "lucide-react";
import React, { useMemo, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";

const StudentIdCardPage = () => {
  const componentRef = useRef<HTMLDivElement | null>(null);

  const [formSelectData, setFormSelectData] = useState({
    name: "",
    admission: "",
    roll: "",
  });

  const [studentInfo, setStudentInfo] = useState<any[]>([]);

  const query: Record<string, any> = {
    limit: 1000,
    page: 1,
    sortBy: "",
    sortOrder: "",
  };

  const { data, isLoading } = useStudentsQuery(query);

  const studentData = data?.students || [];

  /* =========================================================
     UNIQUE STUDENT NAMES
  ========================================================= */

  const studentNames = useMemo(() => {
    return Array.from(
      new Set(studentData.map((student: any) => student?.name).filter(Boolean)),
    );
  }, [studentData]);

  /* =========================================================
     SELECTED STUDENT
  ========================================================= */

  const selectedStudent = useMemo(() => {
    if (!formSelectData.name) return null;

    return studentData.find(
      (student: any) => student?.name === formSelectData.name,
    );
  }, [studentData, formSelectData.name]);

  /* =========================================================
     CLASS OPTIONS
  ========================================================= */

  const classOptions = useMemo(() => {
    if (!formSelectData.name) return [];

    return Array.from(
      new Set(
        studentData
          .filter((student: any) => student?.name === formSelectData.name)
          .map((student: any) => student?.admission)
          .filter(Boolean),
      ),
    );
  }, [studentData, formSelectData.name]);

  /* =========================================================
     ROLL OPTIONS
  ========================================================= */

  const rollOptions = useMemo(() => {
    if (!formSelectData.name || !formSelectData.admission) {
      return [];
    }

    return Array.from(
      new Set(
        studentData
          .filter(
            (student: any) =>
              student?.name === formSelectData.name &&
              student?.admission === formSelectData.admission,
          )
          .map((student: any) => student?.roll)
          .filter(Boolean),
      ),
    );
  }, [studentData, formSelectData.name, formSelectData.admission]);

  /* =========================================================
     HANDLE CHANGE
  ========================================================= */

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === "name") {
      setFormSelectData({
        name: value,
        admission: "",
        roll: "",
      });

      setStudentInfo([]);
      return;
    }

    if (name === "admission") {
      setFormSelectData((prev) => ({
        ...prev,
        admission: value,
        roll: "",
      }));

      setStudentInfo([]);
      return;
    }

    setFormSelectData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setStudentInfo([]);
  };

  /* =========================================================
     FIND STUDENT
  ========================================================= */

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !formSelectData.name ||
      !formSelectData.admission ||
      !formSelectData.roll
    ) {
      return;
    }

    const studentInformation = studentData.filter(
      (student: any) =>
        student?.name === formSelectData.name &&
        String(student?.roll) === String(formSelectData.roll) &&
        String(student?.admission) === String(formSelectData.admission),
    );

    setStudentInfo(studentInformation);
  };

  /* =========================================================
     RESET
  ========================================================= */

  const handleReset = () => {
    setFormSelectData({
      name: "",
      admission: "",
      roll: "",
    });

    setStudentInfo([]);
  };

  /* =========================================================
     PRINT
  ========================================================= */

 const handlePrint = useReactToPrint({
     contentRef: componentRef,
     documentTitle: "Student-Information",
   });

  const canFind =
    formSelectData.name && formSelectData.admission && formSelectData.roll;

  return (
    <div className=" bg-slate-50">
      {/* =====================================================
          PAGE HEADER
      ====================================================== */}

      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto  px-2 py-5 sm:px-3 lg:px-4">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            {/* LEFT */}
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-lg shadow-blue-500/20">
                <IdCard className="h-6 w-6" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-slate-800 sm:text-2xl">
                    Student ID Cards
                  </h1>

                  <span className="hidden rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-600 sm:inline-flex">
                    Management
                  </span>
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                <Users className="h-4 w-4 text-slate-400" />

                <span className="text-xs font-semibold text-slate-600">
                  {studentData.length} Students
                </span>
              </div>

              {studentInfo.length > 0 && (
                <div className="flex items-center gap-2 ">
                  <div className="hidden sm:block">
                  <PrintButton handlePrint={handlePrint} />
                </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <main className="mx-auto max-w-[1500px] px-2 py-3 sm:px-3 lg:px-4">
        {/* ===================================================
            SEARCH PANEL
        ==================================================== */}

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* PANEL HEADER */}

          <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-5 py-5 sm:px-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50">
                  <Search className="h-5 w-5 text-sky-600" />
                </div>

                <div>
                  <h2 className="text-base font-bold text-slate-800">
                    Find Student
                  </h2>               
                </div>
              </div>
            </div>
          </div>

          {/* FORM */}

          <form onSubmit={handleSubmit} className="p-5 sm:p-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {/* =================================================
                  NAME
              ================================================== */}

              <div>
                <label
                  htmlFor="student-name"
                  className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                  <UserRound className="h-3.5 w-3.5 text-sky-500" />
                  Student Name
                </label>

                <div className="relative">
                  <select
                    id="student-name"
                    name="name"
                    value={formSelectData.name}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="h-10 w-full appearance-none  border border-slate-300 bg-white px-4 pr-10 text-sm font-medium text-slate-700 outline-none transition-all hover:border-slate-300 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400">
                    <option value="">Select student</option>

                    {studentNames.map((name: any) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>

                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>
              </div>

              {/* =================================================
                  CLASS
              ================================================== */}

              <div>
                <label
                  htmlFor="student-class"
                  className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                  <BookOpen className="h-3.5 w-3.5 text-blue-500" />
                  Class
                </label>

                <div className="relative">
                  <select
                    id="student-class"
                    name="admission"
                    value={formSelectData.admission}
                    onChange={handleChange}
                    disabled={!formSelectData.name || isLoading}
                    className="h-10 w-full appearance-none border border-slate-300 bg-white px-4 pr-10 text-sm font-medium text-slate-700 outline-none transition-all hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400">
                    <option value="">Select class</option>

                    {classOptions.map((admission: any) => (
                      <option key={admission} value={admission}>
                        {admission}
                      </option>
                    ))}
                  </select>

                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>
              </div>

              {/* =================================================
                  ROLL
              ================================================== */}

              <div>
                <label
                  htmlFor="student-roll"
                  className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                  <IdCard className="h-3.5 w-3.5 text-indigo-500" />
                  Roll Number
                </label>

                <div className="relative">
                  <select
                    id="student-roll"
                    name="roll"
                    value={formSelectData.roll}
                    onChange={handleChange}
                    disabled={!formSelectData.admission || isLoading}
                    className="h-10 w-full appearance-none border border-slate-300 bg-white px-4 pr-10 text-sm font-medium text-slate-700 outline-none transition-all hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400">
                    <option value="">Select roll</option>

                    {rollOptions.map((roll: any) => (
                      <option key={roll} value={roll}>
                        {roll}
                      </option>
                    ))}
                  </select>

                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>
              </div>

              {/* =================================================
                  ACTIONS
              ================================================== */}

              <div className="flex items-end gap-2">
                <button
                  type="submit"
                  disabled={!canFind || isLoading}
                  className="flex h-10 flex-1 items-center justify-center gap-2  bg-gradient-to-r from-sky-500 to-blue-600 px-5 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/25 disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-50">
                  <Search className="h-4 w-4" />

                  {isLoading ? "Loading..." : "Find Student"}
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  title="Reset"
                  className="flex h-10 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-all hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700">
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>
            </div>           
          </form>
        </section>

        {/* =====================================================
            PREVIEW HEADER
        ====================================================== */}

        <section className="">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
           

            {/* PRINT BUTTON */}

            {studentInfo.length > 0 && (
              <div className="flex items-center gap-2">
                

                <button
                  type="button"
                  onClick={handlePrint}
                  className="flex h-10 items-center gap-2 rounded-xl bg-slate-900 px-4 text-xs font-bold text-white shadow-lg shadow-slate-900/10 transition-all hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-xl sm:hidden">
                  <Printer className="h-4 w-4" />
                  Print Card
                </button>
              </div>
            )}
          </div>

          {/* ===================================================
              PREVIEW AREA
          ==================================================== */}

          <div
            className="
              
              overflow-hidden
              rounded-2xl
              border
              border-slate-200
              bg-white
              shadow-sm
            ">
            {isLoading ? (
              <div className="flex  items-center justify-center">
                <div className="flex flex-col items-center">
                  <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-sky-500" />

                  <p className="mt-4 text-sm font-semibold text-slate-600">
                    Loading students...
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Please wait a moment
                  </p>
                </div>
              </div>
            ) : studentInfo.length > 0 ? (
              <div
                ref={componentRef}
                className="flex  items-center justify-center bg-gradient-to-br from-slate-50 via-white to-sky-50 p-6">
                <StudentIdCard studentInfo={studentInfo} />
              </div>
            ) : (
              <div className="flex py-10 items-center justify-center px-5">
                <div className="max-w-sm text-center">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-100">
                    <IdCard className="h-9 w-9 text-slate-300" />
                  </div>

                  <h3 className="mt-5 text-lg font-bold text-slate-700">
                    No ID Card Selected
                  </h3>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default StudentIdCardPage;
