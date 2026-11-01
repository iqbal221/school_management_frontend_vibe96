"use client";

import { useRouter } from "next/navigation";
import React, {
  ChangeEvent,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { toast } from "react-toastify";
import {
  UserPlus,
  User,
  BriefcaseBusiness,
  ShieldCheck,
  Mail,
  Phone,
  PhoneCall,
  MapPin,
  CalendarDays,
  VenusAndMars,
  Droplets,
  Church,
  ImagePlus,
  Upload,
  Eye,
  EyeOff,
  ArrowLeft,
  Save,
  X,
  Loader2,
  CheckCircle2,
  LockKeyhole,
  Sparkles,
} from "lucide-react";

import { useAddUserWithFormDataMutation } from "@/redux/api/userApi";

interface FormSelectData {
  gender: string;
  religious: string;
  dateOfBirth: string;
  bloodGroup: string;
}

const AddNewAdminPage = () => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [formSelectData, setFormSelectData] = useState<FormSelectData>({
    gender: "",
    religious: "",
    dateOfBirth: "",
    bloodGroup: "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const [addUserWithFormData, { isLoading }] = useAddUserWithFormDataMutation();

  // =========================================================
  // SELECT CHANGE
  // =========================================================

  const handleSelectChange = (
    e: ChangeEvent<HTMLSelectElement | HTMLInputElement>,
  ) => {
    const { name, value } = e.target;

    setFormSelectData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================================
  // OPEN FILE SELECTOR
  // =========================================================

  const handleOpenFileSelector = () => {
    fileInputRef.current?.click();
  };

  // =========================================================
  // FILE CHANGE
  // =========================================================

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB.");
      e.target.value = "";
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    const newPreviewUrl = URL.createObjectURL(file);

    setSelectedFile(file);
    setPreviewUrl(newPreviewUrl);
  };

  // =========================================================
  // REMOVE IMAGE
  // =========================================================

  const handleRemoveImage = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedFile(null);
    setPreviewUrl(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // =========================================================
  // CLEANUP IMAGE PREVIEW
  // =========================================================

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // =========================================================
  // SUBMIT
  // =========================================================

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;

    const getInputValue = (name: string) =>
      (
        form.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement
      )?.value.trim();

    const name = getInputValue("name");
    const userId = getInputValue("userId");
    const role = getInputValue("role");
    const password = getInputValue("password");
    const designation = getInputValue("designation");
    const email = getInputValue("email");
    const contactNo = getInputValue("contactNo");
    const emergencyContactNo = getInputValue("emergencyContactNo");
    const address = getInputValue("address");

    // =======================================================
    // VALIDATION
    // =======================================================

    if (!name) {
      toast.error("Please enter full name.");
      return;
    }

    if (!designation) {
      toast.error("Please enter designation.");
      return;
    }

    if (!userId) {
      toast.error("Please enter user ID.");
      return;
    }

    if (!role) {
      toast.error("Please enter role.");
      return;
    }

    if (!password) {
      toast.error("Please enter password.");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must contain at least 6 characters.");
      return;
    }

    if (!email) {
      toast.error("Please enter email.");
      return;
    }

    if (!contactNo) {
      toast.error("Please enter contact number.");
      return;
    }

    if (!emergencyContactNo) {
      toast.error("Please enter emergency contact number.");
      return;
    }

    if (!formSelectData.gender) {
      toast.error("Please select gender.");
      return;
    }

    if (!formSelectData.religious) {
      toast.error("Please select religion.");
      return;
    }

    if (!formSelectData.bloodGroup) {
      toast.error("Please select blood group.");
      return;
    }

    if (!formSelectData.dateOfBirth) {
      toast.error("Please select date of birth.");
      return;
    }

    if (!address) {
      toast.error("Please enter address.");
      return;
    }

    if (!selectedFile) {
      toast.error("Please select an admin image.");
      return;
    }

    // =======================================================
    // ADMIN DATA
    // =======================================================

    const adminObject = {
      name,
      userId,
      role,
      password,
      designation,
      email,
      contactNo,
      emergencyContactNo,
      address,
      gender: formSelectData.gender,
      religious: formSelectData.religious,
      dateOfBirth: formSelectData.dateOfBirth,
      bloodGroup: formSelectData.bloodGroup,
    };

    const uploadData = new FormData();

    uploadData.append("file", selectedFile);
    uploadData.append("data", JSON.stringify(adminObject));

    // =======================================================
    // API REQUEST
    // =======================================================

    try {
      const res = await addUserWithFormData(uploadData).unwrap();

      if (res?.id) {
        toast.success("Admin created successfully!");
        router.push("/admin/adminInformation");
      } else {
        toast.error("Admin creation failed.");
      }
    } catch (error: any) {
      console.error("Admin creation error:", error);

      toast.error(
        error?.data?.message ||
          error?.message ||
          "Admin creation failed. Please try again.",
      );
    }
  };

  // =========================================================
  // STYLES
  // =========================================================

  const inputClass =
    "w-full border border-slate-300 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 outline-none transition-all duration-200 placeholder:text-slate-400 hover:border-slate-300 hover:bg-white focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10";

  const selectClass =
    "w-full appearance-none  border border-slate-300 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 outline-none transition-all duration-200 hover:border-slate-300 hover:bg-white focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10";

  const sectionClass =
    "overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm";

  return (
    <main className="min-h-screen bg-slate-50 px-2 py-5 sm:px-5 lg:px-6">
      <div className="mx-auto max-w-7xl">
        {/* =====================================================
            TOP HEADER
        ====================================================== */}

        <div className="mb-5 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="px-5 py-6 sm:px-8 sm:py-7 lg:px-10">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-600">
                  <UserPlus size={20} />
                </div>

                <div>
                  <div className="mb-1 flex items-center gap-2">
                    <Sparkles size={14} className="text-blue-500" />

                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                      Administration
                    </span>
                  </div>

                  <h1 className="text-xl font-bold tracking-tight text-slate-800 sm:text-2xl">
                    Add New Admin
                  </h1>

                 
                  
                </div>
              </div>

              <button
                type="button"
                onClick={() => router.back()}
                disabled={isLoading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition-all hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto">
                <ArrowLeft size={17} />
                Back
              </button>
            </div>
          </div>
        </div>

        {/* =====================================================
            FORM
        ====================================================== */}

        <form onSubmit={handleSubmit}>
          <div className="space-y-5">
            {/* =================================================
                ACCOUNT INFORMATION
            ================================================== */}

            <section className={sectionClass}>
              <div className="flex items-center gap-4 border-b border-slate-100 px-5 py-5 sm:px-7">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-white shadow-lg shadow-violet-200">
                  <LockKeyhole size={20} />
                </div>

                <div>
                  <h2 className="text-base font-bold text-slate-800 sm:text-lg">
                    Account Information
                  </h2>

                  <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
                    Configure login credentials and administrator access.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 sm:p-7 lg:grid-cols-3">
                {/* USER ID */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    User ID <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="text"
                    name="userId"
                    placeholder="Enter unique user ID"
                    className={inputClass}
                  />
                </div>

                {/* ROLE */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Role <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="text"
                    name="role"
                    placeholder="e.g. admin"
                    className={inputClass}
                  />
                </div>

                {/* PASSWORD */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Password <span className="text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Enter secure password"
                      className={`${inputClass} pr-12`}
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
                    <ShieldCheck size={13} />
                    Minimum 6 characters
                  </div>
                </div>
              </div>
            </section>

            {/* =================================================
                MAIN PROFILE CARD
                PERSONAL + CONTACT + IMAGE + ACTIONS
            ================================================== */}

            <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              {/* =================================================
                  PERSONAL & CONTACT HEADER
              ================================================== */}

              <div className="flex items-center gap-4 border-b border-slate-100 px-5 py-5 sm:px-7">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-200">
                  <User size={20} />
                </div>

                <div>
                  <h2 className="text-base font-bold text-slate-800 sm:text-lg">
                    Personal & Contact Information
                  </h2>

                  <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
                    Enter personal details, contact information and address.
                  </p>
                </div>
              </div>

              {/* =================================================
                  PERSONAL INFORMATION
              ================================================== */}

              <div className="p-5 sm:p-7">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {/* FULL NAME */}

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Full Name <span className="text-red-500">*</span>
                    </label>

                    <div className="relative">
                      <User
                        size={17}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        type="text"
                        name="name"
                        placeholder="Enter full name"
                        className={`${inputClass} pl-10`}
                      />
                    </div>
                  </div>

                  {/* DESIGNATION */}

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Designation <span className="text-red-500">*</span>
                    </label>

                    <div className="relative">
                      <BriefcaseBusiness
                        size={17}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        type="text"
                        name="designation"
                        placeholder="e.g. Head Teacher"
                        className={`${inputClass} pl-10`}
                      />
                    </div>
                  </div>

                  {/* EMAIL */}

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Email <span className="text-red-500">*</span>
                    </label>

                    <div className="relative">
                      <Mail
                        size={17}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        type="email"
                        name="email"
                        placeholder="admin@example.com"
                        className={`${inputClass} pl-10`}
                      />
                    </div>
                  </div>

                  {/* CONTACT */}

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Contact Number <span className="text-red-500">*</span>
                    </label>

                    <div className="relative">
                      <Phone
                        size={17}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        type="tel"
                        name="contactNo"
                        placeholder="Enter contact number"
                        className={`${inputClass} pl-10`}
                      />
                    </div>
                  </div>

                  {/* EMERGENCY */}

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Emergency Contact <span className="text-red-500">*</span>
                    </label>

                    <div className="relative">
                      <PhoneCall
                        size={17}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        type="tel"
                        name="emergencyContactNo"
                        placeholder="Emergency contact number"
                        className={`${inputClass} pl-10`}
                      />
                    </div>
                  </div>

                  {/* GENDER */}

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Gender <span className="text-red-500">*</span>
                    </label>

                    <div className="relative">
                      <VenusAndMars
                        size={17}
                        className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-slate-400"
                      />

                      <select
                        name="gender"
                        value={formSelectData.gender}
                        onChange={handleSelectChange}
                        className={`${selectClass} pl-10`}>
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </div>
                  </div>

                  {/* BLOOD GROUP */}

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Blood Group <span className="text-red-500">*</span>
                    </label>

                    <div className="relative">
                      <Droplets
                        size={17}
                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <select
                        name="bloodGroup"
                        value={formSelectData.bloodGroup}
                        onChange={handleSelectChange}
                        className={`${selectClass} pl-10`}>
                        <option value="">Select blood group</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </select>
                    </div>
                  </div>

                  {/* RELIGION */}

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Religion <span className="text-red-500">*</span>
                    </label>

                    <div className="relative">
                      <Church
                        size={17}
                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <select
                        name="religious"
                        value={formSelectData.religious}
                        onChange={handleSelectChange}
                        className={`${selectClass} pl-10`}>
                        <option value="">Select religion</option>
                        <option value="islam">Islam</option>
                        <option value="hindu">Hindu</option>
                        <option value="buddist">Buddhist</option>
                      </select>
                    </div>
                  </div>

                  {/* DATE OF BIRTH */}

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Date of Birth <span className="text-red-500">*</span>
                    </label>

                    <div className="relative">
                      <CalendarDays
                        size={17}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formSelectData.dateOfBirth}
                        onChange={handleSelectChange}
                        className={`${inputClass} pl-10`}
                      />
                    </div>
                  </div>

                  {/* ADDRESS */}

                  <div className="sm:col-span-2 lg:col-span-3">
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Address <span className="text-red-500">*</span>
                    </label>

                    <div className="relative">
                      <MapPin
                        size={17}
                        className="absolute left-3.5 top-4 text-slate-400"
                      />

                      <textarea
                        name="address"
                        rows={3}
                        placeholder="Enter complete address"
                        className={`${inputClass} resize-none pl-10`}
                      />
                    </div>
                  </div>
                </div>

                {/* =================================================
                    DIVIDER
                ================================================== */}

                <div className="my-7 flex items-center gap-4">
                  <div className="h-px flex-1 bg-slate-100" />

                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    <ImagePlus size={14} />
                    Profile Image
                  </div>

                  <div className="h-px flex-1 bg-slate-100" />
                </div>

                {/* =================================================
                    PROFILE IMAGE
                ================================================== */}

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[180px_1fr]">
                  {/* PREVIEW */}

                  <div className="flex justify-center lg:block">
                    <div className="relative flex h-40 w-40 items-center justify-center overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 shadow-inner">
                      {previewUrl ? (
                        <>
                          <img
                            src={previewUrl}
                            alt="Admin preview"
                            className="h-full w-full object-cover"
                          />

                          <button
                            type="button"
                            onClick={handleRemoveImage}
                            className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white shadow-lg transition hover:scale-105 hover:bg-red-600"
                            aria-label="Remove image">
                            <X size={15} />
                          </button>
                        </>
                      ) : (
                        <div className="text-center">
                          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
                            <ImagePlus size={27} className="text-slate-300" />
                          </div>

                          <p className="mt-3 text-xs font-medium text-slate-400">
                            Image preview
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* UPLOAD */}

                  <div>
                    <button
                      type="button"
                      onClick={handleOpenFileSelector}
                      className="group flex min-h-[160px] w-full cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50/70 px-6 py-8 text-center transition-all duration-300 hover:border-blue-400 hover:bg-blue-50/60">
                      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 shadow-sm transition duration-300 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white">
                        <Upload size={23} />
                      </div>

                      <p className="text-sm font-bold text-slate-700">
                        {selectedFile
                          ? selectedFile.name
                          : "Click to upload profile image"}
                      </p>

                      <p className="mt-1.5 text-xs text-slate-400">
                        PNG, JPG or JPEG · Maximum 5MB
                      </p>
                    </button>

                    <input
                      ref={fileInputRef}
                      id="admin-image"
                      type="file"
                      name="file"
                      accept="image/png,image/jpeg,image/jpg"
                      onChange={handleFileChange}
                      className="hidden"
                    />

                    {selectedFile && (
                      <div className="mt-4 flex items-center justify-between rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3.5">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="rounded-lg bg-blue-100 p-2 text-blue-600">
                            <ImagePlus size={17} />
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-blue-700">
                              {selectedFile.name}
                            </p>

                            <p className="mt-0.5 text-xs text-blue-500">
                              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="ml-3 rounded-lg p-2 text-red-500 transition hover:bg-red-100">
                          <X size={17} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* =================================================
                  ACTION BAR INSIDE SAME CARD
              ================================================== */}

              <div className="border-t border-slate-100 bg-slate-50/70 p-4 sm:px-7 sm:py-5">
                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="hidden items-center gap-2 text-xs text-slate-400 sm:flex">
                    <ShieldCheck size={15} />
                    All required fields must be completed.
                  </div>

                  <div className="flex w-full flex-col-reverse gap-3 sm:w-auto sm:flex-row">
                    <button
                      type="button"
                      onClick={() => router.back()}
                      disabled={isLoading}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-600 transition-all hover:border-slate-300 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50">
                      <X size={18} />
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 px-7 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60">
                      {isLoading ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          Creating Admin...
                        </>
                      ) : (
                        <>
                          <Save size={18} />
                          Create Admin
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </form>
      </div>
    </main>
  );
};

export default AddNewAdminPage;
