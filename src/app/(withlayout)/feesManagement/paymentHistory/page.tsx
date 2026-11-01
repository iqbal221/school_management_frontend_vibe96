
"use client";

import { useEntryFeessQuery } from "@/redux/api/entryFeesApi";
import {
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Filter,
  History,
  Loader2,
  Receipt,
  RotateCcw,
  Search,
  UserRound,
  Users,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import React, { useMemo, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { toast } from "react-toastify";

interface FilterData {
  name: string;
  admission: string;
  roll: string;
  fees: string;
}

interface PaymentRecord {
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

const PaymentHistoryPage = () => {
  const componentRef = useRef<HTMLDivElement>(null);

  const [formSelectData, setFormSelectData] = useState<FilterData>({
    name: "",
    admission: "",
    roll: "",
    fees: "",
  });

  const [paymentHistoryInfo, setPaymentHistoryInfo] = useState<
    PaymentRecord[]
  >([]);

  const [hasSearched, setHasSearched] = useState(false);

  const query = {
    limit: 50,
    page: 1,
  };

  const { data, isLoading } = useEntryFeessQuery(query);

  const entryFeesData: PaymentRecord[] = data?.entryFees || [];

  /* ============================================================
     DEPENDENT DROPDOWN OPTIONS
  ============================================================ */

  // Student names
  const studentUniqueName = useMemo(
    () =>
      Array.from(
        new Set(
          entryFeesData
            .map((item) => item.name)
            .filter((name): name is string => Boolean(name)),
        ),
      ).sort((a, b) => a.localeCompare(b)),
    [entryFeesData],
  );

  // Filter payments according to selected student
  const studentPaymentData = useMemo(
    () =>
      entryFeesData.filter(
        (item) =>
          !formSelectData.name || item.name === formSelectData.name,
      ),
    [entryFeesData, formSelectData.name],
  );

  // Classes belonging to selected student
  const studentUniqueAdmission = useMemo(
    () =>
      Array.from(
        new Set(
          studentPaymentData
            .map((item) => item.admission)
            .filter(
              (value) => value !== undefined && value !== null && value !== "",
            )
            .map(String),
        ),
      ).sort((a, b) => a.localeCompare(b, undefined, { numeric: true })),
    [studentPaymentData],
  );

  // Filter payments according to selected class
  const classPaymentData = useMemo(
    () =>
      studentPaymentData.filter(
        (item) =>
          !formSelectData.admission ||
          String(item.admission) === formSelectData.admission,
      ),
    [studentPaymentData, formSelectData.admission],
  );

  // Roll numbers belonging to selected student and class
  const studentUniqueRoll = useMemo(
    () =>
      Array.from(
        new Set(
          classPaymentData
            .map((item) => item.roll)
            .filter(
              (value) => value !== undefined && value !== null && value !== "",
            )
            .map(String),
        ),
      ).sort((a, b) => a.localeCompare(b, undefined, { numeric: true })),
    [classPaymentData],
  );

  // Filter payments according to selected roll
  const rollPaymentData = useMemo(
    () =>
      classPaymentData.filter(
        (item) =>
          !formSelectData.roll ||
          String(item.roll) === formSelectData.roll,
      ),
    [classPaymentData, formSelectData.roll],
  );

  // Fee categories belonging to the selected student, class and roll
  const studentUniqueFees = useMemo(
    () =>
      Array.from(
        new Set(
          rollPaymentData
            .map((item) => item.fees)
            .filter((value): value is string => Boolean(value)),
        ),
      ).sort((a, b) => a.localeCompare(b)),
    [rollPaymentData],
  );

  /* ============================================================
     CHANGE HANDLER
  ============================================================ */

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormSelectData((prev) => {
      if (name === "name") {
        return {
          name: value,
          admission: "",
          roll: "",
          fees: "",
        };
      }

      if (name === "admission") {
        return {
          ...prev,
          admission: value,
          roll: "",
          fees: "",
        };
      }

      if (name === "roll") {
        return {
          ...prev,
          roll: value,
          fees: "",
        };
      }

      return {
        ...prev,
        [name]: value,
      };
    });

    // Clear previous results when filter selections change
    setPaymentHistoryInfo([]);
    setHasSearched(false);
  };

  /* ============================================================
     FIND PAYMENT HISTORY
  ============================================================ */

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const filteredData = entryFeesData.filter((item) => {
      const nameMatch =
        !formSelectData.name || item.name === formSelectData.name;

      const admissionMatch =
        !formSelectData.admission ||
        String(item.admission) === formSelectData.admission;

      const rollMatch =
        !formSelectData.roll ||
        String(item.roll) === formSelectData.roll;

      const feesMatch =
        !formSelectData.fees || item.fees === formSelectData.fees;

      return nameMatch && admissionMatch && rollMatch && feesMatch;
    });

    setPaymentHistoryInfo(filteredData);
    setHasSearched(true);

    if (filteredData.length === 0) {
      toast.info("No payment records found for the selected filters.");
    }
  };

  /* ============================================================
     RESET FILTERS
  ============================================================ */

  const handleReset = () => {
    setFormSelectData({
      name: "",
      admission: "",
      roll: "",
      fees: "",
    });

    setPaymentHistoryInfo([]);
    setHasSearched(false);
  };

  /* ============================================================
     PRINT
  ============================================================ */

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: "Payment-History-Report",
    onPrintError: (location, error) => {
      console.error(`Print error at ${location}:`, error);
      toast.error("Failed to print payment history.");
    },
  });

  /* ============================================================
     TOTAL PAYMENT
  ============================================================ */

  const totalAmount = useMemo(
    () =>
      paymentHistoryInfo.reduce(
        (total, item) => total + Number(item.amount || 0),
        0,
      ),
    [paymentHistoryInfo],
  );

  /* ============================================================
     DATE FORMAT
  ============================================================ */

  const formatDate = (date?: string) => {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "—";

    return parsedDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 p-2 sm:p-4 lg:p-6">
      <div className="mx-auto max-w-7xl">
        {/* FILTER CARD */}
        <div className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-gradient-to-r from-sky-50 via-white to-indigo-50 px-5 py-4 sm:px-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-600 text-white">
                  <Filter className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="font-bold text-slate-800">
                    Find Payment Records
                  </h2>
                  <p className="text-xs text-slate-500">
                    Search by student, class, roll or fee category.
                  </p>
                </div>
              </div>

              {(formSelectData.name ||
                formSelectData.admission ||
                formSelectData.roll ||
                formSelectData.fees) && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Reset Filters
                </button>
              )}
            </div>
          </div>

          {/* FILTER FORM */}
          <form onSubmit={handleSubmit}>
            <div className="p-5 sm:p-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <FilterSelect
                  label="Student Name"
                  icon={<UserRound className="h-4 w-4" />}
                  name="name"
                  value={formSelectData.name}
                  onChange={handleChange}
                  options={studentUniqueName}
                  placeholder="All Students"
                  loading={isLoading}
                />

                <FilterSelect
                  label="Class"
                  icon={<Users className="h-4 w-4" />}
                  name="admission"
                  value={formSelectData.admission}
                  onChange={handleChange}
                  options={studentUniqueAdmission}
                  placeholder="All Classes"
                  disabled={!formSelectData.name}
                />

                <FilterSelect
                  label="Roll Number"
                  icon={<Search className="h-4 w-4" />}
                  name="roll"
                  value={formSelectData.roll}
                  onChange={handleChange}
                  options={studentUniqueRoll}
                  placeholder="All Rolls"
                  disabled={!formSelectData.name}
                />

                <FilterSelect
                  label="Fee Category"
                  icon={<Wallet className="h-4 w-4" />}
                  name="fees"
                  value={formSelectData.fees}
                  onChange={handleChange}
                  options={studentUniqueFees}
                  placeholder="All Fees"
                  disabled={!formSelectData.name}
                />

                <div className="flex flex-col justify-end">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex h-11 w-full items-center justify-center gap-2 bg-gradient-to-r from-sky-600 to-blue-600 px-5 text-sm font-bold text-white shadow-md shadow-sky-500/20 transition hover:from-sky-700 hover:to-blue-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading
                      </>
                    ) : (
                      <>
                        <Search className="h-4 w-4" />
                        Find Payments
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* PAYMENT HISTORY */}
        <div
          ref={componentRef}
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        >
          {/* RESULTS HEADER */}
          {hasSearched && (
            <div className="border-b border-slate-200 px-5 py-4 sm:px-6">
              <div className="flex w-full items-center justify-between gap-3">
                <div className="flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                  <span className="whitespace-nowrap text-xs font-semibold text-emerald-700">
                    {paymentHistoryInfo.length > 0
                      ? "Payment Found"
                      : "No Payments Found"}
                  </span>
                </div>

                <div className="flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                  <span className="whitespace-nowrap text-xs font-semibold text-emerald-700">
                    Records:
                  </span>
                  <span className="text-sm font-bold text-emerald-700">
                    {paymentHistoryInfo.length}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* EMPTY STATE */}
          {paymentHistoryInfo.length === 0 ? (
            <div className="flex min-h-[250px] flex-col items-center justify-center px-6 py-12 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
                <History className="h-7 w-7 text-slate-400" />
              </div>

              <h3 className="text-base font-bold text-slate-700">
                {hasSearched ? "No Payment Records Found" : "Payment History"}
              </h3>

              <p className="mt-1 max-w-sm text-sm text-slate-400">
                {hasSearched
                  ? "Try changing your filters and search again."
                  : "Select a student, class, roll number or fee category and click Find Payments."}
              </p>
            </div>
          ) : (
            /* PAYMENT TABLE */
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px]">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      #
                    </th>
                    <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Student
                    </th>
                    <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Payment Date
                    </th>
                    <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Fee Type
                    </th>
                    <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Fee
                    </th>
                    <th className="px-5 py-4 text-right text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Amount
                    </th>
                    <th className="px-5 py-4 text-center text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Status
                    </th>
                    <th className="px-5 py-4 text-center text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Voucher
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {paymentHistoryInfo.map((item, index) => {
                    const paymentId = item.id || item._id;

                    return (
                      <tr
                        key={paymentId || `${item.name}-${item.roll}-${index}`}
                        className="group transition hover:bg-sky-50/40"
                      >
                        <td className="px-5 py-4 text-sm font-semibold text-slate-400">
                          {String(index + 1).padStart(2, "0")}
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-100 to-indigo-100 text-sky-700">
                              <UserRound className="h-4 w-4" />
                            </div>
                            <div className="min-w-0">
                              <p className="max-w-[180px] truncate text-sm font-bold text-slate-700">
                                {item.name || "—"}
                              </p>
                              <p className="text-[10px] text-slate-400">
                                Class: {item.admission ?? "—"} · Roll:{" "}
                                {item.roll ?? "—"}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <CalendarDays className="h-4 w-4 text-slate-400" />
                            <span className="whitespace-nowrap text-sm text-slate-600">
                              {formatDate(item.entryDate)}
                            </span>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <span className="inline-flex rounded-full bg-sky-50 px-3 py-1.5 text-xs font-semibold capitalize text-sky-700">
                            {item.feesType || "—"}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <span className="text-sm font-medium text-slate-600">
                            {item.fees || "—"}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-right">
                          <span className="whitespace-nowrap text-sm font-extrabold text-slate-800">
                            ৳ {Number(item.amount || 0).toLocaleString("en-BD")}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-center">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Paid
                          </span>
                        </td>

                        <td className="px-5 py-4 text-center">
                          {paymentId ? (
                            <Link
                              href={`/feesManagement/moneyReceipt/${paymentId}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-xs font-bold text-indigo-700 transition hover:border-indigo-300 hover:bg-indigo-100 hover:text-indigo-800 hover:shadow-sm active:scale-95"
                            >
                              <Receipt className="h-3.5 w-3.5" />
                              Voucher
                            </Link>
                          ) : (
                            <span className="text-xs text-slate-400">
                              Unavailable
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* TABLE FOOTER */}
          {paymentHistoryInfo.length > 0 && (
            <div className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-xs text-slate-500">
                Showing {paymentHistoryInfo.length} payment record(s)
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-500">
                  Total:
                </span>
                <span className="rounded-lg bg-sky-100 px-3 py-1.5 text-sm font-extrabold text-sky-700">
                  ৳ {totalAmount.toLocaleString("en-BD")}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ============================================================
   FILTER SELECT
============================================================ */

interface FilterSelectProps {
  label: string;
  icon: React.ReactNode;
  name: string;
  value: string;
  placeholder: string;
  options: string[];
  loading?: boolean;
  disabled?: boolean;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const FilterSelect = ({
  label,
  icon,
  name,
  value,
  placeholder,
  options,
  loading = false,
  disabled = false,
  onChange,
}: FilterSelectProps) => {
  return (
    <div>
      <label className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-500">
        <span className="text-sky-500">{icon}</span>
        {label}
      </label>

      <div className="relative">
        <select
          name={name}
          value={value}
          onChange={onChange}
          disabled={loading || disabled}
          className="h-11 w-full appearance-none border border-slate-300 bg-white px-3 pr-10 text-sm text-slate-700 outline-none transition hover:border-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
        >
          <option value="">
            {loading ? "Loading..." : placeholder}
          </option>

          {options.map((option, index) => (
            <option key={`${name}-${option}-${index}`} value={option}>
              {option}
            </option>
          ))}
        </select>

        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      </div>
    </div>
  );
};

export default PaymentHistoryPage;
