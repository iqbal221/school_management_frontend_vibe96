"use client";

import { useAddRevenueMutation } from "@/redux/api/revenueApi";
import {
  ArrowLeft,
  CalendarDays,
  FileText,
  Hash,
  MessageSquare,
  Receipt,
  WalletCards,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { FormEvent, useState } from "react";
import { toast } from "react-toastify";

type RevenueForm = {
  serialNo: string;
  revenue: string;
  amount: string;
  entryDate: string;
  comment: string;
};

const EntryAllRevenuePage = () => {
  const router = useRouter();

  const [addRevenue, { isLoading }] = useAddRevenueMutation();

  const [formData, setFormData] = useState<RevenueForm>({
    serialNo: "",
    revenue: "",
    amount: "",
    entryDate: "",
    comment: "",
  });

  /* =========================================================
     HANDLE CHANGE
  ========================================================= */

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
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

    // Validation
    if (!formData.serialNo.trim()) {
      return toast.error("Please enter voucher number");
    }

    if (!formData.revenue.trim()) {
      return toast.error("Please enter revenue name");
    }

    if (!formData.amount.trim()) {
      return toast.error("Please enter amount");
    }

    if (Number(formData.amount) <= 0) {
      return toast.error("Please enter a valid amount");
    }

    if (!formData.entryDate) {
      return toast.error("Please select receive date");
    }

    const payload = {
      serialNo: formData.serialNo.trim(),
      revenue: formData.revenue.trim(),
      amount: Number(formData.amount),
      entryDate: formData.entryDate,
      comment: formData.comment.trim(),
    };

    try {
      const res = await addRevenue(payload).unwrap();

      if (res?.id) {
        toast.success("Revenue added successfully");

        setFormData({
          serialNo: "",
          revenue: "",
          amount: "",
          entryDate: "",
          comment: "",
        });

        router.push("/accounts/detailsAllRevenue");
      }
    } catch (error) {
      console.error("Add revenue error:", error);
      toast.error("Failed to add revenue");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-2 py-5 sm:px-3 lg:px-4">
      <div className="mx-auto max-w-5xl">
        {/* =====================================================
            PAGE HEADER
        ===================================================== */}

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Title */}

          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-100">
              <Receipt className="h-6 w-6" />
            </div>

            <div>
              <h1 className="lg:text-2xl font-bold tracking-tight text-slate-800 sm:text-xl">
                Entry All Revenue
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Record and manage your school revenue
              </p>
            </div>
          </div>

          {/* Back Button */}

          <button
            type="button"
            onClick={() => router.push("/accounts/detailsAllRevenue")}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 shadow-sm transition-all hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600 active:scale-[0.98]">
            <ArrowLeft className="h-4 w-4" />
            Back to Revenue
          </button>
        </div>

        {/* =====================================================
            FORM CARD
        ===================================================== */}

        <form
          onSubmit={handleSubmit}
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* ===================================================
              FORM HEADER
          =================================================== */}

          <div className="border-b border-slate-200 bg-gradient-to-r from-emerald-50 via-white to-teal-50 px-5 py-5 sm:px-7">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-emerald-500 shadow-sm ring-1 ring-emerald-100">
                <WalletCards className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-base font-bold text-slate-800">
                  Revenue Information
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

              {/* Revenue */}

              <FormInput
                label="Revenue"
                name="revenue"
                value={formData.revenue}
                onChange={handleChange}
                placeholder="e.g. Admission Fee"
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
                placeholder="Enter received amount"
                icon={<span className="text-sm font-bold leading-none">৳</span>}
                required
              />

              {/* Receive Date */}

              <FormInput
                label="Receive Date"
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
                  placeholder="Write about this revenue..."
                  icon={<MessageSquare className="h-4 w-4" />}
                />
              </div>
            </div>

            {/* =================================================
                REVENUE SUMMARY
            ================================================= */}

            {formData.amount && Number(formData.amount) > 0 && (
              <div className="mt-6 overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-teal-50 p-4 sm:p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
                      Revenue Amount
                    </p>

                    <p className="mt-1 flex items-center gap-2 text-2xl font-bold text-slate-800">
                      {Number(formData.amount).toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </p>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-emerald-500 shadow-sm">
                    <WalletCards className="h-6 w-6" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ===================================================
              FORM FOOTER
          =================================================== */}

          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 px-5 py-5 sm:flex-row sm:justify-end sm:px-7">
            {/* Cancel */}

            <button
              type="button"
              disabled={isLoading}
              onClick={() => router.back()}
              className="h-11 border border-slate-300 bg-white px-7 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-100 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50">
              Cancel
            </button>

            {/* Submit */}

            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-8 text-sm font-semibold text-white shadow-sm shadow-emerald-100 transition-all hover:from-emerald-600 hover:to-teal-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60">
              {isLoading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Saving...
                </>
              ) : (
                <>
                  <Receipt className="h-4 w-4" />
                  Save Revenue
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
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
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
        className="mb-2 block text-sm font-semibold text-slate-700">
        {label}

        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      <div className="relative">
        {icon && (
          <div className="pointer-events-none absolute left-3.5 top-1/2 z-10 flex -translate-y-1/2 items-center text-slate-400">
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
          step={type === "number" ? "0.01" : undefined}
          className={`h-10 w-full border border-slate-300 bg-white text-sm text-slate-700 shadow-sm outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 ${icon ? "pl-10 pr-4" : "px-4"
            }`}
        />
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
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
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
        className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <div className="relative">
        {icon && (
          <div className="pointer-events-none absolute left-3.5 top-3 text-slate-400">
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
          className={`w-full resize-none border border-slate-300 bg-white py-2 text-sm text-slate-700 shadow-sm outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 ${icon ? "pl-10 pr-4" : "px-4"
            }`}
        />
      </div>
    </div>
  );
};

export default EntryAllRevenuePage;
