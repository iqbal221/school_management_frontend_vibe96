"use client";

import {
  ISchoolHeader,
  useCreateSchoolHeaderMutation,
  useUpdateSchoolHeaderMutation,
} from "@/redux/api/website/home/schoolHeaderApi";
import { ImagePlus, Loader2, Save, Upload, X } from "lucide-react";
import Image from "next/image";
import { ChangeEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";

interface ISchoolHeaderDialogProps {
  open: boolean;
  onClose: () => void;
  schoolHeader?: ISchoolHeader | null;
}

interface IApiError {
  data?: {
    message?: string;
    errorMessages?: Array<{
      message?: string;
    }>;
  };
  message?: string;
}

const SchoolHeaderDialog = ({
  open,
  onClose,
  schoolHeader,
}: ISchoolHeaderDialogProps) => {
  // =========================================================
  // FORM STATE
  // =========================================================

  const [schoolName, setSchoolName] = useState("");
  const [slogan, setSlogan] = useState("");
  const [logoPreview, setLogoPreview] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);

  // =========================================================
  // API
  // =========================================================

  const [createSchoolHeader, { isLoading: isCreating }] =
    useCreateSchoolHeaderMutation();

  const [updateSchoolHeader, { isLoading: isUpdating }] =
    useUpdateSchoolHeaderMutation();

  const isSaving = isCreating || isUpdating;

  // =========================================================
  // LOAD EXISTING DATA
  // =========================================================

  useEffect(() => {
    if (!open) return;

    setSchoolName(schoolHeader?.schoolName || "");
    setSlogan(schoolHeader?.slogan || "");
    setLogoPreview(schoolHeader?.logo || "");
    setLogoFile(null);
  }, [open, schoolHeader]);

  // =========================================================
  // CLOSE DIALOG
  // =========================================================

  const handleClose = () => {
    if (isSaving) return;

    setSchoolName("");
    setSlogan("");
    setLogoPreview("");
    setLogoFile(null);

    onClose();
  };

  // =========================================================
  // LOGO UPLOAD
  // =========================================================

  const handleLogoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    // File type validation
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPG, PNG and WEBP images are allowed");

      event.target.value = "";
      return;
    }

    // File size validation
    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      toast.error("Logo image must be less than 5MB");

      event.target.value = "";
      return;
    }

    setLogoFile(file);

    const preview = URL.createObjectURL(file);

    setLogoPreview(preview);
  };

  // =========================================================
  // ERROR MESSAGE
  // =========================================================

  const getErrorMessage = (error: unknown): string => {
    const apiError = error as IApiError;

    if (typeof apiError?.data?.message === "string") {
      return apiError.data.message;
    }

    if (Array.isArray(apiError?.data?.errorMessages)) {
      const message = apiError.data.errorMessages
        .map((item) => item?.message)
        .filter(Boolean)
        .join(", ");

      if (message) {
        return message;
      }
    }

    if (typeof apiError?.message === "string") {
      return apiError.message;
    }

    return "Something went wrong";
  };

  // =========================================================
  // SAVE HEADER
  // =========================================================

  const handleSave = async () => {
    const trimmedSchoolName = schoolName.trim();

    const trimmedSlogan = slogan.trim();

    // School name validation
    if (!trimmedSchoolName) {
      toast.error("School name is required");
      return;
    }

    if (trimmedSchoolName.length > 200) {
      toast.error("School name cannot exceed 200 characters");
      return;
    }

    // Slogan validation
    if (trimmedSlogan.length > 300) {
      toast.error("Slogan cannot exceed 300 characters");
      return;
    }

    try {
      const formData = new FormData();

      const data = {
        schoolName: trimmedSchoolName,
        slogan: trimmedSlogan,
        isActive: true,
      };

      formData.append("data", JSON.stringify(data));

      // Add logo only when a new image is selected

      console.log(logoFile);
      if (logoFile) {
        formData.append("file", logoFile);
      }

      // =====================================================
      // UPDATE EXISTING HEADER
      // =====================================================

      if (schoolHeader?.id) {
        await updateSchoolHeader({
          id: schoolHeader.id,
          data: formData,
        }).unwrap();

        toast.success("School header updated successfully");
      }

      // =====================================================
      // CREATE NEW HEADER
      // =====================================================
      else {
        await createSchoolHeader(formData).unwrap();

        toast.success("School header created successfully");
      }

      

      handleClose();
    } catch (error) {
      console.error("School header save error:", error);

      toast.error(getErrorMessage(error));
    }
  };

  // =========================================================
  // DON'T RENDER
  // =========================================================

  if (!open) {
    return null;
  }

  // =========================================================
  // UI
  // =========================================================

  console.log(logoFile);

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          handleClose();
        }
      }}>
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
              <ImagePlus size={20} />
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-800">
                Edit School Header
              </h3>

              <p className="mt-0.5 text-xs text-slate-400">
                Update your school logo and header information.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={isSaving}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-50">
            <X size={19} />
          </button>
        </div>

        {/* =====================================================
            BODY
        ====================================================== */}

        <div className="max-h-[75vh] overflow-y-auto p-6">
          <div className="space-y-6">
            {/* =================================================
                LOGO
            ================================================== */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                School Logo
              </label>

              <div className="flex flex-col gap-4 sm:flex-row">
                {/* Preview */}

                <div className="relative flex h-36 w-36 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                  {logoPreview ? (
                    <Image
                      src={logoPreview}
                      alt="School Logo"
                      fill
                      unoptimized
                      className="object-contain p-3"
                    />
                  ) : (
                    <div className="text-center">
                      <ImagePlus
                        size={30}
                        className="mx-auto mb-2 text-slate-300"
                      />

                      <p className="text-[11px] text-slate-400">No logo</p>
                    </div>
                  )}
                </div>

                {/* Upload Area */}

                <div className="flex flex-1 flex-col justify-center">
                  <label className="flex w-fit cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-600">
                    <Upload size={16} />
                    Choose Logo
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handleLogoChange}
                      disabled={isSaving}
                      className="hidden"
                    />
                  </label>

                  <p className="mt-2 text-xs text-slate-400">
                    JPG, PNG or WEBP
                  </p>

                  <p className="mt-1 text-[11px] text-slate-400">
                    Maximum file size: 5MB
                  </p>

                  {logoFile && (
                    <p className="mt-2 max-w-[300px] truncate text-xs font-medium text-violet-600">
                      Selected: {logoFile.name}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* =================================================
                SCHOOL NAME
            ================================================== */}

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="school-name"
                  className="text-sm font-semibold text-slate-700">
                  School Name
                </label>

                <span className="text-[10px] text-slate-400">
                  {schoolName.length}/200
                </span>
              </div>

              <input
                id="school-name"
                type="text"
                value={schoolName}
                onChange={(event) => setSchoolName(event.target.value)}
                maxLength={200}
                disabled={isSaving}
                placeholder="Enter school name"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            {/* =================================================
                SLOGAN
            ================================================== */}

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="school-slogan"
                  className="text-sm font-semibold text-slate-700">
                  Slogan / Tagline
                </label>

                <span className="text-[10px] text-slate-400">
                  {slogan.length}/300
                </span>
              </div>

              <input
                id="school-slogan"
                type="text"
                value={slogan}
                onChange={(event) => setSlogan(event.target.value)}
                maxLength={300}
                disabled={isSaving}
                placeholder="Quality Education • Discipline • Morality"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            {/* =================================================
                INFORMATION
            ================================================== */}

            <div className="rounded-xl border border-violet-100 bg-violet-50 p-4">
              <div className="flex gap-3">
                <div className="mt-0.5">
                  <ImagePlus size={17} className="text-violet-500" />
                </div>

                <div>
                  <p className="text-xs font-semibold text-violet-700">
                    Header Preview Information
                  </p>

                  <p className="mt-1 text-[11px] leading-5 text-violet-500">
                    Your logo, school name and slogan will be displayed in the
                    website header after saving.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            FOOTER
        ====================================================== */}

        <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4 sm:flex-row sm:items-center sm:justify-end">
          <button
            type="button"
            onClick={handleClose}
            disabled={isSaving}
            className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50">
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving || !schoolName.trim()}
            className="flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50">
            {isSaving ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={16} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SchoolHeaderDialog;

// "use client";

// import {
//   ISchoolHeader,
//   useCreateSchoolHeaderMutation,
//   useUpdateSchoolHeaderMutation,
// } from "@/redux/api/website/home/schoolHeaderApi";
// import { ImagePlus, Loader2, Save, Upload, X } from "lucide-react";
// import Image from "next/image";
// import { ChangeEvent, useEffect, useRef, useState } from "react";
// import { toast } from "react-toastify";

// interface ISchoolHeaderDialogProps {
//   open: boolean;
//   onClose: () => void;
//   schoolHeader?: ISchoolHeader | null;
// }

// interface IApiError {
//   data?: {
//     message?: string;
//     errorMessages?: Array<{
//       message?: string;
//     }>;
//   };
//   message?: string;
// }

// const SchoolHeaderDialog = ({
//   open,
//   onClose,
//   schoolHeader,
// }: ISchoolHeaderDialogProps) => {
//   // =========================================================
//   // FORM STATE
//   // =========================================================

//   const [schoolName, setSchoolName] = useState("");
//   const [slogan, setSlogan] = useState("");
//   const [logoPreview, setLogoPreview] = useState("");
//   const [logoFile, setLogoFile] = useState<File | null>(null);

//   // Keep track of locally created blob URL
//   const objectUrlRef = useRef<string | null>(null);

//   // =========================================================
//   // API
//   // =========================================================

//   const [createSchoolHeader, { isLoading: isCreating }] =
//     useCreateSchoolHeaderMutation();

//   const [updateSchoolHeader, { isLoading: isUpdating }] =
//     useUpdateSchoolHeaderMutation();

//   const isSaving = isCreating || isUpdating;

//   // =========================================================
//   // DETERMINE MODE
//   // =========================================================

//   const isEditMode = Boolean(schoolHeader?.id);

//   // =========================================================
//   // LOAD DATABASE DATA WHEN DIALOG OPENS
//   // =========================================================

//   useEffect(() => {
//     if (!open) return;

//     setSchoolName(schoolHeader?.schoolName ?? "");
//     setSlogan(schoolHeader?.slogan ?? "");
//     setLogoPreview(schoolHeader?.logo ?? "");
//     setLogoFile(null);

//     // Remove previous local object URL
//     if (objectUrlRef.current) {
//       URL.revokeObjectURL(objectUrlRef.current);
//       objectUrlRef.current = null;
//     }
//   }, [open, schoolHeader]);

//   // =========================================================
//   // CLEANUP OBJECT URL
//   // =========================================================

//   useEffect(() => {
//     return () => {
//       if (objectUrlRef.current) {
//         URL.revokeObjectURL(objectUrlRef.current);
//       }
//     };
//   }, []);

//   // =========================================================
//   // CLOSE DIALOG
//   // =========================================================

//   const handleClose = () => {
//     if (isSaving) return;

//     if (objectUrlRef.current) {
//       URL.revokeObjectURL(objectUrlRef.current);
//       objectUrlRef.current = null;
//     }

//     setSchoolName("");
//     setSlogan("");
//     setLogoPreview("");
//     setLogoFile(null);

//     onClose();
//   };

//   // =========================================================
//   // LOGO UPLOAD
//   // =========================================================

//   const handleLogoChange = (event: ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];

//     if (!file) return;

//     // -------------------------------------------------------
//     // FILE TYPE
//     // -------------------------------------------------------

//     const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

//     if (!allowedTypes.includes(file.type)) {
//       toast.error("Only JPG, PNG and WEBP images are allowed");

//       event.target.value = "";
//       return;
//     }

//     // -------------------------------------------------------
//     // FILE SIZE
//     // -------------------------------------------------------

//     const maxSize = 5 * 1024 * 1024;

//     if (file.size > maxSize) {
//       toast.error("Logo image must be less than 5MB");

//       event.target.value = "";
//       return;
//     }

//     // -------------------------------------------------------
//     // CLEAN OLD PREVIEW
//     // -------------------------------------------------------

//     if (objectUrlRef.current) {
//       URL.revokeObjectURL(objectUrlRef.current);
//     }

//     // -------------------------------------------------------
//     // CREATE NEW PREVIEW
//     // -------------------------------------------------------

//     const previewUrl = URL.createObjectURL(file);

//     objectUrlRef.current = previewUrl;

//     setLogoFile(file);
//     setLogoPreview(previewUrl);
//   };

//   // =========================================================
//   // ERROR MESSAGE
//   // =========================================================

//   const getErrorMessage = (error: unknown): string => {
//     const apiError = error as IApiError;

//     if (typeof apiError?.data?.message === "string") {
//       return apiError.data.message;
//     }

//     if (Array.isArray(apiError?.data?.errorMessages)) {
//       const message = apiError.data.errorMessages
//         .map((item) => item?.message)
//         .filter(Boolean)
//         .join(", ");

//       if (message) {
//         return message;
//       }
//     }

//     if (typeof apiError?.message === "string") {
//       return apiError.message;
//     }

//     return "Something went wrong while saving school header";
//   };

//   // =========================================================
//   // SAVE HEADER
//   // =========================================================

//   const handleSave = async () => {
//     // -------------------------------------------------------
//     // VALIDATE SCHOOL NAME
//     // -------------------------------------------------------

//     const trimmedSchoolName = schoolName.trim();
//     const trimmedSlogan = slogan.trim();

//     if (!trimmedSchoolName) {
//       toast.error("School name is required");
//       return;
//     }

//     if (trimmedSchoolName.length > 200) {
//       toast.error("School name cannot exceed 200 characters");
//       return;
//     }

//     // -------------------------------------------------------
//     // VALIDATE SLOGAN
//     // -------------------------------------------------------

//     if (trimmedSlogan.length > 300) {
//       toast.error("Slogan cannot exceed 300 characters");
//       return;
//     }

//     // -------------------------------------------------------
//     // PREVENT DOUBLE SUBMIT
//     // -------------------------------------------------------

//     if (isSaving) {
//       return;
//     }

//     try {
//       // =====================================================
//       // CREATE FORMDATA
//       // =====================================================

//       const formData = new FormData();

//       const headerData = {
//         schoolName: trimmedSchoolName,
//         slogan: trimmedSlogan || null,
//         isActive: true,
//       };

//       console.log(headerData);

//       formData.append("data", JSON.stringify(headerData));

//       // =====================================================
//       // ADD NEW LOGO ONLY IF SELECTED
//       // =====================================================

//       if (logoFile) {
//         formData.append("file", logoFile);
//       }

//       // =====================================================
//       // DEBUG
//       // =====================================================

//       console.log("========== SCHOOL HEADER SAVE ==========");
//       console.log("MODE:", isEditMode ? "UPDATE" : "CREATE");
//       console.log("ID:", schoolHeader?.id);
//       console.log("DATA:", headerData);
//       console.log("LOGO:", logoFile?.name || "Existing logo");

//       // =====================================================
//       // UPDATE
//       // =====================================================

//       if (isEditMode && schoolHeader?.id) {
//         const result = await updateSchoolHeader({
//           id: schoolHeader.id,
//           data: formData,
//         }).unwrap();

//         console.log("UPDATE RESPONSE:", result);

//         toast.success(result?.message || "School header updated successfully");

//         // Close only after successful update
//         handleClose();

//         return;
//       }

//       // =====================================================
//       // CREATE
//       // =====================================================

//       const result = await createSchoolHeader(formData).unwrap();

//       console.log("CREATE RESPONSE:", result);

//       toast.success(result?.message || "School header created successfully");

//       handleClose();
//     } catch (error) {
//       console.error("========== SCHOOL HEADER SAVE ERROR ==========");
//       console.error(error);

//       toast.error(getErrorMessage(error));
//     }
//   };

//   // =========================================================
//   // DON'T RENDER
//   // =========================================================

//   if (!open) {
//     return null;
//   }

//   // =========================================================
//   // UI
//   // =========================================================

//   return (
//     <div
//       className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
//       onMouseDown={(event) => {
//         if (event.target === event.currentTarget) {
//           handleClose();
//         }
//       }}>
//       <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
//         {/* =====================================================
//             HEADER
//         ====================================================== */}

//         <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
//           <div className="flex items-center gap-3">
//             <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
//               <ImagePlus size={20} />
//             </div>

//             <div>
//               <h3 className="text-lg font-bold text-slate-800">
//                 {isEditMode ? "Edit School Header" : "Add School Header"}
//               </h3>

//               <p className="mt-0.5 text-xs text-slate-400">
//                 {isEditMode
//                   ? "Update your school logo and header information."
//                   : "Add your school logo and header information."}
//               </p>
//             </div>
//           </div>

//           <button
//             type="button"
//             onClick={handleClose}
//             disabled={isSaving}
//             className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-50">
//             <X size={19} />
//           </button>
//         </div>

//         {/* =====================================================
//             BODY
//         ====================================================== */}

//         <div className="max-h-[75vh] overflow-y-auto p-6">
//           <div className="space-y-6">
//             {/* =================================================
//                 LOGO
//             ================================================== */}

//             <div>
//               <label className="mb-2 block text-sm font-semibold text-slate-700">
//                 School Logo
//               </label>

//               <div className="flex flex-col gap-4 sm:flex-row">
//                 {/* PREVIEW */}

//                 <div className="relative flex h-36 w-36 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
//                   {logoPreview ? (
//                     <Image
//                       src={logoPreview}
//                       alt={schoolName ? `${schoolName} Logo` : "School Logo"}
//                       fill
//                       unoptimized
//                       className="object-contain p-3"
//                     />
//                   ) : (
//                     <div className="text-center">
//                       <ImagePlus
//                         size={30}
//                         className="mx-auto mb-2 text-slate-300"
//                       />

//                       <p className="text-[11px] text-slate-400">No logo</p>
//                     </div>
//                   )}
//                 </div>

//                 {/* UPLOAD */}

//                 <div className="flex flex-1 flex-col justify-center">
//                   <label
//                     className={`flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition ${
//                       isSaving
//                         ? "cursor-not-allowed opacity-50"
//                         : "cursor-pointer hover:border-violet-300 hover:bg-violet-50 hover:text-violet-600"
//                     }`}>
//                     <Upload size={16} />
//                     Choose Logo
//                     <input
//                       type="file"
//                       accept="image/png,image/jpeg,image/webp"
//                       onChange={handleLogoChange}
//                       disabled={isSaving}
//                       className="hidden"
//                     />
//                   </label>

//                   <p className="mt-2 text-xs text-slate-400">
//                     JPG, PNG or WEBP
//                   </p>

//                   <p className="mt-1 text-[11px] text-slate-400">
//                     Maximum file size: 5MB
//                   </p>

//                   {logoFile && (
//                     <p className="mt-2 max-w-[300px] truncate text-xs font-medium text-violet-600">
//                       New logo: {logoFile.name}
//                     </p>
//                   )}

//                   {!logoFile && schoolHeader?.logo && (
//                     <p className="mt-2 text-xs font-medium text-slate-400">
//                       Current logo will be kept
//                     </p>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* =================================================
//                 SCHOOL NAME
//             ================================================== */}

//             <div>
//               <div className="mb-2 flex items-center justify-between">
//                 <label
//                   htmlFor="school-name"
//                   className="text-sm font-semibold text-slate-700">
//                   School Name
//                 </label>

//                 <span className="text-[10px] text-slate-400">
//                   {schoolName.length}/200
//                 </span>
//               </div>

//               <input
//                 id="school-name"
//                 type="text"
//                 value={schoolName}
//                 onChange={(event) => setSchoolName(event.target.value)}
//                 maxLength={200}
//                 disabled={isSaving}
//                 placeholder="Enter school name"
//                 className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100 disabled:cursor-not-allowed disabled:opacity-60"
//               />
//             </div>

//             {/* =================================================
//                 SLOGAN
//             ================================================== */}

//             <div>
//               <div className="mb-2 flex items-center justify-between">
//                 <label
//                   htmlFor="school-slogan"
//                   className="text-sm font-semibold text-slate-700">
//                   Slogan / Tagline
//                 </label>

//                 <span className="text-[10px] text-slate-400">
//                   {slogan.length}/300
//                 </span>
//               </div>

//               <input
//                 id="school-slogan"
//                 type="text"
//                 value={slogan}
//                 onChange={(event) => setSlogan(event.target.value)}
//                 maxLength={300}
//                 disabled={isSaving}
//                 placeholder="Quality Education • Discipline • Morality"
//                 className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100 disabled:cursor-not-allowed disabled:opacity-60"
//               />
//             </div>

//             {/* =================================================
//                 INFORMATION
//             ================================================== */}

//             <div className="rounded-xl border border-violet-100 bg-violet-50 p-4">
//               <div className="flex gap-3">
//                 <div className="mt-0.5">
//                   <ImagePlus size={17} className="text-violet-500" />
//                 </div>

//                 <div>
//                   <p className="text-xs font-semibold text-violet-700">
//                     Header Preview Information
//                   </p>

//                   <p className="mt-1 text-[11px] leading-5 text-violet-500">
//                     Your logo, school name and slogan will be displayed in the
//                     website header after saving.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* =====================================================
//             FOOTER
//         ====================================================== */}

//         <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4 sm:flex-row sm:items-center sm:justify-end">
//           <button
//             type="button"
//             onClick={handleClose}
//             disabled={isSaving}
//             className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50">
//             Cancel
//           </button>

//           <button
//             type="button"
//             onClick={handleSave}
//             disabled={isSaving || !schoolName.trim()}
//             className="flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50">
//             {isSaving ? (
//               <>
//                 <Loader2 size={16} className="animate-spin" />

//                 {isEditMode ? "Updating..." : "Creating..."}
//               </>
//             ) : (
//               <>
//                 <Save size={16} />

//                 {isEditMode ? "Update Header" : "Save Header"}
//               </>
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SchoolHeaderDialog;
