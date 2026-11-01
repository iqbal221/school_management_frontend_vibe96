
"use client";

import Image from "next/image";
import React, { useMemo } from "react";

import school_logo from "../../../public/school_logo.svg";
import { useStudentResultQuery } from "@/redux/api/studentApi";
import StudentMarksheetLayout from "./StudentMarksheetLayout";

export interface StudentInfo {
  _id?: string;
  id?: string;
  name?: string;
  admission?: string | number;
  roll?: string | number;

  banglaMarks?: string | number;
  englishMarks?: string | number;
  mathematicsMarks?: string | number;
  scienceMarks?: string | number;
  religiousMarks?: string | number;

  banglaGrade?: string;
  englishGrade?: string;
  mathematicsGrade?: string;
  scienceGrade?: string;
  religiousGrade?: string;

  point?: string | number;
  grade?: string;
}

interface StudentMarksheetProps {
  studentInfo: StudentInfo[];
  componentRef?: React.Ref<HTMLDivElement>;
}

const subjects = [
  {
    name: "Bangla",
    marksKey: "banglaMarks",
    gradeKey: "banglaGrade",
  },
  {
    name: "English",
    marksKey: "englishMarks",
    gradeKey: "englishGrade",
  },
  {
    name: "Mathematics",
    marksKey: "mathematicsMarks",
    gradeKey: "mathematicsGrade",
  },
  {
    name: "Science",
    marksKey: "scienceMarks",
    gradeKey: "scienceGrade",
  },
  {
    name: "Religious Studies",
    marksKey: "religiousMarks",
    gradeKey: "religiousGrade",
  },
] as const;

const StudentMarksheet = ({
  studentInfo,
  componentRef,
}: StudentMarksheetProps) => {
  const selectedStudent = studentInfo?.[0] ?? null;

  const query = useMemo(
    () => ({
      limit: 100,
      page: 1,
      sortBy: "",
      sortOrder: "",
    }),
    [],
  );

  const { data, isLoading, isError, refetch } =
    useStudentResultQuery(query);

  const studentResults: StudentInfo[] = useMemo(() => {
    return Array.isArray(data?.studentResult)
      ? data.studentResult
      : [];
  }, [data?.studentResult]);

  const selectedStudentHasMarks = useMemo(() => {
    if (!selectedStudent) return false;

    return [
      selectedStudent.banglaMarks,
      selectedStudent.englishMarks,
      selectedStudent.mathematicsMarks,
      selectedStudent.scienceMarks,
      selectedStudent.religiousMarks,
      selectedStudent.point,
      selectedStudent.grade,
    ].some((value) => value !== undefined && value !== null);
  }, [selectedStudent]);

  const resultStudent = useMemo(() => {
    if (!selectedStudent) return null;

    const selectedId = selectedStudent._id ?? selectedStudent.id;

    if (selectedId) {
      const resultById = studentResults.find((student) => {
        const resultId = student._id ?? student.id;

        return (
          resultId != null &&
          String(resultId) === String(selectedId)
        );
      });

      if (resultById) return resultById;
    }

    return (
      studentResults.find((student) => {
        const studentName = String(student.name ?? "")
          .trim()
          .toLowerCase();

        const selectedName = String(selectedStudent.name ?? "")
          .trim()
          .toLowerCase();

        return (
          studentName === selectedName &&
          String(student.admission ?? "").trim() ===
          String(selectedStudent.admission ?? "").trim() &&
          String(student.roll ?? "").trim() ===
          String(selectedStudent.roll ?? "").trim()
        );
      }) ?? null
    );
  }, [selectedStudent, studentResults]);

  const finalStudent = useMemo(() => {
    if (!selectedStudent) return null;

    return selectedStudentHasMarks
      ? selectedStudent
      : resultStudent;
  }, [selectedStudent, selectedStudentHasMarks, resultStudent]);

  if (!selectedStudent) {
    return (
      <MessageState
        title="No Student Selected"
        description="Please select a student, class and roll number first."
        type="empty"
      />
    );
  }

  if (isLoading && !selectedStudentHasMarks) {
    return <LoadingState />;
  }

  if (isError && !selectedStudentHasMarks) {
    return (
      <MessageState
        title="Unable to Load Result"
        description="There was a problem loading the student's result. Please try again."
        type="error"
        onRetry={() => {
          void refetch();
        }}
      />
    );
  }

  if (!finalStudent) {
    return (
      <MessageState
        title="No Result Found"
        description="No marksheet result was found for the selected student."
        type="empty"
      />
    );
  }

  return (
    <div className="w-full bg-slate-50 px-2 py-6 print:bg-white print:p-0">
      <div
        ref={componentRef}
        className="
          mx-auto w-full max-w-[760px] overflow-hidden
          border border-slate-200 bg-white shadow-lg
          print:max-w-none print:border-slate-300 print:shadow-none
        "
      >
        {/* LIGHT COLORFUL SCHOOL HEADER */}
        <header
          className="
            relative overflow-hidden
            border-b border-indigo-100
            bg-gradient-to-r from-indigo-50 via-sky-50 to-violet-50
            px-4 py-5 sm:px-6 sm:py-6
            print:bg-indigo-50
          "
        >
          {/* Decorative pastel accents */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-8 -top-12 h-36 w-36 rounded-full bg-violet-200/40"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-12 left-1/3 h-28 w-28 rounded-full bg-sky-200/40"
          />

          <div className="relative flex items-center gap-3 sm:gap-5">
            {/* School logo */}
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white bg-white p-1.5 shadow-sm sm:h-20 sm:w-20">
              <Image
                src={school_logo}
                width={200}
                height={200}
                priority
                className="h-full w-full object-contain"
                alt="Bhatiary Shishu Kanon School logo"
              />
            </div>

            {/* School name and address */}
            <div className="min-w-0 flex-1 text-center">
              <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-indigo-500 sm:text-[10px]">
                Academic Institution
              </p>

              <h1 className="mt-1 text-base font-extrabold leading-tight text-indigo-950 sm:text-2xl md:text-3xl">
                Bhatiary Shishu Kanon School
              </h1>

              <p className="mt-1 text-[10px] font-medium text-slate-600 sm:text-sm">
                Bhatiary, Sitakund, Chattogram
              </p>

              <div className="mx-auto mt-2 h-1 w-14 rounded-full bg-gradient-to-r from-indigo-400 via-sky-400 to-violet-400" />
            </div>

            {/* Balance space for centered school name */}
            <div className="h-14 w-2 shrink-0 sm:h-20 sm:w-14" />
          </div>
        </header>

        {/* COLORFUL MARKSHEET TITLE */}
        <section className="border-b border-sky-100 bg-gradient-to-r from-sky-50 via-white to-indigo-50 px-4 py-5 text-center sm:py-6 print:bg-sky-50">


          <h2 className="mt-2 text-xl font-extrabold uppercase tracking-[0.1em] text-slate-800 sm:text-2xl">
            Academic Marksheet
          </h2>
        </section>

        <main className="px-4 py-5 sm:px-6">
          {/* STUDENT INFORMATION */}
          <section className="overflow-hidden rounded-xl border border-indigo-100 bg-white">
            <div className="border-b border-indigo-100 bg-gradient-to-r from-indigo-50 to-sky-50 px-4 py-2.5">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-indigo-700">
                Student Information
              </p>
            </div>

            <div className="grid grid-cols-1 divide-y divide-slate-100 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              <StudentInfoItem
                label="Student Name"
                value={finalStudent.name}
              />
              <StudentInfoItem
                label="Class"
                value={finalStudent.admission}
              />
              <StudentInfoItem
                label="Roll Number"
                value={finalStudent.roll}
              />
            </div>
          </section>

          {/* SUBJECT MARKS TABLE */}
          <section className="mt-6 overflow-hidden rounded-xl border border-slate-200">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[650px] border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-indigo-100 via-sky-100 to-violet-100">
                    <th className="w-[55px] border-r border-indigo-100 px-3 py-3 text-center text-[11px] font-bold uppercase tracking-wider text-indigo-950">
                      SL
                    </th>

                    <th className="border-r border-indigo-100 px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-indigo-950">
                      Subject
                    </th>

                    <th className="w-[105px] border-r border-indigo-100 px-3 py-3 text-center text-[11px] font-bold uppercase tracking-wider text-indigo-950">
                      Full Marks
                    </th>

                    <th className="w-[105px] border-r border-indigo-100 px-3 py-3 text-center text-[11px] font-bold uppercase tracking-wider text-indigo-950">
                      Marks
                    </th>

                    <th className="w-[95px] border-r border-indigo-100 px-3 py-3 text-center text-[11px] font-bold uppercase tracking-wider text-indigo-950">
                      Grade
                    </th>

                    <th className="w-[125px] px-3 py-3 text-center text-[11px] font-bold uppercase tracking-wider text-indigo-950">
                      Remarks
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {subjects.map((subject, index) => (
                    <StudentMarksheetLayout
                      key={subject.name}
                      serial={index + 1}
                      subName={subject.name}
                      subNum={finalStudent[subject.marksKey]}
                      subGrade={finalStudent[subject.gradeKey]}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* OVERALL RESULT */}
          <section className="mt-6 overflow-hidden rounded-xl border border-indigo-100 bg-white">
            <div className="grid grid-cols-2 divide-x divide-indigo-100">
              <div className="bg-gradient-to-br from-sky-50 to-white">
                <ResultBox
                  label="Final CGPA"
                  value={finalStudent.point}
                />
              </div>

              <div className="bg-gradient-to-br from-violet-50 to-white">
                <ResultBox
                  label="Final Grade"
                  value={finalStudent.grade}
                />
              </div>
            </div>
          </section>

          {/* RESULT STATUS */}
          <div className="mt-5 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Result Completed
            </div>
          </div>

          {/* SIGNATURES */}
          <section className="mt-20 grid grid-cols-3 gap-4 text-center text-[10px] font-semibold text-slate-500 sm:mt-24 sm:text-xs">
            <Signature label="Result Published Date" />
            <Signature label="Class Teacher" />
            <Signature label="Principal" />
          </section>

          {/* FOOTER */}
          <footer className="mt-8 border-t border-indigo-100 pt-3 text-center text-[9px] font-medium text-slate-400">
            This marksheet is issued by Bhatiary Shishu Kanon School.
          </footer>
        </main>
      </div>
    </div>
  );
};

/* STUDENT INFORMATION ITEM */
interface StudentInfoItemProps {
  label: string;
  value?: string | number;
}

const StudentInfoItem = ({
  label,
  value,
}: StudentInfoItemProps) => (
  <div className="min-w-0 px-4 py-3.5 sm:px-5">
    <p className="text-[9px] font-bold uppercase tracking-wider text-indigo-400">
      {label}
    </p>

    <p className="mt-1 truncate text-sm font-bold text-slate-800">
      {value ?? "—"}
    </p>
  </div>
);

/* RESULT BOX */
interface ResultBoxProps {
  label: string;
  value?: string | number;
}

const ResultBox = ({ label, value }: ResultBoxProps) => (
  <div className="px-4 py-4 text-center sm:px-6 sm:py-5">
    <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-500">
      {label}
    </p>

    <p className="mt-1 text-xl font-extrabold text-indigo-950 sm:text-2xl">
      {value ?? "—"}
    </p>
  </div>
);

/* SIGNATURE */
const Signature = ({ label }: { label: string }) => (
  <div className="px-1">
    <div className="mx-auto mb-2 w-full max-w-[150px] border-t border-slate-400" />
    <p>{label}</p>
  </div>
);

/* LOADING STATE */
const LoadingState = () => (
  <div className="flex min-h-[400px] items-center justify-center bg-white p-8">
    <div className="text-center">
      <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />

      <h3 className="mt-4 text-sm font-bold text-slate-700">
        Loading Marksheet...
      </h3>

      <p className="mt-1 text-xs text-slate-400">
        Please wait while the result is loading.
      </p>
    </div>
  </div>
);

/* EMPTY AND ERROR STATES */
interface MessageStateProps {
  title: string;
  description: string;
  type?: "empty" | "error";
  onRetry?: () => void;
}

const MessageState = ({
  title,
  description,
  type = "empty",
  onRetry,
}: MessageStateProps) => (
  <div className="flex min-h-[400px] items-center justify-center bg-white p-8">
    <div className="max-w-md text-center">
      <div
        className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl ${type === "error"
            ? "bg-rose-50 text-rose-500"
            : "bg-indigo-50 text-indigo-400"
          }`}
      >
        {type === "error" ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-8 w-8"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m0 3.75h.007v.008H12v-.008ZM10.34 3.94l-7.2 12.5A1.875 1.875 0 0 0 4.765 19.25h14.47a1.875 1.875 0 0 0 1.624-2.81l-7.2-12.5a1.875 1.875 0 0 0-3.248 0Z"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-8 w-8"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Zm3.75 11.625a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
            />
          </svg>
        )}
      </div>

      <h2 className="mt-4 text-lg font-bold text-slate-700">
        {title}
      </h2>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {description}
      </p>

      {type === "error" && onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-100"
        >
          Try Again
        </button>
      )}
    </div>
  </div>
);

export default StudentMarksheet;
