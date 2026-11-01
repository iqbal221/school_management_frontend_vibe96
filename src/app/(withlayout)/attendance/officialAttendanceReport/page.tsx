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
import { useOfficialsQuery } from "@/redux/api/officialApi";
import { useGetOfficialAttendanceQuery } from "@/redux/api/attendance/officialAttendanceApi";

// =========================================================
// HELPERS
// =========================================================

const getOfficialName = (item: any) =>
  item?.name?.trim() ||
  item?.officialName?.trim() ||
  `${item?.firstName || ""} ${item?.lastName || ""}`.trim() ||
  "Unknown Official";

const getOfficialDesignation = (item: any) =>
  String(
    item?.designation?.name ??
      item?.designation ??
      item?.position ??
      ""
  );

const getOfficialId = (item: any) =>
  String(item?.id ?? item?.officialId ?? "");

// Official profile image
const getOfficialImage = (item: any): string => {
  const image =
    item?.profileImage ??
    item?.profilePhoto ??
    item?.profilePicture ??
    item?.photo ??
    item?.image ??
    item?.avatar ??
    item?.imageUrl ??
    item?.picture;

  if (typeof image === "string") {
    return image;
  }

  if (image && typeof image === "object") {
    return (
      image?.url ??
      image?.secure_url ??
      image?.imageUrl ??
      image?.path ??
      ""
    );
  }

  return "";
};

const normalizeStatus = (status: any) =>
  String(status ?? "").trim().toUpperCase();

const formatDate = (value: any) => {
  if (!value) return "-";

  const dateValue = String(value).slice(0, 10);
  const parsedDate = new Date(`${dateValue}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) return dateValue;

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
// MAIN PAGE
// =========================================================

export default function IndividualOfficialAttendanceReportPage() {
  const printRef = useRef<HTMLDivElement>(null);

  // =========================================================
  // DATE STATE
  // =========================================================

  const today = new Date();
  const todayString = today.toLocaleDateString("en-CA");

  const firstDayOfMonth = new Date(
    today.getFullYear(),
    today.getMonth(),
    1
  ).toLocaleDateString("en-CA");

  // =========================================================
  // FILTER STATE
  // =========================================================

  const [selectedOfficial, setSelectedOfficial] = useState("");
  const [selectedDesignation, setSelectedDesignation] = useState("");
  const [startDate, setStartDate] = useState(firstDayOfMonth);
  const [endDate, setEndDate] = useState(todayString);

  // =========================================================
  // OFFICIALS QUERY
  // =========================================================

  const {
    data: officialsResponse,
    isLoading: officialsLoading,
  } = useOfficialsQuery({});

  const officials = useMemo(() => {
    if (Array.isArray(officialsResponse)) {
      return officialsResponse;
    }

    if (Array.isArray((officialsResponse as any)?.officials)) {
      return (officialsResponse as any).officials;
    }

    if (Array.isArray((officialsResponse as any)?.Data?.officials)) {
      return (officialsResponse as any).Data.officials;
    }

    if (Array.isArray((officialsResponse as any)?.data?.officials)) {
      return (officialsResponse as any).data.officials;
    }

    if (Array.isArray((officialsResponse as any)?.data)) {
      return (officialsResponse as any).data;
    }

    return [];
  }, [officialsResponse]);

  // =========================================================
  // DESIGNATIONS
  // =========================================================

  const uniqueDesignations = useMemo(() => {
    return Array.from(
      new Set(
        officials
          .map((item: any) => getOfficialDesignation(item))
          .filter(Boolean)
      )
    ).sort((a: any, b: any) => a.localeCompare(b));
  }, [officials]);

  // =========================================================
  // FILTERED OFFICIALS
  // =========================================================

  const filteredOfficials = useMemo(() => {
    return officials.filter((item: any) => {
      return (
        !selectedDesignation ||
        getOfficialDesignation(item) === selectedDesignation
      );
    });
  }, [officials, selectedDesignation]);

  // =========================================================
  // FILTER HANDLERS
  // =========================================================

  const handleOfficialChange = (officialId: string) => {
    setSelectedOfficial(officialId);

    const selected = officials.find(
      (item: any) => getOfficialId(item) === officialId
    );

    setSelectedDesignation(
      selected ? getOfficialDesignation(selected) : ""
    );
  };

  const handleDesignationChange = (designation: string) => {
    setSelectedDesignation(designation);

    if (!designation) {
      setSelectedOfficial("");
      return;
    }

    const matchingOfficial = officials.find(
      (item: any) => getOfficialDesignation(item) === designation
    );

    setSelectedOfficial(
      matchingOfficial ? getOfficialId(matchingOfficial) : ""
    );
  };

  const handleReset = () => {
    setSelectedOfficial("");
    setSelectedDesignation("");
    setStartDate(firstDayOfMonth);
    setEndDate(todayString);
  };

  // =========================================================
  // OFFICIAL ATTENDANCE QUERY
  // =========================================================

  const validDateRange =
    Boolean(startDate) &&
    Boolean(endDate) &&
    startDate <= endDate;

  const {
    data: attendanceResponse,
    isLoading: attendanceLoading,
    isFetching,
    isError,
  } = useGetOfficialAttendanceQuery(
    {
      officialId: selectedOfficial,
      startDate,
      endDate,
    },
    {
      skip: !selectedOfficial || !validDateRange,
    }
  );

  // =========================================================
  // NORMALIZE ATTENDANCE RESPONSE
  // =========================================================

  const attendance = useMemo(() => {
    if (Array.isArray(attendanceResponse)) {
      return attendanceResponse;
    }

    if (Array.isArray((attendanceResponse as any)?.attendences)) {
      return (attendanceResponse as any).attendences;
    }

    if (Array.isArray((attendanceResponse as any)?.attendance)) {
      return (attendanceResponse as any).attendance;
    }

    if (Array.isArray((attendanceResponse as any)?.data?.attendences)) {
      return (attendanceResponse as any).data.attendences;
    }

    if (Array.isArray((attendanceResponse as any)?.data?.attendance)) {
      return (attendanceResponse as any).data.attendance;
    }

    if (Array.isArray((attendanceResponse as any)?.data)) {
      return (attendanceResponse as any).data;
    }

    return [];
  }, [attendanceResponse]);

  // =========================================================
  // SELECTED OFFICIAL
  // =========================================================

  const official = useMemo(() => {
    return officials.find(
      (item: any) => getOfficialId(item) === String(selectedOfficial)
    );
  }, [officials, selectedOfficial]);

  const officialName = official ? getOfficialName(official) : "";

  const officialDesignation = official
    ? getOfficialDesignation(official)
    : "";

  const officialImage = official ? getOfficialImage(official) : "";

  // =========================================================
  // ATTENDANCE RECORDS
  // =========================================================

  const attendanceRecords = useMemo(() => {
    return [...attendance]
      .filter((item: any) => {
        const recordOfficialId =
          item.officialId ??
          item.official?.id ??
          item.official?._id;

        return String(recordOfficialId ?? "") === String(selectedOfficial);
      })
      .filter((item: any) => {
        const recordDate = String(
          item.attendanceDate ?? item.date ?? ""
        ).slice(0, 10);

        return recordDate >= startDate && recordDate <= endDate;
      })
      .sort((a: any, b: any) => {
        const dateA = a.attendanceDate ?? a.date;
        const dateB = b.attendanceDate ?? b.date;

        return (
          new Date(dateB).getTime() -
          new Date(dateA).getTime()
        );
      });
  }, [attendance, selectedOfficial, startDate, endDate]);

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
      const status = normalizeStatus(record.status);

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
  // PRINT
  // =========================================================

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Official-Attendance-${officialName || "Report"}`,
  });

  const canPrint =
    Boolean(selectedOfficial) &&
    validDateRange &&
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
            Individual Official Report
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Individual official&apos;s attendance history.
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
          {/* OFFICIAL */}

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Select Official
            </label>

            <select
              value={selectedOfficial}
              onChange={(e) => handleOfficialChange(e.target.value)}
              disabled={officialsLoading}
              className="w-full border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 disabled:opacity-60"
            >
              <option value="">
                {officialsLoading
                  ? "Loading officials..."
                  : "Choose official"}
              </option>

              {filteredOfficials.map((item: any) => (
                <option
                  key={getOfficialId(item)}
                  value={getOfficialId(item)}
                >
                  {getOfficialName(item)}
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
              onChange={(e) => handleDesignationChange(e.target.value)}
              disabled={officialsLoading}
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
            Official Attendance Report
          </h1>

          <p className="mt-1 text-sm text-gray-600">
            Individual Official Attendance History
          </p>
        </div>

        {/* OFFICIAL INFORMATION */}

        {official && (
          <div className="rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50/80 to-white p-5 print:border-gray-300 print:bg-white">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-4">
                {/* OFFICIAL PROFILE IMAGE */}

                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-blue-100 bg-blue-50 print:border-gray-300">
                  {/* Fallback icon stays behind the image */}
                  <div className="absolute inset-0 flex items-center justify-center text-blue-600">
                    <UserRound className="h-8 w-8" />
                  </div>

                  {officialImage && (
                    <img
                      src={officialImage}
                      alt={officialName}
                      className="relative z-10 h-full w-full rounded-full object-cover"
                      onError={(e) => {
                        e.currentTarget.remove();
                      }}
                    />
                  )}
                </div>

                {/* OFFICIAL DETAILS */}

                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    {officialName}
                  </h2>

                  <p className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                    <BriefcaseBusiness className="h-3.5 w-3.5" />
                    Designation: {officialDesignation || "-"}
                  </p>

                  {official.employeeId && (
                    <p className="mt-1 text-xs text-gray-500">
                      Employee ID: {official.employeeId}
                    </p>
                  )}

                  {official.contact && (
                    <p className="mt-1 text-xs text-gray-500">
                      Contact: {official.contact}
                    </p>
                  )}
                </div>
              </div>

              <div className="rounded-xl border border-blue-100 bg-white px-4 py-3 print:border-gray-300">
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

        {/* ATTENDANCE HISTORY */}

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          {/* ACTION HEADER */}

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

            <div className="flex flex-wrap items-center gap-2 print:hidden">
              {selectedOfficial ? (
                <>
                  <span className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700">
                    {officialName || "Selected Official"}
                  </span>

                  <span className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-600">
                    {attendanceRecords.length} Records
                  </span>

                  <button
                    type="button"
                    onClick={handlePrint}
                    disabled={!canPrint}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Printer className="h-4 w-4" />
                    Print Report
                  </button>
                </>
              ) : (
                <span className="rounded-lg bg-amber-50 px-3 py-2 text-xs font-medium text-amber-700">
                  Select an official to view report
                </span>
              )}
            </div>
          </div>

          {/* TABLE */}

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
                {!selectedOfficial ? (
                  <EmptyRow message="Please select an official to view attendance history." />
                ) : !validDateRange ? (
                  <EmptyRow message="Please select a valid date range." />
                ) : attendanceLoading || isFetching ? (
                  <EmptyRow message="Loading attendance history..." />
                ) : isError ? (
                  <EmptyRow message="Unable to load attendance records." />
                ) : attendanceRecords.length === 0 ? (
                  <EmptyRow message="No attendance records found for this official in the selected date range." />
                ) : (
                  attendanceRecords.map((record: any, index: number) => (
                    <tr
                      key={
                        record.id ??
                        `${record.attendanceDate ?? record.date}-${index}`
                      }
                      className="transition-colors hover:bg-blue-50/40"
                    >
                      <td className="px-5 py-4 text-gray-400">
                        {String(index + 1).padStart(2, "0")}
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 font-semibold text-gray-800">
                        {formatDate(
                          record.attendanceDate ?? record.date
                        )}
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
                          ? `${(
                              Number(record.confidence) * 100
                            ).toFixed(1)}%`
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

            <p>Official Attendance Report</p>
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
  const normalized = normalizeStatus(status);

  const styles: Record<string, string> = {
    PRESENT: "border-green-200 bg-green-50 text-green-700",
    ABSENT: "border-red-200 bg-red-50 text-red-700",
  };

  const label =
    normalized === "PRESENT"
      ? "Present"
      : normalized === "ABSENT"
        ? "Absent"
        : normalized || "-";

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
        styles[normalized] ??
        "border-gray-200 bg-gray-50 text-gray-600"
      }`}
    >
      {label}
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