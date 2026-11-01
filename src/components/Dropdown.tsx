"use client";

import { tokenKey } from "@/constants/token-key";
import { getUserInfo, removeUserInfo } from "@/service/auth.service";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ChevronDown, LogOut, ShieldCheck, UserRound } from "lucide-react";
import { IUser } from "@/types/common";

/* =========================================================
   OUTSIDE CLICK HOOK
========================================================= */

const useClickOutside = (handler: () => void) => {
  const domNode = useRef<HTMLDivElement | null>(null);

  const handleClick = useCallback(
    (event: MouseEvent) => {
      if (domNode.current && !domNode.current.contains(event.target as Node)) {
        handler();
      }
    },
    [handler],
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [handleClick]);

  return domNode;
};

/* =========================================================
   DROPDOWN
========================================================= */

interface Dropdown3Props {
  item: IUser;
}

const Dropdown3 = ({ item }: Dropdown3Props) => {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const userInfo = getUserInfo();

  const domNode = useClickOutside(() => {
    setDropdownOpen(false);
  });

  /* =======================================================
     LOGOUT
  ======================================================= */

  const handleLogout = () => {
    setDropdownOpen(false);
    removeUserInfo(tokenKey);
    router.push("/login");
  };

  /* =======================================================
     USER INFO
  ======================================================= */

  const userRole = userInfo?.userRole;

  const profileHref =
    userRole === "super_admin"
      ? "/profile/superAdmin"
      : userRole === "admin"
        ? "/profile/admin"
        : "#";

  const roleLabel =
    userRole === "super_admin"
      ? "Super Administrator"
      : userRole === "admin"
        ? "Administrator"
        : "User";

  const profileImage = item?.profileImage?.[0];

  const userName = item?.name || userInfo?.name || "Administrator";

  return (
    <div ref={domNode} className="relative">
      {/* =====================================================
          PROFILE BUTTON
      ====================================================== */}

      <button
        type="button"
        onClick={() => setDropdownOpen((prev) => !prev)}
        aria-expanded={dropdownOpen}
        aria-haspopup="menu"
        className={`
          group flex items-center gap-2.5 rounded-2xl
          border border-slate-200/80
          bg-white/95
          px-2 py-1.5
          shadow-sm
          backdrop-blur-md
          transition-all duration-200
          hover:border-blue-200
          hover:bg-blue-50/40
          hover:shadow-md
          focus:outline-none
          focus:ring-2
          focus:ring-blue-500/20
          ${dropdownOpen ? "border-blue-200 bg-blue-50/50 shadow-md" : ""}
        `}>
        {/* Avatar */}

        <div className="relative">
          <div className="h-10 w-10 overflow-hidden rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 ring-2 ring-white shadow-sm">
            {profileImage ? (
              <Image
                src={profileImage}
                width={80}
                height={80}
                alt={`${userName} profile`}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-blue-600">
                <UserRound size={20} />
              </div>
            )}
          </div>

          {/* Online indicator */}

          <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
        </div>

        {/* User information */}

        <div className="hidden text-left sm:block">
          <p className="max-w-[130px] truncate text-sm font-semibold text-slate-800">
            {userName}
          </p>

          <p className="max-w-[130px] truncate text-[11px] font-medium text-slate-400">
            {roleLabel}
          </p>
        </div>

        {/* Chevron */}

        <ChevronDown
          size={17}
          className={`
            mr-1 text-slate-400
            transition-transform duration-200
            group-hover:text-blue-600
            ${dropdownOpen ? "rotate-180 text-blue-600" : ""}
          `}
        />
      </button>

      {/* =====================================================
          DROPDOWN MENU
      ====================================================== */}

      <div
        className={`
          absolute right-0 z-50 mt-3 w-[270px]
          origin-top-right
          transition-all duration-200
          ${
            dropdownOpen
              ? "visible translate-y-0 scale-100 opacity-100"
              : "invisible -translate-y-2 scale-95 opacity-0"
          }
        `}>
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10">
          {/* =================================================
              DROPDOWN HEADER
          ================================================== */}

          <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 p-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="h-12 w-12 overflow-hidden rounded-xl border-2 border-white/20 bg-white/10">
                  {profileImage ? (
                    <Image
                      src={profileImage}
                      width={96}
                      height={96}
                      alt={`${userName} profile`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-white">
                      <UserRound size={23} />
                    </div>
                  )}
                </div>

                <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-slate-950 bg-emerald-400" />
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-white">
                  {userName}
                </p>

                <p className="mt-0.5 truncate text-xs text-blue-200">
                  {roleLabel}
                </p>
              </div>
            </div>

            {/* Status */}

            <div className="mt-3 flex items-center gap-1.5 text-[11px] font-medium text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Account Active
            </div>
          </div>

          {/* =================================================
              MENU ITEMS
          ================================================== */}

          <div className="p-2">
            {/* Profile */}

            {userRole === "super_admin" || userRole === "admin" ? (
              <DropdownItem
                label="My Profile"
                description="View your profile"
                href={profileHref}
                icon={<UserRound size={18} />}
                onClick={() => setDropdownOpen(false)}
              />
            ) : null}

            {/* Divider */}

            <div className="my-1.5 border-t border-slate-100" />

            {/* Logout */}

            <button
              type="button"
              onClick={handleLogout}
              className="
                group flex w-full items-center gap-3
                rounded-xl px-3 py-2.5
                text-left
                transition-colors
                hover:bg-red-50
              ">
              <span
                className="
                  flex h-9 w-9 shrink-0 items-center justify-center
                  rounded-xl
                  bg-red-50
                  text-red-500
                  transition-colors
                  group-hover:bg-red-100
                ">
                <LogOut size={17} />
              </span>

              <span className="min-w-0">
                <span className="block text-sm font-semibold text-slate-700 group-hover:text-red-600">
                  Logout
                </span>

                <span className="block text-[11px] text-slate-400">
                  Sign out of your account
                </span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dropdown3;

/* =========================================================
   DROPDOWN ITEM
========================================================= */

interface DropdownItemProps {
  label: string;
  description?: string;
  href: string;
  icon: React.ReactNode;
  onClick?: () => void;
}

const DropdownItem = ({
  label,
  description,
  href,
  icon,
  onClick,
}: DropdownItemProps) => {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="
        group flex items-center gap-3
        rounded-xl px-3 py-2.5
        transition-colors
        hover:bg-blue-50
      ">
      <span
        className="
          flex h-9 w-9 shrink-0 items-center justify-center
          rounded-xl
          bg-blue-50
          text-blue-600
          transition-colors
          group-hover:bg-blue-100
        ">
        {icon}
      </span>

      <span className="min-w-0">
        <span className="block text-sm font-semibold text-slate-700 group-hover:text-blue-600">
          {label}
        </span>

        {description && (
          <span className="block text-[11px] text-slate-400">
            {description}
          </span>
        )}
      </span>
    </Link>
  );
};
