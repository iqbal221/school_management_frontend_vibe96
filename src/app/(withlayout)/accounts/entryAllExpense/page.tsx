"use client";

import { useAddExpenseMutation } from "@/redux/api/expenseApi";
import {
  ArrowLeft,
  CalendarDays,
  FileText,
  Hash,
  IndianRupee,
  MessageSquare,
  Receipt,
  WalletCards,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { FormEvent, useState } from "react";
import { toast } from "react-toastify";

type ExpenseForm = {
  serialNo: string;
  expenseHead: string;
  expenseType: string;
  amount: string;
  entryDate: string;
  comment: string;
};

const EntryAllExpensePage = () => {
  const router = useRouter();

  const [addExpense, { isLoading }] = useAddExpenseMutation();

  const [formData, setFormData] = useState<ExpenseForm>({
    serialNo: "",
    expenseHead: "",
    expenseType: "",
    amount: "",
    entryDate: "",
    comment: "",
  });

  /* =========================================================
     HANDLE INPUT CHANGE
  ========================================================= */

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* =========================================================
     SUBMIT
  ========================================================= */

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.serialNo.trim()) {
      return toast.error("Please enter voucher number");
    }

    if (!formData.expenseHead) {
      return toast.error("Please select expense head");
    }

    if (!formData.expenseType.trim()) {
      return toast.error("Please enter expense name");
    }

    if (!formData.amount.trim()) {
      return toast.error("Please enter expense amount");
    }

    if (Number(formData.amount) <= 0) {
      return toast.error("Please enter a valid amount");
    }

    if (!formData.entryDate) {
      return toast.error("Please select payment date");
    }

    const payload = {
      serialNo: formData.serialNo.trim(),
      expenseHead: formData.expenseHead,
      expenseType: formData.expenseType.trim(),
      amount: Number(formData.amount),
      entryDate: formData.entryDate,
      comment: formData.comment.trim(),
    };

    try {
      const res = await addExpense(payload).unwrap();

      if (res?.id) {
        toast.success("Expense added successfully");

        setFormData({
          serialNo: "",
          expenseHead: "",
          expenseType: "",
          amount: "",
          entryDate: "",
          comment: "",
        });

        router.push("/accounts/detailsAllExpense");
      }
    } catch (error) {
      console.error("Add expense error:", error);
      toast.error("Failed to add expense");
    }
  };

  /* =========================================================
     UI
  ========================================================= */

  return (
    <div className="bg-slate-50 px-2 py-5 sm:px-3 lg:px-4">
      <div className="mx-auto max-w-5xl">
        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-500 text-white shadow-sm">
                <Receipt className="h-6 w-6" />
              </div>

              <div>
                <h1 className="text-xl font-bold text-slate-800 sm:text-2xl">
                  Entry All Expense
                </h1>

                <p className="mt-0.5 text-sm text-slate-500">
                  Record and manage your school expenses
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => router.push("/accounts/detailsAllExpense")}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Expenses
          </button>
        </div>

        {/* =====================================================
            FORM CARD
        ===================================================== */}

        <form
          onSubmit={handleSubmit}
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        >
          {/* ===================================================
              FORM HEADER
          =================================================== */}

          <div className="border-b border-slate-200 bg-gradient-to-r from-sky-50 via-white to-cyan-50 px-5 py-5 sm:px-7">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-sky-500 shadow-sm ring-1 ring-sky-100">
                <WalletCards className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-base font-bold text-slate-800">
                  Expense Information
                </h2>
              </div>
            </div>
          </div>

          {/* ===================================================
              FORM BODY
          =================================================== */}

          <div className="p-5 sm:p-7">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {/* Voucher Number */}

              <FormInput
                label="Voucher No"
                name="serialNo"
                value={formData.serialNo}
                onChange={handleChange}
                placeholder="Enter voucher number"
                icon={<Hash className="h-4 w-4" />}
                required
              />

              {/* Expense Head */}

              <FormSelect
                label="Expense Head"
                name="expenseHead"
                value={formData.expenseHead}
                onChange={handleChange}
                icon={<WalletCards className="h-4 w-4" />}
                required
              >
                <option value="">Select expense head</option>
                <option value="salary">Salary</option>
                <option value="Management">Management</option>
                <option value="Stationary">Stationary</option>
                <option value="Conveyance">Conveyance</option>
                <option value="Tax">Tax</option>
              </FormSelect>

              {/* Expense Name */}

              <FormInput
                label="Expense Name"
                name="expenseType"
                value={formData.expenseType}
                onChange={handleChange}
                placeholder="e.g. Office stationery"
                icon={<FileText className="h-4 w-4" />}
                required
              />

              {/* Amount */}

              <FormInput
                label="Amount"
                name="amount"
                type="number"
                value={formData.amount}
                onChange={handleChange}
                placeholder="Enter amount"
                 icon={
                <span className="text-sm font-bold leading-none">
                  ৳
                </span>
                }
                required
              />

              {/* Payment Date */}

              <FormInput
                label="Payment Date"
                name="entryDate"
                type="date"
                value={formData.entryDate}
                onChange={handleChange}
                icon={<CalendarDays className="h-4 w-4" />}
                required
              />

              {/* Comment */}

              <div className="md:col-span-1">
                <FormTextarea
                  label="Comment"
                  name="comment"
                  value={formData.comment}
                  onChange={handleChange}
                  placeholder="Write about this expense..."
                  icon={<MessageSquare className="h-4 w-4" />}
                />
              </div>
            </div>

            {/* =================================================
                SUMMARY
            ================================================= */}

            {formData.amount && Number(formData.amount) > 0 && (
              <div className="mt-6 rounded-xl border border-sky-100 bg-sky-50 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-sky-600">
                      Expense Amount
                    </p>

                    <p className="mt-1 text-xl font-bold text-slate-800">
                      ৳ {Number(formData.amount).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-sky-500 shadow-sm">
                    <WalletCards className="h-5 w-5" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ===================================================
              FOOTER
          =================================================== */}

          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 px-5 py-5 sm:flex-row sm:justify-end sm:px-7">
            <button
              type="button"
              disabled={isLoading}
              onClick={() => router.back()}
              className="h-11 border border-slate-300 bg-white px-7 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex h-11 items-center justify-center gap-2  bg-sky-500 px-8 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Saving...
                </>
              ) : (
                <>
                  <Receipt className="h-4 w-4" />
                  Save Expense
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* =========================================================
   FORM INPUT
========================================================= */

interface FormInputProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  placeholder?: string;
  required?: boolean;
  icon?: React.ReactNode;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => void;
}

const FormInput = ({
  label,
  name,
  type = "text",
  value,
  placeholder,
  required = false,
  icon,
  onChange,
}: FormInputProps) => {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-semibold text-slate-700"
      >
        {label}

        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      <div className="relative">
        {icon && (
          <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </div>
        )}

        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          min={type === "number" ? "0" : undefined}
          className={`h-10 w-full  border border-slate-300 bg-white text-sm text-slate-700 outline-none transition hover:border-slate-300 focus:border-sky-400 focus:ring-4 focus:ring-sky-100 ${
            icon ? "pl-10 pr-4" : "px-4"
          }`}
        />
      </div>
    </div>
  );
};

/* =========================================================
   FORM SELECT
========================================================= */

interface FormSelectProps {
  label: string;
  name: string;
  value: string;
  required?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => void;
}

const FormSelect = ({
  label,
  name,
  value,
  required = false,
  icon,
  children,
  onChange,
}: FormSelectProps) => {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-semibold text-slate-700"
      >
        {label}

        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      <div className="relative">
        {icon && (
          <div className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-slate-400">
            {icon}
          </div>
        )}

        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className={`h-10 w-full appearance-none  border border-slate-300 bg-white pr-10 text-sm text-slate-700 outline-none transition hover:border-slate-300 focus:border-sky-400 focus:ring-4 focus:ring-sky-100 ${
            icon ? "pl-10" : "pl-4"
          }`}
        >
          {children}
        </select>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.8}
          stroke="currentColor"
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m19.5 8.25-7.5 7.5-7.5-7.5"
          />
        </svg>
      </div>
    </div>
  );
};

/* =========================================================
   FORM TEXTAREA
========================================================= */

interface FormTextareaProps {
  label: string;
  name: string;
  value: string;
  placeholder?: string;
  icon?: React.ReactNode;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => void;
}

const FormTextarea = ({
  label,
  name,
  value,
  placeholder,
  icon,
  onChange,
}: FormTextareaProps) => {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-semibold text-slate-700"
      >
        {label}
      </label>

      <div className="relative">
        {icon && (
          <div className="pointer-events-none absolute left-3 top-3 text-slate-400">
            {icon}
          </div>
        )}

        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={1}
          className={`w-full resize-none border border-slate-300 bg-white py-2 text-sm text-slate-700 outline-none transition hover:border-slate-300 focus:border-sky-400 focus:ring-4 focus:ring-sky-100 ${
            icon ? "pl-10 pr-4" : "px-4"
          }`}
        />
      </div>
    </div>
  );
};

export default EntryAllExpensePage;