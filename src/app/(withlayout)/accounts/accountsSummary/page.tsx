"use client";

import Loader from "@/components/Loader";
import PrintButton from "@/components/PrintButton";
import { useEntryFeessQuery } from "@/redux/api/entryFeesApi";
import { useExpensesQuery } from "@/redux/api/expenseApi";
import { useRevenuesQuery } from "@/redux/api/revenueApi";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  CalendarDays,
  CircleDollarSign,
  RotateCcw,
  TrendingDown,
  TrendingUp,
  WalletCards,
} from "lucide-react";
import React, { useMemo, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";

const AccountsSummaryPage = () => {
  // =========================================================
  // PRINT REF
  // =========================================================

  const componentRef = useRef<HTMLDivElement>(null);

  // =========================================================
  // DATE FILTER
  // =========================================================

  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  // =========================================================
  // API QUERY
  // =========================================================

  const query: Record<string, any> = {
    limit: 10000,
    page: 1,
  };

  const {
    data: expenseData,
    isLoading: expenseLoading,
    isError: expenseError,
  } = useExpensesQuery(query);

  const {
    data: feesData,
    isLoading: feesLoading,
    isError: feesError,
  } = useEntryFeessQuery(query);

  const {
    data: revenueData,
    isLoading: revenueLoading,
    isError: revenueError,
  } = useRevenuesQuery(query);

  const isLoading = expenseLoading || feesLoading || revenueLoading;

  const isError = expenseError || feesError || revenueError;

  // =========================================================
  // FILTER DATA BY DATE
  // =========================================================

  const filterByDate = (data: any[] = []) => {
    return data.filter((item) => {
      if (!item?.entryDate) return false;

      const itemDate = new Date(item.entryDate);

      if (Number.isNaN(itemDate.getTime())) {
        return false;
      }

      if (startDate) {
        const start = new Date(`${startDate}T00:00:00`);

        if (itemDate < start) {
          return false;
        }
      }

      if (endDate) {
        const end = new Date(`${endDate}T23:59:59.999`);

        if (itemDate > end) {
          return false;
        }
      }

      return true;
    });
  };

  // =========================================================
  // FILTERED DATA
  // =========================================================

  const filteredExpenses = useMemo(
    () => filterByDate(expenseData?.expenses || []),
    [expenseData, startDate, endDate],
  );

  const filteredFees = useMemo(
    () => filterByDate(feesData?.entryFees || []),
    [feesData, startDate, endDate],
  );

  const filteredRevenues = useMemo(
    () => filterByDate(revenueData?.revenues || []),
    [revenueData, startDate, endDate],
  );

  // =========================================================
  // CALCULATE TOTALS
  // =========================================================

  const totalExpense = useMemo(() => {
    return filteredExpenses.reduce(
      (total, item) => total + Number(item?.amount || 0),
      0,
    );
  }, [filteredExpenses]);

  const totalFees = useMemo(() => {
    return filteredFees.reduce(
      (total, item) => total + Number(item?.amount || 0),
      0,
    );
  }, [filteredFees]);

  const totalRevenue = useMemo(() => {
    return filteredRevenues.reduce(
      (total, item) => total + Number(item?.amount || 0),
      0,
    );
  }, [filteredRevenues]);

  // Revenue + Fees - Expenses
  const balance = totalRevenue + totalFees - totalExpense;

  const isProfit = balance >= 0;

  // =========================================================
  // CURRENCY FORMATTER
  // =========================================================

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-BD", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // =========================================================
  // DATE FORMATTER
  // =========================================================

  const formatDate = (date: string) => {
    if (!date) return "";

    const parsedDate = new Date(`${date}T00:00:00`);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString("en-BD", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =========================================================
  // REPORT PERIOD
  // =========================================================

  const reportPeriod = useMemo(() => {
    if (!startDate && !endDate) {
      return "All Time";
    }

    if (startDate && endDate) {
      return `${formatDate(startDate)} — ${formatDate(endDate)}`;
    }

    if (startDate) {
      return `From ${formatDate(startDate)}`;
    }

    return `Until ${formatDate(endDate)}`;
  }, [startDate, endDate]);

  // =========================================================
  // RESET FILTER
  // =========================================================

  const handleReset = () => {
    setStartDate("");
    setEndDate("");
  };

  // =========================================================
  // PRINT
  // =========================================================

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: "Accounts Summary",

    pageStyle: `
      @page {
        size: A4;
        margin: 15mm;
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

        .print-header {
          display: flex !important;
        }

        .print-footer {
          display: block !important;
        }

        .print-no-break {
          break-inside: avoid !important;
          page-break-inside: avoid !important;
        }
      }
    `,

    onBeforePrint: async () => {
      console.log("Preparing Accounts Summary for printing...");
    },

    onAfterPrint: () => {
      console.log("Accounts Summary printed successfully.");
    },

    onPrintError: (errorLocation, error) => {
      console.error("Print error:", errorLocation, error);
    },
  });

  // =========================================================
  // SUMMARY CARDS
  // =========================================================

  const summaryCards = [
    {
      title: "Total Revenue",
      amount: totalRevenue,
      icon: TrendingUp,
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      amountColor: "text-emerald-600",
      description: "Income generated",
    },
    {
      title: "Total Fees",
      amount: totalFees,
      icon: CircleDollarSign,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      amountColor: "text-blue-600",
      description: "Fees collected",
    },
    {
      title: "Total Expense",
      amount: totalExpense,
      icon: TrendingDown,
      iconBg: "bg-rose-100",
      iconColor: "text-rose-600",
      amountColor: "text-rose-600",
      description: "Money spent",
    },
  ];

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
        <div className="w-full max-w-md rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
            <TrendingDown size={24} />
          </div>

          <h2 className="text-lg font-bold text-red-700">
            Unable to Load Accounts
          </h2>

          <p className="mt-2 text-sm text-red-600">
            Something went wrong while loading the financial records.
          </p>
        </div>
      </div>
    );
  }

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="min-h-screen bg-slate-50 px-3 py-5 sm:px-5 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* =====================================================
            PAGE HEADER
        ====================================================== */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-200">
                <WalletCards size={25} />
              </div>

              <div>
                <h1 className="text-xl font-bold text-slate-800 sm:text-2xl">
                  Accounts Summary
                </h1>

                <p className="mt-1 max-w-2xl text-sm text-slate-500">
                  Monitor your revenue, fees, expenses and overall financial
                  performance.
                </p>
              </div>
            </div>

            {/* PRINT BUTTON */}

            <div className="flex">
              <PrintButton handlePrint={handlePrint} />
            </div>
          </div>
        </div>

        {/* =====================================================
            FILTER SECTION
        ====================================================== */}

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold text-slate-800">Filter Summary</h2>

              <p className="mt-1 text-xs text-slate-500">
                Select a date range to view financial records.
              </p>
            </div>

            {(startDate || endDate) && (
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex w-fit items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50">
                <RotateCcw size={14} />
                Reset
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* START DATE */}

            <div>
              <label className="mb-2 block text-xs font-semibold text-slate-600">
                Start Date
              </label>

              <div className="relative">
                <CalendarDays
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* END DATE */}

            <div>
              <label className="mb-2 block text-xs font-semibold text-slate-600">
                End Date
              </label>

              <div className="relative">
                <CalendarDays
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
              </div>
            </div>
          </div>

          {/* ACTIVE FILTER */}

          {(startDate || endDate) && (
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-3 text-xs font-medium text-blue-700">
              <CalendarDays size={15} />

              <span>
                Showing financial summary for <strong>{reportPeriod}</strong>
              </span>
            </div>
          )}
        </div>

        {/* =====================================================
            SUMMARY CARDS
        ====================================================== */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {summaryCards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.title}
                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      {card.title}
                    </p>

                    <h3
                      className={`mt-2 text-2xl font-bold ${card.amountColor}`}>
                      ৳ {formatCurrency(card.amount)}
                    </h3>

                    <p className="mt-2 text-xs text-slate-400">
                      {card.description}
                    </p>
                  </div>

                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.iconBg} ${card.iconColor} transition duration-300 group-hover:scale-110`}>
                    <Icon size={22} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* =====================================================
            PRINTABLE REPORT
        ====================================================== */}

        <div
          ref={componentRef}
          className="print-report rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* =================================================
              REPORT HEADER
          ================================================== */}

          <div className="print-header flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                Financial Report
              </p>

              <h2 className="mt-1 text-xl font-bold text-slate-800 sm:text-2xl">
                Accounts Summary
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Generated financial summary report
              </p>
            </div>

            <div className="text-left sm:text-right">
              <p className="text-xs text-slate-400">Report Period</p>

              <p className="mt-1 text-sm font-semibold text-slate-700">
                {reportPeriod}
              </p>
            </div>
          </div>

          {/* =================================================
              SUMMARY TABLE
          ================================================== */}

          <div className="p-5 sm:p-7">
            <div className="print-no-break overflow-hidden rounded-xl border border-slate-200">
              {/* TABLE HEADER */}

              <div className="grid grid-cols-2 bg-slate-50 px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500 sm:px-6">
                <span>Details</span>

                <span className="text-right">Amount (TK)</span>
              </div>

              {/* =================================================
                  REVENUE
              ================================================== */}

              <div className="grid grid-cols-2 items-center border-t border-slate-100 px-4 py-4 sm:px-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                    <ArrowUpCircle size={19} />
                  </div>

                  <div>
                    <p className="font-semibold text-slate-700">
                      Total Revenue
                    </p>

                    <p className="hidden text-xs text-slate-400 sm:block">
                      Revenue generated
                    </p>
                  </div>
                </div>

                <p className="text-right font-bold text-emerald-600">
                  ৳ {formatCurrency(totalRevenue)}
                </p>
              </div>

              {/* =================================================
                  FEES
              ================================================== */}

              <div className="grid grid-cols-2 items-center border-t border-slate-100 px-4 py-4 sm:px-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                    <CircleDollarSign size={19} />
                  </div>

                  <div>
                    <p className="font-semibold text-slate-700">Total Fees</p>

                    <p className="hidden text-xs text-slate-400 sm:block">
                      Fees collected
                    </p>
                  </div>
                </div>

                <p className="text-right font-bold text-blue-600">
                  ৳ {formatCurrency(totalFees)}
                </p>
              </div>

              {/* =================================================
                  EXPENSE
              ================================================== */}

              <div className="grid grid-cols-2 items-center border-t border-slate-100 px-4 py-4 sm:px-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-rose-100 text-rose-600">
                    <ArrowDownCircle size={19} />
                  </div>

                  <div>
                    <p className="font-semibold text-slate-700">
                      Total Expense
                    </p>

                    <p className="hidden text-xs text-slate-400 sm:block">
                      Total money spent
                    </p>
                  </div>
                </div>

                <p className="text-right font-bold text-rose-600">
                  ৳ {formatCurrency(totalExpense)}
                </p>
              </div>

              {/* =================================================
                  FINAL BALANCE
              ================================================== */}

              <div
                className={`border-t-2 p-5 sm:p-6 ${
                  isProfit
                    ? "border-emerald-200 bg-emerald-50"
                    : "border-rose-200 bg-rose-50"
                }`}>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                        isProfit
                          ? "bg-emerald-100 text-emerald-600"
                          : "bg-rose-100 text-rose-600"
                      }`}>
                      {isProfit ? (
                        <TrendingUp size={22} />
                      ) : (
                        <TrendingDown size={22} />
                      )}
                    </div>

                    <div>
                      <p
                        className={`text-base font-bold ${
                          isProfit ? "text-emerald-700" : "text-rose-700"
                        }`}>
                        Total {isProfit ? "Profit" : "Loss"}
                      </p>

                      <p className="text-xs text-slate-500">
                        Revenue + Fees − Expenses
                      </p>
                    </div>
                  </div>

                  <p
                    className={`text-lg font-extrabold sm:text-2xl ${
                      isProfit ? "text-emerald-700" : "text-rose-700"
                    }`}>
                    {isProfit ? "" : "("}৳ {formatCurrency(Math.abs(balance))}
                    {isProfit ? "" : ")"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* =================================================
              REPORT FOOTER
          ================================================== */}

          <div className="print-footer border-t border-slate-100 px-5 py-4 text-center text-xs text-slate-400">
            Generated Accounts Summary Report
          </div>
        </div>
      </div>

      {/* =====================================================
          PRINT CSS
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

          .print-header {
            display: flex !important;
          }

          .print-footer {
            display: block !important;
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

export default AccountsSummaryPage;
