"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  useOfficialQuery,
  useUpdateOfficialMutation,
} from "@/redux/api/officialApi";
import { User, ArrowLeft, Save, Loader2 } from "lucide-react";

type EditOfficialPageProps = {
  params: {
    id: string;
  };
};

const EditOfficialPage = ({ params }: EditOfficialPageProps) => {
  const { id } = params;
  const router = useRouter();

  const [formSelectData, setFormSelectData] = useState({
    bloodGroup: "",
  });

  // Get official information
  const { data: officialData, isLoading, isFetching } = useOfficialQuery(id);

  // Update official
  const [updateOfficial, { isLoading: isUpdating }] =
    useUpdateOfficialMutation();

  // Set blood group after official data loads
  useEffect(() => {
    if (officialData?.bloodGroup) {
      setFormSelectData({
        bloodGroup: officialData.bloodGroup,
      });
    }
  }, [officialData]);

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormSelectData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleUpdate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;

    const getValue = (name: string) =>
      (form.elements.namedItem(name) as HTMLInputElement)?.value.trim();

    const name = getValue("name");
    const designation = getValue("designation");
    const email = getValue("email");
    const contact = getValue("contact");
    const address = getValue("address");

    if (!name) {
      return toast.error("Please write name");
    }

    if (!designation) {
      return toast.error("Please write designation");
    }

    if (!email) {
      return toast.error("Please write email");
    }

    if (!contact) {
      return toast.error("Please write contact");
    }

    if (!formSelectData.bloodGroup) {
      return toast.error("Please select blood group");
    }

    if (!address) {
      return toast.error("Please write address");
    }

    const data = {
      name,
      designation,
      email,
      contact,
      address,
      bloodGroup: formSelectData.bloodGroup,
    };

    try {
      const res = await updateOfficial({
        id,
        data,
      }).unwrap();

      if (res?.id) {
        toast.success("Official information updated successfully");

        router.push("/instituteInfo/officialInfo");
      }
    } catch (error) {
      console.error(error);
      toast.error("Official information update failed");
    }
  };

  const inputClass =
    "w-full border border-slate-300 bg-slate-50/70 px-4 py-2 text-sm text-slate-700 outline-none transition-all duration-200 placeholder:text-slate-400 hover:border-slate-300 focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100";

  const labelClass = "mb-2 block text-sm font-semibold text-slate-700";

  // Loading UI
  if (isLoading || isFetching) {
    return (
      <div className="flex min-h-[500px] items-center justify-center bg-slate-50/70">
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-50">
            <Loader2 className="h-7 w-7 animate-spin text-sky-500" />
          </div>

          <p className="text-sm font-medium text-slate-500">
            Loading official information...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className=" bg-slate-50/70 px-2 py-5 sm:px-3 lg:px-4">
      <div className="mx-auto w-full max-w-7xl">
        {/* ================= HEADER ================= */}
        <div className="mb-5 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-sm">
              <User className="h-5 w-5" />
            </div>

            <div>
              <h1 className="text-xl font-bold text-slate-800">
                Update Official
              </h1>

              <p className="text-xs text-slate-500">
                Update official profile information
              </p>
            </div>
          </div>

          {/* Back Button */}
          <button
            type="button"
            onClick={() => router.push("/instituteInfo/officialInfo")}
            disabled={isUpdating}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50">
            <ArrowLeft className="h-4 w-4" />
            Back to Officials
          </button>
        </div>

        {/* ================= MAIN CARD ================= */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* Card Header */}
          <div className="border-b border-slate-100 bg-gradient-to-r from-sky-50 via-white to-blue-50 px-5 py-4 sm:px-7">
            <h2 className="text-base font-bold text-slate-800">
              Official Information
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Make changes to the official information below.
            </p>
          </div>

          <form onSubmit={handleUpdate}>
            <div className="p-5 sm:p-7">
              {/* ================= ROW 1 ================= */}
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
                {/* Full Name */}
                <div>
                  <label htmlFor="name" className={labelClass}>
                    Full Name
                  </label>

                  <input
                    id="name"
                    type="text"
                    name="name"
                    defaultValue={officialData?.name}
                    placeholder="Enter full name"
                    className={inputClass}
                  />
                </div>

                {/* Designation */}
                <div>
                  <label htmlFor="designation" className={labelClass}>
                    Designation
                  </label>

                  <input
                    id="designation"
                    type="text"
                    name="designation"
                    defaultValue={officialData?.designation}
                    placeholder="Enter designation"
                    className={inputClass}
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className={labelClass}>
                    Email Address
                  </label>

                  <input
                    id="email"
                    type="email"
                    name="email"
                    defaultValue={officialData?.email}
                    placeholder="Enter email"
                    className={inputClass}
                  />
                </div>

                {/* Contact */}
                <div>
                  <label htmlFor="contact" className={labelClass}>
                    Contact Number
                  </label>

                  <input
                    id="contact"
                    type="text"
                    name="contact"
                    defaultValue={officialData?.contact}
                    placeholder="Enter contact number"
                    className={inputClass}
                  />
                </div>
              </div>

              {/* ================= ROW 2 ================= */}
              <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
                {/* Blood Group */}
                <div>
                  <label htmlFor="bloodGroup" className={labelClass}>
                    Blood Group
                  </label>

                  <select
                    id="bloodGroup"
                    name="bloodGroup"
                    value={formSelectData.bloodGroup}
                    onChange={handleChange}
                    className={`${inputClass} cursor-pointer appearance-none`}>
                    <option value="">Select blood group</option>

                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>

                {/* Address */}
                <div className="md:col-span-1 xl:col-span-3">
                  <label htmlFor="address" className={labelClass}>
                    Address
                  </label>

                  <input
                    id="address"
                    type="text"
                    name="address"
                    defaultValue={officialData?.address}
                    placeholder="Enter official address"
                    className={inputClass}
                  />
                </div>
              </div>

              {/* ================= ROW 4 ================= */}
              <div className="my-7 h-px bg-slate-100" />

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                {/* Cancel */}
                <button
                  type="button"
                  onClick={() => router.push("/instituteInfo/officialInfo")}
                  disabled={isUpdating}
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50">
                  Cancel
                </button>

                {/* Update */}
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-200 transition-all duration-200 hover:-translate-y-0.5 hover:from-sky-600 hover:to-blue-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0">
                  {isUpdating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Update Official
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditOfficialPage;
