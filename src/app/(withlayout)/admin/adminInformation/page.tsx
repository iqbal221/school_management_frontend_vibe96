"use client";

import Loader from "@/components/Loader";
import DeleteAdminConfirmationModal from "@/components/Modal/DeleteAdminConfirmationModal";
import PrintButton from "@/components/PrintButton";
import { useUsersQuery } from "@/redux/api/userApi";
import {
  BriefcaseBusiness,
  Building2,
  Mail,
  MapPin,
  Phone,
  Search,
  ShieldCheck,
  Trash2,
  UserRound,
  Users,
} from "lucide-react";
import Image from "next/image";
import React, { useMemo, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";

const AdminDetailsInformation = () => {
  // =========================================================
  // STATE
  // =========================================================

  const [page] = useState<number>(1);
  const [size] = useState<number>(100);
  const [sortBy] = useState<string>("");
  const [sortOrder] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [deleteAdminId, setDeleteAdminId] = useState<string>("");

  // =========================================================
  // PRINT REF
  // =========================================================

  const componentRef = useRef<HTMLDivElement>(null);

  // =========================================================
  // API QUERY
  // =========================================================

  const query: Record<string, any> = {
    limit: size,
    page,
    sortBy,
    sortOrder,
  };

  const { data, isLoading, isError } = useUsersQuery(query);

  // =========================================================
  // ADMIN DATA
  // =========================================================

  const users = data?.Users || [];

  const adminData = useMemo(() => {
    const admins = users.filter(
      (item: any) => item?.role?.toLowerCase() === "admin",
    );

    if (!searchTerm.trim()) {
      return admins;
    }

    const search = searchTerm.toLowerCase().trim();

    return admins.filter((admin: any) => {
      return (
        admin?.name?.toLowerCase().includes(search) ||
        admin?.email?.toLowerCase().includes(search) ||
        admin?.contactNo?.toLowerCase().includes(search) ||
        admin?.designation?.toLowerCase().includes(search) ||
        admin?.userId?.toLowerCase().includes(search)
      );
    });
  }, [users, searchTerm]);

  // =========================================================
  // DELETE
  // =========================================================

  const handleDelete = (id: string) => {
    setDeleteAdminId(id);
    setShowDeleteModal(true);
  };

  // =========================================================
  // PRINT
  // =========================================================

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: "Admin Information",

    pageStyle: `
      @page {
        size: A4 landscape;
        margin: 12mm;
      }

      @media print {
        html,
        body {
          margin: 0 !important;
          padding: 0 !important;
          background: #ffffff !important;
        }

        body {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }

        .print-report {
          width: 100% !important;
          max-width: none !important;
          margin: 0 !important;
          padding: 0 !important;
          border: none !important;
          box-shadow: none !important;
          border-radius: 0 !important;
        }

        .print-hidden {
          display: none !important;
        }

        .print-table {
          width: 100% !important;
        }

        .print-table th,
        .print-table td {
          font-size: 11px !important;
          padding: 8px !important;
        }

        .print-image {
          width: 45px !important;
          height: 45px !important;
        }

        .print-no-break {
          break-inside: avoid !important;
          page-break-inside: avoid !important;
        }
      }
    `,

    onPrintError: (errorLocation, error) => {
      console.error("Print error:", errorLocation, error);
    },
  });

  // =========================================================
  // LOADING
  // =========================================================

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <Loader />
      </div>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (isError) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
            <Users className="text-red-500" size={26} />
          </div>

          <h2 className="text-lg font-bold text-red-700">
            Unable to Load Admins
          </h2>

          <p className="mt-2 text-sm text-red-600">
            Something went wrong while loading administrator information.
          </p>
        </div>
      </div>
    );
  }

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="bg-slate-50 px-2 py-5 sm:px-5 lg:px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            {/* Title */}

            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-200">
                <ShieldCheck size={25} />
              </div>


              <div className="flex items-center gap-2">
                <h1 className="lg:text-2xl font-bold text-slate-800 sm:text-xl">
                  Admin Information
                </h1>

              </div>

            </div>

            {/* Print */}

            <div className="print-hidden flex">
              <PrintButton handlePrint={handlePrint} />
            </div>
          </div>
        </div>

        {/* =====================================================
            PRINTABLE CONTENT
        ====================================================== */}

        <div
          ref={componentRef}
          className="print-report rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* Print Header */}

          <div className="hidden border-b border-slate-200 p-6 print:block">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                  School Management System
                </p>

                <h2 className="mt-1 text-2xl font-bold text-slate-800">
                  Administrator Information
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Complete administrator directory
                </p>
              </div>

              <div className="text-right">
                <p className="text-xs text-slate-400">Total Administrators</p>

                <p className="text-xl font-bold text-slate-800">
                  {adminData.length}
                </p>
              </div>
            </div>
          </div>

          {/* =====================================================
              TABLE
          ====================================================== */}

          {adminData.length > 0 ? (
            <div className="overflow-hidden">
              {/* Desktop Table */}

              <div className="hidden overflow-x-auto md:block">
                <table className="print-table min-w-full">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                        SL
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                        Administrator
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                        Contact
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                        Address
                      </th>

                      <th className="print-hidden px-5 py-4 text-right text-xs font-bold uppercase tracking-wide text-slate-500">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {adminData.map((admin: any, index: number) => {
                      const profileImage = admin?.profileImage?.[0];

                      return (
                        <tr
                          key={admin?.id || index}
                          className="border-b border-slate-100 transition hover:bg-slate-50">
                          {/* SL */}

                          <td className="px-5 py-4 text-sm font-semibold text-slate-400">
                            {String(index + 1).padStart(2, "0")}
                          </td>

                          {/* ADMIN */}

                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              {profileImage ? (
                                <Image
                                  src={profileImage}
                                  width={56}
                                  height={56}
                                  alt={admin?.name || "Admin"}
                                  className="print-image h-14 w-14 rounded-xl object-cover ring-2 ring-slate-100"
                                />
                              ) : (
                                <div className="print-image flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 text-blue-600">
                                  <UserRound size={24} />
                                </div>
                              )}

                              <div className="min-w-0">
                                <p className="font-semibold text-slate-800">
                                  {admin?.name || "N/A"}
                                </p>

                                <div className="mt-1 flex items-center gap-1.5">
                                  <BriefcaseBusiness
                                    size={13}
                                    className="text-blue-500"
                                  />

                                  <span className="text-xs text-slate-500">
                                    {admin?.designation || "Administrator"}
                                  </span>
                                </div>

                                {admin?.userId && (
                                  <p className="mt-1 text-[11px] text-slate-400">
                                    ID: {admin.userId}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* CONTACT */}

                          <td className="px-5 py-4">
                            <div className="space-y-2">
                              {admin?.email && (
                                <div className="flex items-center gap-2 text-xs text-slate-600">
                                  <Mail
                                    size={14}
                                    className="shrink-0 text-blue-500"
                                  />

                                  <span className="max-w-[220px] truncate">
                                    {admin.email}
                                  </span>
                                </div>
                              )}

                              {admin?.contactNo && (
                                <div className="flex items-center gap-2 text-xs text-slate-600">
                                  <Phone
                                    size={14}
                                    className="shrink-0 text-emerald-500"
                                  />

                                  <span>{admin.contactNo}</span>
                                </div>
                              )}
                            </div>
                          </td>

                          {/* ADDRESS */}

                          <td className="px-5 py-4">
                            <div className="flex max-w-xs items-start gap-2 text-xs leading-5 text-slate-500">
                              <MapPin
                                size={15}
                                className="mt-0.5 shrink-0 text-rose-500"
                              />

                              <span>
                                {admin?.address || "Address not available"}
                              </span>
                            </div>
                          </td>

                          {/* ACTION */}

                          <td className="print-hidden px-5 py-4 text-right">
                            <button
                              type="button"
                              onClick={() => handleDelete(admin?.id)}
                              className="inline-flex items-center gap-2 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:border-red-200 hover:bg-red-100 hover:text-red-700">
                              <Trash2 size={15} />
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* =================================================
                  MOBILE CARDS
              ================================================== */}

              <div className="space-y-3 p-4 md:hidden">
                {adminData.map((admin: any, index: number) => {
                  const profileImage = admin?.profileImage?.[0];

                  return (
                    <div
                      key={admin?.id || index}
                      className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                      {/* Top */}

                      <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-3">
                          {profileImage ? (
                            <Image
                              src={profileImage}
                              width={56}
                              height={56}
                              alt={admin?.name || "Admin"}
                              className="h-14 w-14 shrink-0 rounded-xl object-cover ring-2 ring-slate-100"
                            />
                          ) : (
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 text-blue-600">
                              <UserRound size={24} />
                            </div>
                          )}

                          <div className="min-w-0">
                            <h3 className="truncate font-bold text-slate-800">
                              {admin?.name || "N/A"}
                            </h3>

                            <p className="mt-1 text-xs text-blue-600">
                              {admin?.designation || "Administrator"}
                            </p>
                          </div>
                        </div>

                        <span className="rounded-full bg-blue-50 px-2 py-1 text-[10px] font-bold text-blue-600">
                          #{index + 1}
                        </span>
                      </div>

                      {/* Details */}

                      <div className="mt-4 space-y-2 border-t border-slate-100 pt-4">
                        {admin?.email && (
                          <div className="flex items-center gap-2 text-xs text-slate-600">
                            <Mail size={14} className="text-blue-500" />

                            <span className="truncate">{admin.email}</span>
                          </div>
                        )}

                        {admin?.contactNo && (
                          <div className="flex items-center gap-2 text-xs text-slate-600">
                            <Phone size={14} className="text-emerald-500" />

                            <span>{admin.contactNo}</span>
                          </div>
                        )}

                        {admin?.address && (
                          <div className="flex items-start gap-2 text-xs text-slate-500">
                            <MapPin
                              size={14}
                              className="mt-0.5 text-rose-500"
                            />

                            <span>{admin.address}</span>
                          </div>
                        )}
                      </div>

                      {/* Delete */}

                      <button
                        type="button"
                        onClick={() => handleDelete(admin?.id)}
                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 py-2.5 text-xs font-semibold text-red-600 transition hover:bg-red-100">
                        <Trash2 size={15} />
                        Delete Administrator
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* =================================================
               EMPTY STATE
            ================================================== */

            <div className="flex min-h-[350px] items-center justify-center p-6">
              <div className="text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                  <Users size={36} />
                </div>

                <h2 className="mt-5 text-lg font-bold text-slate-700">
                  No Administrators Found
                </h2>

                <p className="mx-auto mt-2 max-w-sm text-sm text-slate-400">
                  {searchTerm
                    ? "No administrator matches your search."
                    : "There are currently no administrator accounts available."}
                </p>

                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm("")}
                    className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-700">
                    Clear Search
                  </button>
                )}
              </div>
            </div>
          )}

          {/* =====================================================
              PRINT FOOTER
          ====================================================== */}

          <div className="hidden border-t border-slate-200 px-6 py-4 text-center text-xs text-slate-400 print:block">
            Generated Administrator Information Report
          </div>
        </div>

        {/* =====================================================
            DELETE MODAL
        ====================================================== */}

        <DeleteAdminConfirmationModal
          deleteAdminId={deleteAdminId}
          showDeleteModal={showDeleteModal}
          setShowDeleteModal={setShowDeleteModal}
        />
      </div>

      {/* =====================================================
          GLOBAL PRINT CSS
      ====================================================== */}

      <style jsx global>{`
        @media print {
          html,
          body {
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
          }

          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          .print-report {
            width: 100% !important;
            max-width: none !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            border-radius: 0 !important;
            box-shadow: none !important;
          }

          .print-hidden {
            display: none !important;
          }

          .print-table {
            width: 100% !important;
          }

          .print-table th,
          .print-table td {
            vertical-align: middle !important;
          }

          .print-no-break {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminDetailsInformation;
