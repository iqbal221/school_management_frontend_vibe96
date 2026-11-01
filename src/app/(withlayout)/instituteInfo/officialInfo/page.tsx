
"use client";

import Loader from "@/components/Loader";
import DeleteOfficialConfirmationModal from "@/components/Modal/DeleteOfficialConfirmationModal";
import PrintButton from "@/components/PrintButton";
import SearchBox from "@/components/SearchBox";
import SearchBoxResponsive from "@/components/SearchBoxResponsive";
import { useOfficialsQuery } from "@/redux/api/officialApi";
import Image from "next/image";
import Link from "next/link";
import React, { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { toast } from "react-toastify";

const OfficialInfoPage = () => {
  // Attach the print ref to one element only.
  const componentRef = useRef<HTMLDivElement>(null);

  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [sortBy, setSortBy] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<string>("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteOfficial, setDeleteOfficial] = useState("");
  const [Query, setQuery] = useState("");

  const query: Record<string, any> = {
    limit: size,
    page,
    sortBy,
    sortOrder,
    searchTerm: Query,
  };

  const { data, isLoading } = useOfficialsQuery({ ...query });
  const officialsData: any[] = data?.officials || [];

  const handleDelete = (id: string) => {
    setDeleteOfficial(id);
    setShowDeleteModal(true);
  };

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: "Official-Information-Report",
    pageStyle: `
      @page {
        size: A4 landscape;
        margin: 12mm;
      }

      @media print {
        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }

        .no-print {
          display: none !important;
        }

        .official-print-table {
          width: 100% !important;
          table-layout: auto !important;
          border-collapse: collapse !important;
        }

        .official-print-table th,
        .official-print-table td {
          padding: 8px !important;
          border: 1px solid #d1d5db !important;
          color: #111827 !important;
          overflow-wrap: anywhere;
        }

        .official-print-table thead {
          display: table-header-group;
        }

        .official-print-table tr {
          break-inside: avoid;
          page-break-inside: avoid;
        }

        .official-print-table .print-profile-image {
          width: 40px !important;
          height: 40px !important;
          object-fit: cover !important;
        }
      }
    `,
    onPrintError: (location, error) => {
      console.error(`Print error at ${location}:`, error);
      toast.error("Failed to print official information.");
    },
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="bg-slate-50 px-2 py-4 sm:px-3 lg:px-4">
      <div className="mx-auto w-full max-w-[1600px]">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* Header */}
          <div className="border-b border-slate-200 bg-gradient-to-r from-sky-50 via-white to-cyan-50 px-2 py-5 sm:px-3 lg:px-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              {/* Page title */}
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-100 text-sky-600">
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
                        d="M15.75 6.75a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75a17.933 17.933 0 0 1-7.499-1.632Z"
                      />
                    </svg>
                  </div>

                  <div>
                    <h1 className="text-xl font-bold text-slate-800 sm:text-2xl">
                      Official Information
                    </h1>
                    <p className="mt-0.5 text-sm text-slate-500">
                      Manage institute officials and contact information
                    </p>
                  </div>
                </div>
              </div>

              {/* Desktop actions */}
              <div className="hidden items-center gap-2 md:flex no-print">
                <SearchBox setQuery={setQuery} />
                <PrintButton handlePrint={handlePrint} />

                <Link href="/instituteInfo/officialInfo/addNewOfficial">
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-sky-600 hover:shadow-md active:scale-[0.98]"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="h-4 w-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4.5v15m7.5-7.5h-15"
                      />
                    </svg>
                    Add Official
                  </button>
                </Link>
              </div>
            </div>

            {/* Mobile actions */}
            <div className="mt-4 flex flex-col gap-3 md:hidden no-print">
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <PrintButton handlePrint={handlePrint} />
                </div>

                <Link
                  href="/instituteInfo/officialInfo/addNewOfficial"
                  className="flex-1"
                >
                  <button
                    type="button"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-sky-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-600"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="h-4 w-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4.5v15m7.5-7.5h-15"
                      />
                    </svg>
                    Add Official
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Printable content */}
          <div ref={componentRef} className="p-2 sm:p-3 lg:p-4">
            {officialsData.length > 0 ? (
              <>
                {/* Statistics */}
                <div className="mb-2 mt-3 flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-semibold text-slate-800">
                      Officials
                    </h2>
                    <p className="text-sm text-slate-500">
                      {officialsData.length} official
                      {officialsData.length !== 1 ? "s" : ""} found
                    </p>
                  </div>
                </div>

                {/* Officials table */}
                <div className="w-full max-w-full overflow-hidden rounded-xl border border-slate-200">
                  <div className="w-full max-w-full overflow-x-auto overscroll-x-contain">
                    <table className="official-print-table w-full min-w-[850px] table-fixed border-collapse">
                      <colgroup>
                        <col className="w-[6%]" />
                        <col className="w-[29%]" />
                        <col className="w-[25%]" />
                        <col className="w-[25%]" />
                        <col className="no-print w-[15%]" />
                      </colgroup>

                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-50">
                          <th className="px-2 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 sm:px-4">
                            SL
                          </th>
                          <th className="px-2 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 sm:px-4">
                            Official
                          </th>
                          <th className="px-2 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 sm:px-4">
                            Contact
                          </th>
                          <th className="px-2 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 sm:px-4">
                            Email
                          </th>

                          {/* Hidden in printed output */}
                          <th className="no-print px-2 py-4 text-center text-xs font-semibold uppercase tracking-wide text-slate-500 sm:px-4">
                            Action
                          </th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-slate-100">
                        {officialsData.map((OInfo: any, i: number) => (
                          <tr
                            key={OInfo.id || i}
                            className="group transition-colors duration-150 hover:bg-sky-50/40"
                          >
                            {/* Serial number */}
                            <td className="px-2 py-4 align-middle sm:px-4">
                              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-xs font-semibold text-slate-600">
                                {i + 1}
                              </span>
                            </td>

                            {/* Official information */}
                            <td className="px-2 py-4 align-middle sm:px-4">
                              <div className="flex min-w-0 items-center gap-3">
                                {OInfo.image?.[0] ? (
                                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-sm">
                                    <Image
                                      width={80}
                                      height={80}
                                      src={OInfo.image[0]}
                                      alt={`${OInfo.name || "Official"} profile`}
                                      className="print-profile-image h-full w-full object-cover"
                                    />
                                  </div>
                                ) : (
                                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sm font-bold text-sky-600">
                                    {OInfo.name?.charAt(0)?.toUpperCase() || "O"}
                                  </div>
                                )}

                                <div className="min-w-0 flex-1">
                                  <p
                                    className="break-words text-sm font-semibold leading-5 text-slate-800"
                                    title={OInfo.name}
                                  >
                                    {OInfo.name || "Unnamed Official"}
                                  </p>

                                  {OInfo.designation && (
                                    <span
                                      className={`mt-1 inline-flex max-w-full rounded-full px-2 py-0.5 text-[10px] font-medium ${OInfo.designation === "Principle"
                                          ? "bg-amber-100 text-amber-700"
                                          : "bg-sky-100 text-sky-700"
                                        }`}
                                    >
                                      {OInfo.designation}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>

                            {/* Contact information */}
                            <td className="px-2 py-4 align-middle sm:px-4">
                              <div className="min-w-0">
                                <div className="flex min-w-0 items-start gap-2">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="mt-0.5 h-4 w-4 shrink-0 text-slate-400"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106a1.125 1.125 0 0 0-1.173.417l-.97 1.293a1.125 1.125 0 0 1-1.174.417 12.035 12.035 0 0 1-8.954-8.954 1.125 1.125 0 0 1 .417-1.174l1.293-.97c.362-.271.527-.733.417-1.173L5.225 2.37A1.125 1.125 0 0 0 4.134 1.5H2.75A2.25 2.25 0 0 0 .5 3.75v3Z"
                                    />
                                  </svg>

                                  <span className="min-w-0 break-words text-sm font-medium leading-5 text-slate-700">
                                    {OInfo.contact || "—"}
                                  </span>
                                </div>

                                {OInfo.address && (
                                  <p className="mt-1 break-words pl-6 text-xs leading-5 text-slate-500">
                                    {OInfo.address}
                                  </p>
                                )}
                              </div>
                            </td>

                            {/* Email */}
                            <td className="px-2 py-4 align-middle sm:px-4">
                              <div className="flex min-w-0 items-start gap-2">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={1.5}
                                  stroke="currentColor"
                                  className="mt-0.5 h-4 w-4 shrink-0 text-slate-400"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25H4.5a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0l-7.5-4.615A2.25 2.25 0 0 1 2.25 6.993V6.75"
                                  />
                                </svg>

                                <span
                                  className="min-w-0 break-all text-sm leading-5 text-slate-600"
                                  title={OInfo.email}
                                >
                                  {OInfo.email || "—"}
                                </span>
                              </div>
                            </td>

                            {/* Action column: excluded from printing */}
                            <td className="no-print px-2 py-4 align-middle sm:px-4">
                              <div className="flex items-center justify-center gap-2">
                                {/* Edit */}
                                <Link
                                  href={`/instituteInfo/officialInfo/edit/${OInfo.id}`}
                                >
                                  <button
                                    type="button"
                                    title="Edit Official"
                                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-blue-100 bg-blue-50 text-blue-600 transition hover:bg-blue-100"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      strokeWidth={1.7}
                                      stroke="currentColor"
                                      className="h-4 w-4"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z"
                                      />
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                                      />
                                    </svg>
                                  </button>
                                </Link>

                                {/* Delete */}
                                <button
                                  onClick={() => handleDelete(OInfo.id)}
                                  type="button"
                                  title="Delete Official"
                                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-100 bg-red-50 text-red-500 transition hover:bg-red-100"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.7}
                                    stroke="currentColor"
                                    className="h-4 w-4"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.682-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0C9.91 2.768 9 3.752 9 4.932v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                    />
                                  </svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            ) : (
              /* Empty state */
              <div className="flex min-h-[400px] items-center justify-center">
                <div className="flex max-w-sm flex-col items-center text-center">
                  <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-sky-50">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-10 w-10 text-sky-400"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 6.75a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75a17.933 17.933 0 0 1-7.499-1.632Z"
                      />
                    </svg>
                  </div>

                  <h2 className="text-lg font-bold text-slate-700">
                    No Officials Found
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    There are no official records available yet. Add your first
                    official to get started.
                  </p>

                  <Link
                    href="/instituteInfo/officialInfo/addNewOfficial"
                    className="no-print"
                  >
                    <button
                      type="button"
                      className="mt-5 inline-flex items-center gap-2 rounded-xl bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-600 hover:shadow-md"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="h-4 w-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 4.5v15m7.5-7.5h-15"
                        />
                      </svg>
                      Add Official
                    </button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete confirmation modal */}
      <DeleteOfficialConfirmationModal
        deleteOfficialId={deleteOfficial}
        showDeleteModal={showDeleteModal}
        setShowDeleteModal={setShowDeleteModal}
      />
    </div>
  );
};

export default OfficialInfoPage;
