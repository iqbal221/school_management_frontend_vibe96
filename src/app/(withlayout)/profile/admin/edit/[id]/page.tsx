"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import {
  ArrowLeft,
  BriefcaseBusiness,
  CalendarDays,
  Camera,
  Check,
  CheckCircle2,
  Church,
  Droplets,
  Eye,
  EyeOff,
  ImagePlus,
  KeyRound,
  Loader2,
  Mail,
  MapPin,
  Pencil,
  Phone,
  PhoneCall,
  Save,
  ShieldCheck,
  Trash2,
  User,
  UserRound,
  VenusAndMars,
} from "lucide-react";

import { useUpdateUserMutation, useUserQuery } from "@/redux/api/userApi";

import { useRouter } from "next/navigation";

type IDProps = {
  params: {
    id: string;
  };
};

type FormSelectData = {
  gender: string;
  dateOfBirth: string;
  bloodGroup: string;
  religious: string;
};

const UpdateSuperAdminProfilePage = ({ params }: IDProps) => {
  const { id } = params;
  const router = useRouter();

  const imageInputRef = useRef<HTMLInputElement>(null);
  const previewUrlRef = useRef<string | null>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [profileImage, setProfileImage] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const [formSelectData, setFormSelectData] = useState<FormSelectData>({
    gender: "",
    dateOfBirth: "",
    bloodGroup: "",
    religious: "",
  });

  const { data, isLoading } = useUserQuery(id);

  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  // =========================================================
  // LOAD USER DATA
  // =========================================================

  useEffect(() => {
    if (!data) return;

    setFormSelectData({
      gender: data?.gender || "",
      dateOfBirth: data?.dateOfBirth
        ? String(data.dateOfBirth).slice(0, 10)
        : "",
      bloodGroup: data?.bloodGroup || "",
      religious: data?.religious || "",
    });

    setProfileImage(data?.image || data?.profileImage || data?.photo || "");
  }, [data]);

  // =========================================================
  // CLEANUP PREVIEW
  // =========================================================

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  // =========================================================
  // SELECT CHANGE
  // =========================================================

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setFormSelectData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================================
  // IMAGE CHANGE
  // =========================================================

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");

      if (imageInputRef.current) {
        imageInputRef.current.value = "";
      }

      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB.");

      if (imageInputRef.current) {
        imageInputRef.current.value = "";
      }

      return;
    }

    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
    }

    setSelectedImage(file);

    const previewUrl = URL.createObjectURL(file);

    previewUrlRef.current = previewUrl;

    setProfileImage(previewUrl);
  };

  // =========================================================
  // REMOVE IMAGE
  // =========================================================

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setProfileImage("");

    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }

    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  // =========================================================
  // UPDATE PROFILE
  // =========================================================

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;

    const getValue = (name: string) =>
      (
        form.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement
      )?.value?.trim();

    const userId = getValue("userId");
    const role = getValue("role");
    const password = getValue("password");
    const name = getValue("name");
    const designation = getValue("designation");
    const contactNo = getValue("contactNo");
    const emergencyContactNo = getValue("emergencyContactNo");
    const email = getValue("email");
    const address = getValue("address");

    // =======================================================
    // VALIDATION
    // =======================================================

    if (!name) {
      return toast.error("Please enter full name.");
    }

    if (!userId) {
      return toast.error("Please enter user ID.");
    }

    if (!role) {
      return toast.error("Please enter role.");
    }

    if (!designation) {
      return toast.error("Please enter designation.");
    }

    if (!password) {
      return toast.error("Please enter password.");
    }

    if (password.length < 6) {
      return toast.error("Password must contain at least 6 characters.");
    }

    if (!email) {
      return toast.error("Please enter email.");
    }

    if (!contactNo) {
      return toast.error("Please enter contact number.");
    }

    if (!emergencyContactNo) {
      return toast.error("Please enter emergency contact number.");
    }

    if (!formSelectData.gender) {
      return toast.error("Please select gender.");
    }

    if (!formSelectData.religious) {
      return toast.error("Please select religion.");
    }

    if (!formSelectData.bloodGroup) {
      return toast.error("Please select blood group.");
    }

    if (!formSelectData.dateOfBirth) {
      return toast.error("Please select date of birth.");
    }

    if (!address) {
      return toast.error("Please enter address.");
    }

    // =======================================================
    // UPDATE DATA
    // =======================================================

    const updateData = {
      userId,
      role,
      password,
      name,
      designation,
      contactNo,
      emergencyContactNo,
      email,
      address,
      gender: formSelectData.gender,
      dateOfBirth: formSelectData.dateOfBirth,
      bloodGroup: formSelectData.bloodGroup,
      religious: formSelectData.religious,
    };

    const formData = new FormData();

    formData.append("data", JSON.stringify(updateData));

    if (selectedImage) {
      formData.append("file", selectedImage);
    }

    // =======================================================
    // API REQUEST
    // =======================================================

    try {
      const res = await updateUser({
        id,
        data: formData,
      }).unwrap();

      if (res?.id) {
        toast.success("Profile updated successfully.");

        router.push("/profile/admin");
      } else {
        toast.error("Profile update failed.");
      }
    } catch (error: any) {
      console.error("Profile update error:", error);

      toast.error(
        error?.data?.message ||
        error?.message ||
        "Profile update failed. Please try again.",
      );
    }
  };

  // =========================================================
  // STYLES
  // =========================================================

  const inputClass =
    "w-full  border border-slate-300 bg-slate-50 px-4 py-2 text-sm text-slate-700 outline-none transition-all duration-200 placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100";

  const selectClass =
    "w-full appearance-none border border-slate-300 bg-slate-50 px-4 py-2 text-sm text-slate-700 outline-none transition-all duration-200 hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100";

  // =========================================================
  // LOADING
  // =========================================================

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-50 px-2 py-6 sm:px-3 lg:px-4">
        <div className="mx-auto max-w-6xl">
          <div className="flex min-h-[500px] items-center justify-center rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <Loader2 size={28} className="animate-spin" />
              </div>

              <div className="text-center">
                <p className="font-semibold text-slate-700">Loading profile</p>

                <p className="mt-1 text-sm text-slate-400">Please wait...</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // =========================================================
  // UI
  // =========================================================

  return (
    <main className="min-h-screen bg-slate-50 px-2 py-6 sm:px-3 lg:px-4">
      <div className="mx-auto max-w-6xl">
        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-3 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="px-5 py-6 sm:px-8 sm:py-7">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-600">
                  <Pencil size={25} />
                </div>

                <div>
                  <h1 className="text-xl font-bold text-slate-800 sm:text-2xl">
                    Update Admin Profile
                  </h1>

                  <p className="mt-1 text-sm text-slate-500">
                    Manage administrator account and personal information.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => router.push("/profile/admin")}
                disabled={isUpdating}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-50">
                <ArrowLeft size={17} />
                Back
              </button>
            </div>
          </div>
        </div>

        {/* =================================================
            FORM
        ================================================= */}

        <form onSubmit={handleUpdate}>
          <div className="space-y-4">
            {/* =================================================
                MERGED: PROFILE + ACCOUNT
            ================================================= */}

            <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="p-5 sm:p-7">
                {/* PROFILE AREA */}

                <div className="flex flex-col gap-7 border-b border-slate-100 pb-7 lg:flex-row lg:items-center">
                  {/* IMAGE */}

                  <div className="flex justify-center lg:justify-start">
                    <div className="relative">
                      <div className="h-36 w-36 overflow-hidden rounded-full border-4 border-white bg-gradient-to-br from-blue-50 to-indigo-100 shadow-lg ring-1 ring-slate-200">
                        {profileImage ? (
                          <img
                            src={profileImage}
                            alt={data?.name || "Profile image"}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <User className="h-16 w-16 text-blue-300" />
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => imageInputRef.current?.click()}
                        disabled={isUpdating}
                        title="Change profile image"
                        className="absolute bottom-1 right-1 flex h-11 w-11 items-center justify-center rounded-full border-4 border-white bg-blue-600 text-white shadow-lg transition hover:scale-105 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
                        <Camera size={19} />
                      </button>
                    </div>
                  </div>

                  {/* PROFILE DETAILS */}

                  <div className="flex-1 text-center lg:text-left">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-slate-800">
                          {data?.name || "Super Administrator"}
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                          {data?.designation || "Super Admin"}
                        </p>
                      </div>

                      <div className="inline-flex items-center justify-center gap-1.5 self-center rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-600 sm:self-auto">
                        <CheckCircle2 size={14} />
                        Active Account
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap justify-center gap-2 lg:justify-start">
                      <button
                        type="button"
                        onClick={() => imageInputRef.current?.click()}
                        disabled={isUpdating}
                        className="inline-flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-60">
                        <Camera size={16} />

                        {profileImage ? "Change Image" : "Upload Image"}
                      </button>

                      {profileImage && (
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          disabled={isUpdating}
                          className="inline-flex items-center gap-2 rounded-xl bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60">
                          <Trash2 size={16} />
                          Remove
                        </button>
                      )}
                    </div>

                    <p className="mt-3 text-xs text-slate-400">
                      JPG, PNG or WEBP · Maximum 5MB
                    </p>
                  </div>
                </div>

                {/* ACCOUNT INFORMATION */}

                <div className="mt-7">
                  <div className="mb-5 flex items-center gap-2">
                    <KeyRound size={18} className="text-blue-500" />

                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
                      Account Credentials
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                    <FormField label="User ID" icon={UserRound} required>
                      <input
                        type="text"
                        name="userId"
                        defaultValue={data?.userId || ""}
                        placeholder="Enter user ID"
                        className={inputClass}
                      />
                    </FormField>

                    <FormField label="Role" icon={ShieldCheck} required>
                      <input
                        type="text"
                        name="role"
                        defaultValue={data?.role || ""}
                        placeholder="e.g. superAdmin"
                        className={inputClass}
                      />
                    </FormField>

                    <FormField label="Password" icon={KeyRound} required>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          defaultValue={data?.password || ""}
                          placeholder="Enter password"
                          className={`${inputClass} pr-11`}
                        />

                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600">
                          {showPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>

                      <p className="mt-1.5 text-xs text-slate-400">
                        Minimum 6 characters.
                      </p>
                    </FormField>
                  </div>
                </div>
              </div>

              {/* HIDDEN FILE INPUT */}

              <input
                ref={imageInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleImageChange}
                className="hidden"
              />
            </section>

            {/* =================================================
                MERGED: PERSONAL + UPDATE PROFILE
            ================================================= */}

            <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              {/* SECTION HEADER */}

              <div className="border-b border-slate-100 px-5 py-5 sm:px-7">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                    <UserRound size={21} />
                  </div>

                  <div>
                    <h2 className="font-bold text-slate-800 text-xl">
                      Personal Information
                    </h2>

                    <p className="mt-0.5 text-xs text-slate-400">
                      Update personal details, contact information and address.
                    </p>
                  </div>
                </div>
              </div>

              {/* PERSONAL INFORMATION */}

              <div className="grid grid-cols-1 gap-5 p-5 sm:p-7 lg:grid-cols-3">
                <FormField label="Full Name" icon={UserRound} required>
                  <input
                    type="text"
                    name="name"
                    defaultValue={data?.name || ""}
                    placeholder="Enter full name"
                    className={inputClass}
                  />
                </FormField>

                <FormField
                  label="Designation"
                  icon={BriefcaseBusiness}
                  required>
                  <input
                    type="text"
                    name="designation"
                    defaultValue={data?.designation || ""}
                    placeholder="e.g. Super Admin"
                    className={inputClass}
                  />
                </FormField>

                <FormField label="Email Address" icon={Mail} required>
                  <input
                    type="email"
                    name="email"
                    defaultValue={data?.email || ""}
                    placeholder="admin@example.com"
                    className={inputClass}
                  />
                </FormField>

                <FormField label="Contact Number" icon={Phone} required>
                  <input
                    type="tel"
                    name="contactNo"
                    defaultValue={data?.contactNo || ""}
                    placeholder="+880 1XXXXXXXXX"
                    className={inputClass}
                  />
                </FormField>

                <FormField label="Emergency Contact" icon={PhoneCall} required>
                  <input
                    type="tel"
                    name="emergencyContactNo"
                    defaultValue={data?.emergencyContactNo || ""}
                    placeholder="+880 1XXXXXXXXX"
                    className={inputClass}
                  />
                </FormField>

                <FormField label="Gender" icon={VenusAndMars} required>
                  <select
                    name="gender"
                    value={formSelectData.gender}
                    onChange={handleChange}
                    className={selectClass}>
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </FormField>

                <FormField label="Blood Group" icon={Droplets} required>
                  <select
                    name="bloodGroup"
                    value={formSelectData.bloodGroup}
                    onChange={handleChange}
                    className={selectClass}>
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
                </FormField>

                <FormField label="Date of Birth" icon={CalendarDays} required>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formSelectData.dateOfBirth}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </FormField>

                <FormField label="Religion" icon={Church} required>
                  <select
                    name="religious"
                    value={formSelectData.religious}
                    onChange={handleChange}
                    className={selectClass}>
                    <option value="">Select religion</option>
                    <option value="islam">Islam</option>
                    <option value="hindu">Hindu</option>
                    <option value="buddist">Buddhist</option>
                  </select>
                </FormField>

                <FormField
                  label="Address"
                  icon={MapPin}
                  required
                  className="lg:col-span-3">
                  <textarea
                    name="address"
                    rows={4}
                    defaultValue={data?.address || ""}
                    placeholder="Enter complete address"
                    className={`${inputClass} resize-none`}
                  />
                </FormField>
              </div>

              {/* =================================================
                  UPDATE PROFILE ACTION
              ================================================= */}

              <div className="border-t border-slate-100 bg-slate-50/70 px-5 py-5 sm:px-7">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                      <Check size={18} />
                    </div>

                    <div>
                      <p className="text-sm font-bold text-slate-700">
                        Ready to update?
                      </p>

                      <p className="mt-0.5 text-xs text-slate-400">
                        Make sure all information is accurate before saving.
                      </p>
                    </div>
                  </div>

                  <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
                    <button
                      type="button"
                      onClick={() => router.push("/profile/admin")}
                      disabled={isUpdating}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-50">
                      <ArrowLeft size={17} />
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={isUpdating}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-7 py-3 text-sm font-bold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0">
                      {isUpdating ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          Updating Profile...
                        </>
                      ) : (
                        <>
                          <Save size={18} />
                          Update Profile
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </form>

        {/* BOTTOM NOTE */}

        <div className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-400">
          <ShieldCheck size={14} />
          Your profile information is securely managed.
        </div>
      </div>
    </main>
  );
};

// ============================================================
// FORM FIELD
// ============================================================

interface FormFieldProps {
  label: string;
  icon: React.ElementType;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

const FormField = ({
  label,
  icon: Icon,
  required,
  children,
  className = "",
}: FormFieldProps) => {
  return (
    <div className={className}>
      <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
        <Icon size={15} className="text-slate-400" />

        {label}

        {required && <span className="text-red-500">*</span>}
      </label>

      {children}
    </div>
  );
};

export default UpdateSuperAdminProfilePage;
