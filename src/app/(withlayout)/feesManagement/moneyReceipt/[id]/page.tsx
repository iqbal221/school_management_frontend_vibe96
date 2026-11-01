"use client";

import Image from "next/image";
import React, { useRef } from "react";
import { useParams } from "next/navigation";
import { useReactToPrint } from "react-to-print";
import {
  CalendarDays,
  CheckCircle2,
  CreditCard,
  FileText,
  Hash,
  Loader2,
  Receipt,
  UserRound,
  Wallet,
} from "lucide-react";

import PrintButton from "@/components/PrintButton";
import school_logo from "../../../../../../public/school_logo.svg";
import { useEntryFeesQuery } from "@/redux/api/entryFeesApi";
import { getUserInfo } from "@/service/auth.service";

interface EntryFeeData {
  id?: string;
  _id?: string;
  name?: string;
  admission?: string | number;
  roll?: string | number;
  feesType?: string;
  fees?: string;
  amount?: number | string;
  entryDate?: string;
  comment?: string;
}

const MoneyReceiptPage = () => {
  const componentRef = useRef<HTMLDivElement>(null);

  const params = useParams();
  const id = params?.id as string;

  const { data, isLoading, isError } = useEntryFeesQuery(id);

  const userInfo: any = getUserInfo();

  const receiptData = data as EntryFeeData | undefined;

  /* -------------------------------------------------------
     Dates
  ------------------------------------------------------- */

  const formatDate = (dateValue?: string) => {
    if (!dateValue) return "—";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "—";
    }

    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const paymentDate = formatDate(receiptData?.entryDate);
  const currentDate = formatDate(new Date().toISOString());

  /* -------------------------------------------------------
     Amount
  ------------------------------------------------------- */

  const amount = Number(receiptData?.amount || 0);

  const formattedAmount = amount.toLocaleString("en-BD");

  /* -------------------------------------------------------
     Print
  ------------------------------------------------------- */

const handlePrint = useReactToPrint({
  contentRef: componentRef,
  documentTitle: "Money-Receipt",
});

  /* -------------------------------------------------------
     Loading
  ------------------------------------------------------- */

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100">
            <Loader2 className="h-6 w-6 animate-spin text-sky-600" />
          </div>

          <p className="text-sm font-medium text-slate-500">
            Loading money receipt...
          </p>
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------
     Error / Empty
  ------------------------------------------------------- */

  if (isError || !receiptData) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-slate-50 p-6">
        <div className="max-w-md rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50">
            <FileText className="h-7 w-7 text-red-500" />
          </div>

          <h2 className="text-lg font-bold text-slate-800">
            Receipt Not Found
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            We couldn&rsquo;s find the payment information for this receipt.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl">
        {/* ==================================================
            PAGE HEADER
        ================================================== */}

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">
              Money Receipt
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              View and print the student&rsquo;s payment receipt.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-2.5 sm:flex">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-emerald-600">
                  Payment
                </p>

                <p className="text-sm font-bold text-emerald-700">Completed</p>
              </div>
            </div>

            <PrintButton handlePrint={handlePrint} />
          </div>
        </div>

        {/* ==================================================
            RECEIPT PREVIEW
        ================================================== */}

        <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm sm:p-4 lg:p-6">
          {/* ==================================================
              PRINTABLE RECEIPT
          ================================================== */}

          <div
            ref={componentRef}
            className="receipt-print mx-auto w-full max-w-[760px] overflow-hidden rounded-xl border border-slate-200 bg-white">
            {/* ==================================================
                RECEIPT HEADER
            ================================================== */}

            <div className="relative overflow-hidden border-b border-sky-100 bg-gradient-to-br from-sky-50 via-white to-blue-50 px-6 py-7 text-slate-800 sm:px-10">
              {/* Soft decorative shapes */}
              <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-sky-100/70" />

              <div className="absolute -bottom-20 -left-16 h-44 w-44 rounded-full bg-blue-100/60" />

              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-2xl border border-sky-100 bg-white p-2 shadow-sm">
                  <Image
                    src={school_logo}
                    width={100}
                    height={100}
                    className="h-full w-full object-contain"
                    alt="School Logo"
                    priority
                  />
                </div>

                <h2 className="text-xl font-extrabold tracking-tight text-slate-800 sm:text-2xl">
                  Bhatiary Shishu Kanon School
                </h2>

                <p className="mt-1 text-xs font-medium text-slate-500 sm:text-sm">
                  Bhatiary, Sitakund, Chattogram
                </p>

                <div className="mt-4 rounded-full border border-sky-200 bg-sky-100/80 px-5 py-1.5">
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-sky-800">
                    Money Receipt
                  </span>
                </div>
              </div>
            </div>

            {/* ==================================================
                RECEIPT META
            ================================================== */}

            <div className="grid grid-cols-2 border-b border-sky-100 bg-sky-50/40 sm:grid-cols-4">
              <ReceiptMeta
                icon={<Hash className="h-4 w-4" />}
                label="Receipt ID"
                value={receiptData.id || receiptData._id?.slice(-8) || "—"}
              />

              <ReceiptMeta
                icon={<CalendarDays className="h-4 w-4" />}
                label="Payment Date"
                value={paymentDate}
              />

              <ReceiptMeta
                icon={<CreditCard className="h-4 w-4" />}
                label="Payment Type"
                value={receiptData.feesType || "—"}
              />

              <ReceiptMeta
                icon={<CheckCircle2 className="h-4 w-4" />}
                label="Status"
                value="Paid"
                success
              />
            </div>

            {/* ==================================================
                STUDENT INFORMATION
            ================================================== */}

            <div className="px-5 py-6 sm:px-10">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
                  <UserRound className="h-4 w-4" />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-800">
                    Student Information
                  </h3>

                  <p className="text-[11px] text-slate-400">
                    Payment recipient details
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 overflow-hidden rounded-xl border border-slate-200 sm:grid-cols-3">
                <StudentInfo
                  label="Student Name"
                  value={receiptData.name}
                  first
                />

                <StudentInfo label="Class" value={receiptData.admission} />

                <StudentInfo label="Roll Number" value={receiptData.roll} />
              </div>

              {/* ==================================================
                  PAYMENT DETAILS
              ================================================== */}

              <div className="mb-4 mt-8 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                  <Wallet className="h-4 w-4" />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-800">
                    Payment Details
                  </h3>

                  <p className="text-[11px] text-slate-400">
                    Fee payment information
                  </p>
                </div>
              </div>

              <div className="overflow-hidden rounded-xl border border-slate-200">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[580px]">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50">
                        <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                          SL
                        </th>

                        <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                          Payment Date
                        </th>

                        <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                          Fee Type
                        </th>

                        <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                          Fee Category
                        </th>

                        <th className="px-4 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-slate-500">
                          Amount
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      <tr>
                        <td className="px-4 py-4 text-sm font-semibold text-slate-700">
                          01
                        </td>

                        <td className="px-4 py-4 text-sm text-slate-600">
                          {paymentDate}
                        </td>

                        <td className="px-4 py-4">
                          <span className="inline-flex rounded-full bg-sky-50 px-2.5 py-1 text-xs font-semibold capitalize text-sky-700">
                            {receiptData.feesType || "—"}
                          </span>
                        </td>

                        <td className="px-4 py-4 text-sm font-medium text-slate-700">
                          {receiptData.fees || "—"}
                        </td>

                        <td className="px-4 py-4 text-right text-sm font-bold text-slate-800">
                          ৳ {formattedAmount}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* ==================================================
                  TOTAL
              ================================================== */}

              <div className="mt-5 flex justify-end">
                <div className="w-full rounded-xl border border-sky-100 bg-gradient-to-r from-sky-50 to-indigo-50 p-4 sm:w-[300px]">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-slate-500">
                        Total Paid
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-2xl font-extrabold text-sky-700">
                        ৳ {formattedAmount}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ==================================================
                  COMMENT
              ================================================== */}

              {receiptData.comment && (
                <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Comment
                  </p>

                  <p className="text-sm text-slate-600">
                    {receiptData.comment}
                  </p>
                </div>
              )}

              {/* ==================================================
                  FOOTER
              ================================================== */}

              <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-3 sm:items-end">
                <div>
                  <div className="mb-2 h-px w-32 bg-slate-300" />

                  <p className="text-xs font-semibold text-slate-600">
                    Authorized Signature
                  </p>

                  <p className="mt-1 text-[10px] text-slate-400">
                    School Authority
                  </p>
                </div>

                <div className="text-left sm:text-center">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                    Generated On
                  </p>

                  <p className="mt-1 text-xs font-semibold text-slate-600">
                    {currentDate}
                  </p>
                </div>

                <div className="sm:text-right">
                  <div className="mb-2 ml-auto h-px w-32 bg-slate-300" />

                  <p className="text-xs font-semibold text-slate-600">
                    Created By
                  </p>

                  <p className="mt-1 text-[10px] text-slate-400">
                    {userInfo?.id || "Administrator"}
                  </p>
                </div>
              </div>

              {/* Bottom Accent */}
              <div className="mt-8 h-1.5 w-full rounded-full bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600" />

              <p className="mt-3 text-center text-[10px] text-slate-400">
                This is a computer-generated payment receipt.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ==================================================
          PRINT CSS
      ================================================== */}

      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 12mm;
          }

          html,
          body {
            background: white !important;
          }

          body * {
            visibility: hidden;
          }

          .receipt-print,
          .receipt-print * {
            visibility: visible;
          }

          .receipt-print {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            max-width: none !important;
            border: 1px solid #e2e8f0 !important;
            border-radius: 0 !important;
            box-shadow: none !important;
          }

          .receipt-print table {
            page-break-inside: avoid;
          }

          .receipt-print tr {
            page-break-inside: avoid;
          }
        }
      `}</style>
    </div>
  );
};

/* ============================================================
   RECEIPT META
============================================================ */

interface ReceiptMetaProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  success?: boolean;
}

const ReceiptMeta = ({ icon, label, value, success }: ReceiptMetaProps) => {
  return (
    <div className="border-b border-r border-slate-200 px-4 py-3 last:border-r-0 sm:border-b-0">
      <div className="flex items-center gap-2">
        <span className={success ? "text-emerald-500" : "text-slate-400"}>
          {icon}
        </span>

        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          {label}
        </span>
      </div>

      <p
        className={`mt-1 truncate text-xs font-bold capitalize ${
          success ? "text-emerald-600" : "text-slate-700"
        }`}>
        {value || "—"}
      </p>
    </div>
  );
};

/* ============================================================
   STUDENT INFO
============================================================ */

interface StudentInfoProps {
  label: string;
  value?: string | number;
  first?: boolean;
}

const StudentInfo = ({ label, value, first }: StudentInfoProps) => {
  return (
    <div
      className={`px-4 py-4 ${
        !first ? "border-t sm:border-l sm:border-t-0" : ""
      } border-slate-200`}>
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-1.5 truncate text-sm font-bold text-slate-700">
        {value || "—"}
      </p>
    </div>
  );
};

/* ============================================================
   PRINT ICON
============================================================ */

const PrinterIcon = () => {
  return <Receipt className="h-3.5 w-3.5" />;
};

export default MoneyReceiptPage;
