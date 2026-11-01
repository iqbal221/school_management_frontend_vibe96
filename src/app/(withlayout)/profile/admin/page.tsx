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
  Church,
  MapPin,
  BriefcaseBusiness,
  ShieldCheck,
  Pencil,
  BadgeCheck,
  UserCog,
  CircleUserRound,
} from "lucide-react";

const AdminProfilePage = () => {
  const componentRef = useRef<HTMLDivElement | null>(null);

  const query = {
    limit: 10,
    page: 1,
    sortBy: "",
    sortOrder: "",
  };

  const { data, isLoading } = useUsersQuery(query);

  const adminData = useMemo(() => {
    return data?.Users?.filter((item: any) => item?.role === "admin") || [];
  }, [data]);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
  });

  const formatValue = (value: any) => {
    if (value === null || value === undefined || String(value).trim() === "") {
      return "Not provided";
    }

    return String(value)
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const InfoItem = ({
    icon: Icon,
    label,
    value,
    iconClass = "bg-blue-50 text-blue-600",
    valueClass = "text-slate-700",
  }: {
    icon: any;
    label: string;
    value: any;
    iconClass?: string;
    valueClass?: string;
  }) => (
    <div className="group flex gap-3 rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconClass}`}>
        <Icon size={18} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-slate-400">{label}</p>

        <p className={`mt-1 break-words text-sm font-semibold ${valueClass}`}>
          {formatValue(value)}
        </p>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-slate-100 px-3 py-5 sm:px-5 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* =====================================================
            UPPER HEADER
        ====================================================== */}

        <section className="mb-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          {/* TOP HEADER */}

          <div className="relative overflow-hidden border-b border-slate-100 px-5 py-7 sm:px-8">
            {/* Decorative background */}

            <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 rounded-full bg-blue-50 blur-2xl" />

            <div className="pointer-events-none absolute bottom-0 right-32 h-24 w-24 rounded-full bg-indigo-50 blur-2xl" />

            <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              {/* TITLE */}

              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-200">
                  <UserCog size={27} />
                </div>

                <div>
                  <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                    Admin Profile
                  </h1>

                  <p className="mt-1 text-sm text-slate-500">
                    Manage and view administrator information.
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
            LOADING
        ====================================================== */}

        {isLoading ? (
          <div className="flex min-h-[450px] items-center justify-center rounded-3xl border border-slate-200 bg-white shadow-sm">
            <Loader />
          </div>
        ) : adminData.length === 0 ? (
          /* =====================================================
              EMPTY
          ====================================================== */

          <div className="rounded-3xl border border-slate-200 bg-white px-6 py-20 text-center shadow-sm">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-100 text-slate-400">
              <CircleUserRound size={38} />
            </div>

            <h2 className="mt-6 text-xl font-bold text-slate-800">
              No Administrator Found
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              No administrator profile is currently available. Please create an
              administrator account to view the profile.
            </p>
          </div>
        ) : (
          /* =====================================================
              PROFILE
          ====================================================== */

          <div className="space-y-6">
            {adminData.map((admin: any) => (
              <div key={admin.id}>
                {/* ACTION BAR */}

                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-blue-600">
                      Profile Overview
                    </p>

                    <h2 className="mt-1 text-lg font-bold text-slate-900">
                      Administrator Information
                    </h2>
                  </div>

                  <Link href={`/profile/admin/edit/${admin.id}`}>
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
                  className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_60px_-30px_rgba(15,23,42,0.25)]">
                  {/* =================================================
                      PROFILE INTRO
                  ================================================== */}

                  <div className="relative border-b border-slate-200 bg-gradient-to-r from-slate-50 via-white to-blue-50 px-5 py-8 sm:px-8">
                    <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
                      {/* PROFILE IMAGE */}

                      <div className="relative shrink-0">
                        <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-3xl border-4 border-white bg-slate-100 shadow-xl ring-1 ring-slate-200 sm:h-36 sm:w-36">
                          {admin?.profileImage?.[0] ? (
                            <Image
                              width={180}
                              height={180}
                              src={admin.profileImage[0]}
                              alt={`${admin?.name || "Admin"} profile`}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <UserRound size={55} className="text-slate-300" />
                          )}
                        </div>

                        {/* ACTIVE */}

                        <div className="absolute -bottom-2 -right-2 flex h-9 w-9 items-center justify-center rounded-full border-4 border-white bg-emerald-500 text-white shadow-lg">
                          <BadgeCheck size={16} />
                        </div>
                      </div>

                      {/* NAME */}

                      <div className="min-w-0">
                        <h2 className="break-words text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                          {admin?.name || "Administrator"}
                        </h2>

                        <div className="mt-2 flex items-center gap-2 text-sm font-medium text-slate-500">
                          <BriefcaseBusiness
                            size={16}
                            className="text-blue-600"
                          />

                          <span>{admin?.designation || "Administrator"}</span>
                        </div>

                        {/* ROLE */}

                        <div className="mt-4">
                          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold capitalize text-emerald-700 ring-1 ring-inset ring-emerald-100">
                            <BadgeCheck size={14} />
                            {formatValue(admin?.role)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* =================================================
                      CONTENT
                  ================================================== */}

                  <div className="grid grid-cols-1 gap-6 p-5 sm:p-7 lg:grid-cols-3">
                    {/* LEFT */}

                    <div className="lg:col-span-1">
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                        <div className="mb-5 flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
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
                          <div>
                            <p className="text-xs text-slate-400">Full Name</p>

                            <p className="mt-1 text-sm font-bold text-slate-700">
                              {formatValue(admin?.name)}
                            </p>
                          </div>

                          <div className="h-px bg-slate-200" />

                          <div>
                            <p className="text-xs text-slate-400">
                              Designation
                            </p>

                            <p className="mt-1 text-sm font-bold text-slate-700">
                              {formatValue(admin?.designation)}
                            </p>
                          </div>

                          <div className="h-px bg-slate-200" />

                          <div>
                            <p className="text-xs text-slate-400">User ID</p>

                            <p className="mt-1 break-all text-sm font-bold text-slate-700">
                              {formatValue(admin?.userId)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* RIGHT DETAILS */}

                    <div className="lg:col-span-2">
                      <div className="mb-5">
                        <p className="text-xs font-bold uppercase tracking-[0.15em] text-blue-600">
                          Details
                        </p>

                        <h3 className="mt-1 text-lg font-bold text-slate-900">
                          Contact & Personal Details
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <InfoItem
                          icon={Mail}
                          label="Email Address"
                          value={admin?.email}
                          iconClass="bg-blue-50 text-blue-600"
                        />

                        <InfoItem
                          icon={Phone}
                          label="Contact Number"
                          value={admin?.contactNo}
                          iconClass="bg-emerald-50 text-emerald-600"
                        />

                        <InfoItem
                          icon={PhoneCall}
                          label="Emergency Contact"
                          value={admin?.emergencyContactNo}
                          iconClass="bg-red-50 text-red-600"
                        />

                        <InfoItem
                          icon={Droplets}
                          label="Blood Group"
                          value={admin?.bloodGroup}
                          iconClass="bg-rose-50 text-rose-600"
                          valueClass="text-rose-600"
                        />

                        <InfoItem
                          icon={CalendarDays}
                          label="Date of Birth"
                          value={admin?.dateOfBirth}
                          iconClass="bg-amber-50 text-amber-600"
                        />

                        <InfoItem
                          icon={VenusAndMars}
                          label="Gender"
                          value={admin?.gender}
                          iconClass="bg-indigo-50 text-indigo-600"
                        />

                        <InfoItem
                          icon={Church}
                          label="Religion"
                          value={admin?.religious}
                          iconClass="bg-purple-50 text-purple-600"
                        />

                        <InfoItem
                          icon={MapPin}
                          label="Address"
                          value={admin?.address}
                          iconClass="bg-cyan-50 text-cyan-600"
                        />
                      </div>
                    </div>
                  </div>

                  {/* =================================================
                      FOOTER
                  ================================================== */}

                  <div className="border-t border-slate-100 bg-slate-50 px-5 py-4 sm:px-7">
                    <div className="flex flex-col gap-2 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
                      <span>Administrator Profile • Official Information</span>

                      <span className="inline-flex items-center gap-1.5 font-medium">
                        <ShieldCheck size={14} className="text-emerald-500" />
                        Secure Profile
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default AdminProfilePage;
