"use client";

import { useUsersQuery } from "@/redux/api/userApi";
import { useAuthorizationsQuery } from "@/redux/api/authorizationApi";
import { getUserInfo } from "@/service/auth.service";
import { IUser } from "@/types/common";
import React from "react";
import Dropdown3 from "../Dropdown";
import { Bell, CircleAlert, ShieldAlert, UserRound } from "lucide-react";

const Header = () => {
  const query = {
    limit: 10,
    page: 1,
    sortBy: "",
    sortOrder: "",
  };

  /* =========================================================
     AUTHENTICATED USER
  ========================================================= */

  const userInfo = getUserInfo();

  /* =========================================================
     API DATA
  ========================================================= */

  const { data: userData, isLoading: usersLoading } = useUsersQuery(query);

  const { data: authData } = useAuthorizationsQuery(query);

  const users: IUser[] = userData?.Users ?? [];

  const authorizations = authData?.Authorizations ?? [];

  /* =========================================================
     FIND CURRENT USER
     
     Prefer ID/userId over role because multiple users
     can have the same role.
  ========================================================= */

  const currentUser = users.find((user: IUser) => {
    if (userInfo?.userId && user?.userId) {
      return user.userId === userInfo.userId;
    }

    if (userInfo?.id && user?.id) {
      return user.id === userInfo.id;
    }

    if (userInfo?.id && user?.id) {
      return user.id === userInfo.id;
    }

    return false;
  });

  const user =
    currentUser ??
    users.find((item: IUser) => item?.role === userInfo?.userRole);

  /* =========================================================
     PENDING APPROVALS
  ========================================================= */

  const pendingApprovals = authorizations.filter(
    (item: any) => item?.status === true,
  );

  const isSuperAdmin = userInfo?.userRole === "super_admin";

  const hasPendingApprovals = isSuperAdmin && pendingApprovals.length > 0;

  /* =========================================================
     ROLE LABEL
  ========================================================= */

  const roleLabel =
    user?.role === "super_admin"
      ? "Super Administrator"
      : user?.role === "admin"
        ? "Administrator"
        : String(user?.role || "User").replace(/_/g, " ");

  return (
    <header
      className="
        sticky top-0 z-40
        w-full
        border-b border-white/10
        bg-gradient-to-r
        from-indigo-700
        via-violet-600
        to-blue-600
        shadow-lg shadow-indigo-900/20
      ">
      {/* =====================================================
          DECORATIVE BACKGROUND
      ====================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 -top-24 h-48 w-48 rounded-full bg-white/10 blur-3xl" />

        <div className="absolute right-10 top-0 h-32 w-32 rounded-full bg-cyan-300/10 blur-3xl" />

        <div className="absolute bottom-0 left-1/2 h-20 w-64 -translate-x-1/2 rounded-full bg-purple-300/10 blur-3xl" />
      </div>

      {/* =====================================================
          HEADER CONTENT
      ====================================================== */}

      <div className="relative flex min-h-[72px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* ===================================================
            LEFT SIDE
        ==================================================== */}

        <div className="flex min-w-0 items-center gap-3">
          {hasPendingApprovals && (
            <>
              {/* Notification */}

              <div className="group relative">
                <button
                  type="button"
                  aria-label={`You have ${pendingApprovals.length} pending approvals`}
                  className="
                    relative
                    flex h-11 w-11
                    items-center justify-center
                    rounded-xl
                    border border-white/20
                    bg-white/10
                    text-white
                    shadow-lg
                    backdrop-blur-md
                    transition-all
                    duration-200
                    hover:-translate-y-0.5
                    hover:bg-white/20
                    hover:shadow-xl
                    focus:outline-none
                    focus:ring-2
                    focus:ring-white/40
                  ">
                  <Bell size={20} strokeWidth={1.8} />

                  {/* Count */}

                  <span
                    className="
                      absolute
                      -right-1
                      -top-1
                      flex
                      h-5
                      min-w-5
                      items-center
                      justify-center
                      rounded-full
                      border-2
                      border-indigo-700
                      bg-red-500
                      px-1
                      text-[10px]
                      font-bold
                      text-white
                      shadow-md
                    ">
                    {pendingApprovals.length}
                  </span>

                  {/* Ping */}

                  <span
                    className="
                      absolute
                      -right-1
                      -top-1
                      h-5
                      w-5
                      animate-ping
                      rounded-full
                      bg-red-400
                      opacity-40
                    "
                  />
                </button>

                {/* Tooltip */}

                <div
                  className="
                    pointer-events-none
                    absolute left-0 top-[58px]
                    z-50
                    w-[290px]
                    origin-top-left
                    translate-y-2
                    scale-95
                    rounded-2xl
                    border border-slate-200
                    bg-white
                    p-4
                    opacity-0
                    shadow-2xl
                    transition-all
                    duration-200
                    group-hover:translate-y-0
                    group-hover:scale-100
                    group-hover:opacity-100
                  ">
                  <div className="flex items-start gap-3">
                    <div
                      className="
                        flex h-10 w-10
                        shrink-0
                        items-center justify-center
                        rounded-xl
                        bg-red-50
                        text-red-500
                      ">
                      <ShieldAlert size={20} />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-800">
                          Approval Required
                        </h4>

                        <span className="rounded-full bg-red-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-red-500">
                          Action
                        </span>
                      </div>

                      <p className="mt-1.5 text-xs leading-5 text-slate-500">
                        You have{" "}
                        <span className="font-bold text-red-500">
                          {pendingApprovals.length}
                        </span>{" "}
                        pending approval
                        {pendingApprovals.length > 1 ? "s" : ""}.
                      </p>

                      <p className="mt-1 text-[11px] leading-5 text-slate-400">
                        Please review the pending financial requests.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Approval message */}

              <div className="hidden border-l border-white/20 pl-4 md:block">
                <div className="flex items-center gap-2">
                  <CircleAlert size={15} className="text-amber-300" />

                  <p className="text-sm font-semibold text-white">
                    Approval required
                  </p>
                </div>

                <p className="mt-0.5 text-xs text-indigo-100">
                  Please review pending financial requests
                </p>
              </div>
            </>
          )}
        </div>

        {/* ===================================================
            RIGHT SIDE
        ==================================================== */}

        <div className="flex shrink-0 items-center">
          {usersLoading ? (
            /* ===============================================
               LOADING
            ================================================ */

            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <div className="ml-auto h-3 w-24 animate-pulse rounded-full bg-white/20" />

                <div className="ml-auto mt-2 h-2.5 w-16 animate-pulse rounded-full bg-white/10" />
              </div>

              <div
                className="
                  flex h-12 w-12
                  animate-pulse
                  items-center justify-center
                  rounded-2xl
                  border
                  border-white/20
                  bg-white/10
                ">
                <UserRound size={20} className="text-white/40" />
              </div>
            </div>
          ) : user ? (
            /* ===============================================
               USER
            ================================================ */

            <div className="flex items-center gap-3">
              {/* User information */}

              {/* <div className="hidden text-right sm:block">
                <p className="max-w-[180px] truncate text-sm font-bold text-white">
                  {user.name || "User"}
                </p>

                <div className="mt-1 flex items-center justify-end gap-1.5">
                  <span
                    className="
                      h-2
                      w-2
                      rounded-full
                      bg-emerald-400
                      shadow-[0_0_8px_rgba(52,211,153,0.9)]
                    "
                  />

                  <span className="max-w-[170px] truncate text-xs font-medium capitalize text-indigo-100">
                    {roleLabel}
                  </span>
                </div>
              </div> */}

              {/* Avatar / Dropdown */}

              <div
                className="
                  rounded-2xl
                  border
                  border-white/20
                  bg-white/10
                  p-1
                  shadow-lg
                  backdrop-blur-md
                  transition-all
                  duration-200
                  hover:border-white/40
                  hover:bg-white/20
                  hover:shadow-xl
                ">
                <Dropdown3 item={user} />
              </div>
            </div>
          ) : (
            /* ===============================================
               USER NOT FOUND
            ================================================ */

            <div
              className="
                flex
                h-11
                items-center
                gap-2
                rounded-xl
                border
                border-white/15
                bg-white/10
                px-3
                text-white/80
                backdrop-blur-md
              ">
              <UserRound size={17} />

              <span className="hidden text-xs font-medium sm:block">User</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
