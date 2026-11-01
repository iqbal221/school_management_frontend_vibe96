
"use client";

import Loader from "@/components/Loader";
import DeleteExpenseConfirmationModal from "@/components/Modal/DeleteExpenseConfirmationModal";
import PrintButton from "@/components/PrintButton";
import SearchBox from "@/components/SearchBox";
import {
  useAddAuthorizationDataMutation,
  useAuthorizationsQuery,
  useUpdateAuthorizationMutation,
} from "@/redux/api/authorizationApi";
import { useExpensesQuery } from "@/redux/api/expenseApi";
import { getUserInfo } from "@/service/auth.service";
import {
  ArrowDownUp,
  CheckCircle2,
  Clock3,
  CreditCard,
  FileText,
  Receipt,
  Search,
  ShieldCheck,
  Trash2,
  Wallet,
  XCircle,
} from "lucide-react";
import React, { useMemo, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { toast } from "react-toastify";

const DetailsAllExpense = () => {
  /* =========================================================
     PRINT REF
  ========================================================= */

  const printRef = useRef<HTMLDivElement | null>(null);

  /* =========================================================
     STATE
  ========================================================= */

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteExpenseId, setDeleteExpenseId] = useState("");
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
     EXPENSE DATA
  ========================================================= */

  const { data, isLoading } = useExpensesQuery(query);
  const AllExpenses: any[] = data?.expenses || [];

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
     AUTHORIZATION DATA
  ========================================================= */

  const { data: authData } = useAuthorizationsQuery(query);
  const authorizationData: any[] = authData?.Authorizations || [];

  const [addAuthorizationData] = useAddAuthorizationDataMutation();
  const [updateAuthorization] = useUpdateAuthorizationMutation();

  /* =========================================================
     TOTAL EXPENSE
  ========================================================= */

  const totalExpense = useMemo(() => {
    return AllExpenses.reduce(
      (total, expense) => total + Number(expense?.amount || 0),
      0,
    );
  }, [AllExpenses]);

  /* =========================================================
     FORMAT DATE
  ========================================================= */

  const formatDate = (dateValue?: string) => {
    if (!dateValue) return "-";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) return "-";

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
     EXPENSE HEAD STYLE
  ========================================================= */

  const getExpenseHeadStyle = (head: string) => {
    switch (head?.toLowerCase()) {
      case "salary":
        return "bg-blue-50 text-blue-700 ring-blue-600/10";

      case "stationary":
        return "bg-purple-50 text-purple-700 ring-purple-600/10";

      case "management":
        return "bg-amber-50 text-amber-700 ring-amber-600/10";

      case "conveyance":
        return "bg-cyan-50 text-cyan-700 ring-cyan-600/10";

      case "tax":
        return "bg-red-50 text-red-700 ring-red-600/10";

      default:
        return "bg-slate-50 text-slate-700 ring-slate-600/10";
    }
  };

  /* =========================================================
     DELETE REQUEST
  ========================================================= */

  const handleDeleteFunctionality = async (expenseInfo: any) => {
    const { id } = expenseInfo;

    const payload = {
      studentId: id,
      status: true,
    };

    try {
      const res = await addAuthorizationData(payload).unwrap();

      if (res?.id) {
        toast.success("Delete approval request sent");
      }
    } catch (error) {
      console.error("Delete request error:", error);
      toast.error("Request failed");
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
      toast.error("Approval failed");
    }
  };

  /* =========================================================
     DELETE
  ========================================================= */

  const handleDelete = (id: string) => {
    setDeleteExpenseId(id);
    setShowDeleteModal(true);
  };

  /* =========================================================
     PRINT
  ========================================================= */

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "School-Expense-Report",
    pageStyle: `
    @page {
      size: A4 landscape;
      margin: 10mm;
    }

    @media print {
      html,
      body {
        background: #f8fafc !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }

      * {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }

      body {
        margin: 0 !important;
      }

      .expense-print-area {
        width: 100% !important;
        max-width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
        background: #f8fafc !important;
      }

      .expense-print-area .overflow-x-auto {
        overflow: visible !important;
      }

      .expense-print-area table {
        width: 100% !important;
        min-width: 0 !important;
        border-collapse: collapse !important;
      }

      .expense-print-area thead {
        display: table-header-group !important;
      }

      .expense-print-area tr {
        break-inside: avoid !important;
        page-break-inside: avoid !important;
      }

      .expense-print-area th,
      .expense-print-area td {
        padding: 9px 8px !important;
      }

      .expense-print-area .print-hidden {
        display: none !important;
      }

      .expense-print-area .shadow-sm {
        box-shadow: none !important;
      }

      .expense-print-area .rounded-2xl {
        border-radius: 12px !important;
      }
    }
  `,
    onPrintError: (location, error) => {
      console.error(`Print error at ${location}:`, error);
      toast.error("Unable to print the expense report.");
    },
  });

  /* =========================================================
     UI
  ========================================================= */

  return (
    <div className="min-h-screen bg-slate-50 px-2 py-5 sm:px-4 lg:px-6  print:p-0">
      <div className="mx-auto w-full max-w-[1600px]">
        {/* =====================================================
            PAGE HEADER
        ===================================================== */}

        <div className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm print:mb-4 print:rounded-none print:border-0 print:shadow-none">
          <div className="relative overflow-hidden border-b border-sky-100 bg-gradient-to-r from-sky-100 via-cyan-50 to-blue-100 px-5 py-6 sm:px-7 print:hidden">
            <div className="pointer-events-none absolute -right-12 -top-16 h-40 w-40 rounded-full bg-sky-200/40" />
            <div className="pointer-events-none absolute -bottom-20 right-32 h-48 w-48 rounded-full bg-blue-200/30" />

            <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-sky-200 bg-white/80 text-sky-700 shadow-sm">
                  <Receipt className="h-6 w-6" />
                </div>

                <div>
                  <h1 className="lg:text-2xl font-bold tracking-tight text-slate-800 sm:text-xl">
                    All Expenses
                  </h1>
                </div>
              </div>

              {/* SEARCH AND PRINT IN PAGE HEADER */}
              {/* Only show these controls when expenses exist. */}

              {!isLoading && AllExpenses.length > 0 && (
                <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto lg:items-center">
                  <div className="min-w-0 flex-1 lg:w-64 lg:flex-none">
                    <SearchBox setQuery={setQuery} />
                  </div>

                  <div className="shrink-0">
                    <PrintButton handlePrint={handlePrint} />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* SUMMARY */}

          <div className="grid grid-cols-1 divide-y divide-slate-100 sm:grid-cols-3 sm:divide-x sm:divide-y-0 print:hidden">
            {/* RECORDS */}

            <div className="flex items-center gap-4 px-5 py-5 sm:px-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                <Receipt className="h-5 w-5" />
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Total Records
                </p>

                <p className="mt-1 text-xl font-bold text-slate-800">
                  {AllExpenses.length}
                </p>
              </div>
            </div>

            {/* TOTAL */}

            <div className="flex items-center gap-4 px-5 py-5 sm:px-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Wallet className="h-5 w-5" />
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Total Expense
                </p>

                <p className="truncate text-xl font-bold text-slate-800">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(totalExpense)}
                </p>
              </div>
            </div>

            {/* ROLE */}

            <div className="flex items-center gap-4 px-5 py-5 sm:px-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                <ShieldCheck className="h-5 w-5" />
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  User Role
                </p>

                <span
                  className={`mt-1 inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ${userRole === "super_admin"
                    ? "bg-violet-50 text-violet-600"
                    : userRole === "admin"
                      ? "bg-sky-50 text-sky-600"
                      : "bg-slate-100 text-slate-600"
                    }`}
                >
                  {formattedRole}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            PRINT CONTENT
        ===================================================== */}

        <div ref={printRef} className="expense-print-area">
          {/* PRINT TITLE */}

          <div className="mb-5 hidden text-center print:block">
            <h2 className="text-2xl font-bold text-slate-800">
              School Expense Report
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Total Records: {AllExpenses.length}
            </p>

            <p className="text-sm font-semibold text-sky-600">
              Total Expense: {formatCurrency(totalExpense)}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              User Role: {formattedRole}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Printed on {formatDate(new Date().toISOString())}
            </p>
          </div>

          {/* =====================================================
              MAIN CARD
          ===================================================== */}

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm print:rounded-none print:border print:border-slate-300 print:shadow-none">
            {isLoading ? (
              /* LOADING */

              <div className="flex min-h-[450px] items-center justify-center">
                <Loader />
              </div>
            ) : AllExpenses.length > 0 ? (
              <>
                {/* EXPENSE RECORDS HEADER — ONLY WHEN RECORDS EXIST */}

                <div className="flex flex-col gap-2 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 print:hidden">
                  <div>
                    <h2 className="text-lg font-bold text-slate-800">
                      Expense Records
                    </h2>
                  </div>
                </div>

                {/* TABLE */}

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[900px] border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50">
                        <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                          SL
                        </th>

                        <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                          <div className="flex items-center gap-2">
                            Voucher
                            <ArrowDownUp className="h-3.5 w-3.5 text-slate-300 print:hidden" />
                          </div>
                        </th>

                        <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                          Payment Date
                        </th>

                        <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                          Expense Head
                        </th>

                        <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                          Expense Name
                        </th>

                        <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
                          Amount
                        </th>

                        <th className="px-5 py-4 text-center text-xs font-bold uppercase tracking-wider text-slate-500 print:hidden">
                          Status
                        </th>

                        <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500 print:hidden">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      {AllExpenses.map((paymentInfo: any, i: number) => {
                        const authorization = authorizationData.find(
                          (item: any) =>
                            item.studentId === paymentInfo.id &&
                            item.status === true,
                        );

                        const authorizationApproved = authorizationData.find(
                          (item: any) =>
                            item.studentId === paymentInfo.id &&
                            item.status === false &&
                            item.approval === true,
                        );

                        return (
                          <tr
                            key={paymentInfo.id || i}
                            className="group transition hover:bg-sky-50/40"
                          >
                            {/* SL */}

                            <td className="whitespace-nowrap px-5 py-4 text-sm font-semibold text-slate-400">
                              {i + 1}
                            </td>

                            {/* VOUCHER */}

                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-500 print:hidden">
                                  <FileText className="h-4 w-4" />
                                </div>

                                <div>
                                  <p className="text-sm font-bold text-slate-700">
                                    {paymentInfo.serialNo || "-"}
                                  </p>

                                  <p className="text-[11px] text-slate-400 print:hidden">
                                    Voucher
                                  </p>
                                </div>
                              </div>
                            </td>

                            {/* DATE */}

                            <td className="whitespace-nowrap px-5 py-4">
                              <div className="flex items-center gap-2 text-sm text-slate-600">
                                <Clock3 className="h-4 w-4 text-slate-400 print:hidden" />
                                {formatDate(paymentInfo.entryDate)}
                              </div>
                            </td>

                            {/* EXPENSE HEAD */}

                            <td className="px-5 py-4">
                              <span
                                className={`inline-flex rounded-full px-3 py-1.5 text-xs font-bold capitalize ring-1 ring-inset  ${getExpenseHeadStyle(
                                  paymentInfo.expenseHead,
                                )}`}
                              >
                                {paymentInfo.expenseHead || "Other"}
                              </span>
                            </td>

                            {/* EXPENSE NAME */}

                            <td className="max-w-[240px] px-5 py-4">
                              <div className="flex items-center gap-2">
                                <CreditCard className="h-4 w-4 shrink-0 text-slate-300 print:hidden" />

                                <span className="truncate text-sm font-semibold text-slate-700">
                                  {paymentInfo.expenseType || "-"}
                                </span>
                              </div>
                            </td>

                            {/* AMOUNT */}

                            <td className="whitespace-nowrap px-5 py-4 text-right">
                              <span className="font-bold text-slate-800">
                                {formatCurrency(paymentInfo.amount)}
                              </span>
                            </td>

                            {/* STATUS */}

                            <td className="px-5 py-4 text-center print:hidden">
                              {authorization ? (
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700">
                                  <Clock3 className="h-3.5 w-3.5" />
                                  Pending
                                </span>
                              ) : authorizationApproved ? (
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                                  <CheckCircle2 className="h-3.5 w-3.5" />
                                  Approved
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-500">
                                  <CheckCircle2 className="h-3.5 w-3.5" />
                                  Active
                                </span>
                              )}
                            </td>

                            {/* ACTION */}

                            <td className="px-5 py-4 text-right print:hidden">
                              {userRole === "admin" && (
                                <div className="flex justify-end">
                                  {authorization && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleApproval(authorization)
                                      }
                                      className="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700 transition hover:bg-blue-100"
                                    >
                                      <ShieldCheck className="h-4 w-4" />
                                      Approve
                                    </button>
                                  )}

                                  {authorizationApproved && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleDelete(paymentInfo.id)
                                      }
                                      className="inline-flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-100"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                      Delete
                                    </button>
                                  )}

                                  {!authorization &&
                                    !authorizationApproved && (
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleDeleteFunctionality(paymentInfo)
                                        }
                                        className="inline-flex items-center gap-2 rounded-lg border border-red-100 bg-white px-3 py-2 text-xs font-bold text-red-500 transition hover:bg-red-50"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                        Delete
                                      </button>
                                    )}
                                </div>
                              )}

                              {userRole === "super_admin" && (
                                <div className="flex justify-end">
                                  {authorization && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleApproval(authorization)
                                      }
                                      className="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700 transition hover:bg-blue-100"
                                    >
                                      <ShieldCheck className="h-4 w-4" />
                                      Approve
                                    </button>
                                  )}

                                  {authorizationApproved && (
                                    <span className="inline-flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700">
                                      <CheckCircle2 className="h-4 w-4" />
                                      Approved
                                    </span>
                                  )}

                                  {!authorization &&
                                    !authorizationApproved && (
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleDelete(paymentInfo.id)
                                        }
                                        className="inline-flex items-center gap-2 rounded-lg border border-red-100 bg-white px-3 py-2 text-xs font-bold text-red-500 transition hover:bg-red-50"
                                      >
                                        <Trash2 className="h-4 w-4" />
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
              /* EMPTY STATE */

              <div className="flex min-h-[450px] flex-col items-center justify-center px-5 text-center print:hidden">
                <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-sky-50 text-sky-500">
                  <Search className="h-10 w-10" />
                </div>

                <h3 className="mt-5 text-xl font-bold text-slate-800">
                  No expenses found
                </h3>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* DELETE MODAL */}

      <DeleteExpenseConfirmationModal
        deleteExpenseId={deleteExpenseId}
        showDeleteModal={showDeleteModal}
        setShowDeleteModal={setShowDeleteModal}
      />

      {/* PRINT CSS */}

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

          .print\\:block {
            display: block !important;
          }

          table {
            width: 100% !important;
            min-width: 0 !important;
          }

          th,
          td {
            border-color: #d1d5db !important;
          }

          tr {
            page-break-inside: avoid;
          }

          thead {
            display: table-header-group;
          }

          tbody {
            display: table-row-group;
          }
        }
      `}</style>
    </div>
  );
};

export default DetailsAllExpense;
