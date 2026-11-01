"use client";

import Loader from "@/components/Loader";
import DeleteRevenueConfirmationModal from "@/components/Modal/DeleteRevenueConfirmationModal";
import PrintButton from "@/components/PrintButton";
import SearchBox from "@/components/SearchBox";
import {
  useAddAuthorizationDataMutation,
  useAuthorizationsQuery,
  useUpdateAuthorizationMutation,
} from "@/redux/api/authorizationApi";
import { useRevenuesQuery } from "@/redux/api/revenueApi";
import { getUserInfo } from "@/service/auth.service";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  Receipt,
  Search,
  ShieldCheck,
  Trash2,
  UserRound,
  WalletCards,
  XCircle,
} from "lucide-react";
import React, { useMemo, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { toast } from "react-toastify";

const DetailsAllRevenue = () => {
  const printRef = useRef<HTMLDivElement | null>(null);

  /* =========================================================
     STATE
  ========================================================= */

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteRevenue, setDeleteRevenue] = useState("");
  const [Query, setQuery] = useState("");

  const [page] = useState<number>(1);
  const [size] = useState<number>(10);
  const [sortBy] = useState<string>("");
  const [sortOrder] = useState<string>("");

  /* =========================================================
     QUERY
  ========================================================= */

  const query: Record<string, any> = {
    limit: size,
    page,
    sortBy,
    sortOrder,
    searchTerm: Query,
  };

  /* =========================================================
     USER INFO
  ========================================================= */

  const UserInfo: any = getUserInfo();

  const userRole = UserInfo?.userRole || "user";

  const formattedRole =
    userRole === "super_admin"
      ? "Super Admin"
      : userRole === "admin"
        ? "Admin"
        : userRole
          .replace(/_/g, " ")
          .replace(/\b\w/g, (char: string) => char.toUpperCase());

  /* =========================================================
     REVENUE QUERY
  ========================================================= */

  const { data, isLoading } = useRevenuesQuery(query);

  const AllRevenue: any[] = data?.revenues || [];

  /* =========================================================
     AUTHORIZATION QUERY
  ========================================================= */

  const { data: authData } = useAuthorizationsQuery(query);

  const authorizationData: any[] = authData?.Authorizations || [];

  const [addAuthorizationData] = useAddAuthorizationDataMutation();

  const [updateAuthorization] = useUpdateAuthorizationMutation();

  /* =========================================================
     TOTAL REVENUE
  ========================================================= */

  const totalRevenue = useMemo(() => {
    return AllRevenue.reduce(
      (total, item) => total + Number(item?.amount || 0),
      0,
    );
  }, [AllRevenue]);

  /* =========================================================
     FORMAT DATE
  ========================================================= */

  const formatDate = (dateValue?: string) => {
    if (!dateValue) return "-";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "-";
    }

    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  /* =========================================================
     FORMAT CURRENCY
  ========================================================= */

  const formatCurrency = (amount: number | string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(amount) || 0);
  };

  /* =========================================================
     DELETE REQUEST
  ========================================================= */

  const handleDeleteFunctionality = async (revenueInfo: any) => {
    const { id } = revenueInfo;

    const payload = {
      studentId: id,
      status: true,
    };

    try {
      const res = await addAuthorizationData(payload).unwrap();

      if (res?.id) {
        toast.success("Delete request sent for approval");
      }
    } catch (error) {
      console.error("Delete request error:", error);
      toast.error("Failed to send delete request");
    }
  };

  /* =========================================================
     APPROVAL
  ========================================================= */

  const handleApproval = async (approvalData: any) => {
    const { id } = approvalData;

    const payload = {
      approval: true,
      status: false,
    };

    try {
      const res = await updateAuthorization({
        id,
        data: payload,
      }).unwrap();

      if (res?.id) {
        toast.success("Delete request approved");
      }
    } catch (error) {
      console.error("Approval error:", error);
      toast.error("Failed to approve request");
    }
  };

  /* =========================================================
     DELETE MODAL
  ========================================================= */

  const handleDelete = (id: string) => {
    setDeleteRevenue(id);
    setShowDeleteModal(true);
  };

  /* =========================================================
     PRINT
  ========================================================= */

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "School-Expense-Report",
    onPrintError: (location, error) => {
      console.error(`Print error at ${location}:`, error);
      toast.error("Unable to print the expense report.");
    },
  });

  /* =========================================================
     UI
  ========================================================= */

  return (
    <div className="min-h-screen bg-slate-50 px-3 py-5 sm:px-5 lg:px-6 print:bg-white print:p-0">
      <div className="mx-auto max-w-7xl">
        {/* =====================================================
            HEADER CARD
        ===================================================== */}

        <div className="mb-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm print:mb-4 print:rounded-none print:border-0 print:shadow-none">
          {/* HEADER */}

          <div className="flex flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
            {/* TITLE */}

            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-100">
                <Receipt className="h-6 w-6" />
              </div>

              <div>
                <h1 className="lg:text-2xl font-bold tracking-tight text-slate-800 sm:text-xl">
                  All Revenue
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  View and manage all school revenue records
                </p>
              </div>
            </div>

            {/* ACTIONS */}

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center print:hidden">
              <div className="min-w-[220px]">
                <SearchBox setQuery={setQuery} />
              </div>

              <PrintButton handlePrint={handlePrint} />
            </div>
          </div>

          {/* =================================================
              SUMMARY
          ================================================= */}

          <div className="grid grid-cols-1 border-t border-slate-100 sm:grid-cols-3">
            {/* TOTAL RECORDS */}

            <div className="flex items-center gap-3 px-5 py-4 sm:px-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-500">
                <FileText className="h-5 w-5" />
              </div>

              <div>
                <p className="text-xs font-medium text-slate-400">
                  Total Records
                </p>

                <p className="text-lg font-bold text-slate-800">
                  {AllRevenue.length}
                </p>
              </div>
            </div>

            {/* TOTAL REVENUE */}

            <div className="flex items-center gap-3 border-t border-slate-100 px-5 py-4 sm:border-l sm:border-t-0 sm:px-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-500">
                <WalletCards className="h-5 w-5" />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-medium text-slate-400">
                  Total Revenue
                </p>

                <p className="truncate text-xl font-bold text-slate-800">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(totalRevenue)}
                </p>
              </div>
            </div>

            {/* USER ROLE */}

            <div className="flex items-center gap-3 border-t border-slate-100 px-5 py-4 sm:border-l sm:border-t-0 sm:px-6">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${userRole === "super_admin"
                  ? "bg-violet-50 text-violet-500"
                  : "bg-sky-50 text-sky-500"
                  }`}>
                {userRole === "super_admin" ? (
                  <ShieldCheck className="h-5 w-5" />
                ) : (
                  <UserRound className="h-5 w-5" />
                )}
              </div>

              <div>
                <p className="text-xs font-medium text-slate-400">User Role</p>

                <span
                  className={`mt-1 inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ${userRole === "super_admin"
                    ? "bg-violet-50 text-violet-600"
                    : userRole === "admin"
                      ? "bg-sky-50 text-sky-600"
                      : "bg-slate-100 text-slate-600"
                    }`}>
                  {formattedRole}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            PRINT REPORT
        ===================================================== */}

        <div ref={printRef}>
          {/* PRINT TITLE */}

          <div className="mb-5 hidden text-center print:block">
            <h2 className="text-2xl font-bold text-slate-800">
              School Revenue Report
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Total Records: {AllRevenue.length}
            </p>

            <p className="text-sm font-semibold text-emerald-600">
              Total Revenue: {formatCurrency(totalRevenue)}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              User Role: {formattedRole}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Printed on {formatDate(new Date().toISOString())}
            </p>
          </div>

          {/* =====================================================
              TABLE CARD
          ===================================================== */}

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm print:rounded-none print:border print:border-slate-300 print:shadow-none">
            {isLoading ? (
              /* =================================================
                 LOADING
              ================================================= */

              <div className="flex min-h-[450px] items-center justify-center">
                <Loader />
              </div>
            ) : AllRevenue.length > 0 ? (
              <>
                {/* Revenue RECORDS HEADER — ONLY WHEN RECORDS EXIST */}

                <div className="flex flex-col gap-2 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 print:hidden">
                  <div>
                    <h2 className="text-lg font-bold text-slate-800">
                      Revenue Records
                    </h2>
                  </div>
                </div>
                {/* =================================================
                    TABLE
                ================================================= */}

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[850px] border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50 print:bg-slate-100">
                        <th className="whitespace-nowrap px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                          SL
                        </th>

                        <th className="whitespace-nowrap px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                          Voucher No
                        </th>

                        <th className="whitespace-nowrap px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                          Receive Date
                        </th>

                        <th className="whitespace-nowrap px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                          Revenue
                        </th>

                        <th className="whitespace-nowrap px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                          Amount
                        </th>

                        <th className="whitespace-nowrap px-5 py-4 text-right text-xs font-bold uppercase tracking-wide text-slate-500 print:hidden">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      {AllRevenue.map((revenueInfo: any, index: number) => {
                        const authorization = authorizationData.find(
                          (item: any) =>
                            item.studentId === revenueInfo.id &&
                            item.status === true,
                        );

                        const authorizationApproved = authorizationData.find(
                          (item: any) =>
                            item.studentId === revenueInfo.id &&
                            item.status === false &&
                            item.approval === true,
                        );

                        return (
                          <tr
                            key={revenueInfo.id || index}
                            className="group transition-colors hover:bg-slate-50 print:hover:bg-transparent">
                            {/* SL */}

                            <td className="whitespace-nowrap px-5 py-4 text-sm font-semibold text-slate-400">
                              {index + 1}
                            </td>

                            {/* VOUCHER */}

                            <td className="whitespace-nowrap px-5 py-4">
                              <div className="flex items-center gap-2.5">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                                  #
                                </div>

                                <span className="text-sm font-semibold text-slate-700">
                                  {revenueInfo.serialNo || "-"}
                                </span>
                              </div>
                            </td>

                            {/* DATE */}

                            <td className="whitespace-nowrap px-5 py-4">
                              <div className="flex items-center gap-2 text-sm text-slate-600">
                                <CalendarDays className="h-4 w-4 text-slate-400" />

                                {formatDate(revenueInfo.entryDate)}
                              </div>
                            </td>

                            {/* REVENUE */}

                            <td className="px-5 py-4">
                              <div className="max-w-[280px]">
                                <p className="truncate text-sm font-semibold text-slate-700">
                                  {revenueInfo.revenue || "-"}
                                </p>
                              </div>
                            </td>

                            {/* AMOUNT */}

                            <td className="whitespace-nowrap px-5 py-4">
                              <span className="inline-flex items-center rounded-lg bg-emerald-50 px-3 py-1.5 text-sm font-bold text-emerald-600">
                                {formatCurrency(revenueInfo.amount)}
                              </span>
                            </td>

                            {/* ACTION */}

                            <td className="whitespace-nowrap px-5 py-4 text-right print:hidden">
                              {/* ADMIN */}

                              {userRole === "admin" && (
                                <div className="flex justify-end">
                                  {authorization && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleApproval(authorization)
                                      }
                                      className="inline-flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-600 transition hover:bg-amber-100">
                                      <Clock3 className="h-3.5 w-3.5" />
                                      Approve Delete
                                    </button>
                                  )}

                                  {authorizationApproved && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleDelete(revenueInfo.id)
                                      }
                                      className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 transition hover:bg-red-100">
                                      <Trash2 className="h-3.5 w-3.5" />
                                      Delete
                                    </button>
                                  )}

                                  {!authorization && !authorizationApproved && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleDeleteFunctionality(revenueInfo)
                                      }
                                      className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-500 transition hover:bg-red-50">
                                      <Trash2 className="h-3.5 w-3.5" />
                                      Request Delete
                                    </button>
                                  )}
                                </div>
                              )}

                              {/* SUPER ADMIN */}

                              {userRole === "super_admin" && (
                                <div className="flex justify-end">
                                  {authorization && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleApproval(authorization)
                                      }
                                      className="inline-flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-600 transition hover:bg-amber-100">
                                      <Clock3 className="h-3.5 w-3.5" />
                                      Approve Delete
                                    </button>
                                  )}

                                  {authorizationApproved && (
                                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-600">
                                      <CheckCircle2 className="h-3.5 w-3.5" />
                                      Approved
                                    </span>
                                  )}

                                  {!authorization && !authorizationApproved && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleDelete(revenueInfo.id)
                                      }
                                      className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-500 transition hover:bg-red-50">
                                      <Trash2 className="h-3.5 w-3.5" />
                                      Delete
                                    </button>
                                  )}
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              /* =================================================
                 EMPTY STATE
              ================================================= */

              <div className="flex min-h-[450px] flex-col items-center justify-center px-5 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                  <Search className="h-7 w-7" />
                </div>

                <h3 className="mt-5 text-base font-bold text-slate-700">
                  No revenue found
                </h3>

                <p className="mt-1 max-w-sm text-sm text-slate-400">
                  {Query
                    ? "No revenue records match your search. Try another keyword."
                    : "There are no revenue records available yet."}
                </p>

                {Query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="mt-4 inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-600">
                    <XCircle className="h-4 w-4" />
                    Clear Search
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* =========================================================
          DELETE MODAL
      ========================================================= */}

      <DeleteRevenueConfirmationModal
        deleteRevenueId={deleteRevenue}
        showDeleteModal={showDeleteModal}
        setShowDeleteModal={setShowDeleteModal}
      />

      {/* =========================================================
          PRINT CSS
      ========================================================= */}

      <style jsx global>{`
        @media print {
          @page {
            size: A4 landscape;
            margin: 10mm;
          }

          html,
          body {
            background: white !important;
          }

          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          .print\\:hidden {
            display: none !important;
          }

          table {
            width: 100% !important;
          }

          th,
          td {
            border-color: #d1d5db !important;
          }

          tr {
            page-break-inside: avoid;
          }

          .print\\:block {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
};

export default DetailsAllRevenue;
