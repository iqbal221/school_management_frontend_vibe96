"use client";

import {
  ISchoolHeader,
  useGetSchoolHeaderQuery,
} from "@/redux/api/website/home/schoolHeaderApi";

import { ImagePlus, RefreshCw, School } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import SchoolHeaderDialog from "./DialogBoxSchoolHeader";

const SchoolHeaderSection = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // =========================================================
  // GET SCHOOL HEADER FROM DATABASE
  // =========================================================

  const {
    data: response,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetSchoolHeaderQuery();

  console.log(response);

  // =========================================================
  // NORMALIZE API RESPONSE
  // =========================================================
  // API can return:
  //
  // data: ISchoolHeader[]
  // data: ISchoolHeader
  // data: null
  //
  // We always convert it to:
  //
  // ISchoolHeader | null
  // =========================================================

  const schoolHeader: ISchoolHeader | null = (() => {
    if (!response) {
      return null;
    }

    if (Array.isArray(response)) {
      return response[0] ?? null;
    }

    return response;
  })();

  console.log(schoolHeader);

  return (
    <>
      {/* =======================================================
          SCHOOL HEADER CARD
      ======================================================== */}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-4">
          {/* LEFT SIDE */}

          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
              <School size={20} />
            </div>

            <div className="min-w-0">
              <h2 className="text-2xl font-bold text-slate-800">
                School Header
              </h2>

              <p className="mt-0.5 text-xs text-slate-500">
                Manage your school logo, name and header information.
              </p>
            </div>
          </div>

          {/* EDIT / ADD BUTTON */}

          <button
            type="button"
            onClick={() => setIsDialogOpen(true)}
            disabled={isLoading}
            className="flex shrink-0 items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60">
            <ImagePlus size={17} />

            {schoolHeader ? "Edit Header" : "Add Header"}
          </button>
        </div>

        {/* =====================================================
            CONTENT
        ====================================================== */}

        <div className="p-5">
          {/* ===================================================
              LOADING
          ==================================================== */}

          {isLoading ? (
            <SchoolHeaderSkeleton />
          ) : /* =================================================
              ERROR
          ================================================== */
          isError ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
              <School size={30} className="mx-auto mb-3 text-red-400" />

              <p className="text-sm font-semibold text-red-600">
                Failed to load school header
              </p>

              <p className="mt-1 text-xs text-red-400">
                Something went wrong while loading the header information.
              </p>

              <button
                type="button"
                onClick={() => refetch()}
                disabled={isFetching}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60">
                <RefreshCw
                  size={14}
                  className={isFetching ? "animate-spin" : ""}
                />

                {isFetching ? "Retrying..." : "Try Again"}
              </button>
            </div>
          ) : /* =================================================
              NO DATABASE DATA
          ================================================== */
          !schoolHeader ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm">
                <School size={25} className="text-slate-300" />
              </div>

              <p className="text-sm font-semibold text-slate-600">
                School header is not configured
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Click &quot;Add Header&quot; to configure your school header.
              </p>
            </div>
          ) : (
            /* =================================================
              DATABASE DATA
          ================================================== */
            <div className="grid gap-6 lg:grid-cols-[180px_1fr]">
              {/* =================================================
                  SCHOOL LOGO
              ================================================== */}

              <div>
                <p className="mb-2 text-sm font-semibold text-slate-700">
                  School Logo
                </p>

                <div className="flex min-h-[170px] items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                  {schoolHeader.logo ? (
                    <Image
                      src={schoolHeader.logo[0]}
                      alt={schoolHeader.schoolName || "School Logo"}
                      width={150}
                      height={150}
                      unoptimized
                      className="h-[140px] w-[140px] object-contain"
                    />
                  ) : (
                    <div className="text-center">
                      <School
                        size={38}
                        className="mx-auto mb-2 text-slate-300"
                      />

                      <p className="text-xs font-medium text-slate-400">
                        No logo available
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* =================================================
                  SCHOOL INFORMATION
              ================================================== */}

              <div className="grid content-center gap-4">
                <InfoItem
                  label="School Name"
                  value={
                    schoolHeader.schoolName?.trim() ||
                    "School name not configured"
                  }
                />

                <InfoItem
                  label="Slogan / Tagline"
                  value={schoolHeader.slogan?.trim() || "No slogan configured"}
                />
              </div>
            </div>
          )}

          {/* =====================================================
              BACKGROUND FETCHING INDICATOR
          ====================================================== */}

          {isFetching && !isLoading && !isError && (
            <div className="mt-4 flex items-center justify-end gap-2 text-xs font-medium text-violet-500">
              <RefreshCw size={13} className="animate-spin" />
              Updating...
            </div>
          )}
        </div>
      </section>

      {/* =======================================================
          SCHOOL HEADER DIALOG
      ======================================================== */}

      <SchoolHeaderDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        schoolHeader={schoolHeader}
      />
    </>
  );
};

export default SchoolHeaderSection;

// =========================================================
// INFO ITEM
// =========================================================

interface InfoItemProps {
  label: string;
  value: string;
}

const InfoItem = ({ label, value }: InfoItemProps) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="break-words text-sm font-semibold text-slate-700">
        {value}
      </p>
    </div>
  );
};

// =========================================================
// SKELETON
// =========================================================

const SchoolHeaderSkeleton = () => {
  return (
    <div className="grid animate-pulse gap-6 lg:grid-cols-[180px_1fr]">
      {/* LOGO */}

      <div>
        <div className="mb-2 h-5 w-24 rounded bg-slate-100" />

        <div className="flex h-[170px] items-center justify-center rounded-2xl border border-slate-200 bg-slate-50">
          <div className="h-[120px] w-[120px] rounded-xl bg-slate-100" />
        </div>
      </div>

      {/* INFORMATION */}

      <div className="grid content-center gap-4">
        <div className="h-[76px] rounded-xl bg-slate-100" />

        <div className="h-[76px] rounded-xl bg-slate-100" />

        <div className="h-[76px] rounded-xl bg-slate-100" />
      </div>
    </div>
  );
};
