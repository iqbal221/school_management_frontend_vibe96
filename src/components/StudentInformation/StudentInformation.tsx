"use client";

import Image from "next/image";
import React from "react";

const StudentInformation = ({ componentRef, studentInfo }: any) => {
  if (!studentInfo || studentInfo.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white px-5 py-16 shadow-sm sm:py-20">
        <div className="mx-auto flex max-w-md flex-col items-center text-center">
          <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-sky-50">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-10 w-10 text-sky-400">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Zm3.75 11.625a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
              />
            </svg>
          </div>

          <h2 className="text-lg font-bold text-slate-700">
            No Student Selected
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-400">
            Select a student name, class, and roll number above to view the
            complete student information.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div ref={componentRef} className="space-y-5 print:space-y-0">
        {studentInfo.map((student: any, index: number) => (
          <div
            key={student?.id || index}
            className="
              student-print-card
              overflow-hidden
              rounded-2xl
              border
              border-slate-200
              bg-white
              shadow-sm
              print:rounded-none
              print:border
              print:border-slate-300
              print:shadow-none
              print:overflow-visible
              print:bg-white
            ">
            {/* ================= PROFILE HEADER ================= */}
            <div
              className="
                border-b
                border-slate-200
                bg-gradient-to-r
                from-sky-50
                via-white
                to-blue-50
                px-5
                py-4
                sm:px-8

                print:bg-white
                print:px-4
                print:py-3
              ">
              <div
                className="
                  flex
                  flex-col
                  gap-6
                  md:flex-row
                  md:items-center

                  print:flex-row
                  print:items-center
                  print:gap-4
                ">
                {/* Profile Image */}
                <div className="shrink-0">
                  {student?.image?.[0] ? (
                    <div
                      className="
                        overflow-hidden
                        rounded-2xl
                        border-4
                        border-white
                        bg-white
                        shadow-md

                        print:rounded-lg
                        print:border-2
                        print:shadow-none
                      ">
                      <Image
                        width={140}
                        height={160}
                        src={student.image[0]}
                        alt={`${student?.name || "Student"} profile`}
                        className="
                          h-36
                          w-32
                          object-cover
                          sm:h-40
                          sm:w-36

                          print:h-24
                          print:w-20
                        "
                      />
                    </div>
                  ) : (
                    <div
                      className="
                        flex
                        h-36
                        w-32
                        items-center
                        justify-center
                        rounded-2xl
                        border-2
                        border-dashed
                        border-sky-200
                        bg-white
                        text-center
                        text-xs
                        font-medium
                        text-slate-400
                        sm:h-40
                        sm:w-36

                        print:h-24
                        print:w-20
                        print:rounded-lg
                      ">
                      No Profile
                      <br />
                      Image
                    </div>
                  )}
                </div>

                {/* Main Student Info */}
                <div className="flex-1">
                  <div
                    className="
                      mb-3
                      inline-flex
                      rounded-full
                      bg-sky-100
                      px-3
                      py-1
                      text-xs
                      font-semibold
                      text-sky-700

                      print:mb-1
                      print:bg-slate-100
                      print:px-2
                      print:py-0.5
                      print:text-[9px]
                    ">
                    Student Profile
                  </div>

                  <h2
                    className="
                      text-2xl
                      font-bold
                      text-slate-800
                      sm:text-3xl

                      print:text-xl
                    ">
                    {student?.name}
                  </h2>

                  <div
                    className="
                      mt-4
                      grid
                      grid-cols-2
                      gap-4
                      sm:grid-cols-3

                      print:mt-2
                      print:grid-cols-3
                      print:gap-3
                    ">
                    <div>
                      <p className="text-xs font-medium text-slate-400 print:text-[9px]">
                        Class
                      </p>

                      <p className="mt-1 text-sm font-semibold text-slate-700 print:mt-0.5 print:text-xs">
                        {student?.admission || "—"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-slate-400 print:text-[9px]">
                        Roll Number
                      </p>

                      <p className="mt-1 text-sm font-semibold text-slate-700 print:mt-0.5 print:text-xs">
                        {student?.roll || "—"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-slate-400 print:text-[9px]">
                        Student ID
                      </p>

                      <p className="mt-1 text-sm font-semibold text-slate-700 print:mt-0.5 print:text-xs">
                        {student?.studentIdNumber || "—"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ================= INFORMATION ================= */}
            <div
              className="
                p-5
                sm:p-8

                print:p-4
              ">
              {/* Section Header */}
              <div
                className="
                  mb-5
                  flex
                  items-center
                  gap-3

                  print:mb-3
                  print:gap-2
                ">
                <div className="h-1 w-8 rounded-full bg-sky-500 print:h-0.5 print:w-5" />

                <div>
                  <h3 className="text-lg font-bold text-slate-800 print:text-sm">
                    Personal Information
                  </h3>

                  <p className="mt-0.5 text-xs text-slate-400 print:text-[9px]">
                    Detailed information about the student
                  </p>
                </div>
              </div>

              {/* ================= INFORMATION GRID ================= */}
              <div
                className="
                  grid
                  grid-cols-1
                  gap-4
                  sm:grid-cols-2
                  lg:grid-cols-3

                  print:grid-cols-3
                  print:gap-2
                ">
                <InfoItem label="Full Name" value={student?.name} />

                <InfoItem label="Father Name" value={student?.fatherName} />

                <InfoItem label="Mother Name" value={student?.motherName} />

                <InfoItem label="Email Address" value={student?.email} />

                <InfoItem label="Contact Number" value={student?.contact} />

                <InfoItem
                  label="Emergency Contact"
                  value={student?.emergencyContactNo}
                />

                <InfoItem label="Blood Group" value={student?.bloodGroup} />

                <InfoItem label="Date of Birth" value={student?.dateOfBirth} />

                <InfoItem label="Religion" value={student?.religious} />

                <InfoItem label="Gender" value={student?.gender} />

                <InfoItem label="Class" value={student?.admission} />

                <InfoItem label="Roll Number" value={student?.roll} />

                {/* Address */}
                <div className="sm:col-span-2 lg:col-span-3 print:col-span-3">
                  <InfoItem label="Address" value={student?.address} />
                </div>
              </div>

              {/* ================= BOTTOM SUMMARY ================= */}
              <div
                className="
                  mt-7
                  rounded-xl
                  border
                  border-sky-100
                  bg-sky-50/60
                  px-4
                  py-4

                  print:mt-3
                  print:rounded-lg
                  print:border-slate-200
                  print:bg-slate-50
                  print:px-3
                  print:py-2
                ">
                <div
                  className="
                    flex
                    flex-col
                    gap-3
                    sm:flex-row
                    sm:items-center
                    sm:justify-between

                    print:flex-row
                    print:items-center
                    print:justify-between
                  ">
                  <div>
                    <p className="text-xs font-medium text-sky-600 print:text-[9px]">
                      Student Record
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-700 print:mt-0.5 print:text-xs">
                      {student?.name}
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <p className="text-xs font-medium text-sky-600 print:text-[9px]">
                      Class / Roll
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-700 print:mt-0.5 print:text-xs">
                      {student?.admission || "—"} / {student?.roll || "—"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ================= PRINT CSS ================= */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 8mm;
          }

          html,
          body {
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
          }

          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          .student-print-card {
            width: 100% !important;
            max-width: 100% !important;
          }

          /* Force exactly 3 columns while printing */
          .student-print-card .grid {
            grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
          }

          /* Keep every information box together */
          .student-print-card .grid > div {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }

          /* Keep complete student card on one page */
          .student-print-card {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }

          /* Remove browser link decoration */
          a {
            color: inherit !important;
            text-decoration: none !important;
          }
        }
      `}</style>
    </>
  );
};

/* =========================================================
   INFORMATION ITEM
========================================================= */

interface InfoItemProps {
  label: string;
  value?: any;
}

const InfoItem = ({ label, value }: InfoItemProps) => {
  return (
    <div
      className="
        rounded-xl
        border
        border-slate-100
        bg-slate-50/60
        px-4
        py-3.5
        transition

        hover:border-sky-100
        hover:bg-sky-50/30

        print:rounded-md
        print:border-slate-200
        print:bg-slate-50
        print:px-2.5
        print:py-2
      ">
      <p
        className="
          text-xs
          font-semibold
          uppercase
          tracking-wide
          text-slate-400

          print:text-[8px]
          print:tracking-normal
        ">
        {label}
      </p>

      <p
        className="
          mt-1.5
          break-words
          text-sm
          font-medium
          text-slate-700

          print:mt-0.5
          print:text-[10px]
          print:leading-tight
        ">
        {value || "—"}
      </p>
    </div>
  );
};

export default StudentInformation;
