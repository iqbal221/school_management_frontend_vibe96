"use client";

import PrintButton from "@/components/PrintButton";
import SearchBox from "@/components/SearchBox";
import SearchBoxResponsive from "@/components/SearchBoxResponsive";
import StudentListByClass from "@/components/StudentListByClass/page";
import React, { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";

const admissionClass = [
  { title: "One" },
  { title: "Two" },
  { title: "Three" },
  { title: "Four" },
  { title: "Five" },
  { title: "Six" },
  { title: "Seven" },
  { title: "Eight" },
  { title: "Nine" },
  { title: "Ten" },
];

const StudentListPage = () => {
  const componentRef = useRef(null);

  const [studentClassTitle, setStudentClassTitle] = useState("");
  const [Query, setQuery] = useState("");

  const [formSelectData, setFormSelectData] = useState({
    admission: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormSelectData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleStudentAdmissionClass = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStudentClassTitle(formSelectData.admission);
  };

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: "Student-List",
    onPrintError: (location, error) => {
      console.error(`Print error at ${location}:`, error);
    },
  });


  return (
    <div className="bg-slate-50">
      <div className="mx-auto w-full max-w-[1600px] px-2 py-5 sm:px-3 lg:px-4">
        {/* =====================================================
            PAGE HEADER
        ====================================================== */}
        <div className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 px-5 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
            {/* Title */}
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/20">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.8}
                  stroke="currentColor"
                  className="h-6 w-6">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.125-.9M15 19.128v-3.099a6.75 6.75 0 0 0-6.75-6.75H6.75A6.75 6.75 0 0 0 0 16.029v3.099m15 0a9.38 9.38 0 0 1-9.75 0M9 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm12.75 3.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Z"
                  />
                </svg>
              </div>

              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-800 sm:text-2xl">
                  Student List
                </h1>

                <p className="mt-1 text-sm text-slate-400">
                  View and manage students by class
                </p>
              </div>
            </div>

            {/* Desktop Actions */}
            <div className="hidden items-center gap-3 sm:flex">
              <div className="min-w-[220px]">
                <SearchBox setQuery={setQuery} />
              </div>

              <PrintButton handlePrint={handlePrint} />
            </div>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

          {/* =====================================================
              CLASS FILTER
          ====================================================== */}
          <div className="bg-gradient-to-br from-slate-50/80 via-white to-sky-50/40 px-5 py-6 sm:px-6">
            <form onSubmit={handleStudentAdmissionClass}>
              <div className="mx-auto flex max-w-3xl flex-col gap-3 sm:flex-row">
                {/* Select */}
                <div className="relative flex-1">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.7}
                      stroke="currentColor"
                      className="h-5 w-5 text-slate-400">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 6.75h15M4.5 12h15m-15 5.25h15"
                      />
                    </svg>
                  </div>

                  <select
                    name="admission"
                    value={formSelectData.admission}
                    onChange={handleChange}
                    className="h-12 w-full appearance-none  border border-slate-300 bg-white pl-11 pr-10 text-sm font-medium text-slate-700 shadow-sm outline-none transition-all duration-200 hover:border-sky-300 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10">
                    <option value="">-- Select Class --</option>

                    {admissionClass.map((data) => (
                      <option key={data.title} value={data.title}>
                        Class {data.title}
                      </option>
                    ))}
                  </select>

                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.8}
                      stroke="currentColor"
                      className="h-4 w-4 text-slate-400">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m19.5 8.25-7.5 7.5-7.5-7.5"
                      />
                    </svg>
                  </div>
                </div>

                {/* Find Button */}
                <button
                  type="submit"
                  className="inline-flex h-12 items-center justify-center gap-2 bg-gradient-to-r from-sky-500 to-blue-600 px-7 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:from-sky-600 hover:to-blue-700 hover:shadow-xl hover:shadow-sky-500/25 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 sm:min-w-[140px]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="h-4 w-4">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m21 21-4.35-4.35m0 0A7.5 7.5 0 1 0 6.045 6.045a7.5 7.5 0 0 0 10.605 10.605Z"
                    />
                  </svg>
                  Find Students
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* =====================================================
            MOBILE SEARCH + PRINT
        ====================================================== */}
        <div className="mb-5 flex items-center justify-between gap-3 sm:hidden">
          <div className="flex-1">
            <SearchBoxResponsive setQuery={setQuery} />
          </div>

          <PrintButton handlePrint={handlePrint} />
        </div>

        {/* =====================================================
            STUDENT TABLE
        ====================================================== */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <StudentListByClass
            componentRef={componentRef}
            studentClassTitle={studentClassTitle}
            Query={Query}
          />
        </div>
      </div>
    </div>
  );
};

export default StudentListPage;
