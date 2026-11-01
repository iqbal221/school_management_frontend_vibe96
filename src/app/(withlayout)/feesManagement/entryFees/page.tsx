"use client";

import { useAddEntryFeesWithFormDataMutation } from "@/redux/api/entryFeesApi";
import { useStudentsQuery } from "@/redux/api/studentApi";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";
import {
  BadgeDollarSign,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  CreditCard,
  FileText,
  GraduationCap,
  Hash,
  Loader2,
  MessageSquare,
  Receipt,
  UserRound,
  Wallet,
} from "lucide-react";
import { toast } from "react-toastify";

interface FormData {
  name: string;
  admission: string;
  roll: string;
  feesType: string;
  fees: string;
  amount: string;
  entryDate: string;
  comment: string;
}

const EntryFeesPage = () => {
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    name: "",
    admission: "",
    roll: "",
    feesType: "",
    fees: "",
    amount: "",
    entryDate: "",
    comment: "",
  });

  const query: Record<string, any> = {
    limit: 1000,
    page: 1,
    sortBy: "",
    sortOrder: "",
  };

  const { data, isLoading: studentsLoading } = useStudentsQuery(query);

  const studentData = data?.students || [];

  const [addEntryFeesWithFormData, { isLoading: isSubmitting }] =
    useAddEntryFeesWithFormDataMutation();

  // Unique student names
  const uniqueStudentNames = useMemo(() => {
    return Array.from(
      new Set(studentData.map((student: any) => student?.name).filter(Boolean)),
    );
  }, [studentData]);

  // Selected student
  const selectedStudent = useMemo(() => {
    return studentData.find((student: any) => student?.name === formData.name);
  }, [studentData, formData.name]);

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

    // Automatically set class and roll when student is selected
    if (name === "name") {
      const student = studentData.find((item: any) => item?.name === value);

      setFormData((prev) => ({
        ...prev,
        name: value,
        admission: student?.admission?.toString() || "",
        roll: student?.roll?.toString() || "",
      }));
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      admission: "",
      roll: "",
      feesType: "",
      fees: "",
      amount: "",
      entryDate: "",
      comment: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.name) {
      toast.error("Please select a student");
      return;
    }

    if (!formData.admission) {
      toast.error("Student class is required");
      return;
    }

    if (!formData.roll) {
      toast.error("Student roll is required");
      return;
    }

    if (!formData.feesType) {
      toast.error("Please select fees type");
      return;
    }

    if (!formData.fees) {
      toast.error("Please select fees");
      return;
    }

    if (!formData.entryDate) {
      toast.error("Please select entry date");
      return;
    }

    if (!formData.amount || Number(formData.amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (!formData.comment.trim()) {
      toast.error("Please write a comment");
      return;
    }

    const payload = {
      name: formData.name,
      admission: formData.admission,
      roll: formData.roll,
      feesType: formData.feesType,
      fees: formData.fees,
      entryDate: formData.entryDate,
      comment: formData.comment.trim(),
      amount: Number(formData.amount),
    };

    try {
      const res = await addEntryFeesWithFormData(payload).unwrap();

      if (res?.id) {
        toast.success("Entry fees successfully recorded!");

        resetForm();

        setTimeout(() => {
          router.push("/feesManagement/paymentHistory");
        }, 500);
      }
    } catch (err) {
      console.error("Entry fees error:", err);
      toast.error("Failed to record entry fees. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-3 sm:p-4 lg:p-6">
      <div className="mx-auto max-w-6xl">

        {/* Main Card */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* Card Header */}
          <div className="border-b border-slate-200 bg-gradient-to-r from-sky-50 via-white to-indigo-50 px-5 py-5 sm:px-7">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-600 text-white shadow-sm">
                <Wallet className="h-5 w-5" />
              </div>

              <div>
                <h2 className="font-bold text-slate-800">
                  Payment Information
                </h2>

                <p className="text-sm text-slate-500">
                  Enter the student&rsquo;s payment details below.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="p-5 sm:p-7">
              {/* Student Section */}
              <div className="mb-8">

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  {/* Student Name */}
                  <FormField
                    label="Student Name"
                    icon={<UserRound className="h-4 w-4" />}
                    required>
                    <Select
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={studentsLoading}>
                      <option value="">
                        {studentsLoading
                          ? "Loading students..."
                          : "Select Student"}
                      </option>

                      {uniqueStudentNames.map((name: any) => (
                        <option key={name} value={name}>
                          {name}
                        </option>
                      ))}
                    </Select>
                  </FormField>

                  {/* Class */}
                  <FormField
                    label="Class"
                    icon={<GraduationCap className="h-4 w-4" />}
                    required>
                    <Select
                      name="admission"
                      value={formData.admission}
                      onChange={handleChange}>
                      <option value="">Select Class</option>

                      {selectedStudent?.admission && (
                        <option value={selectedStudent.admission}>
                          {selectedStudent.admission}
                        </option>
                      )}
                    </Select>
                  </FormField>

                  {/* Roll */}
                  <FormField
                    label="Roll Number"
                    icon={<Hash className="h-4 w-4" />}
                    required>
                    <Select
                      name="roll"
                      value={formData.roll}
                      onChange={handleChange}>
                      <option value="">Select Roll</option>

                      {selectedStudent?.roll !== undefined && (
                        <option value={selectedStudent.roll}>
                          {selectedStudent.roll}
                        </option>
                      )}
                    </Select>
                  </FormField>
                  <FormField
                    label="Fee Type"
                    icon={<ClipboardList className="h-4 w-4" />}
                    required>
                    <Select
                      name="feesType"
                      value={formData.feesType}
                      onChange={handleChange}>
                      <option value="">Select Fee Type</option>
                      <option value="regular">Regular</option>
                      <option value="exam">Exam</option>
                    </Select>
                  </FormField>

                  {/* Fee */}
                  <FormField
                    label="Fee Category"
                    icon={<BadgeDollarSign className="h-4 w-4" />}
                    required>
                    <Select
                      name="fees"
                      value={formData.fees}
                      onChange={handleChange}>
                      <option value="">Select Fee</option>
                      <option value="Monthly">Monthly Fees</option>
                      <option value="Others">Others Fees</option>
                      <option value="Mid-Term">Mid-Term Fees</option>
                      <option value="Final">Final Fees</option>
                    </Select>
                  </FormField>

                  {/* Date */}
                  <FormField
                    label="Entry Date"
                    icon={<CalendarDays className="h-4 w-4" />}
                    required>
                    <input
                      type="date"
                      name="entryDate"
                      value={formData.entryDate}
                      onChange={handleChange}
                      className="h-10 w-full border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10"
                    />
                  </FormField>

                  {/* Amount */}
                  <FormField
                    label="Amount"
                    icon={<BadgeDollarSign className="h-4 w-4" />}
                    required>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
                        $
                      </span>

                      <input
                        type="number"
                        name="amount"
                        min="0"
                        value={formData.amount}
                        onChange={handleChange}
                        placeholder="Enter amount"
                        className="h-10 w-full border border-slate-300 bg-white pl-8 pr-3 text-sm font-medium text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10"
                      />
                    </div>
                  </FormField>
                  
                  {/* Comment */}
                  <div className="sm:col-span-2 lg:col-span-2">
                    <FormField
                      label="Comment"
                      icon={<MessageSquare className="h-4 w-4" />}
                      required>
                      <input
                        name="comment"
                        value={formData.comment}
                        onChange={handleChange}
                        placeholder="Write a short comment..."
                        className="h-10 w-full border border-slate-300 bg-white pl-8 pr-3 text-sm font-medium text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10"
                      />
                    </FormField>
                  </div>
                </div>
              </div>


              {/* Payment Preview */}
              <div className="mb-7 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-sky-600 shadow-sm">
                      <Wallet className="h-5 w-5" />
                    </div>

                    <div>
                      <p className="text-xs font-medium text-slate-500">
                        Payment Amount
                      </p>

                      <p className="text-sm font-semibold text-slate-700">
                        {formData.fees || "No fee selected"}
                      </p>
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <p className="text-xs font-medium text-slate-500">Total</p>

                    <p className="text-2xl font-bold text-sky-600">
                      ৳ {Number(formData.amount || 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={isSubmitting}
                  className="h-11 rounded-xl border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50">
                  Reset
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 px-7 text-sm font-bold text-white shadow-md shadow-sky-500/20 transition hover:from-sky-700 hover:to-blue-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      Submit Payment
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

/* ---------------------------------------------------------
   Reusable Form Field
--------------------------------------------------------- */

interface FormFieldProps {
  label: string;
  icon?: React.ReactNode;
  required?: boolean;
  children: React.ReactNode;
}

const FormField = ({ label, icon, required, children }: FormFieldProps) => {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
        <span className="text-slate-400">{icon}</span>

        {label}

        {required && <span className="text-red-500">*</span>}
      </label>

      {children}
    </div>
  );
};

/* ---------------------------------------------------------
   Reusable Select
--------------------------------------------------------- */

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children: React.ReactNode;
}

const Select = ({ children, ...props }: SelectProps) => {
  return (
    <div className="relative">
      <select
        {...props}
        className="h-10 w-full appearance-none border border-slate-300 bg-white px-3 pr-10 text-sm text-slate-700 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400">
        {children}
      </select>

      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
    </div>
  );
};

export default EntryFeesPage;
