"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useAddOfficialWithFormDataMutation } from "@/redux/api/officialApi";

interface InputFieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}

interface SelectFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode;
  required?: boolean;
}

const AddNewOfficialPage = () => {
  const router = useRouter();

  const [formSelectData, setFormSelectData] = useState({
    bloodGroup: "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [addOfficialWithFormData, { isLoading }] =
    useAddOfficialWithFormDataMutation();

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormSelectData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;

    const getValue = (name: string) =>
      (form.elements.namedItem(name) as HTMLInputElement)?.value.trim();

    const name = getValue("name");
    const designation = getValue("designation");
    const email = getValue("email");
    const contact = getValue("contact");
    const address = getValue("address");

    if (!name) return toast.error("Please enter official&rsquo;s name");

    if (!designation) return toast.error("Please enter designation");

    if (!email) return toast.error("Please enter email");

    if (!contact) return toast.error("Please enter contact number");

    if (!formSelectData.bloodGroup)
      return toast.error("Please select blood group");

    if (!address) return toast.error("Please enter address");

    if (!selectedFile) return toast.error("Please select official image");

    const officialData = {
      name,
      designation,
      email,
      contact,
      address,
      bloodGroup: formSelectData.bloodGroup,
    };

    const formData = new FormData();

    formData.append("file", selectedFile);
    formData.append("data", JSON.stringify(officialData));

    try {
      const res = await addOfficialWithFormData(formData).unwrap();

      if (res?.id) {
        toast.success("Official added successfully");
        router.push("/instituteInfo/officialInfo");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to add official");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-2 py-5 sm:px-3 lg:px-4">
      <div className="mx-auto max-w-6xl">
        <form
          onSubmit={handleSubmit}
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* ================= HEADER ================= */}
          <div className="border-b border-slate-200 bg-gradient-to-r from-sky-50 via-white to-cyan-50 px-5 py-5 sm:px-7">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {/* Icon */}
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sky-500 text-white shadow-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.8}
                    stroke="currentColor"
                    className="h-6 w-6">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                    />
                  </svg>
                </div>

                <div>
                  <h1 className="text-xl font-bold text-slate-800 sm:text-2xl">
                    Add New Official
                  </h1>

                  <p className="mt-1 text-sm text-slate-500">
                    Enter complete official information below.
                  </p>
                </div>
              </div>

              <div className="hidden rounded-full bg-sky-100 px-3 py-1.5 text-xs font-semibold text-sky-700 sm:block">
                Official Registration
              </div>
            </div>
          </div>

          {/* ================= BODY ================= */}
          <div className="p-5 sm:p-7">
            {/* Section Title */}
            <div className="mb-6 flex items-center gap-3">
              <div className="h-1 w-8 rounded-full bg-sky-500" />

              <h2 className="text-lg font-bold text-slate-800">
                Official Information
              </h2>
            </div>

            {/* ================= FORM GRID ================= */}
            <div className="grid grid-cols-1 gap-x-8 gap-y-5 md:grid-cols-4">
              <InputField
                label="Official Name"
                name="name"
                placeholder="Enter official&rsquo;s full name"
                required
              />

              <InputField
                label="Designation"
                name="designation"
                placeholder="e.g. Headmaster, Chairman"
                required
              />

              <InputField
                label="Email Address"
                name="email"
                type="email"
                placeholder="official@example.com"
                required
              />

              <InputField
                label="Contact Number"
                name="contact"
                type="tel"
                placeholder="01XXXXXXXXX"
                required
              />

              <SelectField
                label="Blood Group"
                name="bloodGroup"
                value={formSelectData.bloodGroup}
                onChange={handleChange}
                required>
                <option value="">Select blood group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </SelectField>

              {/* Address - Full Width */}
              <div className="md:col-span-2">
                <InputField
                  label="Address"
                  name="address"
                  placeholder="Enter official&rsquo;s full address"
                  required
                />
              </div>
            </div>

            {/* ================= PHOTO UPLOAD ================= */}
            <div className="mt-8 border-t border-slate-200 pt-7">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.7}
                    stroke="currentColor"
                    className="h-5 w-5">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.659 2.659m-18.75 3.75h16.5a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 17.25 4.5H4.5A2.25 2.25 0 0 0 2.25 6.75v11.25A2.25 2.25 0 0 0 4.5 20.25Zm10.5-11.25h.008v.008H15V9Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                    />
                  </svg>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-800">
                    Official Photo
                  </h3>

                  <p className="text-xs text-slate-500">
                    Upload a clear profile image.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-[140px_1fr]">
                {/* Preview */}
                <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Official preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-10 w-10 text-slate-300">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                      />
                    </svg>
                  )}
                </div>

                {/* Upload Area */}
                <div>
                  <label
                    htmlFor="official-image"
                    className="flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 px-5 py-5 text-center transition hover:border-sky-400 hover:bg-sky-50">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.6}
                      stroke="currentColor"
                      className="mb-2 h-7 w-7 text-sky-500">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5h10.5A2.25 2.25 0 0 0 19.5 17.25v-10.5A2.25 2.25 0 0 0 17.25 4.5H6.75A2.25 2.25 0 0 0 4.5 6.75v10.5A2.25 2.25 0 0 0 6.75 19.5Z"
                      />
                    </svg>

                    <span className="text-sm font-semibold text-slate-700">
                      Click to upload official photo
                    </span>

                    <span className="mt-1 text-xs text-slate-400">
                      PNG, JPG or JPEG • Maximum 5MB
                    </span>

                    {selectedFile && (
                      <span className="mt-2 max-w-full truncate text-xs font-semibold text-sky-600">
                        {selectedFile.name}
                      </span>
                    )}
                  </label>

                  <input
                    id="official-image"
                    type="file"
                    name="file"
                    accept="image/png,image/jpeg,image/jpg"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ================= FOOTER ================= */}
          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 px-5 py-5 sm:flex-row sm:justify-end sm:px-7">
            <button
              type="button"
              onClick={() => router.back()}
              disabled={isLoading}
              className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-300 bg-white px-7 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50">
              Cancel
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-sky-500 px-8 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-600 hover:shadow-md active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60">
              {isLoading ? (
                <>
                  <svg
                    className="h-4 w-4 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />

                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4Z"
                    />
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="h-4 w-4">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m4.5 12.75 6 6 9-13.5"
                    />
                  </svg>
                  Add Official
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
   INPUT FIELD
========================================================= */

const InputField = ({
  label,
  name,
  type = "text",
  placeholder,
  required = false,
}: InputFieldProps) => {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-semibold text-slate-700">
        {label}

        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      <input
        id={name}
        type={type}
        name={name}
        placeholder={placeholder}
        required={required}
        className="h-10 w-full border border-slate-300 bg-white px-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
      />
    </div>
  );
};

/* =========================================================
   SELECT FIELD
========================================================= */

const SelectField = ({
  label,
  name,
  value,
  onChange,
  children,
  required = false,
}: SelectFieldProps) => {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-semibold text-slate-700">
        {label}

        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      <div className="relative">
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className="h-10 w-full appearance-none border border-slate-300 bg-white px-4 pr-10 text-sm text-slate-700 outline-none transition hover:border-slate-300 focus:border-sky-400 focus:ring-4 focus:ring-sky-100">
          {children}
        </select>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.8}
          stroke="currentColor"
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400">
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

export default AddNewOfficialPage;
