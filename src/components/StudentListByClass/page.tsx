"use client";

import { useStudentsQuery } from "@/redux/api/studentApi";
import {
  Edit3,
  Mail,
  MapPin,
  Phone,
  Trash2,
  Users,
  GraduationCap,
  UserRound,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import DeleteConfirmationModal from "../Modal/DeleteStudentConfirmationModal";

const StudentListByClass = ({
  componentRef,
  studentClassTitle,
  Query,
}: any) => {
  const query: Record<string, any> = {};

  const [page] = useState<number>(1);
  const [size] = useState<number>(10);
  const [sortBy] = useState<string>("");
  const [sortOrder] = useState<string>("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteStudent, setDeleteStudent] = useState("");

  query["limit"] = size;
  query["page"] = page;
  query["sortBy"] = sortBy;
  query["sortOrder"] = sortOrder;
  query["searchTerm"] = Query;

  const { data, isLoading } = useStudentsQuery({ ...query });

  const studentData = data?.students || [];

  const studentDataFilterByclassName = studentData.filter(
    (student: any) => student?.admission === studentClassTitle,
  );

  const handleDelete = (id: string) => {
    setDeleteStudent(id);
    setShowDeleteModal(true);
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (isLoading) {
    return (
      <div className="mt-6">
        {/* CARD 1 SKELETON */}
        <div className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5 ">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-slate-200" />

              <div className="space-y-2">
                <div className="h-3 w-28 rounded bg-slate-200" />
                <div className="h-6 w-40 rounded bg-slate-200" />
                <div className="h-3 w-52 rounded bg-slate-100" />
              </div>
            </div>

            <div className="h-14 w-32 rounded-xl bg-slate-200" />
          </div>
        </div>

        {/* CARD 2 SKELETON */}
        <div className="animate-pulse rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-5">
            <div className="h-5 w-44 rounded bg-slate-200" />
            <div className="mt-2 h-3 w-64 rounded bg-slate-100" />
          </div>

          <div className="space-y-4 p-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="h-7 w-7 rounded-lg bg-slate-100" />
                <div className="h-12 w-12 rounded-xl bg-slate-200" />

                <div className="min-w-0 flex-1 space-y-2">
                  <div className="h-4 w-32 rounded bg-slate-200" />
                  <div className="h-3 w-20 rounded bg-slate-100" />
                </div>

                <div className="hidden h-4 w-28 rounded bg-slate-100 sm:block" />
                <div className="hidden h-4 w-28 rounded bg-slate-100 md:block" />

                <div className="flex gap-2">
                  <div className="h-8 w-8 rounded-lg bg-slate-100" />
                  <div className="h-8 w-8 rounded-lg bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================
     EMPTY STATE
  ========================================================= */

  if (studentDataFilterByclassName.length === 0) {
    return (
      <>
        <div className="mt-6  bg-white px-5 py-16">
          <div className="mx-auto flex max-w-md flex-col items-center text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-50">
              <Users className="h-8 w-8 text-sky-400" />
            </div>

            <h2 className="text-xl font-bold text-slate-700">
              No Students Found
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              There are no students available in{" "}
              <span className="font-semibold text-slate-500">
                {studentClassTitle || "this class"}
              </span>
              .
            </p>
          </div>
        </div>

        <DeleteConfirmationModal
          deleteStudentId={deleteStudent}
          showDeleteModal={showDeleteModal}
          setShowDeleteModal={setShowDeleteModal}
        />
      </>
    );
  }

  return (
    <>
      <div className="">

        {/* =====================================================
            PRINT HEADER
        ====================================================== */}

        <div className="mb-5 hidden print:block">
          <div className="border-b-2 border-slate-800 pb-3">
            <div className="text-center">
              <h1 className="text-xl font-bold uppercase text-slate-900">
                Student Information
              </h1>

              <h2 className="mt-1 text-lg font-semibold text-slate-700">
                Class {studentClassTitle}
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Total Students:{" "}
                <span className="font-semibold">
                  {studentDataFilterByclassName.length}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* =====================================================
            CARD 2 — STUDENT INFORMATION
        ====================================================== */}

        <div
          ref={componentRef}
          className="
            overflow-hidden
            rounded-2xl
            border
            border-slate-200
            bg-white
            print:px-4
            print:overflow-visible
            print:rounded-none
            print:border-0
            print:bg-white
            print:shadow-none
          ">
          {/* =================================================
              CARD HEADER
          ================================================== */}

          <div className="border-b border-slate-100 px-5 py-5 sm:px-6 print:border-b print:border-slate-700  print:py-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-3">
                <div className="min-w-0">
                  <h3 className="text-lg font-bold text-slate-800">
                    Student Information
                  </h3>
                  <p className="mt-0.5 text-xs text-slate-400">
                    Complete student list for Class {studentClassTitle}
                  </p>
                </div>
              </div>

              <div className="flex w-fit items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 ">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />

                <span className="text-xs font-semibold text-slate-500">
                  {studentDataFilterByclassName.length}{" "}
                  {studentDataFilterByclassName.length === 1
                    ? "Student"
                    : "Students"}
                </span>
              </div>
            </div>
          </div>

          {/* =================================================
              TABLE
          ================================================== */}

          <div className="w-full overflow-x-auto print:overflow-visible">
            <table className="w-full min-w-[800px] table-fixed border-collapse print:min-w-0 print:w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 print:border-b print:border-slate-700 print:bg-slate-100">
                  {/* SL */}
                  <th className="w-[4%] px-2 py-3.5 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400 sm:px-4 print:w-[6%] print:px-2 print:py-2 print:text-[9px] print:text-slate-800">
                    SL
                  </th>

                  {/* PHOTO */}
                  <th className="w-[6%] px-2 py-3.5 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400 sm:px-4 print:w-[9%] print:px-2 print:py-2 print:text-[9px] print:text-slate-800">
                    Photo
                  </th>

                  {/* STUDENT */}
                  <th className="w-[22%] px-2 py-3.5 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400 sm:px-4 print:w-[24%] print:px-2 print:py-2 print:text-[9px] print:text-slate-800">
                    Student
                  </th>

                  {/* CONTACT */}
                  <th className="w-[20%] px-2 py-3.5 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400 sm:px-4 print:w-[23%] print:px-2 print:py-2 print:text-[9px] print:text-slate-800">
                    Contact
                  </th>

                  {/* ADDRESS */}
                  <th className="w-[25%] px-2 py-3.5 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400 sm:px-4 print:w-[38%] print:px-2 print:py-2 print:text-[9px] print:text-slate-800">
                    Address
                  </th>

                  {/* ACTIONS — HIDDEN WHEN PRINTING */}
                  <th className="print:hidden w-[13%] px-2 py-3.5 text-center text-[10px] font-bold uppercase tracking-wider text-slate-400 sm:px-4">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 print:divide-slate-300">
                {studentDataFilterByclassName.map(
                  (student: any, index: number) => (
                    <tr
                      key={student?.id || index}
                      className="group transition-colors duration-200 hover:bg-sky-50/40 print:hover:bg-transparent">
                      {/* =================================================
                          SL
                      ================================================== */}

                      <td className="px-2 py-4 align-middle sm:px-4 print:px-2 print:py-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-[11px] font-bold text-slate-500 group-hover:bg-sky-100 group-hover:text-sky-600 print:h-auto print:w-auto print:justify-start print:rounded-none print:bg-transparent print:text-[10px] print:text-slate-800">
                          {index + 1}
                        </div>
                      </td>

                      {/* =================================================
                          IMAGE
                      ================================================== */}

                      <td className="px-2 py-4 align-middle sm:px-4 print:px-2 print:py-2">
                        {student?.image?.[0] ? (
                          <div className="h-11 w-11 overflow-hidden rounded-xl border-2 border-white bg-slate-100 shadow-sm ring-1 ring-slate-200 sm:h-12 sm:w-12 print:h-10 print:w-10 print:rounded-md print:border print:shadow-none">
                            <Image
                              width={60}
                              height={60}
                              src={student.image[0]}
                              alt={`${student?.name || "Student"} profile`}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 sm:h-12 sm:w-12 print:h-10 print:w-10 print:rounded-md">
                            <UserRound className="h-5 w-5 text-slate-300 print:h-4 print:w-4" />
                          </div>
                        )}
                      </td>

                      {/* =================================================
                          STUDENT
                      ================================================== */}

                      <td className="px-2 py-4 align-middle sm:px-4 print:px-2 print:py-2">
                        <div className="min-w-0">
                          <p className="break-words text-xs font-bold text-slate-800 sm:text-sm print:text-[10px]">
                            {student?.name || "—"}
                          </p>

                          <div className="mt-1.5 flex flex-wrap gap-1 print:mt-1">
                            <span className="inline-flex max-w-full items-center gap-1 rounded-md bg-sky-50 px-1.5 py-1 text-[9px] font-semibold text-sky-600 print:rounded-none print:bg-transparent print:px-0 print:py-0 print:text-[9px] print:text-slate-600">
                              <GraduationCap className="h-3 w-3 shrink-0 print:hidden" />

                              <span className="break-words">
                                {student?.admission || "—"}
                              </span>
                            </span>

                            <span className="rounded-md bg-blue-50 px-1.5 py-1 text-[9px] font-semibold text-blue-600 print:rounded-none print:bg-transparent print:px-0 print:py-0 print:text-[9px] print:text-slate-600">
                              Roll: {student?.roll || "—"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* =================================================
                          CONTACT
                      ================================================== */}

                      <td className="px-2 py-4 align-middle sm:px-4 print:px-2 print:py-2">
                        <div className="min-w-0 space-y-1.5 print:space-y-0.5">
                          {student?.email && (
                            <div className="flex min-w-0 items-start gap-1.5">
                              <Mail className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sky-500 print:hidden" />

                              <span className="min-w-0 break-all text-[10px] leading-4 text-slate-600 sm:text-xs print:text-[9px] print:leading-4">
                                {student.email}
                              </span>
                            </div>
                          )}

                          {student?.contact && (
                            <div className="flex items-center gap-1.5">
                              <Phone className="h-3.5 w-3.5 shrink-0 text-emerald-500 print:hidden" />

                              <span className="break-words text-[10px] text-slate-600 sm:text-xs print:text-[9px]">
                                {student.contact}
                              </span>
                            </div>
                          )}

                          {!student?.email && !student?.contact && (
                            <span className="text-[10px] text-slate-400 print:text-[9px]">
                              No contact
                            </span>
                          )}
                        </div>
                      </td>

                      {/* =================================================
                          ADDRESS
                      ================================================== */}

                      <td className="px-2 py-4 align-middle sm:px-4 print:px-2 print:py-2">
                        <div className="flex min-w-0 items-start gap-1.5">
                          <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-orange-500 print:hidden" />

                          <p className="min-w-0 break-words text-[10px] leading-4 text-slate-500 sm:text-xs print:text-[9px] print:leading-4 print:text-slate-700">
                            {student?.address || "Address not available"}
                          </p>
                        </div>
                      </td>

                      {/* =================================================
                          ACTIONS
                          HIDDEN WHEN PRINTING
                      ================================================== */}

                      <td className="print:hidden px-1 py-4 text-center align-middle sm:px-3">
                        <div className="flex items-center justify-center gap-1.5">
                          <Link href={`/student/edit/${student.id}`}>
                            <button
                              type="button"
                              title="Edit student"
                              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-sky-100 bg-sky-50 text-sky-600 transition-all hover:bg-sky-500 hover:text-white hover:shadow-md sm:h-9 sm:w-9">
                              <Edit3 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            </button>
                          </Link>

                          <button
                            onClick={() => handleDelete(student.id)}
                            type="button"
                            title="Delete student"
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-red-100 bg-red-50 text-red-500 transition-all hover:bg-red-500 hover:text-white hover:shadow-md sm:h-9 sm:w-9">
                            <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* =====================================================
          DELETE MODAL
      ====================================================== */}

      <DeleteConfirmationModal
        deleteStudentId={deleteStudent}
        showDeleteModal={showDeleteModal}
        setShowDeleteModal={setShowDeleteModal}
      />
    </>
  );
};

export default StudentListByClass;
