"use client";

import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAddStudentWithFormDataMutation } from "@/redux/api/studentApi";

const AddNewStudentPage = () => {
  const router = useRouter();

  const [formSelectData, setFormSelectData] = useState({
    admission: "",
    gender: "",
    religious: "",
    dateOfBirth: "",
    bloodGroup: "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [addStudentWithFormData, { isLoading }] =
    useAddStudentWithFormDataMutation();

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
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
    const studentIdNumber = getValue("studentIdNumber");
    const roll = getValue("roll");
    const fatherName = getValue("fatherName");
    const motherName = getValue("motherName");
    const email = getValue("email");
    const contact = getValue("contact");
    const emergencyContactNo = getValue("emergencyContactNo");
    const address = getValue("address");

    if (!name) return toast.error("Please enter student&rsquo;s name");
    if (!studentIdNumber) return toast.error("Please enter student ID");
    if (!formSelectData.admission) return toast.error("Please select class");
    if (!roll) return toast.error("Please enter roll number");
    if (!fatherName) return toast.error("Please enter father&rsquo;s name");
    if (!motherName) return toast.error("Please enter mother&rsquo;s name");
    if (!formSelectData.gender) return toast.error("Please select gender");
    if (!email) return toast.error("Please enter email");
    if (!contact) return toast.error("Please enter contact number");
    if (!emergencyContactNo)
      return toast.error("Please enter emergency contact number");
    if (!formSelectData.bloodGroup)
      return toast.error("Please select blood group");
    if (!formSelectData.religious) return toast.error("Please select religion");
    if (!formSelectData.dateOfBirth)
      return toast.error("Please select date of birth");
    if (!address) return toast.error("Please enter address");
    if (!selectedFile) return toast.error("Please select student image");

    const studentData = {
      name,
      studentIdNumber,
      roll,
      fatherName,
      motherName,
      email,
      contact,
      emergencyContactNo,
      address,
      admission: formSelectData.admission,
      gender: formSelectData.gender,
      religious: formSelectData.religious,
      bloodGroup: formSelectData.bloodGroup,
      dateOfBirth: formSelectData.dateOfBirth,
    };

    console.log("Student Data:", studentData);

    const formData = new FormData();

    console.log(selectedFile)

    formData.append("file", selectedFile);
    formData.append("data", JSON.stringify(studentData));

    try {
      const res = await addStudentWithFormData(formData).unwrap();

      if (res?.id) {
        toast.success("Student added successfully");
        router.push("/student/studentInformation");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to add student");
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
                      d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.38 9.38 0 0 0 2.625-.372M15 19.128v-.003c0-1.123.893-2.035 2.006-2.035h.238c1.113 0 2.006.912 2.006 2.035v.003m-4.25 0a9.38 9.38 0 0 1-3.75 0m3.75 0v-.003c0-1.123-.893-2.035-2.006-2.035h-.238c-1.113 0-2.006.912-2.006 2.035v.003m-3.75 0a9.38 9.38 0 0 1-2.625-.372m2.625.372v-.003c0-1.123-.893-2.035-2.006-2.035H6.51c-1.113 0-2.006.912-2.006 2.035v.003m3.75 0a9.38 9.38 0 0 0 3.75 0m0 0a9.38 9.38 0 0 0 3.75 0M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
                    />
                  </svg>
                </div>

                <div>
                  <h1 className="text-xl font-bold text-slate-800 sm:text-2xl">
                    Add New Student
                  </h1>

                  <p className="mt-1 text-sm text-slate-500">
                    Enter complete student information below.
                  </p>
                </div>
              </div>

              <div className="hidden rounded-full bg-sky-100 px-3 py-1.5 text-xs font-semibold text-sky-700 sm:block">
                Student Registration
              </div>
            </div>
          </div>

          {/* ================= BODY ================= */}
          <div className="p-5 sm:p-7">
            <div className="mb-6 flex items-center gap-3">
              <div className="h-1 w-8 rounded-full bg-sky-500" />

              <h2 className="text-lg font-bold text-slate-800">
                Student Information
              </h2>
            </div>

            {/* =====================================================
                3 COLUMN FORM
                Desktop: 3 columns
                Tablet: 2 columns
                Mobile: 1 column
            ====================================================== */}
            <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
              {/* ROW 1 */}
              <InputField
                label="Student Name"
                name="name"
                placeholder="Enter student&rsquo;s full name"
                required
              />
              <InputField
                label="Student ID"
                name="studentIdNumber"
                placeholder="Enter student ID"
                required
              />

              <SelectField
                label="Class"
                name="admission"
                value={formSelectData.admission}
                onChange={handleChange}
                required>
                <option value="">Select class</option>
                <option value="One">Class One</option>
                <option value="Two">Class Two</option>
                <option value="Three">Class Three</option>
                <option value="Four">Class Four</option>
                <option value="Five">Class Five</option>
                <option value="Six">Class Six</option>
                <option value="Seven">Class Seven</option>
                <option value="Eight">Class Eight</option>
                <option value="Nine">Class Nine</option>
                <option value="Ten">Class Ten</option>
              </SelectField>

              <InputField
                label="Roll Number"
                name="roll"
                placeholder="Enter roll number"
                required
              />

              {/* ROW 2 */}
              <SelectField
                label="Gender"
                name="gender"
                value={formSelectData.gender}
                onChange={handleChange}
                required>
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </SelectField>

              <InputField
                label="Date of Birth"
                name="dateOfBirth"
                type="date"
                value={formSelectData.dateOfBirth}
                onChange={handleChange}
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

              {/* ROW 3 */}
              <SelectField
                label="Religion"
                name="religious"
                value={formSelectData.religious}
                onChange={handleChange}
                required>
                <option value="">Select religion</option>
                <option value="islam">Islam</option>
                <option value="hindu">Hindu</option>
                <option value="buddist">Buddhist</option>
              </SelectField>

              <InputField
                label="Father&rsquo;s Name"
                name="fatherName"
                placeholder="Enter father&rsquo;s name"
                required
              />

              <InputField
                label="Mother&rsquo;s Name"
                name="motherName"
                placeholder="Enter mother&rsquo;s name"
                required
              />

              {/* ROW 4 */}
              <InputField
                label="Email Address"
                name="email"
                type="email"
                placeholder="student@example.com"
                required
              />

              <InputField
                label="Contact Number"
                name="contact"
                type="tel"
                placeholder="01XXXXXXXXX"
                required
              />

              <InputField
                label="Emergency Contact"
                name="emergencyContactNo"
                type="tel"
                placeholder="Emergency contact number"
                required
              />

              {/* ADDRESS */}
              <div className="sm:col-span-2 lg:col-span-3">
                <InputField
                  label="Address"
                  name="address"
                  placeholder="Enter student&rsquo;s full address"
                  required
                />
              </div>
            </div>

            {/* ================= PHOTO ================= */}
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
                      d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.659 2.659m-18.75 3.75h16.5a2.25 2.25 0 0 0 2.25-2.25V6.75a2.25 2.25 0 0 0-2.25-2.25H4.5A2.25 2.25 0 0 0 2.25 6.75v11.25A2.25 2.25 0 0 0 4.5 20.25Zm10.5-11.25h.008v.008H15V9Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                    />
                  </svg>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-800">
                    Student Photo
                  </h3>

                  <p className="text-xs text-slate-500">
                    Upload a clear profile image.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-[140px_1fr]">
                <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Student preview"
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

                <div>
                  <label
                    htmlFor="student-image"
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
                        d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5h10.5A2.25 2.25 0 0 0 19.5 17.25v-10.5A2.25 2.25 0 0 0 17.25 4.5H6.75A2.25 2.25 0 0 0 4.5 6.75v10.5a2.25 2.25 0 0 0 2.25 2.25Z"
                      />
                    </svg>

                    <span className="text-sm font-semibold text-slate-700">
                      Click to upload student photo
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
                    id="student-image"
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
                  Add Student
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

interface InputFieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

const InputField = ({
  label,
  name,
  type = "text",
  placeholder,
  required = false,
  value,
  onChange,
}: InputFieldProps) => {
  return (
    <div className="min-w-0">
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
        value={value}
        onChange={onChange}
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

interface SelectFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode;
  required?: boolean;
}

const SelectField = ({
  label,
  name,
  value,
  onChange,
  children,
  required = false,
}: SelectFieldProps) => {
  return (
    <div className="min-w-0">
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

export default AddNewStudentPage;
