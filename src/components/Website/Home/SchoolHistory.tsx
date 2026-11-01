"use client";

import {
  useCreateSchoolHistoryMutation,
  useGetSchoolHistoryQuery,
  useUpdateSchoolHistoryMutation,
} from "@/redux/api/website/home/schoolHistoryApi";
import {
  BookOpen,
  CheckCircle2,
  FileText,
  Loader2,
  Plus,
  Save,
  Pencil,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

// ==========================================
// TYPES
// ==========================================
interface ISchoolHistory {
  id: string;
  sectionTitle: string;
  aboutSchool: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ISchoolHistoryResponse {
  success: boolean;
  message: string;
  data: ISchoolHistory | null;
}

interface IApiError {
  data?: {
    success?: boolean;
    message?: string;
    errorMessages?: Array<{
      message?: string;
    }>;
  };
  message?: string;
}

// ==========================================
// COMPONENT
// ==========================================
const SchoolHistory = () => {
  // ========================================
  // FORM STATE
  // ========================================
  const [sectionTitle, setSectionTitle] = useState("");
  const [aboutSchool, setAboutSchool] = useState("");

  // ========================================
  // EDIT MODE
  // ========================================
  const [isEditing, setIsEditing] = useState(false);

  // ========================================
  // GET SCHOOL HISTORY
  // ========================================
  const {
    data: schoolHistoryResponse,
    isLoading: isSchoolHistoryLoading,
    isFetching: isSchoolHistoryFetching,
    isError: isSchoolHistoryError,
    refetch,
  } = useGetSchoolHistoryQuery();

  // ========================================
  // CREATE
  // ========================================
  const [createSchoolHistory, { isLoading: isCreating }] =
    useCreateSchoolHistoryMutation();

  // ========================================
  // UPDATE
  // ========================================
  const [updateSchoolHistory, { isLoading: isUpdating }] =
    useUpdateSchoolHistoryMutation();

  // ========================================
  // DATABASE DATA
  // ========================================
  const schoolHistory: any =
    (schoolHistoryResponse as ISchoolHistoryResponse | undefined)
       ?? null;

  const hasSchoolHistory = Boolean(schoolHistory?.id);

  // ========================================
  // LOAD DATABASE DATA
  // ========================================
  useEffect(() => {
    if (schoolHistory) {
      setSectionTitle(schoolHistory.sectionTitle || "");
      setAboutSchool(schoolHistory.aboutSchool || "");
    }
  }, [schoolHistory]);

  // ========================================
  // ERROR MESSAGE
  // ========================================
  const getErrorMessage = (
    error: unknown,
    defaultMessage: string,
  ): string => {
    const apiError = error as IApiError;

    // Normal API message
    if (typeof apiError?.data?.message === "string") {
      return apiError.data.message;
    }

    // Validation messages
    if (
      Array.isArray(apiError?.data?.errorMessages) &&
      apiError.data.errorMessages.length > 0
    ) {
      const message = apiError.data.errorMessages
        .map((item) => item?.message)
        .filter(Boolean)
        .join(", ");

      if (message) {
        return message;
      }
    }

    // General error message
    if (typeof apiError?.message === "string") {
      return apiError.message;
    }

    return defaultMessage;
  };

  // ========================================
  // VALIDATE FORM
  // ========================================
  const validateForm = (): boolean => {
    const title = sectionTitle.trim();
    const about = aboutSchool.trim();

    if (!title) {
      toast.error("Please enter section title");
      return false;
    }

    if (!about) {
      toast.error("Please enter about school information");
      return false;
    }

    if (title.length > 200) {
      toast.error("Section title cannot exceed 200 characters");
      return false;
    }

    if (about.length > 5000) {
      toast.error("About school cannot exceed 5000 characters");
      return false;
    }

    return true;
  };

  // ========================================
  // ADD SCHOOL HISTORY
  // ========================================
  const handleAddSchoolHistory = async () => {
    if (!validateForm()) {
      return;
    }

    if (hasSchoolHistory) {
      toast.info(
        "School history already exists. Please use Update.",
      );
      return;
    }

    try {
      await createSchoolHistory({
        sectionTitle: sectionTitle.trim(),
        aboutSchool: aboutSchool.trim(),
      }).unwrap();

      toast.success(
        "School history added successfully",
      );

      // Clear form
      setSectionTitle("");
      setAboutSchool("");

      // Refresh data
      await refetch();
    } catch (error) {
      console.error(
        "Create school history error:",
        error,
      );

      toast.error(
        getErrorMessage(
          error,
          "Failed to add school history",
        ),
      );

      await refetch();
    }
  };

  // ========================================
  // START UPDATE / EDIT MODE
  // ========================================
  const handleStartEdit = () => {
    if (!schoolHistory) {
      return;
    }

    setSectionTitle(
      schoolHistory.sectionTitle || "",
    );

    setAboutSchool(
      schoolHistory.aboutSchool || "",
    );

    setIsEditing(true);
  };

  // ========================================
  // CANCEL UPDATE
  // ========================================
  const handleCancelEdit = () => {
    if (schoolHistory) {
      setSectionTitle(
        schoolHistory.sectionTitle || "",
      );

      setAboutSchool(
        schoolHistory.aboutSchool || "",
      );
    }

    setIsEditing(false);
  };

  // ========================================
  // UPDATE SCHOOL HISTORY
  // ========================================
  const handleUpdateSchoolHistory = async () => {
    if (!validateForm()) {
      return;
    }

    if (!hasSchoolHistory) {
      toast.info(
        "School history not found. Please add it first.",
      );
      return;
    }

    try {
      await updateSchoolHistory({
        sectionTitle: sectionTitle.trim(),
        aboutSchool: aboutSchool.trim(),
      }).unwrap();

      toast.success(
        "School history updated successfully",
      );

      // Exit edit mode
      setIsEditing(false);

      // Refresh database data
      await refetch();
    } catch (error) {
      console.error(
        "Update school history error:",
        error,
      );

      toast.error(
        getErrorMessage(
          error,
          "Failed to update school history",
        ),
      );
    }
  };

  // ========================================
  // FORMAT DATE
  // ========================================
  const formatDate = (date?: string) => {
    if (!date) return "";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "";
    }

    return parsedDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ========================================
  // LOADING
  // ========================================
  if (isSchoolHistoryLoading) {
    return (
      <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100">
              <BookOpen
                size={21}
                className="text-blue-600"
              />
            </div>

            <div>
              <div className="h-5 w-40 animate-pulse rounded bg-slate-200" />
              <div className="mt-2 h-3 w-64 animate-pulse rounded bg-slate-100" />
            </div>
          </div>
        </div>

        <div className="space-y-5 p-5">
          <div className="animate-pulse">
            <div className="mb-2 h-4 w-28 rounded bg-slate-200" />
            <div className="h-12 rounded-xl bg-slate-100" />
          </div>

          <div className="animate-pulse">
            <div className="mb-2 h-4 w-32 rounded bg-slate-200" />
            <div className="h-40 rounded-xl bg-slate-100" />
          </div>
        </div>
      </section>
    );
  }

  // ========================================
  // MAIN UI
  // ========================================
  return (
    <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* ======================================================
          HEADER
      ======================================================= */}
      <div className="border-b border-slate-200 bg-white px-5 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* LEFT */}
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              <BookOpen size={21} />
            </div>

            <div className="min-w-0">
              <h2 className="text-2xl font-bold text-slate-800">
                School History
              </h2>

              <p className="mt-0.5 text-xs text-slate-500">
                Manage your school section title and
                information.
              </p>
            </div>
          </div>

          {/* STATUS */}
          <div className="hidden sm:block">
            {hasSchoolHistory ? (
              <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2">
                <CheckCircle2
                  size={16}
                  className="text-emerald-600"
                />

                <span className="text-xs font-semibold text-emerald-600">
                  Available
                </span>
              </div>
            ) : (
              <div className="rounded-xl bg-amber-50 px-4 py-2">
                <span className="text-xs font-semibold text-amber-600">
                  Not Added
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ======================================================
          CONTENT
      ======================================================= */}
      <div className="p-5">
        {/* FETCHING */}
        {isSchoolHistoryFetching &&
          !isSchoolHistoryLoading && (
            <div className="mb-4 flex items-center gap-2 text-xs font-medium text-blue-500">
              <Loader2
                size={13}
                className="animate-spin"
              />
              Refreshing school history...
            </div>
          )}

        {/* ERROR */}
        {isSchoolHistoryError && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="text-sm font-semibold text-red-600">
              Failed to load school history
            </p>

            <p className="mt-1 text-xs text-red-400">
              Something went wrong while loading the
              school history.
            </p>

            <button
              type="button"
              onClick={() => refetch()}
              className="mt-3 rounded-lg bg-red-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-600"
            >
              Try Again
            </button>
          </div>
        )}

        {/* ====================================================
            NO DATABASE DATA
        ===================================================== */}
        {!hasSchoolHistory ? (
          <>
            {/* ADD FORM */}
            <div>
              {/* SECTION TITLE */}
              <div className="mb-5">
                <label
                  htmlFor="school-section-title"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Section Title
                </label>

                <div className="relative">
                  <input
                    id="school-section-title"
                    type="text"
                    maxLength={200}
                    value={sectionTitle}
                    onChange={(e) =>
                      setSectionTitle(
                        e.target.value,
                      )
                    }
                    disabled={
                      isCreating || isUpdating
                    }
                    placeholder="About Our School"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-20 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                  />

                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-medium text-slate-400">
                    {sectionTitle.length}/200
                  </span>
                </div>
              </div>

              {/* ABOUT SCHOOL */}
              <div className="mb-5">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label
                    htmlFor="about-school"
                    className="block text-sm font-semibold text-slate-700"
                  >
                    About School
                  </label>

                  <span className="text-[10px] font-medium text-slate-400">
                    {aboutSchool.length}/5000
                  </span>
                </div>

                <textarea
                  id="about-school"
                  maxLength={5000}
                  rows={10}
                  value={aboutSchool}
                  onChange={(e) =>
                    setAboutSchool(
                      e.target.value,
                    )
                  }
                  disabled={
                    isCreating || isUpdating
                  }
                  placeholder="Write about your school, its history, mission, vision, achievements, and educational journey..."
                  className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>

              {/* ADD BUTTON */}
              <div className="flex justify-end border-t border-slate-100 pt-5">
                <button
                  type="button"
                  onClick={
                    handleAddSchoolHistory
                  }
                  disabled={
                    isCreating ||
                    isUpdating ||
                    !sectionTitle.trim() ||
                    !aboutSchool.trim()
                  }
                  className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isCreating ? (
                    <>
                      <Loader2
                        size={17}
                        className="animate-spin"
                      />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus size={17} />
                      Add School History
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* NOT ADDED */}
            <div className="mt-5">
              <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
                <FileText
                  size={18}
                  className="mt-0.5 shrink-0 text-amber-600"
                />

                <div>
                  <p className="text-sm font-semibold text-amber-700">
                    School history has not been added
                  </p>

                  <p className="mt-1 text-xs leading-5 text-amber-600">
                    Enter the section title and
                    school information above, then
                    click Add School History.
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* ==================================================
             DATABASE DATA EXISTS
          ================================================== */
          <>
            {!isEditing ? (
              /* ==================================================
                 VIEW MODE
              ================================================== */
              <>
                {/* SECTION TITLE */}
                <div className="mb-5">
                  <p className="mb-2 text-sm font-semibold text-slate-700">
                    Section Title
                  </p>

                  <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <p className="text-sm font-medium text-slate-800">
                      {schoolHistory?.sectionTitle}
                    </p>
                  </div>
                </div>

                {/* ABOUT SCHOOL */}
                <div className="mb-5">
                  <p className="mb-2 text-sm font-semibold text-slate-700">
                    About School
                  </p>

                  <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4">
                    <p className="whitespace-pre-wrap text-sm leading-7 text-slate-700">
                      {schoolHistory?.aboutSchool}
                    </p>
                  </div>
                </div>

                {/* UPDATE BUTTON */}
                <div className="flex justify-end border-t border-slate-100 pt-5">
                  <button
                    type="button"
                    onClick={handleStartEdit}
                    className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 active:scale-[0.98]"
                  >
                    <Pencil size={17} />
                    Update School History
                  </button>
                </div>

                {/* AVAILABLE STATUS */}
                <div className="mt-5">
                  <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                    <CheckCircle2
                      size={18}
                      className="mt-0.5 shrink-0 text-emerald-600"
                    />

                    <div>
                      <p className="text-sm font-semibold text-emerald-700">
                        School history is available
                      </p>

                      <p className="mt-1 text-xs leading-5 text-emerald-600">
                        Your school history information
                        has been saved successfully.
                      </p>

                      {schoolHistory?.updatedAt && (
                        <p className="mt-2 text-[10px] font-medium text-emerald-500">
                          Last updated:{" "}
                          {formatDate(
                            schoolHistory.updatedAt,
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* CREATED DATE */}
                {schoolHistory?.createdAt && (
                  <div className="mt-4 text-right">
                    <span className="text-[10px] text-slate-400">
                      Created:{" "}
                      {formatDate(
                        schoolHistory.createdAt,
                      )}
                    </span>
                  </div>
                )}
              </>
            ) : (
              /* ==================================================
                 EDIT MODE
              ================================================== */
              <>
                <div className="mb-5">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-slate-800">
                        Update School History
                      </h3>

                      <p className="mt-1 text-xs text-slate-500">
                        Edit the information and save
                        your changes.
                      </p>
                    </div>

                    {/* CANCEL */}
                    <button
                      type="button"
                      onClick={
                        handleCancelEdit
                      }
                      disabled={isUpdating}
                      className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <X size={15} />
                      Cancel
                    </button>
                  </div>

                  {/* SECTION TITLE */}
                  <div className="mb-5">
                    <label
                      htmlFor="update-school-section-title"
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      Section Title
                    </label>

                    <div className="relative">
                      <input
                        id="update-school-section-title"
                        type="text"
                        maxLength={200}
                        value={sectionTitle}
                        onChange={(e) =>
                          setSectionTitle(
                            e.target.value,
                          )
                        }
                        disabled={isUpdating}
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-20 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                      />

                      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-medium text-slate-400">
                        {sectionTitle.length}/200
                      </span>
                    </div>
                  </div>

                  {/* ABOUT SCHOOL */}
                  <div>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <label
                        htmlFor="update-about-school"
                        className="block text-sm font-semibold text-slate-700"
                      >
                        About School
                      </label>

                      <span className="text-[10px] font-medium text-slate-400">
                        {aboutSchool.length}/5000
                      </span>
                    </div>

                    <textarea
                      id="update-about-school"
                      maxLength={5000}
                      rows={10}
                      value={aboutSchool}
                      onChange={(e) =>
                        setAboutSchool(
                          e.target.value,
                        )
                      }
                      disabled={isUpdating}
                      className="w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                    />
                  </div>
                </div>

                {/* UPDATE BUTTON */}
                <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    disabled={isUpdating}
                    className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <X size={17} />
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={
                      handleUpdateSchoolHistory
                    }
                    disabled={
                      isUpdating ||
                      !sectionTitle.trim() ||
                      !aboutSchool.trim()
                    }
                    className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isUpdating ? (
                      <>
                        <Loader2
                          size={17}
                          className="animate-spin"
                        />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save size={17} />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default SchoolHistory;