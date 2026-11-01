"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useUpdateUserMutation, useUserQuery } from "@/redux/api/userApi";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Camera,
  Check,
  Eye,
  EyeOff,
  HeartPulse,
  IdCard,
  ImagePlus,
  KeyRound,
  Mail,
  MapPin,
  Phone,
  Save,
  ShieldCheck,
  Trash2,
  User,
  UserCog,
  Users,
} from "lucide-react";

type IDProps = {
  params: any;
};

const UpdateSuperAdminProfilePage = ({ params }: IDProps) => {
  const router = useRouter();
  const { id } = params;

  const { data, isLoading } = useUserQuery(id);

  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  const imageInputRef = useRef<HTMLInputElement>(null);

  const [showPassword, setShowPassword] = useState(false);

  const [profileImage, setProfileImage] = useState<string>("");

  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const [formSelectData, setFormSelectData] = useState({
    gender: "",
    dateOfBirth: "",
    bloodGroup: "",
    religious: "",
  });

  /* ==========================================
     LOAD USER DATA
  ========================================== */

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

  /* ==========================================
     HANDLE SELECT CHANGE
  ========================================== */

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setFormSelectData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* ==========================================
     PROFILE IMAGE
  ========================================== */

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // File type validation
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }

    // File size validation - 5 MB
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB.");
      return;
    }

    // Store file
    setSelectedImage(file);

    // Preview
    const previewUrl = URL.createObjectURL(file);

    setProfileImage(previewUrl);
  };

  /* ==========================================
     REMOVE IMAGE
  ========================================== */

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setProfileImage("");

    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  /* ==========================================
     UPDATE PROFILE
  ========================================== */

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;

    const getValue = (name: string) =>
      (form.elements.namedItem(name) as HTMLInputElement)?.value?.trim();

    const userId = getValue("userId");
    const role = getValue("role");
    const password = getValue("password");
    const name = getValue("name");
    const designation = getValue("designation");
    const contactNo = getValue("contactNo");
    const emergencyContactNo = getValue("emergencyContactNo");
    const email = getValue("email");
    const address = getValue("address");

    /* ==========================================
       VALIDATION
    ========================================== */

    if (!name) {
      return toast.error("Please write name");
    }

    if (!userId) {
      return toast.error("Please write user ID");
    }

    if (!role) {
      return toast.error("Please write role");
    }

    if (!designation) {
      return toast.error("Please write designation");
    }

    if (!password) {
      return toast.error("Please write password");
    }

    if (!email) {
      return toast.error("Please write email");
    }

    if (!contactNo) {
      return toast.error("Please write contact number");
    }

    if (!emergencyContactNo) {
      return toast.error("Please write emergency contact number");
    }

    if (!address) {
      return toast.error("Please write address");
    }

    if (!formSelectData.gender) {
      return toast.error("Please select gender");
    }

    if (!formSelectData.religious) {
      return toast.error("Please select religion");
    }

    if (!formSelectData.bloodGroup) {
      return toast.error("Please select blood group");
    }

    if (!formSelectData.dateOfBirth) {
      return toast.error("Please select date of birth");
    }

    /* ==========================================
       UPDATE OBJECT
    ========================================== */

    const obj = {
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

    // JSON data
    formData.append("data", JSON.stringify(obj));

    // IMPORTANT
    // For Image
    if (selectedImage) {
      formData.append("file", selectedImage);
    }

    console.log(selectedImage);

    try {
      const res = await updateUser({
        id,
        data: formData,
      }).unwrap();

      if (res?.id) {
        toast.success("Profile updated successfully");

        router.push("/profile/superAdmin");
      }
    } catch (err) {
      toast.error("Profile update failed");
    }
  };

  /* ==========================================
     LOADING
  ========================================== */

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-sky-100 border-t-sky-600" />

          <p className="text-sm font-medium text-slate-500">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  const inputClass =
    "w-full border border-slate-300 bg-white px-4 py-2 pl-11 text-sm text-slate-700 outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10";

  const selectClass =
    "w-full appearance-none border border-slate-300 bg-white px-4 py-2 pl-11 text-sm text-slate-700 outline-none transition-all hover:border-slate-300 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10";

  return (
    <div className="min-h-screen bg-slate-50 px-3 py-5 sm:px-5 lg:px-6">
      <div className="mx-auto max-w-6xl">
        {/* ==========================================
    HEADER CARD
========================================== */}

        <div className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-5 px-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            {/* TITLE */}
            <div className="flex items-center gap-4">
              {/* ICON */}
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-sky-100 bg-sky-50 text-sky-600">
                <UserCog className="h-6 w-6" />
              </div>

              {/* TEXT */}
              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-800 sm:text-2xl">
                  Update Super Admin
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  Manage profile, account and personal information
                </p>
              </div>
            </div>

            {/* BACK BUTTON */}
            <button
              type="button"
              onClick={() => router.push("/profile/superAdmin")}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 shadow-sm transition-all hover:border-sky-200 hover:bg-sky-50 hover:text-sky-600">
              <ArrowLeft className="h-4 w-4" />
              Back to Profile
            </button>
          </div>
        </div>
        {/* ==========================================
            MAIN CARD
        ========================================== */}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <form onSubmit={handleUpdate}>
            {/* ========================================
                PROFILE IMAGE
            ======================================== */}

            <div className="border-b border-slate-100 px-3 py-7 sm:px-4">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50">
                  <ImagePlus className="h-5 w-5 text-purple-600" />
                </div>

                <div>
                  <h2 className="font-bold text-slate-800">Profile Image</h2>

                  <p className="text-xs text-slate-500">
                    Upload a professional profile photo
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-center gap-6 sm:flex-row">
                {/* IMAGE */}

                <div className="relative">
                  <div className="h-36 w-36 overflow-hidden rounded-full border-4 border-white bg-gradient-to-br from-sky-100 to-indigo-100 shadow-lg ring-1 ring-slate-200">
                    {profileImage ? (
                      <img
                        src={profileImage}
                        alt={data?.name || "Profile image"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <User className="h-16 w-16 text-sky-400" />
                      </div>
                    )}
                  </div>

                  {/* CAMERA BUTTON */}

                  <button
                    type="button"
                    onClick={() => imageInputRef.current?.click()}
                    className="absolute bottom-1 right-1 flex h-11 w-11 items-center justify-center rounded-full border-4 border-white bg-sky-600 text-white shadow-lg transition hover:scale-105 hover:bg-sky-700"
                    title="Change profile image">
                    <Camera className="h-5 w-5" />
                  </button>
                </div>

                {/* IMAGE ACTIONS */}

                <div className="text-center sm:text-left">
                  <h3 className="text-base font-bold text-slate-800">
                    {data?.name || "Super Administrator"}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    {data?.designation || "Super Admin"}
                  </p>

                  <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
                    <button
                      type="button"
                      onClick={() => imageInputRef.current?.click()}
                      className="inline-flex items-center gap-2 rounded-xl bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-600 transition hover:bg-sky-100">
                      <Camera className="h-4 w-4" />
                      {profileImage ? "Change Image" : "Upload Image"}
                    </button>

                    {profileImage && (
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="inline-flex items-center gap-2 rounded-xl bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-100">
                        <Trash2 className="h-4 w-4" />
                        Remove
                      </button>
                    )}
                  </div>

                  <p className="mt-3 text-xs text-slate-400">
                    JPG, PNG or WEBP · Maximum 5MB
                  </p>
                </div>
              </div>

              {/* HIDDEN INPUT */}

              <input
                ref={imageInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>

            {/* ========================================
                ACCOUNT INFORMATION
            ======================================== */}

            <div className="border-b border-slate-100 px-5 py-6 sm:px-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50">
                  <ShieldCheck className="h-5 w-5 text-sky-600" />
                </div>

                <div>
                  <h2 className="font-bold text-slate-800">
                    Account Information
                  </h2>

                  <p className="text-xs text-slate-500">
                    Update login and administrative details
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                <FormField label="User ID" icon={<IdCard />} required>
                  <input
                    type="text"
                    name="userId"
                    defaultValue={data?.userId}
                    placeholder="Enter user ID"
                    className={inputClass}
                    required
                  />
                </FormField>

                <FormField label="Role" icon={<ShieldCheck />} required>
                  <input
                    type="text"
                    name="role"
                    defaultValue={data?.role}
                    placeholder="Enter role"
                    className={inputClass}
                    required
                  />
                </FormField>

                <FormField label="Password" icon={<KeyRound />} required>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      defaultValue={data?.password}
                      placeholder="Enter password"
                      className={`${inputClass} pr-12`}
                      required
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600">
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </FormField>

                <FormField label="Designation" icon={<UserCog />} required>
                  <input
                    type="text"
                    name="designation"
                    defaultValue={data?.designation}
                    placeholder="e.g. Super Admin"
                    className={inputClass}
                    required
                  />
                </FormField>

                <FormField label="Full Name" icon={<User />} required>
                  <input
                    type="text"
                    name="name"
                    defaultValue={data?.name}
                    placeholder="Enter full name"
                    className={inputClass}
                    required
                  />
                </FormField>

                <FormField label="Gender" icon={<Users />} required>
                  <select
                    name="gender"
                    value={formSelectData.gender}
                    onChange={handleChange}
                    className={selectClass}
                    required>
                    <option value="">Select gender</option>

                    <option value="male">Male</option>

                    <option value="female">Female</option>
                  </select>
                </FormField>

                <FormField
                  label="Date of Birth"
                  icon={<CalendarDays />}
                  required>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formSelectData.dateOfBirth}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  />
                </FormField>

                <FormField label="Blood Group" icon={<HeartPulse />} required>
                  <select
                    name="bloodGroup"
                    value={formSelectData.bloodGroup}
                    onChange={handleChange}
                    className={selectClass}
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
                  </select>
                </FormField>

                <FormField label="Religion" icon={<User />} required>
                  <select
                    name="religious"
                    value={formSelectData.religious}
                    onChange={handleChange}
                    className={selectClass}
                    required>
                    <option value="">Select religion</option>

                    <option value="islam">Islam</option>

                    <option value="hindu">Hindu</option>

                    <option value="buddist">Buddhist</option>
                  </select>
                </FormField>

                <FormField label="Contact Number" icon={<Phone />} required>
                  <input
                    type="tel"
                    name="contactNo"
                    defaultValue={data?.contactNo}
                    placeholder="+880 1XXXXXXXXX"
                    className={inputClass}
                    required
                  />
                </FormField>

                <FormField label="Emergency Contact" icon={<Phone />} required>
                  <input
                    type="tel"
                    name="emergencyContactNo"
                    defaultValue={data?.emergencyContactNo}
                    placeholder="+880 1XXXXXXXXX"
                    className={inputClass}
                    required
                  />
                </FormField>

                <FormField label="Email Address" icon={<Mail />} required>
                  <input
                    type="email"
                    name="email"
                    defaultValue={data?.email}
                    placeholder="admin@example.com"
                    className={inputClass}
                    required
                  />
                </FormField>

                <FormField label="Address" icon={<MapPin />} required>
                  <input
                    type="text"
                    name="address"
                    defaultValue={data?.address}
                    placeholder="Enter full address"
                    className={`${inputClass} md:col-span-2`}
                    required
                  />
                </FormField>
              </div>
            </div>

            {/* ========================================
                FOOTER
            ======================================== */}

            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50 px-5 py-5 sm:flex-row sm:justify-end sm:px-8">
              <button
                type="button"
                onClick={() => router.push("/profile/superAdmin")}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100">
                Cancel
              </button>

              <button
                type="submit"
                disabled={isUpdating}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 px-7 py-3 text-sm font-semibold text-white shadow-md shadow-sky-500/20 transition hover:from-sky-700 hover:to-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
                {isUpdating ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Update Profile
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Bottom Note */}

        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400">
          <Check className="h-3.5 w-3.5" />
          Make sure all information is accurate before saving.
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   FORM FIELD
========================================================= */

interface FormFieldProps {
  label: string;
  icon: React.ReactNode;
  required?: boolean;
  children: React.ReactNode;
}

const FormField = ({ label, icon, required, children }: FormFieldProps) => {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
        {label}

        {required && <span className="text-rose-500">*</span>}
      </label>

      <div className="relative">
        <div className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-slate-400 [&>svg]:h-[18px] [&>svg]:w-[18px]">
          {icon}
        </div>

        {children}
      </div>
    </div>
  );
};

export default UpdateSuperAdminProfilePage;
