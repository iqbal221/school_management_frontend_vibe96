
"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { getUserInfo } from "@/service/auth.service";
import Link from "next/link";
import Image from "next/image";
import school_logo from "../../../public/school_logo.svg";

const SideBarResponsive = () => {
  const UserInfo: any = getUserInfo();

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile sidebar after route navigation
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  // Lock body scrolling while mobile sidebar is open
  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  // Automatically open the submenu containing the current route
  const isActiveRoute = (routes: string[]) =>
    routes.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`)
    );

  /* =========================
     Icons
  ========================= */

  const ArrowIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.8}
      stroke="currentColor"
      className="h-4 w-4 shrink-0 transition-transform duration-200 group-open:rotate-90"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m8.25 4.5 7.5 7.5-7.5 7.5"
      />
    </svg>
  );

  const SubArrow = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className="h-3 w-3 shrink-0"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m9 5 7 7-7 7" />
    </svg>
  );

  const DashboardIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.7}
      stroke="currentColor"
      className="h-5 w-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 6.75A3 3 0 0 1 6.75 3.75h10.5a3 3 0 0 1 3 3v10.5a3 3 0 0 1-3 3H6.75a3 3 0 0 1-3-3V6.75Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 8h2v2H8V8Zm6 0h2v2h-2V8ZM8 14h2v2H8v-2Zm6 0h2v2h-2v-2Z"
      />
    </svg>
  );

  const InstituteIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.7}
      stroke="currentColor"
      className="h-5 w-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 10.5 12 4l9 6.5M5.25 10.5v8.25h13.5V10.5M9 18.75v-5.25h6v5.25"
      />
    </svg>
  );

  const StudentIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.7}
      stroke="currentColor"
      className="h-5 w-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.25a7.5 7.5 0 0 1 15 0"
      />
    </svg>
  );

  const AttendanceIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.7}
      stroke="currentColor"
      className="h-5 w-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 5.25h6M9 8.25h6M7.5 3.75h9A1.5 1.5 0 0 1 18 5.25v13.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 18.75V5.25a1.5 1.5 0 0 1 1.5-1.5Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m9 14 1.5 1.5L15 11"
      />
    </svg>
  );

  const FeesIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.7}
      stroke="currentColor"
      className="h-5 w-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6v12m-3-2.25.75.5c1.25.84 3.25.84 4.5 0s1.25-2.16 0-3c-.63-.42-1.37-.63-2.25-.63-.88 0-1.62-.21-2.25-.63-1.25-.84-1.25-2.16 0-3s3.25-.84 4.5 0l.75.5"
      />
      <circle cx="12" cy="12" r="9" />
    </svg>
  );

  const ResultIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.7}
      stroke="currentColor"
      className="h-5 w-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7 4.5h10A2.5 2.5 0 0 1 19.5 7v13h-15V7A2.5 2.5 0 0 1 7 4.5Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 9h6M9 12h6M9 15h4"
      />
    </svg>
  );

  const AccountsIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.7}
      stroke="currentColor"
      className="h-5 w-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 7.5h8M8 12h8M8 16.5h5"
      />
      <circle cx="12" cy="12" r="9" />
    </svg>
  );

  const AdminIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.7}
      stroke="currentColor"
      className="h-5 w-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3.75 4.5 7.5v4.5c0 4.5 3 7.5 7.5 8.25 4.5-.75 7.5-3.75 7.5-8.25V7.5L12 3.75Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.5 12 11 13.5l3.5-3.5"
      />
    </svg>
  );

  const WebsiteIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.7}
      stroke="currentColor"
      className="h-5 w-5"
    >
      <circle cx="12" cy="12" r="9" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h18" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3c2.25 2.46 3.5 5.55 3.5 9S14.25 18.54 12 21c-2.25-2.46-3.5-5.55-3.5-9S9.75 5.46 12 3Z"
      />
    </svg>
  );

  const ProfileIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.7}
      stroke="currentColor"
      className="h-5 w-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 6.75a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.25a7.5 7.5 0 0 1 15 0"
      />
    </svg>
  );

  /* =========================
     Common Styles
  ========================= */

  const menuItem =
    "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-300 transition-all duration-200 hover:bg-white/10 hover:text-white hover:translate-x-0.5";

  const summaryItem =
    "group flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-sm text-slate-200 transition-all duration-200 hover:bg-white/10 hover:text-white";

  const subItem =
    "group flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-400 transition-all duration-200 hover:bg-white/5 hover:text-violet-300 hover:translate-x-1";

  const closeSidebar = () => setIsMobileOpen(false);

  return (
    <>
      {/* =========================
          Mobile Menu Button
      ========================= */}
      <button
        type="button"
        onClick={() => setIsMobileOpen(true)}
        aria-label="Open navigation menu"
        aria-expanded={isMobileOpen}
        className="fixed left-4 top-4 z-[60] flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-lg transition hover:bg-slate-50 md:hidden"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="h-6 w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"
          />
        </svg>
      </button>

      {/* =========================
          Mobile Backdrop
      ========================= */}
      {isMobileOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={closeSidebar}
          className="fixed inset-0 z-[70] bg-slate-950/60 backdrop-blur-[2px] md:hidden"
        />
      )}

      {/* =========================
          Sidebar
      ========================= */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-[80]
          flex h-[100dvh] w-[min(85vw,18rem)] shrink-0
          transform transition-transform duration-300 ease-in-out
          md:sticky md:top-0 md:z-40 md:h-screen md:w-72
          md:translate-x-0 md:transition-none
          ${
            isMobileOpen
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0"
          }
        `}
      >
        <div className="flex h-full w-full flex-col overflow-hidden border-r border-white/10 bg-gradient-to-b from-[#111827] via-[#172033] to-[#0b1120] shadow-2xl">

          {/* =========================
              Logo / Brand
          ========================= */}
          <div className="relative shrink-0 border-b border-white/10 px-4 py-5 sm:px-5">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 via-indigo-500/10 to-transparent" />

            <div className="relative flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/10 p-1.5 shadow-lg backdrop-blur sm:h-14 sm:w-14">
                <Image
                  src={school_logo}
                  width={200}
                  height={200}
                  className="h-full w-full rounded-xl object-contain"
                  alt="Bhatiary Adorsho Biddapith"
                  priority
                />
              </div>

              <div className="min-w-0 flex-1">
                <h1 className="text-xs font-bold uppercase tracking-wide text-white sm:text-sm">
                  Bhatiary Shushu konon School
                </h1>

                <div className="mt-2 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />

                  <span className="text-[10px] font-medium text-slate-400">
                    School Management
                  </span>
                </div>
              </div>

              {/* Mobile Close Button */}
              <button
                type="button"
                onClick={closeSidebar}
                aria-label="Close sidebar"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white/10 hover:text-white md:hidden"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m6 6 12 12M18 6 6 18"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* =========================
              Navigation
          ========================= */}
          <div className="sidebar-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-4">
            <nav className="space-y-1.5">

              {/* Dashboard */}
              <Link
                href="/dashboard"
                onClick={closeSidebar}
                aria-current={pathname === "/dashboard" ? "page" : undefined}
                className={`${menuItem} ${
                  pathname === "/dashboard"
                    ? "bg-gradient-to-r from-violet-600/20 to-indigo-600/10 text-white ring-1 ring-violet-400/10"
                    : ""
                }`}
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/15 text-violet-300">
                  <DashboardIcon />
                </span>

                <span>Dashboard</span>

                {pathname === "/dashboard" && (
                  <span className="ml-auto h-2 w-2 rounded-full bg-violet-400 shadow-[0_0_8px_rgba(167,139,250,0.8)]" />
                )}
              </Link>

              {/* Institute */}
              <details
                className="group"
                open={isActiveRoute(["/instituteInfo"])}
              >
                <summary className={summaryItem}>
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-slate-300 transition group-hover:bg-violet-500/15 group-hover:text-violet-300">
                      <InstituteIcon />
                    </span>
                    <span>Institute</span>
                  </div>
                  <ArrowIcon />
                </summary>

                <ul className="mt-1 ml-5 space-y-1 border-l border-white/10 pl-7">
                  <li>
                    <Link href="/instituteInfo/studentInfo" onClick={closeSidebar} className={subItem}>
                      <SubArrow /> Student Info
                    </Link>
                  </li>
                  <li>
                    <Link href="/instituteInfo/teacherInfo" onClick={closeSidebar} className={subItem}>
                      <SubArrow /> Teachers Info
                    </Link>
                  </li>
                  <li>
                    <Link href="/instituteInfo/officialInfo" onClick={closeSidebar} className={subItem}>
                      <SubArrow /> Official Info
                    </Link>
                  </li>
                </ul>
              </details>

              {/* Student */}
              <details
                className="group"
                open={isActiveRoute(["/student"])}
              >
                <summary className={summaryItem}>
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-slate-300 transition group-hover:bg-violet-500/15 group-hover:text-violet-300">
                      <StudentIcon />
                    </span>
                    <span>Student</span>
                  </div>
                  <ArrowIcon />
                </summary>

                <ul className="mt-1 ml-5 space-y-1 border-l border-white/10 pl-7">
                  <li>
                    <Link href="/student/addNewStudent" onClick={closeSidebar} className={subItem}>
                      <SubArrow /> Add Student
                    </Link>
                  </li>
                  <li>
                    <Link href="/student/studentInformation" onClick={closeSidebar} className={subItem}>
                      <SubArrow /> Student Query
                    </Link>
                  </li>
                  <li>
                    <Link href="/student/studentList" onClick={closeSidebar} className={subItem}>
                      <SubArrow /> Student List
                    </Link>
                  </li>
                  <li>
                    <Link href="/student/studentIdCard" onClick={closeSidebar} className={subItem}>
                      <SubArrow /> Student ID Card
                    </Link>
                  </li>
                </ul>
              </details>

              {/* Attendance */}
              <details
                className="group"
                open={isActiveRoute(["/attendance"])}
              >
                <summary className={summaryItem}>
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-slate-300 transition group-hover:bg-violet-500/15 group-hover:text-violet-300">
                      <AttendanceIcon />
                    </span>
                    <span>Attendance</span>
                  </div>
                  <ArrowIcon />
                </summary>

                <ul className="mt-1 ml-5 space-y-1 border-l border-white/10 pl-7">
                  <li>
                    <Link href="/attendance/attendanceDashboard" onClick={closeSidebar} className={subItem}>
                      <SubArrow /> Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link href="/attendance/studentAttendance" onClick={closeSidebar} className={subItem}>
                      <SubArrow /> Student
                    </Link>
                  </li>
                  <li>
                    <Link href="/attendance/teacherAttendance" onClick={closeSidebar} className={subItem}>
                      <SubArrow /> Teacher
                    </Link>
                  </li>
                  <li>
                    <Link href="/attendance/officialAttendance" onClick={closeSidebar} className={subItem}>
                      <SubArrow /> Official
                    </Link>
                  </li>
                  <li>
                    <Link href="/attendance/studentAttendanceReport" onClick={closeSidebar} className={subItem}>
                      <SubArrow /> Student Report
                    </Link>
                  </li>
                  <li>
                    <Link href="/attendance/teacherAttendanceReport" onClick={closeSidebar} className={subItem}>
                      <SubArrow /> Teacher Report
                    </Link>
                  </li>
                  <li>
                    <Link href="/attendance/officialAttendanceReport" onClick={closeSidebar} className={subItem}>
                      <SubArrow /> Official Report
                    </Link>
                  </li>
                </ul>
              </details>

              {/* Fees */}
              <details
                className="group"
                open={isActiveRoute(["/feesManagement"])}
              >
                <summary className={summaryItem}>
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-slate-300 transition group-hover:bg-violet-500/15 group-hover:text-violet-300">
                      <FeesIcon />
                    </span>
                    <span>Fees</span>
                  </div>
                  <ArrowIcon />
                </summary>

                <ul className="mt-1 ml-5 space-y-1 border-l border-white/10 pl-7">
                  <li>
                    <Link href="/feesManagement/entryFees" onClick={closeSidebar} className={subItem}>
                      <SubArrow /> Entry Fees
                    </Link>
                  </li>
                  <li>
                    <Link href="/feesManagement/paymentHistory" onClick={closeSidebar} className={subItem}>
                      <SubArrow /> Payment History
                    </Link>
                  </li>
                </ul>
              </details>

              {/* Results */}
              <details
                className="group"
                open={isActiveRoute(["/resultManagement"])}
              >
                <summary className={summaryItem}>
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-slate-300 transition group-hover:bg-violet-500/15 group-hover:text-violet-300">
                      <ResultIcon />
                    </span>
                    <span>Results</span>
                  </div>
                  <ArrowIcon />
                </summary>

                <ul className="mt-1 ml-5 space-y-1 border-l border-white/10 pl-7">
                  <li>
                    <Link href="/resultManagement/resultUpload" onClick={closeSidebar} className={subItem}>
                      <SubArrow /> Upload Result
                    </Link>
                  </li>
                  <li>
                    <Link href="/resultManagement/studentMarksheet" onClick={closeSidebar} className={subItem}>
                      <SubArrow /> Marksheet
                    </Link>
                  </li>
                </ul>
              </details>

              {/* Accounts */}
              <details
                className="group"
                open={isActiveRoute(["/accounts"])}
              >
                <summary className={summaryItem}>
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-slate-300 transition group-hover:bg-violet-500/15 group-hover:text-violet-300">
                      <AccountsIcon />
                    </span>
                    <span>Accounts</span>
                  </div>
                  <ArrowIcon />
                </summary>

                <ul className="mt-1 ml-5 space-y-1 border-l border-white/10 pl-7">
                  <li>
                    <Link href="/accounts/entryAllExpense" onClick={closeSidebar} className={subItem}>
                      <SubArrow /> Entry Expense
                    </Link>
                  </li>
                  <li>
                    <Link href="/accounts/detailsAllExpense" onClick={closeSidebar} className={subItem}>
                      <SubArrow /> Details Expense
                    </Link>
                  </li>
                  <li>
                    <Link href="/accounts/entryAllRevenue" onClick={closeSidebar} className={subItem}>
                      <SubArrow /> Entry Revenue
                    </Link>
                  </li>
                  <li>
                    <Link href="/accounts/detailsAllRevenue" onClick={closeSidebar} className={subItem}>
                      <SubArrow /> Details Revenue
                    </Link>
                  </li>

                  {UserInfo?.userRole === "super_admin" && (
                    <li>
                      <Link href="/accounts/accountsSummary" onClick={closeSidebar} className={subItem}>
                        <SubArrow /> Accounts Summary
                      </Link>
                    </li>
                  )}
                </ul>
              </details>

              {/* Admin */}
              {UserInfo?.userRole === "super_admin" && (
                <details
                  className="group"
                  open={isActiveRoute(["/admin"])}
                >
                  <summary className={summaryItem}>
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-slate-300 transition group-hover:bg-violet-500/15 group-hover:text-violet-300">
                        <AdminIcon />
                      </span>
                      <span>Admin</span>
                    </div>
                    <ArrowIcon />
                  </summary>

                  <ul className="mt-1 ml-5 space-y-1 border-l border-white/10 pl-7">
                    <li>
                      <Link href="/admin/addNewAdmin" onClick={closeSidebar} className={subItem}>
                        <SubArrow /> Add Admin
                      </Link>
                    </li>
                    <li>
                      <Link href="/admin/adminInformation" onClick={closeSidebar} className={subItem}>
                        <SubArrow /> Admin Details
                      </Link>
                    </li>
                  </ul>
                </details>
              )}

              {/* Website Management */}
              {UserInfo?.userRole === "super_admin" && (
                <details
                  className="group"
                  open={isActiveRoute(["/website"])}
                >
                  <summary className={`${summaryItem} relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 to-indigo-500/5 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

                    <div className="relative flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/10 text-violet-300 transition group-hover:bg-violet-500/20">
                        <WebsiteIcon />
                      </span>

                      <div>
                        <span className="block">Website</span>
                        <span className="block text-[9px] font-normal text-slate-500">
                          Manage public website
                        </span>
                      </div>
                    </div>

                    <span className="relative">
                      <ArrowIcon />
                    </span>
                  </summary>

                  <ul className="mt-1 ml-5 space-y-1 border-l border-violet-500/20 pl-7">
                    <li>
                      <Link href="/website/home" onClick={closeSidebar} className={subItem}>
                        <SubArrow /> Home Page
                      </Link>
                    </li>
                    <li>
                      <Link href="/website/about" onClick={closeSidebar} className={subItem}>
                        <SubArrow /> About Page
                      </Link>
                    </li>
                    <li>
                      <Link href="/website/news" onClick={closeSidebar} className={subItem}>
                        <SubArrow /> News & Notices
                      </Link>
                    </li>
                    <li>
                      <Link href="/website/admission" onClick={closeSidebar} className={subItem}>
                        <SubArrow /> Admission
                      </Link>
                    </li>
                    <li>
                      <Link href="/website/contact" onClick={closeSidebar} className={subItem}>
                        <SubArrow /> Contact
                      </Link>
                    </li>
                  </ul>
                </details>
              )}

              {/* Profile */}
              {(UserInfo?.userRole === "super_admin" ||
                UserInfo?.userRole === "admin") && (
                <div className="mt-3 border-t border-white/10 pt-3">
                  <Link
                    href={
                      UserInfo?.userRole === "super_admin"
                        ? "/profile/superAdmin"
                        : "/profile/admin"
                    }
                    onClick={closeSidebar}
                    className={menuItem}
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-slate-300 transition group-hover:bg-violet-500/15 group-hover:text-violet-300">
                      <ProfileIcon />
                    </span>
                    <span>Profile</span>
                  </Link>
                </div>
              )}
            </nav>
          </div>

          {/* =========================
              Bottom User Indicator
          ========================= */}
          <div className="shrink-0 border-t border-white/10 p-3">
            <div className="flex items-center gap-3 rounded-xl bg-white/5 px-3 py-2.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-sm font-bold text-white shadow-lg">
                {(UserInfo?.userRole || "U").charAt(0).toUpperCase()}
              </div>

              <div className="min-w-0">
                <p className="truncate text-xs font-semibold capitalize text-white">
                  {UserInfo?.userRole
                    ? String(UserInfo.userRole).replace(/_/g, " ")
                    : "User"}
                </p>

                <div className="mt-0.5 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.7)]" />
                  <span className="text-[10px] text-slate-400">
                    Active account
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =========================
            Custom Scrollbar
        ========================= */}
        <style jsx global>{`
          .sidebar-scroll::-webkit-scrollbar {
            width: 5px;
          }

          .sidebar-scroll::-webkit-scrollbar-track {
            background: transparent;
          }

          .sidebar-scroll::-webkit-scrollbar-thumb {
            background: rgba(139, 92, 246, 0.3);
            border-radius: 999px;
          }

          .sidebar-scroll::-webkit-scrollbar-thumb:hover {
            background: rgba(139, 92, 246, 0.55);
          }

          .sidebar-scroll {
            scrollbar-width: thin;
            scrollbar-color: rgba(139, 92, 246, 0.3) transparent;
          }

          details > summary {
            list-style: none;
          }

          details > summary::-webkit-details-marker {
            display: none;
          }
        `}</style>
      </aside>
    </>
  );
};

export default SideBarResponsive;
