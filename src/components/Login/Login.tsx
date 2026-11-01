
"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Eye,
  EyeOff,
  ShieldCheck,
  GraduationCap,
  LockKeyhole,
  UserRound,
  ArrowRight,
  LoaderCircle,
} from "lucide-react";
import { toast } from "react-toastify";

import school_image from "../../../public/login_image.jpg";
import { storeUserInfo } from "@/service/auth.service";
import { useUserLoginMutation } from "@/redux/api/authApi";
import { useUsersQuery } from "@/redux/api/userApi";

type LoginRole = "super_admin" | "admin";

type User = {
  userId: string;
  role: string;
};

const LoginPage = () => {
  const router = useRouter();

  const [userLogin, { isLoading }] = useUserLoginMutation();

  const { data: usersData, isLoading: isUsersLoading } = useUsersQuery({
    limit: 100,
    page: 1,
  });
  console.log(usersData)

  const users: User[] = usersData?.Users ?? [];

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    userId: "",
    password: "",
    role: "super_admin" as LoginRole,
  });

  // Find the user ID for the selected role from database results.
  const handleRoleChange = (role: LoginRole) => {
    const matchedUser = users.find(
      (user) => user.role === role
    );

    setFormData((prev) => ({
      ...prev,
      role,
      userId: matchedUser?.userId ?? "",
      password: "",
    }));

    if (!isUsersLoading && !matchedUser) {
      toast.info(
        `No ${role.replace("_", " ")} account found.`
      );
    }
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const userId = formData.userId.trim();
    const password = formData.password;

    if (!userId || !password) {
      toast.error("Please enter your user ID and password.");
      return;
    }

    console.log(userId,password)

    try {
      const res = await userLogin({
        userId,
        password,
        role: formData.role,
      }).unwrap();

      if (!res?.accessToken) {
        toast.error("Login failed. Please try again.");
        return;
      }

      storeUserInfo({ accessToken: res.accessToken });

      toast.success("Login successful!");
      router.replace("/dashboard");
    } catch (err: any) {
      toast.error(
        err?.data?.message ||
          "Invalid credentials or unauthorized account."
      );
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 lg:grid lg:grid-cols-2">
       {/* left visual panel */}
      <section className="relative hidden overflow-hidden bg-slate-950 lg:block">
        <Image
          src={school_image}
          alt="School campus and education"
          fill
          priority
          sizes="50vw"
          className="object-cover opacity-55"
        />

        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/90 via-indigo-900/65 to-slate-950/90" />

        <div className="relative z-10 flex h-full flex-col justify-between p-12 xl:p-16">
          <div className="flex items-center gap-2 text-sm font-medium text-indigo-100">
            <ShieldCheck size={19} />
            Trusted School Administration
          </div>

          <div className="max-w-lg">
            <div className="mb-5 h-1.5 w-16 rounded-full bg-indigo-400" />

            <h2 className="text-4xl font-bold leading-tight tracking-tight text-white xl:text-5xl">
              Everything your school needs,
              <span className="text-indigo-300">
                {" "}in one place.
              </span>
            </h2>

            <p className="mt-6 max-w-md text-base leading-7 text-indigo-100/80">
              Manage school operations through a secure,
              centralized platform built for efficient
              administration and better decision-making.
            </p>

            <div className="mt-9 grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
                <ShieldCheck
                  size={23}
                  className="mb-3 text-indigo-300"
                />

                <h3 className="text-sm font-semibold text-white">
                  Role-based access
                </h3>

                <p className="mt-2 text-xs leading-5 text-indigo-100/70">
                  Permissions for authorized administrators.
                </p>
              </div>

              <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
                <GraduationCap
                  size={23}
                  className="mb-3 text-indigo-300"
                />

                <h3 className="text-sm font-semibold text-white">
                  Centralized management
                </h3>

                <p className="mt-2 text-xs leading-5 text-indigo-100/70">
                  Essential school operations in one system.
                </p>
              </div>
            </div>
          </div>

          <p className="text-sm text-blue-600 font-bold pt-4">
            Secure access. Smarter administration. Better organization.
          </p>
        </div>
      </section>
      {/* Login section */}
      <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
        <div className="w-full max-w-md">
          {/* Brand */}
          <div className="mb-9 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
              <GraduationCap size={27} />
            </div>

            <div>
              <h1 className="text-lg font-bold tracking-tight text-slate-900">
                SchoolERP
              </h1>
              <p className="text-xs text-slate-500">
                School Management System
              </p>
            </div>
          </div>


          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role selection */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Sign in as
              </label>

              <div className="grid grid-cols-2 gap-3">
                {(
                  [
                    {
                      value: "super_admin",
                      label: "Super Admin",
                      description: "Full system access",
                    },
                    {
                      value: "admin",
                      label: "Admin",
                      description: "Authorized access",
                    },
                  ] as const
                ).map((item) => {
                  const selected = formData.role === item.value;

                  return (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() =>
                        handleRoleChange(item.value)
                      }
                      aria-pressed={selected}
                      disabled={isUsersLoading || isLoading}
                      className={`rounded-xl border p-3 text-left transition ${
                        selected
                          ? "border-indigo-600 bg-indigo-50 ring-2 ring-indigo-100"
                          : "border-slate-200 bg-white hover:border-indigo-300"
                      } disabled:cursor-not-allowed disabled:opacity-60`}
                    >
                      <span className="block text-sm font-semibold text-slate-800">
                        {item.label}
                      </span>

                      <span className="mt-1 block text-xs text-slate-500">
                        {item.description}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Database User ID */}
            <div>
              <label
                htmlFor="userId"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                User ID
              </label>

              <div className="relative">
                <UserRound
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="userId"
                  name="userId"
                  type="text"
                  autoComplete="username"
                  placeholder={
                    isUsersLoading
                      ? "Loading user ID..."
                      : "Select an administrator role"
                  }
                  value={formData.userId}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      userId: e.target.value,
                    }))
                  }
                  required
                  disabled={isUsersLoading || isLoading}
                  className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 disabled:opacity-60"
                />
              </div>

             
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Password
              </label>

              <div className="relative">
                <LockKeyhole
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  required
                  disabled={isLoading}
                  className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 disabled:opacity-60"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((prev) => !prev)
                  }
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Login button */}
            <button
              type="submit"
              disabled={
                isLoading ||
                isUsersLoading ||
                !formData.userId
              }
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <LoaderCircle
                    size={18}
                    className="animate-spin"
                  />
                  Signing in...
                </>
              ) : isUsersLoading ? (
                <>
                  <LoaderCircle
                    size={18}
                    className="animate-spin"
                  />
                  Loading users...
                </>
              ) : (
                <>
                  Sign in to Dashboard
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Security notice */}

          <p className="mt-8 text-center text-xs text-slate-400">
            © {new Date().getFullYear()} SchoolERP. All rights reserved.
          </p>
        </div>
      </section>

     
    </main>
  );
};

export default LoginPage;
