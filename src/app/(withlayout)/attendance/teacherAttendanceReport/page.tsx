
"use client";

import { useMemo, useRef, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  XCircle,
  ClipboardList,
  Search,
  Clock3,
  TrendingUp,
  UserRound,
  Printer,
  BriefcaseBusiness,
} from "lucide-react";
import { useReactToPrint } from "react-to-print";

import {
  useGetTeacherAttendanceQuery,
} from "@/redux/api/attendance/teacherAttendanceApi";

import { useTeachersQuery } from "@/redux/api/teacherApi";

// =========================================================
// MAIN PAGE
// =========================================================

export default function IndividualTeacherAttendanceReportPage() {
  const printRef = useRef<HTMLDivElement>(null);

  // =========================================================
  // STATE
  // =========================================================

  const today = new Date();
  const todayString = today.toLocaleDateString("en-CA");

  const firstDayOfMonth = new Date(
    today.getFullYear(),
    today.getMonth(),
    1
  ).toLocaleDateString("en-CA");

  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [selectedDesignation, setSelectedDesignation] = useState("");
  const [startDate, setStartDate] = useState(firstDayOfMonth);
  const [endDate, setEndDate] = useState(todayString);

  // =========================================================
  // TEACHERS QUERY
  // =========================================================

  const {
    data: teachersResponse,
    isLoading: teachersLoading,
  } = useTeachersQuery({});

  const teachers = useMemo(() => {
    if (Array.isArray(teachersResponse)) {
      return teachersResponse;
    }

    if (Array.isArray((teachersResponse as any)?.teachers)) {
      return (teachersResponse as any).teachers;
    }

    if (Array.isArray((teachersResponse as any)?.data?.teachers)) {
      return (teachersResponse as any).data.teachers;
    }

    if (Array.isArray((teachersResponse as any)?.data)) {
      return (teachersResponse as any).data;
    }

    return [];
  }, [teachersResponse]);

  // =========================================================
  // TEACHER HELPERS
  // =========================================================

  const getTeacherName = (item: any) =>
    item.name?.trim() ||
    item.teacherName?.trim() ||
    `${item.firstName || ""} ${item.lastName || ""}`.trim() ||
    "Unknown Teacher";

  const getTeacherDesignation = (item: any) =>
    String(item.designation ?? item.position ?? "");


  const uniqueDesignations = useMemo(() => {
    return Array.from(
      new Set(
        teachers
          .map((item: any) => getTeacherDesignation(item))
          .filter(Boolean)
      )
    ).sort((a: any, b: any) => a.localeCompare(b));
  }, [teachers]);

  // =========================================================
  // FILTERED TEACHERS
  // =========================================================

  const filteredTeachers = useMemo(() => {
    return teachers.filter((item: any) => {


      const matchesDesignation =
        !selectedDesignation ||
        getTeacherDesignation(item) === selectedDesignation;

      return matchesDesignation;
    });
  }, [teachers, selectedEmployeeId, selectedDesignation]);

  // =========================================================
  // FILTER SYNCHRONIZATION
  // =========================================================

  const handleTeacherChange = (teacherId: string) => {
    setSelectedTeacher(teacherId);

    const selected = teachers.find(
      (item: any) => String(item.id) === teacherId
    );

    setSelectedDesignation(
      selected ? getTeacherDesignation(selected) : ""
    );
  };

  const handleEmployeeIdChange = (employeeId: string) => {
    setSelectedEmployeeId(employeeId);

    if (!employeeId) {
      setSelectedTeacher("");
      return;
    }

    const matchingTeacher = teachers.find(
      (item: any) =>
      (!selectedDesignation ||
        getTeacherDesignation(item) === selectedDesignation)
    );

    if (matchingTeacher) {
      setSelectedTeacher(String(matchingTeacher.id));
      setSelectedDesignation(getTeacherDesignation(matchingTeacher));
    } else {
      setSelectedTeacher("");
    }
  };

  const handleDesignationChange = (designation: string) => {
    setSelectedDesignation(designation);

    if (!designation) {
      setSelectedTeacher("");
      setSelectedEmployeeId("");
      return;
    }

    const matchingTeacher = teachers.find(
      (item: any) =>
        getTeacherDesignation(item) === designation
    );

    if (matchingTeacher) {
      setSelectedTeacher(String(matchingTeacher.id));
    } else {
      setSelectedTeacher("");
    }
  };

  const handleReset = () => {
    setSelectedTeacher("");
    setSelectedDesignation("");
    setStartDate(firstDayOfMonth);
    setEndDate(todayString);
  };

  // =========================================================
  // TEACHER ATTENDANCE QUERY
  // =========================================================

  const {
    data: attendanceResponse,
    isLoading: attendanceLoading,
    isFetching,
    isError,
    refetch,
  } = useGetTeacherAttendanceQuery(
    {
      teacherId: selectedTeacher,
      startDate,
      endDate,
    },
    {
      skip:
        !selectedTeacher ||
        !startDate ||
        !endDate ||
        startDate > endDate,
    }
  );

  // =========================================================
  // NORMALIZE ATTENDANCE RESPONSE
  // =========================================================

  const attendance = useMemo(() => {
    if (Array.isArray(attendanceResponse)) {
      return attendanceResponse;
    }

    if (Array.isArray((attendanceResponse as any)?.attendance)) {
      return (attendanceResponse as any).attendance;
    }

    if (Array.isArray((attendanceResponse as any)?.teacherAttendance)) {
      return (attendanceResponse as any).teacherAttendance;
    }

    if (Array.isArray((attendanceResponse as any)?.data?.attendance)) {
      return (attendanceResponse as any).data.attendance;
    }

    if (
      Array.isArray(
        (attendanceResponse as any)?.data?.teacherAttendance
      )
    ) {
      return (attendanceResponse as any).data.teacherAttendance;
    }

    if (Array.isArray((attendanceResponse as any)?.data)) {
      return (attendanceResponse as any).data;
    }

    return [];
  }, [attendanceResponse]);

  // =========================================================
  // SELECTED TEACHER
  // =========================================================

  const teacher = useMemo(() => {
    return teachers.find(
      (item: any) => String(item.id) === String(selectedTeacher)
    );
  }, [teachers, selectedTeacher]);

  const teacherName = teacher ? getTeacherName(teacher) : "";
  const teacherDesignation = teacher
    ? getTeacherDesignation(teacher)
    : "";

  // =========================================================
  // ATTENDANCE RECORDS
  // =========================================================

  const attendanceRecords = useMemo(() => {
    return [...attendance]
      .filter((item: any) => {
        const recordTeacherId =
          item.teacherId ?? item.teacher?.id;

        return (
          String(recordTeacherId ?? "") ===
          String(selectedTeacher)
        );
      })
      .filter((item: any) => {
        const recordDate = String(
          item.attendanceDate ?? item.date ?? ""
        ).slice(0, 10);

        return (
          recordDate >= startDate &&
          recordDate <= endDate
        );
      })
      .sort((a: any, b: any) => {
        const dateA = a.attendanceDate ?? a.date;
        const dateB = b.attendanceDate ?? b.date;

        return (
          new Date(dateB).getTime() -
          new Date(dateA).getTime()
        );
      });
  }, [attendance, selectedTeacher, startDate, endDate]);

  // =========================================================
  // SUMMARY
  // =========================================================

  const summary = useMemo(() => {
    const result = {
      total: attendanceRecords.length,
      present: 0,
      absent: 0,
      percentage: 0,
    };

    attendanceRecords.forEach((record: any) => {
      const status = String(record.status ?? "").toUpperCase();

      if (status === "PRESENT") {
        result.present++;
      } else if (status === "ABSENT") {
        result.absent++;
      }
    });

    result.percentage =
      result.total > 0
        ? Math.round((result.present / result.total) * 100)
        : 0;

    return result;
  }, [attendanceRecords]);

  // =========================================================
  // FORMATTERS
  // =========================================================

  const formatDate = (value: any) => {
    if (!value) return "-";

    const dateValue = String(value).slice(0, 10);
    const parsedDate = new Date(`${dateValue}T00:00:00`);

    if (Number.isNaN(parsedDate.getTime())) {
      return dateValue;
    }

    return parsedDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (value: any) => {
    if (!value) return "-";

    const parsedDate = new Date(value);

    if (Number.isNaN(parsedDate.getTime())) {
      return String(value);
    }

    return parsedDate.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // =========================================================
  // PRINT
  // =========================================================

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Teacher-Attendance-${teacherName || "Report"}`,
  });

  const canPrint =
    Boolean(selectedTeacher) &&
    Boolean(startDate) &&
    Boolean(endDate) &&
    startDate <= endDate &&
    attendanceRecords.length > 0 &&
    !attendanceLoading &&
    !isFetching &&
    !isError;

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="space-y-6 p-4 md:p-6">

      {/* PAGE HEADER */}

      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <ClipboardList className="h-5 w-5" />
        </div>

        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">
            Individual Teacher Report
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Individual teacher's attendance history.
          </p>
        </div>
      </div>

      {/* FILTER SECTION */}

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

        <div className="mb-5 flex items-center gap-2">
          <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
            <Search className="h-4 w-4" />
          </div>

          <h2 className="text-base font-bold text-gray-900">
            Report Filters
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">

          {/* TEACHER */}

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Select Teacher
            </label>

            <select
              value={selectedTeacher}
              onChange={(e) => handleTeacherChange(e.target.value)}
              disabled={teachersLoading}
              className="w-full border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 disabled:opacity-60"
            >
              <option value="">
                {teachersLoading
                  ? "Loading teachers..."
                  : "Choose teacher"}
              </option>

              {filteredTeachers.map((item: any) => (
                <option key={item.id} value={item.id}>
                  {getTeacherName(item)}
                </option>
              ))}
            </select>
          </div>

          {/* DESIGNATION */}

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Designation
            </label>

            <select
              value={selectedDesignation}
              onChange={(e) =>
                handleDesignationChange(e.target.value)
              }
              disabled={teachersLoading}
              className="w-full border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 disabled:opacity-60"
            >
              <option value="">Choose designation</option>

              {uniqueDesignations.map((designation: any) => (
                <option key={designation} value={designation}>
                  {designation}
                </option>
              ))}
            </select>
          </div>

          {/* FROM DATE */}

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              From Date
            </label>

            <input
              type="date"
              value={startDate}
              max={endDate || todayString}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* TO DATE */}

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              To Date
            </label>

            <input
              type="date"
              value={endDate}
              min={startDate}
              max={todayString}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        {startDate > endDate && (
          <p className="mt-3 text-sm text-red-600">
            From Date cannot be later than To Date.
          </p>
        )}
      </div>



      {/* PRINTABLE REPORT */}

      <div
        ref={printRef}
        className="print-report flex flex-col gap-4"
      >

        {/* PRINT TITLE */}

        <div className="hidden border-b-2 border-gray-800 pb-4 text-center print:block">
          <h1 className="text-2xl font-bold text-black">
            Teacher Attendance Report
          </h1>

          <p className="mt-1 text-sm text-gray-600">
            Individual Teacher Attendance History
          </p>
        </div>

        {/* TEACHER INFORMATION */}

        {teacher && (
          <div className="rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50/80 to-white p-5">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <UserRound className="h-6 w-6" />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    {teacherName}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Designation: {teacherDesignation || "-"}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-blue-100 bg-white px-4 py-3">
                <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                  Report Period
                </p>

                <p className="mt-1 text-sm font-semibold text-gray-800">
                  {formatDate(startDate)} – {formatDate(endDate)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* SUMMARY CARDS */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">

          <SummaryCard
            title="Total Records"
            value={summary.total}
            description="Attendance records"
            icon={ClipboardList}
            color="blue"
          />

          <SummaryCard
            title="Present"
            value={summary.present}
            description="Days present"
            icon={CheckCircle2}
            color="green"
          />

          <SummaryCard
            title="Absent"
            value={summary.absent}
            description="Days absent"
            icon={XCircle}
            color="red"
          />

          <SummaryCard
            title="Attendance Rate"
            value={`${summary.percentage}%`}
            description="Present / total records"
            icon={TrendingUp}
            color="purple"
          />

        </div>
        {/* PRINT ACTION - OUTSIDE PRINT REF */}

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

          <div className="flex flex-col justify-between gap-3 border-b border-gray-100 bg-gradient-to-r from-white to-gray-50/80 px-5 py-5 sm:flex-row sm:items-center">

            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <CalendarDays className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Attendance History
                </h2>

              </div>
            </div>

            {selectedTeacher ? (
              <div className="flex flex-wrap items-center gap-2  print:hidden">
                <span className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700">
                  {teacherName || "Selected Student"}
                </span>
                <span className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-600">
                  {attendanceRecords.length} Records
                </span>

                <button
                  type="button"
                  onClick={handlePrint}
                  disabled={
                    attendanceLoading ||
                    isFetching ||
                    isError ||
                    attendanceRecords.length === 0
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Printer className="h-4 w-4" />
                  Print Report
                </button>
              </div>
            ) : (
              <span className="rounded-lg bg-amber-50 px-3 py-2 text-xs font-medium text-amber-700">
                Select a student to view report
              </span>
            )}

          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">

              <thead className="border-b border-gray-200 bg-gray-50/80">
                <tr>
                  {[
                    "#",
                    "Attendance Date",
                    "Check In",
                    "Check Out",
                    "Status",
                    "Method",
                    "Confidence",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">

                {!selectedTeacher ? (
                  <EmptyRow message="Please select a teacher to view their attendance history." />
                ) : startDate > endDate ? (
                  <EmptyRow message="Please select a valid date range." />
                ) : attendanceLoading || isFetching ? (
                  <EmptyRow message="Loading attendance history..." />
                ) : isError ? (
                  <EmptyRow message="Unable to load attendance records." />
                ) : attendanceRecords.length === 0 ? (
                  <EmptyRow message="No attendance records found for this student in the selected date range." />
                ) : (
                  attendanceRecords.map((record: any, index: number) => (
                    <tr
                      key={record.id ?? `${record.attendanceDate ?? record.date}-${index}`}
                      className="transition-colors hover:bg-blue-50/40"
                    >
                      <td className="px-5 py-4 text-gray-400">
                        {String(index + 1).padStart(2, "0")}
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 font-semibold text-gray-800">
                        {formatDate(record.attendanceDate ?? record.date)}
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-gray-600">
                        <span className="inline-flex items-center gap-2">
                          <Clock3 className="h-3.5 w-3.5 text-green-500" />
                          {formatTime(record.checkInTime)}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-gray-600">
                        <span className="inline-flex items-center gap-2">
                          <Clock3 className="h-3.5 w-3.5 text-red-400" />
                          {formatTime(record.checkOutTime)}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge status={record.status} />
                      </td>

                      <td className="px-5 py-4">
                        <MethodBadge method={record.method} />
                      </td>

                      <td className="px-5 py-4 font-medium text-gray-700">
                        {record.confidence != null
                          ? `${(Number(record.confidence) * 100).toFixed(1)}%`
                          : "-"}
                      </td>
                    </tr>
                  ))
                )}

              </tbody>
            </table>
          </div>
        </div>

        {/* PRINT FOOTER */}

        <div className="hidden border-t border-gray-300 pt-4 print:block">
          <div className="flex justify-between text-xs text-gray-600">
            <p>
              Generated on: {new Date().toLocaleString()}
            </p>

            <p>Teacher Attendance Report</p>
          </div>

          <div className="mt-12 flex justify-between">
            <div className="w-48 border-t border-gray-500 pt-2 text-center text-xs">
              Head Teacher Signature
            </div>

            <div className="w-48 border-t border-gray-500 pt-2 text-center text-xs">
              Authorized Signature
            </div>
          </div>
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
  description,
  icon: Icon,
  color,
}: {
  title: string;
  value: string | number;
  description: string;
  icon: any;
  color: "blue" | "green" | "red" | "purple";
}) {
  const styles = {
    blue: {
      icon: "bg-blue-50 text-blue-600",
      value: "text-blue-600",
    },
    green: {
      icon: "bg-green-50 text-green-600",
      value: "text-green-600",
    },
    red: {
      icon: "bg-red-50 text-red-600",
      value: "text-red-600",
    },
    purple: {
      icon: "bg-purple-50 text-purple-600",
      value: "text-purple-600",
    },
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500">
          {title}
        </p>

        <div className={`rounded-xl p-2.5 ${styles[color].icon}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <p className={`text-3xl font-bold tracking-tight ${styles[color].value}`}>
        {value}
      </p>

      <p className="mt-1.5 text-xs text-gray-400">
        {description}
      </p>
    </div>
  );
}

// =========================================================
// EMPTY ROW
// =========================================================

function EmptyRow({ message }: { message: string }) {
  return (
    <tr>
      <td
        colSpan={7}
        className="px-5 py-14 text-center text-sm text-gray-500"
      >
        <div className="flex flex-col items-center gap-2">
          <ClipboardList className="h-8 w-8 text-gray-300" />
          <span>{message}</span>
        </div>
      </td>
    </tr>
  );
}

// =========================================================
// STATUS BADGE
// =========================================================

function StatusBadge({ status }: { status?: string }) {
  const normalized = String(status ?? "").toUpperCase();

  const styles: Record<string, string> = {
    PRESENT: "border-green-200 bg-green-50 text-green-700",
    ABSENT: "border-red-200 bg-red-50 text-red-700",
  };

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${styles[normalized] ??
        "border-gray-200 bg-gray-50 text-gray-600"
        }`}
    >
      {normalized || "-"}
    </span>
  );
}

// =========================================================
// METHOD BADGE
// =========================================================

function MethodBadge({ method }: { method?: string }) {
  const normalized = String(method ?? "").toUpperCase();

  const config: Record<string, string> = {
    MANUAL: "Manual",
    WEB: "Attendance",
    FACE: "Face Recognition",
    BIOMETRIC: "Biometric",
    MOBILE: "Mobile",
  };

  return (
    <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
      {config[normalized] ?? (normalized || "-")}
    </span>
  );
}
