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

import {
  useGetStudentAttendanceQuery,
  useCreateStudentAttendanceMutation,
} from "@/redux/api/attendance/studentAttendanceApi";

import { useStudentsQuery } from "@/redux/api/studentApi";
import { toast } from "react-toastify";

type ManualStatus = "PRESENT" | "ABSENT";

export default function StudentAttendancePage() {
  // =========================================================
  // DATE
  // =========================================================

  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  // =========================================================
  // SELECTED ADMISSION ID
  // =========================================================

  const [selectedAdmissionId, setSelectedAdmissionId] =
    useState("");

  // =========================================================
  // SELECTED STATUS
  // =========================================================

  const [selectedStatus, setSelectedStatus] =
    useState<Record<string, ManualStatus>>({});

  // =========================================================
  // GET ATTENDANCE
  // =========================================================

  const {
    data: attendance = [],
    isFetching,
    refetch,
  } = useGetStudentAttendanceQuery({
    date,
  });

  // =========================================================
  // GET STUDENTS
  // =========================================================

  const {
    data,
    isLoading: studentsLoading,
  } = useStudentsQuery({});

  const studentsData = data?.students ?? [];

  console.log("studentsData:", studentsData);

  // =========================================================
  // CREATE ATTENDANCE
  // =========================================================

  const [
    createStudentAttendance,
    {
      isLoading: savingAttendance,
    },
  ] = useCreateStudentAttendanceMutation();

  // =========================================================
  // GET UNIQUE ADMISSION IDS
  // =========================================================

  const admissionIds = useMemo(() => {
    const admissionMap = new Map<string, any>();

    studentsData.forEach((student: any) => {
      const admissionId = student.admission;

      if (!admissionId) {
        return;
      }

      admissionMap.set(String(admissionId), {
        id: String(admissionId),
      });
    });

    return Array.from(admissionMap.values());
  }, [studentsData]);

  // =========================================================
  // GET STUDENTS BY ADMISSION ID
  // =========================================================

  const admissionStudents = useMemo(() => {
    if (!selectedAdmissionId) {
      return [];
    }

    return studentsData.filter(
      (student: any) =>
        String(student.admission) ===
        String(selectedAdmissionId)
    );
  }, [
    studentsData,
    selectedAdmissionId,
  ]);

  // =========================================================
  // ATTENDANCE MAP
  // =========================================================

  const attendanceMap = useMemo(() => {
    const map: Record<string, any> = {};

    attendance.forEach((item: any) => {
      map[String(item.studentId)] = item;
    });

    return map;
  }, [attendance]);

  // =========================================================
  // FILTER ATTENDANCE BY ADMISSION ID
  // =========================================================

  const admissionAttendance = useMemo(() => {
    if (!selectedAdmissionId) {
      return [];
    }

    return attendance.filter(
      (item: any) =>
        String(item.admission) ===
        String(selectedAdmissionId)
    );
  }, [
    attendance,
    selectedAdmissionId,
  ]);

  /// =========================================================
  // ATTENDANCE SUMMARY
  // =========================================================

  const attendanceSummary = useMemo(() => {
    const summary = {
      PRESENT: 0,
      ABSENT: 0,
    };

    admissionStudents.forEach((student: any) => {
      const attendanceRecord =
        attendanceMap[String(student.id)];

      // No attendance marked yet
      if (!attendanceRecord) {
        return;
      }

      const status =
        attendanceRecord.status as ManualStatus;

      if (status === "PRESENT") {
        summary.PRESENT++;
      } else if (status === "ABSENT") {
        summary.ABSENT++;
      }
    });

    return summary;
  }, [
    admissionStudents,
    attendanceMap,
  ]);

  // =========================================================
  // STATUS CHANGE
  // =========================================================

  const handleStatusChange = (
    studentId: string,
    status: ManualStatus
  ) => {
    setSelectedStatus((previous) => ({
      ...previous,
      [studentId]: status,
    }));
  };

  // =========================================================
  // SAVE ONE STUDENT
  // =========================================================

  const saveAttendance = async (
    studentId: string
  ) => {
    const student = admissionStudents.find(
      (item: any) =>
        String(item.id) ===
        String(studentId)
    );

    if (!student) {
      console.error(
        "Student not found:",
        studentId
      );
      return;
    }

    const existing =
      attendanceMap[String(studentId)];

    const status =
      selectedStatus[studentId] ??
      existing?.status ??
      "PRESENT";

    const admissionId =
      student.admission ??
      selectedAdmissionId;

    const studentData: any = {
      studentId: student.id,

      admissionId: String(
        admissionId
      ),

      attendanceDate: date,

      status,

      method: "MANUAL",
    };

    console.log(
      "Saving attendance:",
      studentData
    );

    try {
      await createStudentAttendance(
        studentData
      ).unwrap();

      toast.success(
        "Attendance saved successfully"
      );

      setSelectedStatus((previous) => {
        const updated = {
          ...previous,
        };

        delete updated[studentId];

        return updated;
      });

      await refetch();
    } catch (error) {
      console.error(
        "Failed to save attendance:",
        error
      );
    }
  };

  // =========================================================
  // SAVE ALL ATTENDANCE
  // =========================================================

  const saveAllAttendance = async () => {
    if (!selectedAdmissionId) {
      alert(
        "Please select an admission ID first."
      );
      return;
    }

    if (admissionStudents.length === 0) {
      alert(
        "No student found for this admission ID."
      );
      return;
    }

    try {
      const promises =
        admissionStudents.map(
          (student: any) => {
            const existing =
              attendanceMap[
              String(student.id)
              ];

            const status =
              selectedStatus[
              student.id
              ] ??
              existing?.status ??
              "PRESENT";



            return createStudentAttendance({
              studentId:
                student.id,

              attendanceDate:
                date,

              status,

              method: "MANUAL",
            }).unwrap();
          }
        );

      await Promise.all(promises);

      setSelectedStatus({});

      await refetch();

      console.log(
        "All attendance saved successfully"
      );
    } catch (error) {
      console.error(
        "Failed to save attendance:",
        error
      );
    }
  };

  // =========================================================
  // ADMISSION ID CHANGE
  // =========================================================

  const handleAdmissionIdChange = (
    admissionId: string
  ) => {
    setSelectedAdmissionId(
      admissionId
    );

    setSelectedStatus({});
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="space-y-6 p-6 bg-slate-50">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Student Attendance
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage daily teacher attendance.
          </p>
        </div>

        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="flex items-center justify-center gap-2 rounded-lg border bg-white px-4 py-2 hover:bg-gray-50 disabled:opacity-50"
        >
          <RefreshCw
            className={`h-4 w-4 ${isFetching
              ? "animate-spin"
              : ""
              }`}
          />

          Refresh
        </button>

      </div>

      {/* =====================================================
              FILTERS + ATTENDANCE SUMMARY
      ===================================================== */}

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
                onChange={(e) => {
                  setDate(e.target.value);
                  setSelectedStatus({});
                }}
                className="w-full py-2 text-sm outline-none"
              />
            </div>
          </div>

          {/* CLASS FILTER */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Select Class
            </label>

            <select
              value={selectedAdmissionId}
              onChange={(e) =>
                handleAdmissionIdChange(e.target.value)
              }
              disabled={studentsLoading}
              className="w-full  border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-blue-100 disabled:opacity-50"
            >
              <option value="">Select Class</option>

              {admissionIds.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.id}
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
                {selectedAdmissionId
                  ? attendanceSummary.PRESENT
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
                {selectedAdmissionId
                  ? attendanceSummary.ABSENT
                  : 0}
              </p>
            </div>

            <div className="rounded-full bg-white p-3">
              <Users className="h-5 w-5 text-red-600" />
            </div>
          </div>

        </div>

        {/* SELECTED CLASS INFO */}
        {selectedAdmissionId && (
          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-3 text-sm text-gray-600">
            <Users className="h-4 w-4 text-blue-500" />

            <span>
              <strong className="text-gray-800">
                Class:
              </strong>{" "}
              {selectedAdmissionId}
            </span>

            <span className="text-gray-300">|</span>

            <span>
              {admissionStudents.length} Students
            </span>
          </div>
        )}

      </div>


      {/* =====================================================
          MANUAL ATTENDANCE
      ===================================================== */}

      <div className="rounded-xl border bg-white shadow-sm">

        <div className="flex flex-col justify-between gap-3 border-b p-5 md:flex-row md:items-center">

          <div>

            <h2 className="text-lg font-semibold">
              Manual Attendance
            </h2>

          </div>

          <button
            onClick={
              saveAllAttendance
            }
            disabled={
              savingAttendance ||
              studentsLoading ||
              !selectedAdmissionId ||
              admissionStudents.length === 0
            }
            className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
          >

            <Save className="h-4 w-4" />

            {savingAttendance
              ? "Saving..."
              : "Save All Attendance"}

          </button>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full text-left text-sm">

            <thead className="border-b bg-gray-50">

              <tr>

                <th className="px-5 py-4">
                  #
                </th>

                <th className="px-5 py-4">
                  Student
                </th>

                <th className="px-5 py-4">
                  Class
                </th>

                <th className="px-5 py-4">
                  Roll
                </th>

                <th className="px-5 py-4">
                  Current
                </th>

                <th className="px-5 py-4">
                  Manual Status
                </th>

                <th className="px-5 py-4">
                  Method
                </th>

                <th className="px-5 py-4">
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {!selectedAdmissionId ? (

                <tr>
                  <td
                    colSpan={8}
                    className="px-5 py-10 text-center text-gray-500"
                  >
                    Please select a class for mark attendance.
                  </td>
                </tr>

              ) : studentsLoading ? (

                <tr>
                  <td
                    colSpan={8}
                    className="px-5 py-10 text-center"
                  >
                    Loading students...
                  </td>
                </tr>

              ) : admissionStudents.length ===
                0 ? (

                <tr>
                  <td
                    colSpan={8}
                    className="px-5 py-10 text-center text-gray-500"
                  >
                    No student found for this
                    Admission ID.
                  </td>
                </tr>

              ) : (

                admissionStudents.map(
                  (
                    student: any,
                    index: number
                  ) => {

                    const existing =
                      attendanceMap[
                      String(student.id)
                      ];

                    const status =
                      selectedStatus[
                      student.id
                      ] ??
                      existing?.status ??
                      "PRESENT";

                    return (
                      <tr
                        key={student.id}
                        className="border-b last:border-0"
                      >

                        {/* INDEX */}

                        <td className="px-5 py-4">
                          {index + 1}
                        </td>

                        {/* STUDENT */}

                        <td className="px-5 py-4">

                          <p className="font-medium">
                            {student.name ??
                              student.studentName ??
                              (`${student.firstName ?? ""} ${student.lastName ?? ""}`.trim() ||
                                "Unknown Student")}
                          </p>

                        </td>

                        {/* ADMISSION ID */}

                        <td className="px-5 py-4">
                          {student.admission ??
                            "-"}
                        </td>

                        {/* ROLL */}

                        <td className="px-5 py-4">
                          {student.roll ??
                            student.rollNumber ??
                            "-"}
                        </td>

                        {/* CURRENT */}

                        <td className="px-5 py-4">

                          {existing ? (
                            <StatusBadge
                              status={
                                existing.status
                              }
                            />
                          ) : (
                            <span className="text-gray-400">
                              Not marked
                            </span>
                          )}

                        </td>

                        {/* STATUS */}

                        <td className="px-5 py-4">

                          <select
                            value={status}
                            onChange={(e) =>
                              handleStatusChange(
                                student.id,
                                e.target
                                  .value as ManualStatus
                              )
                            }
                            className="rounded-lg border px-3 py-2 outline-none focus:ring-2"
                          >

                            <option value="PRESENT">
                              Present
                            </option>

                            <option value="ABSENT">
                              Absent
                            </option>

                          </select>

                        </td>

                        {/* METHOD */}

                        <td className="px-5 py-4">

                          {existing ? (
                            <MethodBadge
                              method={
                                existing.method
                              }
                            />
                          ) : (
                            <MethodBadge
                              method="MANUAL"
                            />
                          )}

                        </td>

                        {/* SAVE */}

                        <td className="px-5 py-4">

                          <button
                            onClick={() =>
                              saveAttendance(
                                student.id
                              )
                            }
                            disabled={
                              savingAttendance
                            }
                            className="flex items-center gap-2 rounded-lg border px-3 py-2 hover:bg-gray-50 disabled:opacity-50"
                          >

                            <Check className="h-4 w-4" />

                            Save

                          </button>

                        </td>

                      </tr>
                    );
                  }
                )

              )}

            </tbody>

          </table>

        </div>

      </div>



    </div>
  );
}

// =========================================================
// SUMMARY CARD
// =========================================================

function SummaryCard({
  title,
  value,
  className,
}: {
  title: string;
  value: number;
  className: string;
}) {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">

      <p className="text-sm text-gray-500">
        {title}
      </p>

      <p
        className={`mt-1 text-2xl font-bold ${className}`}
      >
        {value}
      </p>

    </div>
  );
}

// =========================================================
// STATUS BADGE
// =========================================================

function StatusBadge({
  status,
}: {
  status: string;
}) {
  const classes: Record<
    string,
    string
  > = {
    PRESENT:
      "bg-green-100 text-green-700",

    ABSENT:
      "bg-red-100 text-red-700",

  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium ${classes[status] ??
        "bg-gray-100 text-gray-700"
        }`}
    >
      {status}
    </span>
  );
}

// =========================================================
// METHOD BADGE
// =========================================================

function MethodBadge({
  method,
}: {
  method: string;
}) {
  const config: Record<
    string,
    {
      label: string;
      className: string;
    }
  > = {
    MANUAL: {
      label: "Manual",
      className:
        "bg-gray-100 text-gray-700",
    },

    FACE: {
      label: "Face",
      className:
        "bg-purple-100 text-purple-700",
    },

    BIOMETRIC: {
      label: "Biometric",
      className:
        "bg-blue-100 text-blue-700",
    },

    MOBILE: {
      label: "Mobile",
      className:
        "bg-indigo-100 text-indigo-700",
    },

    WEB: {
      label: "Web",
      className:
        "bg-gray-100 text-gray-700",
    },
  };

  const item =
    config[method] ?? {
      label: method || "Unknown",
      className:
        "bg-gray-100 text-gray-700",
    };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium ${item.className}`}
    >
      {item.label}
    </span>
  );
}