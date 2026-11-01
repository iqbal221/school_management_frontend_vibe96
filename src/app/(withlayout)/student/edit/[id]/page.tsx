"use client";

import Image from "next/image";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  useStudentQuery,
  useUpdateStudentMutation,
} from "@/redux/api/studentApi";
import { ArrowLeft, Camera, ImagePlus, X } from "lucide-react";

type IDProps = {
  params: {
    id: string;
  };
};

type FormSelectData = {
  admission: string;
  gender: string;
  religious: string;
  dateOfBirth: string;
  bloodGroup: string;
};

const UpdateStudentPage = ({ params }: IDProps) => {
  const { id } = params;
  const router = useRouter();

  const [formSelectData, setFormSelectData] = useState<FormSelectData>({
    admission: "",
    gender: "",
    religious: "",
    dateOfBirth: "",
    bloodGroup: "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { data, isLoading } = useStudentQuery(id);

  const [updateStudent, { isLoading: isUpdating }] = useUpdateStudentMutation();

  /* =========================================================
     POPULATE FORM
  ========================================================= */

  useEffect(() => {
    if (!data) return;

    console.log("Student data:", data);
    console.log("Student image:", data.image);

    setFormSelectData({
      admission: data.admission || "",
      gender: data.gender || "",
      religious: data.religious || "",
      dateOfBirth: data.dateOfBirth ? data.dateOfBirth.substring(0, 10) : "",
      bloodGroup: data.bloodGroup || "",
    });

    // Existing profile image
    const existingImage = Array.isArray(data.image)
      ? data.image[0]
      : data.image;

    if (existingImage) {
      setImagePreview(existingImage);
    } else {
      setImagePreview(null);
    }
  }, [data]);

  /* =========================================================
     INPUT CHANGE
  ========================================================= */

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setFormSelectData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* =========================================================
     IMAGE CHANGE
  ========================================================= */

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
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

    // Remove previous object URL if current preview is a blob
    if (imagePreview?.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    const objectUrl = URL.createObjectURL(file);

    setSelectedFile(file);
    setImagePreview(objectUrl);
  };

  /* =========================================================
     REMOVE SELECTED IMAGE
  ========================================================= */

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);

    /*
     * Restore existing image
     */
    if (data?.image) {
      const existingImage = Array.isArray(data.image)
        ? data.image[0]
        : data.image;

      setImagePreview(existingImage || null);
    } else {
      setImagePreview(null);
    }
  };

  console.log(selectedFile)

  /* =========================================================
     UPDATE
  ========================================================= */

  const handleUpdate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;

    const getValue = (name: string) =>
      (form.elements.namedItem(name) as HTMLInputElement)?.value.trim();

    const name = getValue("name");
    const roll = getValue("roll");
    const fatherName = getValue("fatherName");
    const motherName = getValue("motherName");
    const email = getValue("email");
    const contact = getValue("contact");
    const emergencyContactNo = getValue("emergencyContactNo");
    const address = getValue("address");

    /* =======================================================
       VALIDATION
    ======================================================= */

    if (!name) {
      return toast.error("Please enter student&rsquo;s name");
    }

    if (!formSelectData.admission) {
      return toast.error("Please select class");
    }

    if (!roll) {
      return toast.error("Please enter roll number");
    }

    if (!fatherName) {
      return toast.error("Please enter father&rsquo;s name");
    }

    if (!motherName) {
      return toast.error("Please enter mother&rsquo;s name");
    }

    if (!formSelectData.gender) {
      return toast.error("Please select gender");
    }

    if (!email) {
      return toast.error("Please enter email");
    }

    if (!contact) {
      return toast.error("Please enter contact number");
    }

    if (!emergencyContactNo) {
      return toast.error("Please enter emergency contact number");
    }

    if (!formSelectData.bloodGroup) {
      return toast.error("Please select blood group");
    }

    if (!formSelectData.religious) {
      return toast.error("Please select religion");
    }

    if (!formSelectData.dateOfBirth) {
      return toast.error("Please select date of birth");
    }

    if (!address) {
      return toast.error("Please enter address");
    }

    /* =======================================================
       FORM DATA
    ======================================================= */

    const studentData = {
      name,
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

    const formData = new FormData();

    // JSON data
    formData.append("data", JSON.stringify(studentData));

    // IMPORTANT
    // For Image
    if (selectedFile) {
      formData.append("file", selectedFile);

      console.log("Uploading file:", {
        name: selectedFile.name,
        type: selectedFile.type,
        size: selectedFile.size,
      });
      console.log(selectedFile.name);
    }

    /* =======================================================
       API
    ======================================================= */

    try {
      const res = await updateStudent({
        id,
        data: formData,
      }).unwrap();

      if (res?.id) {
        toast.success("Student updated successfully");

        router.push("/student/studentInformation");
      }
    } catch (error) {
      console.error("Update student error:", error);

      toast.error("Failed to update student");
    }
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 px-2 py-5 sm:px-3 lg:px-4">
        <div className="mx-auto max-w-6xl">
          <div className="flex min-h-[500px] items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-sky-500" />

              <p className="text-sm font-medium text-slate-500">
                Loading student information...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================
     UI
  ========================================================= */

  return (
    <div className="min-h-screen bg-slate-50 px-2 py-5 sm:px-3 lg:px-4">
      <div className="mx-auto max-w-6xl">
        <form
          onSubmit={handleUpdate}
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* ===================================================
              HEADER
          =================================================== */}
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
                    Update Student
                  </h1>

                  <p className="mt-1 text-sm text-slate-500">
                    Update student&rsquo;s information and profile photo.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => router.push("/student/studentList")}
                className="hidden items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 sm:inline-flex">
                <ArrowLeft className="h-4 w-4" />
                Back to Students
              </button>
            </div>
          </div>
          {/* ===================================================
              BODY
          =================================================== */}

          <div className="p-5 sm:p-7">
            {/* =================================================
                PROFILE IMAGE
            ================================================= */}

            <div className="mb-8">
              <div className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:flex-row sm:items-center">
                {/* IMAGE PREVIEW */}

                <div className="relative shrink-0">
                  <div className="relative h-28 w-28 overflow-hidden rounded-2xl border-4 border-white bg-slate-100 shadow-md sm:h-32 sm:w-32">
                    {imagePreview ? (
                      <Image
                        src={imagePreview}
                        alt="Student profile"
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-slate-400">
                        <Camera className="h-10 w-10" />
                      </div>
                    )}
                  </div>

                  {selectedFile && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-white shadow-md transition hover:bg-red-600">
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                {/* UPLOAD AREA */}
                <div className="flex-1">
                  
                  <label
                    htmlFor="profileImage"
                    className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-sky-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-600">
                    <ImagePlus className="h-4 w-4" />
                    Choose New Image
                  </label>
                  <input
                    id="profileImage"
                    name="profileImage"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <p className="mt-2 text-[11px] text-slate-400">
                    JPG, PNG or WebP • Maximum 5MB
                  </p>

                  {selectedFile && (
                    <p className="mt-2 text-xs font-semibold text-sky-600">
                      New image selected: {selectedFile.name}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* =================================================
                STUDENT INFORMATION
            ================================================= */}

            <div className="mb-6 flex items-center gap-3">
              <div className="h-1 w-8 rounded-full bg-sky-500" />

              <h2 className="text-lg font-bold text-slate-800">
                Student Information
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2 lg:grid-cols-4">
              <InputField
                label="Student Name"
                name="name"
                placeholder="Enter student&rsquo;s full name"
                defaultValue={data?.name}
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
                defaultValue={data?.roll}
                required
              />

              <InputField
                label="Father&rsquo;s Name"
                name="fatherName"
                placeholder="Enter father&rsquo;s name"
                defaultValue={data?.fatherName}
                required
              />

              <InputField
                label="Mother&rsquo;s Name"
                name="motherName"
                placeholder="Enter mother&rsquo;s name"
                defaultValue={data?.motherName}
                required
              />

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
                label="Email Address"
                name="email"
                type="email"
                placeholder="student@example.com"
                defaultValue={data?.email}
                required
              />

              <InputField
                label="Contact Number"
                name="contact"
                type="tel"
                placeholder="01XXXXXXXXX"
                defaultValue={data?.contact}
                required
              />

              <InputField
                label="Emergency Contact"
                name="emergencyContactNo"
                type="tel"
                placeholder="Emergency contact number"
                defaultValue={data?.emergencyContactNo}
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
                label="Date of Birth"
                name="dateOfBirth"
                type="date"
                value={formSelectData.dateOfBirth}
                onChange={handleChange}
                required
              />

              <div className="md:col-span-2 lg:col-span-3">
                <InputField
                  label="Address"
                  name="address"
                  placeholder="Enter student&rsquo;s full address"
                  defaultValue={data?.address}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>
          {/* ===================================================
              FOOTER
          =================================================== */}
          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 px-5 py-5 sm:flex-row sm:justify-end sm:px-7">
            <button
              type="button"
              onClick={() => router.back()}
              disabled={isUpdating}
              className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-300 bg-white px-7 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50">
              Cancel
            </button>

            <button
              type="submit"
              disabled={isUpdating}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-sky-500 px-8 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-60">
              {isUpdating ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Updating...
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
                  Update Student
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
  defaultValue?: string | number;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

const InputField = ({
  label,
  name,
  type = "text",
  placeholder,
  required = false,
  defaultValue,
  value,
  onChange,
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
        defaultValue={defaultValue}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="h-10 w-full  border border-slate-300 bg-white px-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
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

export default UpdateStudentPage;
