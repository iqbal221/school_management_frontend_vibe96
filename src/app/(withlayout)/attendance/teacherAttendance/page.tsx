
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
import { toast } from "react-toastify";

import {
  useCreateTeacherAttendanceMutation,
  useGetTeacherAttendanceQuery,
} from "@/redux/api/attendance/teacherAttendanceApi";
import { useTeachersQuery } from "@/redux/api/teacherApi";

type ManualStatus = "Present" | "Absent";

interface Teacher {
  id: string | number;
  name?: string;
  TeacherName?: string;
  firstName?: string;
  lastName?: string;
  designation?: string;
  contact?: string;
  phone?: string;
}

interface AttendanceRecord {
  id?: string;
  teacherId?: string | number;
  teacher?: { id?: string | number };
  attendanceDate: string | Date;
  status: string;
  method?: string;
}

const getLocalDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

// Avoid timezone shifting when the API returns an ISO date string.
const getDateKey = (value?: string | Date) => {
  if (!value) return "";

  if (typeof value === "string") {
    const datePart = value.slice(0, 10);

    if (/^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
      return datePart;
    }
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) return "";

  const year = parsedDate.getFullYear();
  const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
  const day = String(parsedDate.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getTeacherName = (teacher: Teacher) =>
  teacher.name ||
  teacher.TeacherName ||
  `${teacher.firstName || ""} ${teacher.lastName || ""}`.trim() ||
  "Unknown Teacher";

export default function TeacherAttendancePage() {
  const [date, setDate] = useState(getLocalDate());
  const [selectedTeacherId, setSelectedTeacherId] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<
    Record<string, ManualStatus>
  >({});

  // --------------------------------------------------
  // TEACHERS API
  // --------------------------------------------------

  const {
    data: teacherResponse,
    isLoading: teachersLoading,
    refetch: refetchTeachers,
  } = useTeachersQuery({});


  const teachersData: Teacher[] = useMemo(() => {
    if (Array.isArray(teacherResponse)) return teacherResponse;

    return (
      teacherResponse?.teachers ??
      []
    );
  }, [teacherResponse]);

  // --------------------------------------------------
  // ATTENDANCE API
  // --------------------------------------------------

  const {
    data: attendanceResponse,
    isFetching,
    refetch: refetchAttendance,
  } = useGetTeacherAttendanceQuery({
    startDate: `${date}T00:00:00.000`,
    endDate: `${date}T23:59:59.999`,
  });

  const attendance: AttendanceRecord[] = useMemo(() => {
    if (Array.isArray(attendanceResponse)) {
      return attendanceResponse;
    }

    return (
      attendanceResponse ?? []
    );
  }, [attendanceResponse]);

  // --------------------------------------------------
  // CREATE ATTENDANCE
  // --------------------------------------------------

  const [
    addTeacherAttendance,
    { isLoading: savingAttendance },
  ] = useCreateTeacherAttendanceMutation();

  // --------------------------------------------------
  // TEACHER OPTIONS
  // --------------------------------------------------

  const teacherOptions = useMemo(() => {
    return teachersData
      .filter((teacher) => teacher?.id)
      .map((teacher) => ({
        id: String(teacher.id),
        name: getTeacherName(teacher),
      }));
  }, [teachersData]);

  // --------------------------------------------------
  // SELECTED TEACHERS
  // Show ALL teachers when no filter is selected.
  // --------------------------------------------------

  const selectedTeachers = useMemo(() => {
    if (!selectedTeacherId) return teachersData;

    return teachersData.filter(
      (teacher) => String(teacher.id) === selectedTeacherId
    );
  }, [teachersData, selectedTeacherId]);

  // --------------------------------------------------
  // FILTER ATTENDANCE BY DATE
  // --------------------------------------------------

  const selectedDateAttendance = useMemo(() => {
    return attendance.filter(
      (item) => getDateKey(item.attendanceDate) === date
    );
  }, [attendance, date]);

  // --------------------------------------------------
  // ATTENDANCE MAP
  // --------------------------------------------------

  const attendanceMap = useMemo(() => {
    const map: Record<string, AttendanceRecord> = {};

    selectedDateAttendance.forEach((item) => {
      const teacherId = item.teacherId ?? item.teacher?.id;

      if (teacherId !== undefined && teacherId !== null) {
        map[String(teacherId)] = item;
      }
    });

    return map;
  }, [selectedDateAttendance]);

  // --------------------------------------------------
  // SUMMARY
  // --------------------------------------------------

  const attendanceSummary = useMemo(() => {
    let Present = 0;
    let Absent = 0;

    selectedTeachers.forEach((teacher) => {
      const record = attendanceMap[String(teacher.id)];

      if (record?.status?.toUpperCase() === "PRESENT") {
        Present++;
      }

      if (record?.status?.toUpperCase() === "ABSENT") {
        Absent++;
      }
    });

    return { Present, Absent };
  }, [selectedTeachers, attendanceMap]);

  // --------------------------------------------------
  // REFRESH
  // --------------------------------------------------

  const handleRefresh = async () => {
    try {
      await Promise.all([
        refetchAttendance(),
        refetchTeachers(),
      ]);

      toast.success("Attendance data refreshed.");
    } catch (error) {
      console.error("Refresh failed:", error);
      toast.error("Failed to refresh data.");
    }
  };

  // --------------------------------------------------
  // CHANGE STATUS
  // --------------------------------------------------

  const handleStatusChange = (
    teacherId: string,
    status: ManualStatus
  ) => {
    setSelectedStatus((previous) => ({
      ...previous,
      [teacherId]: status,
    }));
  };

  // --------------------------------------------------
  // SAVE ATTENDANCE
  // --------------------------------------------------

  const saveAttendance = async (teacherId: string) => {
    const teacher = teachersData.find(
      (item) => String(item.id) === teacherId
    );

    if (!teacher) {
      toast.error("Teacher not found.");
      return;
    }

    const existing = attendanceMap[teacherId];

    if (existing) {
      toast.error(
        "Attendance already exists for this teacher and date. Use the update API to change it."
      );
      return;
    }

    const status: ManualStatus =
      selectedStatus[teacherId] ?? "Present";

    try {
      await addTeacherAttendance({
        teacherId: String(teacher.id),
        attendanceDate: date,
        status: status === "Absent" ? "ABSENT" : "PRESENT",
        method: "MANUAL",
      }).unwrap();

      setSelectedStatus((previous) => {
        const updated = { ...previous };
        delete updated[teacherId];
        return updated;
      });

      toast.success("Teacher attendance saved successfully.");

      await refetchAttendance();
    } catch (error: any) {
      console.error("Failed to save attendance:", error);

      toast.error(
        error?.data?.message ||
        error?.message ||
        "Failed to save attendance."
      );
    }
  };

  // --------------------------------------------------
  // SAVE SELECTED TEACHER
  // --------------------------------------------------

  const saveAllAttendance = async () => {
    if (!selectedTeacherId) {
      toast.error("Please select a teacher first.");
      return;
    }

    await saveAttendance(selectedTeacherId);
  };

  const handleTeacherChange = (teacherId: string) => {
    setSelectedTeacherId(teacherId);
    setSelectedStatus({});
  };

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div className="min-h-screen space-y-6 bg-slate-50 p-6">

      {/* HEADER */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Teacher Attendance
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage daily teacher attendance.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={isFetching || teachersLoading}
          className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
        >
          <RefreshCw
            className={`h-4 w-4 ${
              isFetching || teachersLoading ? "animate-spin" : ""
            }`}
          />
          Refresh
        </button>
      </div>

      {/* FILTERS AND SUMMARY */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:items-end">

          {/* DATE */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Attendance Date
            </label>

            <div className="flex items-center gap-2 border border-gray-300 bg-white px-3">
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

          {/* TEACHER FILTER */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Select Teacher
            </label>

            <select
              value={selectedTeacherId}
              onChange={(event) =>
                handleTeacherChange(event.target.value)
              }
              disabled={teachersLoading}
              className="w-full border border-gray-300 bg-white px-3 py-2 text-sm outline-none"
            >
              <option value="">All Teachers</option>

              {teacherOptions.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.name}
                </option>
              ))}
            </select>
          </div>

          {/* PRESENT */}
          <div className="flex items-center justify-between rounded-lg border border-green-100 bg-green-50 px-4 py-3">
            <div>
              <p className="text-sm font-medium text-green-700">
                Present
              </p>

              <p className="mt-1 text-2xl font-bold text-green-700">
                {attendanceSummary.Present}
              </p>
            </div>

            <div className="rounded-full bg-white p-3">
              <UserCheck className="h-5 w-5 text-green-600" />
            </div>
          </div>

          {/* ABSENT */}
          <div className="flex items-center justify-between rounded-lg border border-red-100 bg-red-50 px-4 py-3">
            <div>
              <p className="text-sm font-medium text-red-700">
                Absent
              </p>

              <p className="mt-1 text-2xl font-bold text-red-700">
                {attendanceSummary.Absent}
              </p>
            </div>

            <div className="rounded-full bg-white p-3">
              <Users className="h-5 w-5 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* ATTENDANCE TABLE */}
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
              teachersLoading ||
              !selectedTeacherId ||
              selectedTeachers.length === 0 ||
              Boolean(attendanceMap[selectedTeacherId])
            }
            className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {savingAttendance ? "Saving..." : "Save Selected Teacher"}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">

            <thead className="border-b bg-gray-50 text-gray-600">
              <tr>
                <th className="px-5 py-4">#</th>
                <th className="px-5 py-4">Teacher</th>
                <th className="px-5 py-4">Designation</th>
                <th className="px-5 py-4">Contact</th>
                <th className="px-5 py-4">Current Status</th>
                <th className="px-5 py-4">Manual Status</th>
                <th className="px-5 py-4">Method</th>
                <th className="px-5 py-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {teachersLoading ? (
                <tr>
                  <td colSpan={8} className="px-5 py-10 text-center text-gray-500">
                    Loading teachers...
                  </td>
                </tr>
              ) : selectedTeachers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-10 text-center text-gray-500">
                    No teachers found.
                  </td>
                </tr>
              ) : (
                selectedTeachers.map((teacher, index) => {
                  const teacherId = String(teacher.id);
                  const existing = attendanceMap[teacherId];

                  const status: ManualStatus =
                    selectedStatus[teacherId] ??
                    (existing?.status?.toUpperCase() === "ABSENT"
                      ? "Absent"
                      : "Present");

                  return (
                    <tr
                      key={teacherId}
                      className="border-b last:border-0 hover:bg-gray-50"
                    >
                      <td className="px-5 py-4">{index + 1}</td>

                      <td className="px-5 py-4">
                        <p className="font-medium text-gray-800">
                          {getTeacherName(teacher)}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        {teacher.designation || "—"}
                      </td>

                      <td className="px-5 py-4">
                        {teacher.contact || teacher.phone || "—"}
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
                              teacherId,
                              event.target.value as ManualStatus
                            )
                          }
                          disabled={Boolean(existing)}
                          className="rounded-lg border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100 disabled:text-gray-500"
                        >
                          <option value="Present">Present</option>
                          <option value="Absent">Absent</option>
                        </select>
                      </td>

                      <td className="px-5 py-4">
                        {existing ? (
                          <MethodBadge method={existing.method || "MANUAL"} />
                        ) : (
                          <MethodBadge method="MANUAL" />
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <button
                          onClick={() => saveAttendance(teacherId)}
                          disabled={
                            savingAttendance ||
                            Boolean(existing)
                          }
                          className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <Check className="h-4 w-4" />
                          {existing ? "Saved" : "Save"}
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
    late: "bg-yellow-100 text-yellow-700",
    leave: "bg-blue-100 text-blue-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium ${
        classes[normalizedStatus] ?? "bg-gray-100 text-gray-700"
      }`}
    >
      {status || "Unknown"}
    </span>
  );
}

// METHOD BADGE
function MethodBadge({ method }: { method: string }) {
  const config: Record<string, { label: string; className: string }> = {
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
