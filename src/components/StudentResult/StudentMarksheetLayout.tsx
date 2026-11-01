"use client";

import React from "react";

/* ================================================================
   TYPES
================================================================ */

interface StudentMarksheetProps {
  serial: number;
  subName: string;
  subNum?: string | number;
  subGrade?: string;
}

/* ================================================================
   CONSTANTS
================================================================ */

const FULL_MARKS = 100;

/* ================================================================
   REMARKS
================================================================ */

const getRemarks = (grade?: string): string => {
  switch (grade?.trim().toUpperCase()) {
    case "A+":
      return "Excellent";

    case "A":
      return "Very Good";

    case "A-":
      return "Good";

    case "B":
      return "Satisfactory";

    case "C":
      return "Average";

    case "D":
      return "Pass";

    case "F":
      return "Fail";

    default:
      return "—";
  }
};

/* ================================================================
   GRADE STYLE
================================================================ */

const getGradeStyle = (grade?: string): string => {
  switch (grade?.trim().toUpperCase()) {
    case "A+":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";

    case "A":
      return "border-sky-200 bg-sky-50 text-sky-700";

    case "A-":
      return "border-cyan-200 bg-cyan-50 text-cyan-700";

    case "B":
      return "border-indigo-200 bg-indigo-50 text-indigo-700";

    case "C":
      return "border-amber-200 bg-amber-50 text-amber-700";

    case "D":
      return "border-orange-200 bg-orange-50 text-orange-700";

    case "F":
      return "border-red-200 bg-red-50 text-red-700";

    default:
      return "border-slate-200 bg-slate-50 text-slate-500";
  }
};

/* ================================================================
   MARKS STYLE
================================================================ */

const getMarksStyle = (marks?: string | number): string => {
  if (marks === undefined || marks === null || marks === "") {
    return "text-slate-400";
  }

  const numericMarks = Number(marks);

  if (Number.isNaN(numericMarks)) {
    return "text-slate-700";
  }

  if (numericMarks >= 80) {
    return "text-emerald-700";
  }

  if (numericMarks >= 60) {
    return "text-sky-700";
  }

  if (numericMarks >= 40) {
    return "text-amber-700";
  }

  return "text-red-600";
};

/* ================================================================
   COMPONENT
================================================================ */

const StudentMarksheetLayout = ({
  serial,
  subName,
  subNum,
  subGrade,
}: StudentMarksheetProps) => {
  const marksValue =
    subNum !== undefined && subNum !== null && subNum !== "" ? subNum : "—";

  const gradeValue = subGrade?.trim() || "—";

  const normalizedGrade = subGrade?.trim().toUpperCase();

  const remarks = getRemarks(subGrade);

  const marksStyle = getMarksStyle(subNum);

  const gradeStyle = getGradeStyle(subGrade);

  const isFail = normalizedGrade === "F";

  return (
    <tr
      className="
        border-b
        border-slate-200
        bg-white
        transition-colors
        duration-150
        last:border-b-0
        hover:bg-slate-50
        print:hover:bg-white
      ">
      {/* =========================================================
          SERIAL
      ========================================================= */}

      <td
        className="
          w-[55px]
          border-r
          border-slate-200
          px-3
          py-3.5
          text-center
          align-middle
          sm:py-4
        ">
        <span
          className="
            inline-flex
            h-7
            w-7
            items-center
            justify-center
            rounded-lg
            bg-slate-100
            text-[11px]
            font-bold
            text-slate-600
          ">
          {serial}
        </span>
      </td>

      {/* =========================================================
          SUBJECT
      ========================================================= */}

      <td
        className="
          border-r
          border-slate-200
          px-4
          py-3.5
          align-middle
          sm:py-4
        ">
        <span
          className="
            text-sm
            font-bold
            text-slate-700
          ">
          {subName}
        </span>
      </td>

      {/* =========================================================
          FULL MARKS
      ========================================================= */}

      <td
        className="
          w-[105px]
          border-r
          border-slate-200
          px-3
          py-3.5
          text-center
          align-middle
          sm:py-4
        ">
        <span
          className="
            text-sm
            font-semibold
            text-slate-500
          ">
          {FULL_MARKS}
        </span>
      </td>

      {/* =========================================================
          OBTAINED MARKS
      ========================================================= */}

      <td
        className="
          w-[105px]
          border-r
          border-slate-200
          px-3
          py-3.5
          text-center
          align-middle
          sm:py-4
        ">
        <span
          className={`
            text-sm
            font-extrabold
            ${marksStyle}
          `}>
          {marksValue}
        </span>
      </td>

      {/* =========================================================
          GRADE
      ========================================================= */}

      <td
        className="
          w-[95px]
          border-r
          border-slate-200
          px-3
          py-3.5
          text-center
          align-middle
          sm:py-4
        ">
        <span
          className={`
            inline-flex
            min-w-[44px]
            items-center
            justify-center
            rounded-lg
            border
            px-2.5
            py-1
            text-[11px]
            font-extrabold
            ${gradeStyle}
          `}>
          {gradeValue}
        </span>
      </td>

      {/* =========================================================
          REMARKS
      ========================================================= */}

      <td
        className="
          w-[125px]
          px-3
          py-3.5
          text-center
          align-middle
          sm:py-4
        ">
        <span
          className={`
            text-xs
            font-semibold
            ${isFail ? "text-red-600" : "text-slate-500"}
          `}>
          {remarks}
        </span>
      </td>
    </tr>
  );
};

export default StudentMarksheetLayout;
