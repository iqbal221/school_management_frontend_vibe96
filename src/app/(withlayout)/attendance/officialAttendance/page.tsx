
"use client";

import { useMemo, useState } from "react";
import {
  CalendarDays,
  Check,
  RefreshCw,
  Save,
  UserCheck,
  Users,
} from "lucide-react";




import { useOfficialsQuery } from "@/redux/api/officialApi";
import { toast } from "react-toastify";
import { AttendanceStatusType, useCreateOfficialAttendanceMutation, useGetOfficialAttendanceQuery } from "@/redux/api/attendance/officialAttendanceApi";

type ManualStatus = "Present" | "Absent";

export default function OfficialAttendancePage() {
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  const [selectedOfficialId, setSelectedOfficialId] = useState("");

  const [selectedStatus, setSelectedStatus] = useState<
    Record<string, ManualStatus>
  >({});

  // Official list
  const {
    data: officialResponse,
    isLoading: officialsLoading,
    refetch: refetchOfficials,
  } = useOfficialsQuery({});

  const officialsData = officialResponse?.officials ?? [];

  // Official attendance records
  const {
    data: attendanceResponse,
    isFetching,
    refetch: refetchAttendance,
  } = useGetOfficialAttendanceQuery({});

  const attendance = attendanceResponse ?? [];

  // Existing bulk attendance mutation
  const [
    addOfficialAttendance,
    { isLoading: savingAttendance },
  ] = useCreateOfficialAttendanceMutation();

  // Refresh both APIs
  const handleRefresh = async () => {
    try {
      await Promise.all([
        refetchOfficials(),
        refetchAttendance(),
      ]);
    } catch (error) {
      console.error("Failed to refresh attendance:", error);
    }
  };

  // Format date consistently using local calendar date
  const getDateKey = (value: string | Date) => {
    const parsedDate = new Date(value);

    if (Number.isNaN(parsedDate.getTime())) return "";

    const year = parsedDate.getFullYear();
    const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
    const day = String(parsedDate.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // Official options
  const officialOptions = useMemo(() => {
    return officialsData
      .filter((official: any) => official?.id)
      .map((official: any) => ({
        id: String(official.id),
        name:
          official.name ||
          official.officialName ||
          `${official.firstName || ""} ${official.lastName || ""}`.trim() ||
          "Unknown Official",
      }));
  }, [officialsData]);

  // Selected official
  const selectedOfficials = useMemo(() => {
    if (!selectedOfficialId) return [];

    return officialsData.filter(
      (official: any) =>
        String(official.id) === selectedOfficialId,
    );
  }, [officialsData, selectedOfficialId]);

  // Filter attendance records by selected date
  const selectedDateAttendance = useMemo(() => {
    return attendance.filter((item: any) => {
      const attendanceDate = item.attendanceDate;

      return attendanceDate && getDateKey(attendanceDate) === date;
    });
  }, [attendance, date]);

  // Attendance lookup by official ID
  const attendanceMap = useMemo(() => {
    const map: Record<string, any> = {};

    selectedDateAttendance.forEach((item: any) => {
      const officialId =
        item.officialId ??
        item.official?.id;

      if (officialId !== undefined && officialId !== null) {
        map[String(officialId)] = item;
      }
    });

    return map;
  }, [selectedDateAttendance]);

  // Present / Absent summary
  const attendanceSummary = useMemo(() => {
    const summary = {
      Present: 0,
      Absent: 0,
    };

    selectedOfficials.forEach((official: any) => {
      const record = attendanceMap[String(official.id)];

      const status = record?.status?.toLowerCase();

      if (status === "present") summary.Present++;
      if (status === "absent") summary.Absent++;
    });

    return summary;
  }, [selectedOfficials, attendanceMap]);

  // Change manual status
  const handleStatusChange = (
    officialId: string,
    status: ManualStatus,
  ) => {
    setSelectedStatus((previous) => ({
      ...previous,
      [officialId]: status,
    }));
  };

  // Save attendance using your existing mutation
  const saveAttendance = async (officialId: string) => {
    const official = selectedOfficials.find(
      (item: any) => String(item.id) === officialId,
    );



    if (!official) {
      toast.error("Official not found.");
      return;
    }

    const existing = attendanceMap[officialId];

    const status: ManualStatus =
      selectedStatus[officialId] ??
      (existing?.status?.toLowerCase() === "absent"
        ? "Absent"
        : "Present");
    console.log("official",official.id,date,status)

    try {
      await addOfficialAttendance({
        officialId: String(official.id),
        attendanceDate: date,
        status: status === "Absent" ? "ABSENT" : "PRESENT",
        method: "MANUAL",
      }).unwrap();

      setSelectedStatus((previous) => {
        const updated = { ...previous };
        delete updated[officialId];
        return updated;
      });

      toast.success("Official attendance saved successfully.");

      await refetchAttendance();
    } catch (error: any) {
      console.error("Failed to save official attendance:", error);

      toast.error(
        error?.data?.message || "Failed to save attendance.",
      );
    }
  };

  // Save attendance for selected official
  const saveAllAttendance = async () => {
    if (!selectedOfficialId) {
      toast.error("Please select an official first.");
      return;
    }

    if (selectedOfficials.length === 0) {
      toast.error("No official found.");
      return;
    }

    const official = selectedOfficials[0];
    const officialId = String(official.id);
    const existing = attendanceMap[officialId];

    const status: ManualStatus =
      selectedStatus[officialId] ??
      (existing?.status?.toLowerCase() === "absent"
        ? "Absent"
        : "Present");

    try {
      await addOfficialAttendance({
        officialId: String(official.id),
        attendanceDate: date,
        status: status === "Absent" ? "ABSENT" : "PRESENT",
        method: "MANUAL",
      }).unwrap();

      setSelectedStatus({});

      toast.success("Official attendance saved successfully.");

      await refetchAttendance();
    } catch (error: any) {
      console.error("Failed to save official attendance:", error);

      toast.error(
        error?.data?.message || "Failed to save attendance.",
      );
    }
  };

  // Change selected official
  const handleOfficialChange = (officialId: string) => {
    setSelectedOfficialId(officialId);
    setSelectedStatus({});
  };

  return (
    <div className="min-h-screen space-y-6 bg-slate-50 p-6">
      {/* HEADER */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Official Attendance
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage daily official attendance.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={isFetching || officialsLoading}
          className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
        >
          <RefreshCw
            className={`h-4 w-4 ${isFetching || officialsLoading
                ? "animate-spin"
                : ""
              }`}
          />
          Refresh
        </button>
      </div>

      {/* FILTERS + ATTENDANCE SUMMARY */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:items-end">
          {/* DATE FILTER */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Attendance Date
            </label>

            <div className="flex items-center gap-2 border border-gray-300 bg-white px-3 transition focus-within:ring-2 focus-within:ring-blue-100">
              <CalendarDays className="h-4 w-4 shrink-0 text-gray-500" />

              <input
                type="date"
                value={date}
                onChange={(event) => {
                  setDate(event.target.value);
                  setSelectedStatus({});
                }}
                className="w-full py-2 text-sm outline-none"
              />
            </div>
          </div>

          {/* OFFICIAL FILTER */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Select Official
            </label>

            <select
              value={selectedOfficialId}
              onChange={(event) =>
                handleOfficialChange(event.target.value)
              }
              disabled={officialsLoading}
              className="w-full border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-blue-100 disabled:opacity-50"
            >
              <option value="">Select Official</option>

              {officialOptions.map((official: any) => (
                <option key={official.id} value={official.id}>
                  {official.name}
                </option>
              ))}
            </select>
          </div>

          {/* PRESENT SUMMARY */}
          <div className="flex items-center justify-between rounded-lg border border-green-100 bg-green-50 px-4 py-3">
            <div>
              <p className="text-sm font-medium text-green-700">
                Present
              </p>

              <p className="mt-1 text-2xl font-bold text-green-700">
                {selectedOfficialId
                  ? attendanceSummary.Present
                  : 0}
              </p>
            </div>

            <div className="rounded-full bg-white p-3">
              <UserCheck className="h-5 w-5 text-green-600" />
            </div>
          </div>

          {/* ABSENT SUMMARY */}
          <div className="flex items-center justify-between rounded-lg border border-red-100 bg-red-50 px-4 py-3">
            <div>
              <p className="text-sm font-medium text-red-700">
                Absent
              </p>

              <p className="mt-1 text-2xl font-bold text-red-700">
                {selectedOfficialId
                  ? attendanceSummary.Absent
                  : 0}
              </p>
            </div>

            <div className="rounded-full bg-white p-3">
              <Users className="h-5 w-5 text-red-600" />
            </div>
          </div>
        </div>

        {/* SELECTED OFFICIAL INFO */}
        {selectedOfficialId && selectedOfficials.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-3 text-sm text-gray-600">
            <Users className="h-4 w-4 text-blue-500" />

            <span>
              <strong className="text-gray-800">Official:</strong>{" "}
              {officialOptions.find(
                (item: any) => item.id === selectedOfficialId,
              )?.name ?? "Selected Official"}
            </span>
          </div>
        )}
      </div>

      {/* OFFICIAL ATTENDANCE TABLE */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-3 border-b p-5 md:flex-row md:items-center">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              Manual Attendance
            </h2>
          </div>

          <button
            onClick={saveAllAttendance}
            disabled={
              savingAttendance ||
              officialsLoading ||
              !selectedOfficialId ||
              selectedOfficials.length === 0
            }
            className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save className="h-4 w-4" />

            {savingAttendance
              ? "Saving..."
              : "Save All Attendance"}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-gray-50 text-gray-600">
              <tr>
                <th className="px-5 py-4">#</th>
                <th className="px-5 py-4">Official</th>
                <th className="px-5 py-4">Designation</th>
                <th className="px-5 py-4">Contact</th>
                <th className="px-5 py-4">Current Status</th>
                <th className="px-5 py-4">Manual Status</th>
                <th className="px-5 py-4">Method</th>
                <th className="px-5 py-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {!selectedOfficialId ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-5 py-10 text-center text-gray-500"
                  >
                    Please select an official to mark attendance.
                  </td>
                </tr>
              ) : officialsLoading ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-5 py-10 text-center text-gray-500"
                  >
                    Loading officials...
                  </td>
                </tr>
              ) : selectedOfficials.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-5 py-10 text-center text-gray-500"
                  >
                    No official found.
                  </td>
                </tr>
              ) : (
                selectedOfficials.map((official: any, index: number) => {
                  const officialId = String(official.id);
                  const existing = attendanceMap[officialId];

                  const status: ManualStatus =
                    selectedStatus[officialId] ??
                    (existing?.status?.toLowerCase() === "absent"
                      ? "Absent"
                      : "Present");

                  const officialName =
                    official.name ||
                    official.officialName ||
                    `${official.firstName || ""} ${official.lastName || ""
                      }`.trim() ||
                    "Unknown Official";

                  return (
                    <tr
                      key={official.id}
                      className="border-b last:border-0"
                    >
                      <td className="px-5 py-4">{index + 1}</td>

                      <td className="px-5 py-4">
                        <p className="font-medium text-gray-800">
                          {officialName}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        {official.designation || "—"}
                      </td>

                      <td className="px-5 py-4">
                        {official.contact || "—"}
                      </td>

                      <td className="px-5 py-4">
                        {existing ? (
                          <StatusBadge status={existing.status} />
                        ) : (
                          <span className="text-gray-400">
                            Not marked
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <select
                          value={status}
                          onChange={(event) =>
                            handleStatusChange(
                              officialId,
                              event.target.value as ManualStatus,
                            )
                          }
                          className="rounded-lg border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-100"
                        >
                          <option value="Present">Present</option>
                          <option value="Absent">Absent</option>
                        </select>
                      </td>

                      <td className="px-5 py-4">
                        {existing ? (
                          <MethodBadge method={existing.method} />
                        ) : (
                          <MethodBadge method="MANUAL" />
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <button
                          onClick={() => saveAttendance(officialId)}
                          disabled={savingAttendance}
                          className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 transition hover:bg-gray-50 disabled:opacity-50"
                        >
                          <Check className="h-4 w-4" />
                          Save
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// STATUS BADGE
function StatusBadge({ status }: { status: string }) {
  const normalizedStatus = status?.toLowerCase();

  const classes: Record<string, string> = {
    present: "bg-green-100 text-green-700",
    absent: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium ${classes[normalizedStatus] ?? "bg-gray-100 text-gray-700"
        }`}
    >
      {status || "Unknown"}
    </span>
  );
}

// METHOD BADGE
function MethodBadge({ method }: { method: string }) {
  const config: Record<
    string,
    { label: string; className: string }
  > = {
    MANUAL: {
      label: "Manual",
      className: "bg-gray-100 text-gray-700",
    },
    FACE: {
      label: "Face",
      className: "bg-purple-100 text-purple-700",
    },
    BIOMETRIC: {
      label: "Biometric",
      className: "bg-blue-100 text-blue-700",
    },
    MOBILE: {
      label: "Mobile",
      className: "bg-indigo-100 text-indigo-700",
    },
    WEB: {
      label: "Web",
      className: "bg-gray-100 text-gray-700",
    },
  };

  const item = config[method?.toUpperCase()] ?? {
    label: method || "Unknown",
    className: "bg-gray-100 text-gray-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium ${item.className}`}
    >
      {item.label}
    </span>
  );
}
