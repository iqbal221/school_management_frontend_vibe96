"use client";

import Loader from "@/components/Loader";
import PrintButton from "@/components/PrintButton";
import { useUsersQuery } from "@/redux/api/userApi";
import Image from "next/image";
import Link from "next/link";
import React, { useMemo, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import {
  UserRound,
  Mail,
  Phone,
  PhoneCall,
  Droplets,
  CalendarDays,
  VenusAndMars,
  MapPin,
  BriefcaseBusiness,
  ShieldCheck,
  Pencil,
  BadgeCheck,
  UserCog,
  CircleUserRound,
  IdCard,
} from "lucide-react";
import { IUser } from "@/types/common";

const SuperAdminProfilePage = () => {
  const componentRef = useRef<HTMLDivElement | null>(null);

  const query: Record<string, any> = {
    limit: 10,
    page: 1,
    sortBy: "",
    sortOrder: "",
  };

  const { data, isLoading, isError } = useUsersQuery(query);

  const superAdminData = useMemo(() => {
    return (
      data?.Users?.filter((item: IUser) => item?.role === "super_admin") || []
    );
  }, [data]);

  const superAdmin = superAdminData[0];

  /* =========================================================
     PRINT
  ========================================================= */

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `${superAdmin?.name || "Super Admin"} - Profile`,
  });

  /* =========================================================
     FORMAT VALUE
  ========================================================= */

  const formatValue = (value: any) => {
    if (value === null || value === undefined || String(value).trim() === "") {
      return "Not provided";
    }

    return String(value)
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-100 px-3 py-5 sm:px-5 lg:px-8">
        <div className="mx-auto flex min-h-[450px] max-w-7xl items-center justify-center rounded-3xl border border-slate-200 bg-white shadow-sm">
          <Loader />
        </div>
      </main>
    );
  }

  /* =========================================================
     ERROR
  ========================================================= */

  if (isError) {
    return (
      <main className="min-h-screen bg-slate-100 px-3 py-5 sm:px-5 lg:px-8">
        <div className="mx-auto flex min-h-[450px] max-w-7xl items-center justify-center">
          <div className="w-full max-w-md rounded-3xl border border-red-100 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-red-50 text-red-500">
              <ShieldCheck size={38} />
            </div>

            <h2 className="mt-6 text-xl font-bold text-slate-800">
              Unable to Load Profile
            </h2>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
              Something went wrong while loading the super administrator
              information. Please try again later.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 px-3 py-5 sm:px-5 lg:px-6">
      <div className="mx-auto max-w-7xl">
        {/* =====================================================
            UPPER HEADER
        ====================================================== */}

        <section className="mb-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm print:hidden">
          {/* HEADER */}

          <div className="relative overflow-hidden border-b border-slate-100 px-5 py-7 sm:px-8">
            {/* Decorative background */}

            <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 rounded-full bg-blue-50 blur-2xl" />

            <div className="pointer-events-none absolute bottom-0 right-32 h-24 w-24 rounded-full bg-indigo-50 blur-2xl" />

            <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              {/* TITLE */}

              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-200">
                  <ShieldCheck size={27} />
                </div>

                <div>
                  <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                    Super Admin Profile
                  </h1>

                  <p className="mt-1 text-sm text-slate-500">
                    Manage and view super administrator information.
                  </p>
                </div>
              </div>

              {/* PRINT */}

              <div className="flex items-center">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-1">
                  <PrintButton handlePrint={handlePrint} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            PROFILE
        ====================================================== */}

        {!superAdmin ? (
          <div className="rounded-3xl border border-slate-200 bg-white px-6 py-20 text-center shadow-sm">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-100 text-slate-400">
              <CircleUserRound size={38} />
            </div>

            <h2 className="mt-6 text-xl font-bold text-slate-800">
              No Super Administrator Found
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              No super administrator profile is currently available. Please
              create a super administrator account to view the profile.
            </p>
          </div>
        ) : (
          <div>
            {/* =================================================
                ACTION BAR
            ================================================== */}

            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between print:hidden">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-blue-600">
                  Profile Overview
                </p>

                <h2 className="mt-1 text-lg font-bold text-slate-900">
                  Super Administrator Information
                </h2>
              </div>

              <Link href={`/profile/superAdmin/edit/${superAdmin.id}`}>
                <button
                  type="button"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-slate-200 transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-600 hover:shadow-blue-200 sm:w-auto">
                  <Pencil size={16} />
                  Edit Profile
                </button>
              </Link>
            </div>

            {/* =================================================
                MAIN PROFILE CARD
            ================================================== */}

            <div
              ref={componentRef}
              className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_60px_-30px_rgba(15,23,42,0.25)] print:rounded-none print:border-0 print:shadow-none">
              {/* =================================================
                  PROFILE INTRO
              ================================================== */}

              <div className="relative border-b border-slate-200 bg-gradient-to-r from-slate-50 via-white to-blue-50 px-5 py-8 sm:px-8 print:bg-white print:px-8 print:py-6">
                {/* Decorative */}

                <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 rounded-full bg-blue-50 blur-3xl print:hidden" />

                <div className="pointer-events-none absolute bottom-0 right-40 h-24 w-24 rounded-full bg-indigo-50 blur-2xl print:hidden" />

                <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
                  {/* PROFILE IMAGE */}

                  <div className="relative shrink-0">
                    <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-3xl border-4 border-white bg-slate-100 shadow-xl ring-1 ring-slate-200 sm:h-36 sm:w-36 print:h-28 print:w-28 print:rounded-2xl print:border-2 print:shadow-none">
                      {superAdmin?.profileImage?.[0] ? (
                        <Image
                          width={180}
                          height={180}
                          src={superAdmin.profileImage[0]}
                          alt={`${superAdmin?.name || "Super Admin"} profile`}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <UserRound size={55} className="text-slate-300" />
                      )}
                    </div>

                    {/* ACTIVE */}

                    <div className="absolute -bottom-2 -right-2 flex h-9 w-9 items-center justify-center rounded-full border-4 border-white bg-emerald-500 text-white shadow-lg print:hidden">
                      <BadgeCheck size={16} />
                    </div>
                  </div>

                  {/* NAME */}

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="break-words text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                        {superAdmin?.name || "Super Administrator"}
                      </h2>
                    </div>

                    <div className="mt-2 flex items-center gap-2 text-sm font-medium text-slate-500">
                      <BriefcaseBusiness size={16} className="text-blue-600" />

                      <span>{superAdmin?.designation || "Administrator"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* =================================================
                  CONTENT
              ================================================== */}

              <div className="grid grid-cols-1 gap-6 p-5 sm:p-7 lg:grid-cols-3 print:p-6">
                {/* =================================================
                    LEFT BASIC INFORMATION
                ================================================== */}

                <div className="lg:col-span-1">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 print:border-slate-200 print:bg-white">
                    <div className="mb-5 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white print:bg-white print:text-blue-600">
                        <UserRound size={18} />
                      </div>

                      <div>
                        <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                          Personal
                        </p>

                        <h3 className="font-bold text-slate-800">
                          Basic Information
                        </h3>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <BasicItem label="Full Name" value={superAdmin?.name} />

                      <Divider />

                      <BasicItem
                        label="Designation"
                        value={superAdmin?.designation}
                      />

                      <Divider />

                      <BasicItem label="User ID" value={superAdmin?.userId} />

                      <Divider />

                      <BasicItem
                        label="Account Role"
                        value={superAdmin?.role}
                        badge
                      />
                    </div>
                  </div>
                </div>

                {/* =================================================
                    RIGHT DETAILS
                ================================================== */}

                <div className="lg:col-span-2">
                  <div className="mb-5">
                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-blue-600">
                      Details
                    </p>

                    <h3 className="mt-1 text-lg font-bold text-slate-900">
                      Contact & Personal Details
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 print:grid-cols-2">
                    <InfoItem
                      icon={Mail}
                      label="Email Address"
                      value={superAdmin?.email}
                      iconClass="bg-blue-50 text-blue-600"
                    />

                    <InfoItem
                      icon={Phone}
                      label="Contact Number"
                      value={superAdmin?.contactNo}
                      iconClass="bg-emerald-50 text-emerald-600"
                    />

                    <InfoItem
                      icon={PhoneCall}
                      label="Emergency Contact"
                      value={superAdmin?.emergencyContactNo}
                      iconClass="bg-red-50 text-red-600"
                    />

                    <InfoItem
                      icon={Droplets}
                      label="Blood Group"
                      value={superAdmin?.bloodGroup}
                      iconClass="bg-rose-50 text-rose-600"
                      valueClass="text-rose-600"
                    />

                    <InfoItem
                      icon={CalendarDays}
                      label="Date of Birth"
                      value={superAdmin?.dateOfBirth}
                      iconClass="bg-amber-50 text-amber-600"
                    />

                    <InfoItem
                      icon={VenusAndMars}
                      label="Gender"
                      value={superAdmin?.gender}
                      iconClass="bg-indigo-50 text-indigo-600"
                    />

                    <InfoItem
                      icon={BriefcaseBusiness}
                      label="Designation"
                      value={superAdmin?.designation}
                      iconClass="bg-violet-50 text-violet-600"
                    />

                    <InfoItem
                      icon={ShieldCheck}
                      label="Access Level"
                      value="Full System Access"
                      iconClass="bg-emerald-50 text-emerald-600"
                      valueClass="text-emerald-700"
                    />

                    {/* ADDRESS */}

                    <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md sm:col-span-2 print:col-span-2 print:shadow-none">
                      <div className="flex gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                          <MapPin size={18} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-slate-400">
                            Address
                          </p>

                          <p className="mt-1 break-words text-sm font-semibold leading-6 text-slate-700">
                            {formatValue(superAdmin?.address)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* =================================================
                  FOOTER
              ================================================== */}

              <div className="border-t border-slate-100 bg-slate-50 px-5 py-4 sm:px-7 print:bg-white print:px-7">
                <div className="flex flex-col gap-2 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
                  <span>
                    Super Administrator Profile • Official Information
                  </span>

                  <span className="inline-flex items-center gap-1.5 font-medium">
                    <ShieldCheck size={14} className="text-emerald-500" />
                    Secure Profile
                  </span>
                </div>
              </div>

              {/* PRINT FOOTER */}

              <div className="hidden border-t border-slate-200 px-7 py-3 print:block">
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>School Management System</span>
                  <span>Official Profile Document</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

/* ============================================================
   BASIC ITEM
============================================================ */

interface BasicItemProps {
  label: string;
  value?: any;
  badge?: boolean;
}

const BasicItem = ({ label, value, badge = false }: BasicItemProps) => {
  const formatted =
    value === null || value === undefined || String(value).trim() === ""
      ? "Not provided"
      : String(value)
          .replace(/_/g, " ")
          .replace(/\b\w/g, (char) => char.toUpperCase());

  return (
    <div>
      <p className="text-xs text-slate-400">{label}</p>

      {badge ? (
        <span className="mt-1 inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold capitalize text-emerald-700 ring-1 ring-inset ring-emerald-100">
          {formatted}
        </span>
      ) : (
        <p className="mt-1 break-words text-sm font-bold text-slate-700">
          {formatted}
        </p>
      )}
    </div>
  );
};

/* ============================================================
   DIVIDER
============================================================ */

const Divider = () => <div className="h-px bg-slate-200" />;

/* ============================================================
   INFO ITEM
============================================================ */

interface InfoItemProps {
  icon: any;
  label: string;
  value: any;
  iconClass?: string;
  valueClass?: string;
}

const InfoItem = ({
  icon: Icon,
  label,
  value,
  iconClass = "bg-blue-50 text-blue-600",
  valueClass = "text-slate-700",
}: InfoItemProps) => {
  const formatted =
    value === null || value === undefined || String(value).trim() === ""
      ? "Not provided"
      : String(value)
          .replace(/_/g, " ")
          .replace(/\b\w/g, (char) => char.toUpperCase());

  return (
    <div className="group flex gap-3 rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md print:rounded-xl print:shadow-none">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconClass}`}>
        <Icon size={18} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-slate-400">{label}</p>

        <p className={`mt-1 break-words text-sm font-semibold ${valueClass}`}>
          {formatted}
        </p>
      </div>
    </div>
  );
};

export default SuperAdminProfilePage;
