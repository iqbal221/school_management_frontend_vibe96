"use client";

import Image from "next/image";
import React from "react";
import school_logo from "../../../public/school_logo.svg";

interface StudentInfo {
  _id?: string;
  id?: string;
  name?: string;
  fatherName?: string;
  motherName?: string;
  admission?: string;
  roll?: string | number;
  image?: string[];
}

interface StudentIdCardProps {
  studentInfo: StudentInfo[];
  componentRef?: React.Ref<HTMLDivElement>;
}

const StudentIdCard = ({ studentInfo, componentRef }: StudentIdCardProps) => {
  const issueDate = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  if (!studentInfo || studentInfo.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center px-4">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-10 w-10 text-slate-400">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5A3.375 3.375 0 0 0 10.125 2.25H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Zm3.75 11.625a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
              />
            </svg>
          </div>

          <h2 className="text-lg font-semibold text-slate-700">
            No Student Data
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Student information will appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-6 px-4 py-8">
      {studentInfo.map((SInfo, index) => {
        const studentImage = SInfo.image?.[0];

        return (
          <div
            key={SInfo._id || SInfo.id || index}
            className="flex justify-center">
            {/* EXACT ID CARD
                Width  = 54mm
                Height = 85.6mm
            */}
            <div
              ref={index === 0 ? componentRef : undefined}
              className="
                relative
                box-border
                h-[110mm]
                w-[75mm]
                overflow-hidden
                rounded-[3mm]
                border-[0.35mm]
                border-slate-300
                bg-white
                shadow-xl

                print:h-[85.6mm]
                print:w-[54mm]
                print:rounded-none
                print:border-[0.2mm]
                print:shadow-none
              ">
              {/* =========================================
                  HEADER
              ========================================== */}
              <div
                className="
                  relative
                  h-[24mm]
                  overflow-hidden
                  bg-gradient-to-br
                  from-sky-700
                  via-blue-700
                  to-indigo-800
                ">
                {/* Decorative circles */}
                <div className="absolute -right-[8mm] -top-[8mm] h-[25mm] w-[25mm] rounded-full bg-white/10" />

                <div className="absolute -left-[8mm] -bottom-[12mm] h-[25mm] w-[25mm] rounded-full bg-white/10" />

                {/* Header content */}
                <div className="relative z-10 flex flex-col items-center pt-[2.5mm] text-white">
                  {/* Logo */}
                  <div className="flex h-[10mm] w-[10mm] items-center justify-center rounded-full border-[0.4mm] border-white bg-white shadow-md">
                    <Image
                      src={school_logo}
                      width={80}
                      height={80}
                      className="h-[8mm] w-[8mm] object-contain"
                      alt="School Logo"
                    />
                  </div>

                  {/* School Name */}
                  <h1 className="mt-[1.2mm] max-w-[47mm] truncate text-center text-[2.8mm] font-bold leading-tight tracking-wide">
                    Bhatiary Shishu Kanon School
                  </h1>

                  {/* Address */}
                  <p className="mt-[0.5mm] text-center text-[1.8mm] font-medium leading-tight text-blue-100">
                    Bhatiary, Sitakund, Chattogram
                  </p>
                </div>
              </div>

              {/* =========================================
                  ID CARD BADGE
              ========================================== */}
              <div className="relative -mt-[2mm] flex justify-center">
                <div className="rounded-full bg-white px-[3.5mm] py-[1mm] shadow-md ring-[0.2mm] ring-slate-100">
                  <span className="text-[2.1mm] font-bold uppercase tracking-[0.25mm] text-blue-700">
                    Student ID Card
                  </span>
                </div>
              </div>

              {/* =========================================
                  STUDENT PHOTO
              ========================================== */}
              <div className="flex justify-center pt-[2mm]">
                <div className="relative">
                  {/* Glow */}
                  <div className="absolute -inset-[0.8mm] rounded-[2mm] bg-gradient-to-br from-blue-500 to-indigo-600 opacity-20" />

                  {/* Photo */}
                  <div className="relative h-[22mm] w-[18mm] overflow-hidden rounded-[2mm] border-[0.8mm] border-white bg-slate-100 shadow-md">
                    {studentImage ? (
                      <Image
                        src={studentImage}
                        width={180}
                        height={220}
                        className="h-full w-full object-cover"
                        alt={SInfo.name || "Student"}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-slate-400">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="h-[9mm] w-[9mm]">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* =========================================
                  STUDENT NAME
              ========================================== */}
              <div className="px-[3mm] pt-[1.5mm] text-center">
                <h2 className="truncate text-[3.2mm] font-bold leading-tight text-slate-800">
                  {SInfo.name || "Student Name"}
                </h2>

                <div className="mt-[0.8mm] flex items-center justify-center gap-[1.5mm]">
                  <span className="h-[1mm] w-[1mm] rounded-full bg-blue-600" />

                  <span className="text-[1.8mm] font-medium text-slate-500">
                    Student
                  </span>

                  <span className="h-[1mm] w-[1mm] rounded-full bg-blue-600" />
                </div>
              </div>

              {/* =========================================
                  STUDENT INFORMATION
              ========================================== */}
              <div className="mx-[3mm] mt-[2.5mm] overflow-hidden rounded-[2mm] border-[0.2mm] border-slate-200 bg-slate-50">
                <div className="divide-y divide-slate-200">
                  <InfoRow label="Father&rsquo;s Name" value={SInfo.fatherName} />

                  <InfoRow label="Mother&rsquo;s Name" value={SInfo.motherName} />

                  <InfoRow label="Class" value={SInfo.admission} />

                  <InfoRow label="Roll No." value={SInfo.roll} highlight />

                  <InfoRow label="Issue Date" value={issueDate} />
                </div>
              </div>

              {/* =========================================
                  FOOTER
              ========================================== */}
              <div className="absolute bottom-[2.5mm] left-[3mm] right-[3mm]">
                <div className="flex items-end justify-between">
                  {/* Academic Year */}
                  <div>
                    <p className="text-[1.5mm] font-medium uppercase tracking-wider text-slate-400">
                      Academic Year
                    </p>

                    <p className="mt-[0.3mm] text-[1.8mm] font-semibold text-slate-600">
                      {new Date().getFullYear()}
                    </p>
                  </div>

                  {/* Signature */}
                  <div className="text-center">
                    <div className="mb-[0.8mm] w-[15mm] border-t-[0.2mm] border-slate-400" />

                    <p className="text-[1.5mm] font-semibold text-slate-500">
                      Principal
                    </p>
                  </div>
                </div>
              </div>

              {/* =========================================
                  BOTTOM ACCENT
              ========================================== */}
              <div className="absolute bottom-0 left-0 right-0 h-[1.5mm] bg-gradient-to-r from-sky-600 via-blue-700 to-indigo-700" />
            </div>
          </div>
        );
      })}
    </div>
  );
};

interface InfoRowProps {
  label: string;
  value?: string | number;
  highlight?: boolean;
}

const InfoRow = ({ label, value, highlight = false }: InfoRowProps) => {
  return (
    <div className="flex min-h-[6.2mm] items-center px-[2mm]">
      {/* Label */}
      <div className="w-[42%] truncate text-[1.7mm] font-medium text-slate-500">
        {label}
      </div>

      {/* Value */}
      <div className="w-[58%] min-w-0">
        <div className="flex items-center gap-[1mm]">
          <span className="text-[1.7mm] text-slate-300">:</span>

          <span
            className={`truncate text-[1.8mm] font-semibold ${
              highlight ? "text-blue-700" : "text-slate-700"
            }`}>
            {value || "N/A"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default StudentIdCard;
