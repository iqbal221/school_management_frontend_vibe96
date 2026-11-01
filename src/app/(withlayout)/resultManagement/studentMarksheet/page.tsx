
"use client";

import React, { useMemo, useRef, useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  ChevronDown,
  FileSearch,
  GraduationCap,
  Loader2,
  Printer,
  RotateCcw,
  Search,
  UserRound,
  Users,
} from "lucide-react";
import { useReactToPrint } from "react-to-print";
import { toast } from "react-toastify";

import StudentMarksheet from "@/components/StudentResult/StudentMarksheet";
import { useStudentsQuery } from "@/redux/api/studentApi";

interface Student {
  _id?: string;
  id?: string;
  name?: string;
  admission?: string | number;
  roll?: string | number;
}

interface StudentSelection {
  name: string;
  admission: string;
  roll: string;
}

const StudentMarksheetPage = () => {
  // Ref for the complete printable marksheet section.
  const printRef = useRef<HTMLDivElement | null>(null);

  // Keep this separate if StudentMarksheet uses its own componentRef.
  const componentRef = useRef<HTMLDivElement | null>(null);

  const [formSelectData, setFormSelectData] =
    useState<StudentSelection>({
      name: "",
      admission: "",
      roll: "",
    });

  const [studentInfo, setStudentInfo] = useState<Student[]>([]);

  const query = useMemo(
    () => ({
      limit: 100,
      page: 1,
      sortBy: "",
      sortOrder: "",
    }),
    [],
  );

  const {
    data,
    isLoading,
    isError,
  } = useStudentsQuery(query);

  const studentData: Student[] = data?.students ?? [];

  // Get unique student names.
  const uniqueStudentNames = useMemo(
    () =>
      Array.from(
        new Set(
          studentData
            .map((student) => student.name?.trim())
            .filter(
              (name): name is string => Boolean(name),
            ),
        ),
      ),
    [studentData],
  );

  // Get available classes for the selected student.
  const availableClasses = useMemo(() => {
    if (!formSelectData.name) return [];

    return Array.from(
      new Set(
        studentData
          .filter(
            (student) =>
              student.name?.trim() === formSelectData.name,
          )
          .map((student) => student.admission)
          .filter(
            (admission): admission is string | number =>
              admission !== undefined &&
              admission !== null &&
              String(admission).trim() !== "",
          )
          .map(String),
      ),
    );
  }, [studentData, formSelectData.name]);

  // Get available rolls for the selected student and class.
  const availableRolls = useMemo(() => {
    if (!formSelectData.name || !formSelectData.admission) {
      return [];
    }

    return Array.from(
      new Set(
        studentData
          .filter(
            (student) =>
              student.name?.trim() === formSelectData.name &&
              String(student.admission) ===
                formSelectData.admission,
          )
          .map((student) => student.roll)
          .filter(
            (roll): roll is string | number =>
              roll !== undefined &&
              roll !== null &&
              String(roll).trim() !== "",
          )
          .map(String),
      ),
    );
  }, [
    studentData,
    formSelectData.name,
    formSelectData.admission,
  ]);

  // Find the currently selected student.
  const selectedStudent = useMemo(
    () =>
      studentData.find(
        (student) =>
          student.name?.trim() === formSelectData.name &&
          String(student.admission) ===
            formSelectData.admission &&
          String(student.roll) === formSelectData.roll,
      ),
    [
      studentData,
      formSelectData.name,
      formSelectData.admission,
      formSelectData.roll,
    ],
  );

  const hasResult = studentInfo.length > 0;

  // Print only the selected marksheet.
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Student-Marksheet-${formSelectData.roll || "Student"}`,
    pageStyle: `
      @page {
        size: A4 portrait;
        margin: 10mm;
      }

      html,
      body {
        margin: 0 !important;
        padding: 0 !important;
        background: #ffffff !important;
        print-color-adjust: exact !important;
        -webkit-print-color-adjust: exact !important;
      }

      body {
        font-family: Arial, Helvetica, sans-serif;
      }

      .no-print {
        display: none !important;
      }

      #print-marksheet {
        width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
        border: none !important;
        border-radius: 0 !important;
        box-shadow: none !important;
        overflow: visible !important;
        background: #ffffff !important;
      }

      #print-marksheet * {
        visibility: visible !important;
      }

      #print-marksheet table {
        width: 100%;
        border-collapse: collapse;
      }

      #print-marksheet tr,
      #print-marksheet img {
        break-inside: avoid;
        page-break-inside: avoid;
      }

      #print-marksheet .no-print {
        display: none !important;
      }
    `,
    onPrintError: (location, error) => {
      console.error(`Print error at ${location}:`, error);
      toast.error("Failed to print the marksheet.");
    },
  });

  // Handle dropdown changes.
  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setFormSelectData((previous) => {
      if (name === "name") {
        return {
          name: value,
          admission: "",
          roll: "",
        };
      }

      if (name === "admission") {
        return {
          ...previous,
          admission: value,
          roll: "",
        };
      }

      return {
        ...previous,
        roll: value,
      };
    });

    // Clear previous result when selection changes.
    setStudentInfo([]);
  };

  // Find the selected student's marksheet.
  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    const { name, admission, roll } = formSelectData;

    if (!name || !admission || !roll) {
      toast.warning(
        "Please select student name, class, and roll number.",
      );
      return;
    }

    const result = studentData.filter(
      (student) =>
        student.name?.trim() === name &&
        String(student.admission) === admission &&
        String(student.roll) === roll,
    );

    setStudentInfo(result);

    if (result.length === 0) {
      toast.info(
        "No student found for the selected information.",
      );
    }
  };

  // Reset filters and marksheet.
  const handleReset = () => {
    setFormSelectData({
      name: "",
      admission: "",
      roll: "",
    });

    setStudentInfo([]);
  };

  return (
    <div className="min-h-screen bg-slate-50 px-3 py-5 sm:px-5 lg:px-6">
      <div className="mx-auto w-full max-w-7xl">
        {/* Page header */}
        <div className="no-print mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white shadow-md shadow-indigo-200">
              <GraduationCap className="h-6 w-6" />
            </div>

            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-800 sm:text-3xl">
                Student Marksheet
              </h1>
              
            </div>
          </div>

          <div className="flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
            <Users className="h-4 w-4 text-indigo-500" />
            <span className="text-xs font-semibold text-slate-600">
              Students: {studentData.length}
            </span>
          </div>
        </div>

        {/* Search panel */}
        <div className="no-print mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-indigo-100 bg-gradient-to-r from-indigo-50 via-white to-blue-50 px-5 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="h-8 w-1 rounded-full bg-indigo-600" />
              <div>
                <h2 className="font-bold text-slate-800">
                  Find Student Result
                </h2>
             
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="p-4 sm:p-6"
          >
            <div className="grid grid-cols-1 items-end gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <SelectField
                label="Student Name"
                icon={<UserRound className="h-4 w-4" />}
                name="name"
                value={formSelectData.name}
                placeholder={
                  isLoading
                    ? "Loading students..."
                    : "Select student"
                }
                options={uniqueStudentNames}
                disabled={isLoading || isError}
                onChange={handleChange}
              />

              <SelectField
                label="Student Class"
                icon={<BookOpen className="h-4 w-4" />}
                name="admission"
                value={formSelectData.admission}
                placeholder={
                  formSelectData.name
                    ? "Select class"
                    : "Select student first"
                }
                options={availableClasses}
                disabled={
                  !formSelectData.name ||
                  isLoading ||
                  isError
                }
                onChange={handleChange}
              />

              <SelectField
                label="Student Roll"
                icon={<Users className="h-4 w-4" />}
                name="roll"
                value={formSelectData.roll}
                placeholder={
                  formSelectData.admission
                    ? "Select roll"
                    : "Select class first"
                }
                options={availableRolls}
                disabled={
                  !formSelectData.admission ||
                  isLoading ||
                  isError
                }
                onChange={handleChange}
              />

              <div className="flex items-end gap-2">
                <button
                  type="submit"
                  disabled={
                    isLoading ||
                    isError ||
                    !formSelectData.name ||
                    !formSelectData.admission ||
                    !formSelectData.roll
                  }
                  className="flex h-12 min-w-0 flex-1 items-center justify-center gap-2  bg-gradient-to-r from-indigo-600 to-blue-600 px-3 text-sm font-bold text-white shadow-md shadow-indigo-200/60 transition hover:-translate-y-0.5 hover:from-indigo-700 hover:to-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Search className="h-4 w-4 shrink-0" />
                  <span>Find Result</span>
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  title="Reset"
                  aria-label="Reset student selection"
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Loading state */}
            {isLoading && (
              <p className="mt-4 flex items-center gap-2 text-sm text-indigo-600">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading student records...
              </p>
            )}

            {/* Error state */}
            {isError && (
              <p
                role="alert"
                className="mt-4 text-sm text-rose-600"
              >
                Unable to load student records. Please try again.
              </p>
            )}

           
          </form>
        </div>

        {/* Marksheet and print button */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {isLoading ? (
            <LoadingState />
          ) : hasResult ? (
            <>
              {/* Toolbar: excluded from printing */}
              <div className="no-print flex flex-col gap-3 border-b border-slate-200 bg-gradient-to-r from-indigo-50 via-white to-blue-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <div>
                  <h2 className="font-bold text-slate-800">
                    Marksheet Preview
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Review the result before printing.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handlePrint()}
                  className="flex h-11 items-center justify-center gap-2 px-5 text-sm font-bold text-black shadow-md transition hover:-translate-y-0.5 hover:from-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-indigo-100"
                >
                  <Printer className="h-4 w-4" />
                  Print Marksheet
                </button>
              </div>

              {/* Only this section is printed */}
              <div
                id="print-marksheet"
                ref={printRef}
                className="marksheet-print-area min-h-[400px] bg-white p-3 sm:p-6"
              >
                <StudentMarksheet
                  studentInfo={studentInfo}
                  componentRef={componentRef}
                />
              </div>
            </>
          ) : (
            <EmptyMarksheetState />
          )}
        </div>
      </div>
    </div>
  );
};

/* ================================================================
   SELECT FIELD
================================================================ */

interface SelectFieldProps {
  label: string;
  name: string;
  value: string;
  placeholder: string;
  options: Array<string | number>;
  icon: React.ReactNode;
  disabled?: boolean;
  onChange: (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => void;
}

const SelectField = ({
  label,
  name,
  value,
  placeholder,
  options,
  icon,
  disabled,
  onChange,
}: SelectFieldProps) => {
  const id = `student-result-${name}`;

  return (
    <div className="w-full min-w-0">
      <label
        htmlFor={id}
        className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500"
      >
        <span className="text-indigo-500">{icon}</span>
        {label}
      </label>

      <div className="relative">
        <select
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className="h-10 w-full appearance-none  border border-slate-300 bg-white px-3 pr-9 text-sm font-semibold text-slate-700 outline-none transition hover:border-indigo-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
        >
          <option value="">{placeholder}</option>

          {options.map((option, index) => (
            <option
              key={`${name}-${String(option)}-${index}`}
              value={String(option)}
            >
              {String(option)}
            </option>
          ))}
        </select>

        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      </div>
    </div>
  );
};

/* ================================================================
   SELECTED STUDENT INFO BADGE
================================================================ */

const InfoBadge = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => (
  <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-100 bg-white px-3 py-1.5 text-xs shadow-sm">
    <span className="font-semibold text-slate-400">
      {label}:
    </span>
    <span className="font-bold text-emerald-700">
      {value}
    </span>
  </span>
);

/* ================================================================
   LOADING STATE
================================================================ */

const LoadingState = () => (
  <div className="flex min-h-[400px] flex-col items-center justify-center p-8 text-center">
    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50">
      <Loader2 className="h-7 w-7 animate-spin text-indigo-600" />
    </div>

    <h3 className="mt-5 text-lg font-bold text-slate-700">
      Loading Students
    </h3>

    <p className="mt-1 max-w-sm text-sm text-slate-400">
      Please wait while student information is being loaded.
    </p>
  </div>
);

/* ================================================================
   EMPTY MARKSHEET STATE
================================================================ */

const EmptyMarksheetState = () => (
  <div className="flex flex-col items-center justify-center p-8 text-center">
    <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-indigo-50 text-indigo-400">
      <FileSearch className="h-9 w-9" />
    </div>

    <h3 className="mt-5 text-xl font-bold text-slate-700">
      No Marksheet Selected
    </h3>
  </div>
);

export default StudentMarksheetPage;
