
"use client";

import {
  ISliderBanner,
  useCreateSliderBannerMutation,
  useGetSliderBannersQuery,
  useUpdateSliderBannerMutation,
} from "@/redux/api/website/home/sliderImageApi";
import { ImagePlus, Loader2, Plus, Upload } from "lucide-react";
import Image from "next/image";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "image/webp",
];

const SliderBannerImage = () => {
  // =========================================================
  // GET HERO SLIDERS
  // =========================================================

  const {
    data: response,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetSliderBannersQuery();

  console.log("slider data response:", response);

  // =========================================================
  // NORMALIZE RESPONSE
  // =========================================================

  const heroSlides: ISliderBanner[] = Array.isArray(response)
    ? response
    : [];

  console.log("heroSlides:", heroSlides);

  // =========================================================
  // MUTATIONS
  // =========================================================

  const [createSliderBanner, { isLoading: isCreating }] =
    useCreateSliderBannerMutation();

  const [updateSliderBanner, { isLoading: isUpdating }] =
    useUpdateSliderBannerMutation();

  // =========================================================
  // STATE
  // =========================================================

  const [selectedFiles, setSelectedFiles] = useState<
    Record<string, File | undefined>
  >({});

  const [previews, setPreviews] = useState<Record<string, string>>({});

  const [isAdding, setIsAdding] = useState(false);

  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Hidden file input for ADD
  const addInputRef = useRef<HTMLInputElement | null>(null);

  // =========================================================
  // CLEANUP LOCAL PREVIEWS
  // =========================================================

  useEffect(() => {
    return () => {
      Object.values(previews).forEach((url) => {
        if (url) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [previews]);

  // =========================================================
  // ERROR MESSAGE
  // =========================================================

  const getErrorMessage = (error: unknown): string => {
    const apiError = error as {
      data?: {
        message?: string;
        errorMessages?: string | Array<{ message?: string }>;
      };
      message?: string;
    };

    if (typeof apiError?.data?.message === "string") {
      return apiError.data.message;
    }

    if (typeof apiError?.data?.errorMessages === "string") {
      return apiError.data.errorMessages;
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
  // VALIDATE IMAGE
  // =========================================================

  const validateImage = (file: File): boolean => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("Only JPG, PNG and WEBP images are allowed");
      return false;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("Slider image must be less than 5MB");
      return false;
    }

    return true;
  };

  // =========================================================
  // OPEN ADD FILE SELECTOR
  // =========================================================

  const handleAddSlideClick = () => {
    if (isAdding || isCreating) {
      return;
    }

    addInputRef.current?.click();
  };

  // =========================================================
  // ADD NEW SLIDER IMAGE
  // =========================================================

  const handleAddSlide = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    // Allow selecting same image again
    event.target.value = "";

    if (!file) {
      return;
    }

    if (!validateImage(file)) {
      return;
    }

    setIsAdding(true);

    try {
      const formData = new FormData();

      // Backend expects JSON inside "data"
      formData.append(
        "data",
        JSON.stringify({
          isActive: true,
        }),
      );

      // Backend multer field
      formData.append("file", file);

      console.log("========== CREATE HERO SLIDER ==========");
      console.log("FILE:", file);
      console.log("FILE NAME:", file.name);
      console.log("DATA:", {
        isActive: true,
      });

      await createSliderBanner(formData).unwrap();

      toast.success("Hero slider added successfully");

      await refetch();
    } catch (error) {
      console.error("Create hero slider error:", error);

      toast.error(getErrorMessage(error));
    } finally {
      setIsAdding(false);
    }
  };

  // =========================================================
  // SELECT NEW IMAGE FOR EXISTING SLIDER
  // =========================================================

  const handleImageChange = (
    event: ChangeEvent<HTMLInputElement>,
    slideId: string,
  ) => {
    const file = event.target.files?.[0];

    // Allow selecting same file again
    event.target.value = "";

    if (!file) {
      return;
    }

    if (!validateImage(file)) {
      return;
    }

    // Remove previous local preview
    const oldPreview = previews[slideId];

    if (oldPreview) {
      URL.revokeObjectURL(oldPreview);
    }

    // Save selected file
    setSelectedFiles((previous) => ({
      ...previous,
      [slideId]: file,
    }));

    // Create preview
    const previewUrl = URL.createObjectURL(file);

    setPreviews((previous) => ({
      ...previous,
      [slideId]: previewUrl,
    }));
  };

  // =========================================================
  // UPDATE EXISTING SLIDER IMAGE
  // =========================================================

  const handleUpdateImage = async (
    slide: ISliderBanner,
  ) => {
    const file = selectedFiles[slide.id];

    if (!file) {
      toast.error("Please select a new image first");
      return;
    }

    if (!slide.id) {
      toast.error("Slider ID is missing");
      return;
    }

    setUpdatingId(slide.id);

    try {
      const formData = new FormData();

      // Backend expects JSON data
      formData.append(
        "data",
        JSON.stringify({
          isActive: slide.isActive ?? true,
        }),
      );

      // New image
      formData.append("file", file);

      console.log("========== UPDATE HERO SLIDER ==========");
      console.log("ID:", slide.id);
      console.log("FILE:", file);
      console.log("FILE NAME:", file.name);

      await updateSliderBanner({
        id: slide.id,
        data: formData,
      }).unwrap();

      toast.success("Slider image updated successfully");

      // Remove selected file
      setSelectedFiles((previous) => {
        const updated = { ...previous };

        delete updated[slide.id];

        return updated;
      });

      // Remove preview
      const oldPreview = previews[slide.id];

      if (oldPreview) {
        URL.revokeObjectURL(oldPreview);
      }

      setPreviews((previous) => {
        const updated = { ...previous };

        delete updated[slide.id];

        return updated;
      });

      await refetch();
    } catch (error) {
      console.error("Update hero slider error:", error);

      toast.error(getErrorMessage(error));
    } finally {
      setUpdatingId(null);
    }
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (isLoading) {
    return (
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <SliderBannerHeader
          onAdd={handleAddSlideClick}
          disabled
        />

        <div className="p-5">
          <SliderBannerSkeleton />
        </div>
      </section>
    );
  }

  // =========================================================
  // UI
  // =========================================================

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* =====================================================
          HEADER
      ====================================================== */}

      <SliderBannerHeader
        onAdd={handleAddSlideClick}
        disabled={isAdding || isCreating}
        isAdding={isAdding}
      />

      {/* =====================================================
          HIDDEN ADD INPUT
      ====================================================== */}

      <input
        ref={addInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={handleAddSlide}
        className="hidden"
      />

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <div className="p-5">
        {/* ===================================================
            ERROR
        ==================================================== */}

        {isError && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
            <ImagePlus
              size={35}
              className="mx-auto mb-3 text-red-400"
            />

            <p className="text-sm font-semibold text-red-600">
              Failed to load hero sliders
            </p>

            <p className="mt-1 text-xs text-red-400">
              Something went wrong while loading slider images.
            </p>

            <button
              type="button"
              onClick={() => refetch()}
              className="mt-4 rounded-lg bg-red-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-600"
            >
              Try Again
            </button>
          </div>
        )}

        {/* ===================================================
            EMPTY
        ==================================================== */}

        {!isError && heroSlides.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
              <ImagePlus
                size={30}
                className="text-slate-300"
              />
            </div>

            <p className="text-sm font-semibold text-slate-600">
              No hero slider found
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Click &quot;Add Slide&quot; to upload your first
              slider image.
            </p>

            <button
              type="button"
              onClick={handleAddSlideClick}
              disabled={isAdding || isCreating}
              className="mx-auto mt-4 flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus size={16} />
              Add Slider Image
            </button>
          </div>
        )}

        {/* ===================================================
            SLIDER IMAGES - COLUMN / GRID LAYOUT
        ==================================================== */}

        {!isError && heroSlides.length > 0 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {heroSlides.map((slide, index) => {
              const selectedFile =
                selectedFiles[slide.id];

              const preview = previews[slide.id];

              const currentImage =
                preview || slide.image || "";

              const isThisUpdating =
                updatingId === slide.id;

              return (
                <div
                  key={slide.id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-violet-200 hover:shadow-sm"
                >
                  {/* =================================================
                      SLIDE HEADER
                  ================================================== */}

                  <div className="mb-4 flex items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="shrink-0 rounded-lg bg-violet-100 px-3 py-1 text-xs font-bold text-violet-700">
                        Slide {index + 1}
                      </span>

                      {slide.isActive && (
                        <span className="rounded-lg bg-emerald-100 px-3 py-1 text-[10px] font-semibold text-emerald-600">
                          Active
                        </span>
                      )}
                    </div>

                    {isFetching && (
                      <span className="shrink-0 text-[10px] font-medium text-violet-500">
                        Updating...
                      </span>
                    )}
                  </div>

                  {/* =================================================
                      IMAGE PREVIEW
                  ================================================== */}

                  <div>
                    <p className="mb-2 text-sm font-semibold text-slate-700">
                      Slider Image
                    </p>

                    <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-slate-200 bg-white">
                      {currentImage ? (
                        <Image
                          src={currentImage}
                          alt={`Slider ${index + 1}`}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-center">
                          <div>
                            <ImagePlus
                              size={40}
                              className="mx-auto mb-3 text-slate-300"
                            />

                            <p className="text-xs font-medium text-slate-400">
                              No image uploaded
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* =================================================
                      CHANGE IMAGE
                  ================================================== */}

                  <div className="mt-4">
                    <p className="mb-2 text-sm font-semibold text-slate-700">
                      Change Image
                    </p>

                    <label
                      className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-600 ${
                        isThisUpdating || isUpdating
                          ? "pointer-events-none opacity-50"
                          : ""
                      }`}
                    >
                      <Upload size={17} />

                      Choose New Image

                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        disabled={
                          isThisUpdating || isUpdating
                        }
                        onChange={(event) =>
                          handleImageChange(
                            event,
                            slide.id,
                          )
                        }
                        className="hidden"
                      />
                    </label>

                    <p className="mt-2 text-[11px] text-slate-400">
                      JPG, PNG or WEBP
                    </p>

                    <p className="mt-1 text-[11px] text-slate-400">
                      Maximum file size: 5MB
                    </p>

                    {/* =================================================
                        SELECTED FILE
                    ================================================== */}

                    {selectedFile && (
                      <div className="mt-3 rounded-lg border border-violet-100 bg-violet-50 px-3 py-2">
                        <p className="truncate text-xs font-medium text-violet-600">
                          {selectedFile.name}
                        </p>
                      </div>
                    )}

                    {/* =================================================
                        UPDATE BUTTON
                    ================================================== */}

                    <button
                      type="button"
                      onClick={() =>
                        handleUpdateImage(slide)
                      }
                      disabled={
                        isThisUpdating ||
                        isUpdating ||
                        !selectedFile
                      }
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isThisUpdating ? (
                        <>
                          <Loader2
                            size={16}
                            className="animate-spin"
                          />

                          Updating...
                        </>
                      ) : (
                        <>
                          <Upload size={16} />

                          Update Image
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default SliderBannerImage;

// =========================================================
// HEADER
// =========================================================

interface SliderBannerHeaderProps {
  onAdd: () => void;
  disabled?: boolean;
  isAdding?: boolean;
}

const SliderBannerHeader = ({
  onAdd,
  disabled = false,
  isAdding = false,
}: SliderBannerHeaderProps) => {
  return (
    <div className="flex flex-col gap-4 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
          <ImagePlus size={20} />
        </div>

        <div className="min-w-0">
          <h2 className="text-2xl font-bold text-slate-800">
            Hero Slider
          </h2>

          <p className="mt-0.5 text-xs text-slate-500">
            Manage homepage slider images.
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onAdd}
        disabled={disabled}
        className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isAdding ? (
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

            Add Slide
          </>
        )}
      </button>
    </div>
  );
};

// =========================================================
// SKELETON
// =========================================================

const SliderBannerSkeleton = () => {
  return (
    <div className="grid grid-cols-1 gap-5 animate-pulse sm:grid-cols-2 xl:grid-cols-3">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
        >
          <div className="mb-4 h-6 w-20 rounded-lg bg-slate-200" />

          <div className="aspect-video rounded-2xl bg-slate-200" />

          <div className="mt-4 space-y-3">
            <div className="h-5 w-24 rounded bg-slate-200" />

            <div className="h-12 rounded-xl bg-slate-200" />

            <div className="h-4 w-32 rounded bg-slate-200" />

            <div className="h-10 rounded-xl bg-slate-200" />
          </div>
        </div>
      ))}
    </div>
  );
};
