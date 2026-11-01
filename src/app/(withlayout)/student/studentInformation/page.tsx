
"use client";

import PrintButton from "@/components/PrintButton";
import StudentInformation from "@/components/StudentInformation/StudentInformation";
import { useStudentsQuery } from "@/redux/api/studentApi";
import React, { useMemo, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";

type Student = {
  id: string;
  name: string;
  admission: string;
  roll: string | number;
  [key: string]: any;
};

const StudentInformationPage = () => {
  const componentRef = useRef<HTMLDivElement>(null);

  const [formSelectData, setFormSelectData] = useState({
    name: "",
    admission: "",
    roll: "",
  });

  const [studentInfo, setStudentInfo] = useState<Student[]>([]);
  const [searchError, setSearchError] = useState("");

  const query = useMemo(
    () => ({
      limit: 1000,
      page: 1,
    }),
    [],
  );

  const { data, isLoading, isError } = useStudentsQuery(query);

  // Support common API response shapes.
  const studentData: Student[] = useMemo(() => {
    const response = data as any;

    const students =
      response?.students ??
      response?.data?.students ??
      response?.data?.data ??
      response?.data ??
      [];

    return Array.isArray(students) ? students : [];
  }, [data]);

  const studentNames = useMemo(() => {
    const names = studentData
      .map((student) => student.name)
      .filter((name): name is string => Boolean(name));

    return Array.from(new Set(names));
  }, [studentData]);


  const selectedNameStudents = useMemo(() => {
    if (!formSelectData.name) return [];

    return studentData.filter(
      (student) => student.name === formSelectData.name,
    );
  }, [studentData, formSelectData.name]);


  const admissionOptions = useMemo(() => {
    const admissions = selectedNameStudents
      .map((student) => student.admission)
      .filter(Boolean);

    return Array.from(new Set(admissions));
  }, [selectedNameStudents]);



  const rollOptions = useMemo(() => {
    const rolls = selectedNameStudents
      .filter(
        (student) =>
          // Keep your existing filter conditions here.
          Boolean(student.roll),
      )
      .map((student) => student.roll)
      .filter(Boolean);

    return Array.from(new Set(rolls));
  }, [selectedNameStudents]);


  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;

    setSearchError("");
    setStudentInfo([]);

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
        [name]: value,
      };
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearchError("");

    const { name, admission, roll } = formSelectData;

    if (!name || !admission || !roll) {
      setStudentInfo([]);
      setSearchError("Please select a student name, class, and roll number.");
      return;
    }

    const result = studentData.filter(
      (student) =>
        student.name === name &&
        student.admission === admission &&
        String(student.roll) === String(roll),
    );

    setStudentInfo(result);

    if (result.length === 0) {
      setSearchError("No student found for the selected information.");
    }
  };

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: "Student-Information",
  });

  return (
    <div className="min-h-screen bg-slate-50/70 px-2 py-5 sm:px-3 lg:px-4">
      <div className="mx-auto w-full max-w-7xl">
        {/* Header */}
        <div className="mb-3 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.8}
                stroke="currentColor"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6.75a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.25a7.5 7.5 0 0 1 15 0"
                />
              </svg>
            </div>

            <div>
              <h1 className="text-xl font-bold text-slate-800 sm:text-2xl">
                Student Information
              </h1>
              <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
                Search and view detailed student information
              </p>
            </div>
          </div>

          <PrintButton handlePrint={handlePrint} />
        </div>

        {/* Search Card */}
        <div className="mb-3 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 bg-gradient-to-r from-sky-50 via-white to-blue-50 px-5 py-4 sm:px-7">
            <div className="flex items-center gap-3">
              <div className="h-1 w-8 rounded-full bg-sky-500" />
              <div>
                <h2 className="text-base font-bold text-slate-800">
                  Find Student
                </h2>
                <p className="mt-0.5 text-xs text-slate-500">
                  Select student details to view the full profile.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-5 sm:p-7">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
              {/* Student Name */}
              <div>
                <label
                  htmlFor="student-name"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Student Name
                </label>
                <select
                  id="student-name"
                  name="name"
                  value={formSelectData.name}
                  onChange={handleChange}
                  disabled={isLoading}
                  required
                  className="h-10 w-full border border-slate-300 bg-slate-50/70 px-4 text-sm text-slate-700 outline-none focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100 disabled:opacity-60"
                >
                  <option value="">
                    {isLoading ? "Loading students..." : "Select student name"}
                  </option>
                  {studentNames.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Class / Admission */}
              <div>
                <label
                  htmlFor="student-admission"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Class
                </label>
                <select
                  id="student-admission"
                  name="admission"
                  value={formSelectData.admission}
                  onChange={handleChange}
                  disabled={!formSelectData.name}
                  required
                  className="h-10 w-full border border-slate-300 bg-slate-50/70 px-4 text-sm text-slate-700 outline-none focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100 disabled:opacity-60"
                >
                  <option value="">Select class</option>
                  {admissionOptions.map((admission) => (
                    <option key={admission} value={admission}>
                      {admission}
                    </option>
                  ))}
                </select>
              </div>

              {/* Roll Number */}
              <div>
                <label
                  htmlFor="student-roll"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Roll Number
                </label>
                <select
                  id="student-roll"
                  name="roll"
                  value={formSelectData.roll}
                  onChange={handleChange}
                  disabled={!formSelectData.admission}
                  required
                  className="h-10 w-full border border-slate-300 bg-slate-50/70 px-4 text-sm text-slate-700 outline-none focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100 disabled:opacity-60"
                >
                  <option value="">Select roll</option>
                  {rollOptions.map((roll) => (
                    <option key={roll} value={roll}>
                      {roll}
                    </option>
                  ))}
                </select>
              </div>

              {/* Submit */}
              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={isLoading || isError}
                  className="h-10 w-full bg-gradient-to-r from-sky-500 to-blue-600 px-6 text-sm font-semibold text-white shadow-md transition hover:from-sky-600 hover:to-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Find Student
                </button>
              </div>
            </div>

            {isError && (
              <p role="alert" className="mt-4 text-sm text-red-600">
                Unable to load student records. Please try again.
              </p>
            )}

            {searchError && (
              <p role="status" className="mt-4 text-sm text-amber-700">
                {searchError}
              </p>
            )}
          </form>
        </div>

        {/* Results */}
        {studentInfo.length > 0 ? (
          <StudentInformation
            componentRef={componentRef}
            studentInfo={studentInfo}
          />
        ) : (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
            Select a student, class, and roll number, then click Find Student.
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentInformationPage;
