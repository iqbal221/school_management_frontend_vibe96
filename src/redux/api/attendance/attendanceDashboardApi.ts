import { baseApi } from "@/redux/api/baseApi";
import { tagTypes } from "@/redux/tag-types";

// =========================================================
// ATTENDANCE SUMMARY
// =========================================================

export interface AttendanceSummary {
  total: number;

  present: number;

  absent: number;

  late: number;

  leave: number;

  attendancePercentage: number;
}

// =========================================================
// ATTENDANCE METHOD SUMMARY
// =========================================================

export interface AttendanceMethodSummary {
  face: number;

  biometric: number;

  manual: number;
}

// =========================================================
// RECENT ATTENDANCE TYPES
// =========================================================

export interface StudentAttendance {
  id: string;

  studentId: string;

  attendanceDate: string;

  checkInTime?: string | null;

  checkOutTime?: string | null;

  status: string;

  method: string;

  confidence?: number | null;

  deviceId?: string | null;

  verificationId?: string | null;
}

export interface TeacherAttendance {
  id: string;

  teacherId: string;

  attendanceDate: string;

  checkInTime?: string | null;

  checkOutTime?: string | null;

  status: string;

  method: string;

  confidence?: number | null;

  deviceId?: string | null;

  verificationId?: string | null;
}

export interface OfficialAttendance {
  id: string;

  officialId: string;

  attendanceDate: string;

  checkInTime?: string | null;

  checkOutTime?: string | null;

  status: string;

  method: string;

  confidence?: number | null;

  deviceId?: string | null;

  verificationId?: string | null;
}

// =========================================================
// DASHBOARD
// =========================================================

export interface AttendanceDashboard {
  date: string;

  totals: {
    students: number;

    teachers: number;

    officials: number;
  };

  students: AttendanceSummary;

  teachers: AttendanceSummary;

  officials: AttendanceSummary;

  methods: {
    students: AttendanceMethodSummary;

    teachers: AttendanceMethodSummary;

    officials: AttendanceMethodSummary;
  };

  recentAttendance: {
    students: StudentAttendance[];

    teachers: TeacherAttendance[];

    officials: OfficialAttendance[];
  };
}

// =========================================================
// QUERY
// =========================================================

export interface AttendanceDashboardQuery {
  date?: string;

  startDate?: string;

  endDate?: string;
}

// =========================================================
// API
// =========================================================

export const attendanceDashboardApi =
  baseApi.injectEndpoints({
    endpoints: (builder) => ({
      // ===================================================
      // GET ATTENDANCE DASHBOARD
      // GET /attendance-dashboard
      // ===================================================

      getAttendanceDashboard: builder.query<
        AttendanceDashboard,
        AttendanceDashboardQuery | void
      >({
        query: (params) => ({
          url: "/attendance-dashboard",

          method: "GET",

          params,
        }),

        providesTags: [
          tagTypes.AttendanceDashboard,
        ],
      }),

      // ===================================================
      // GET TODAY DASHBOARD
      // GET /attendance-dashboard/today
      // ===================================================

      getTodayAttendanceDashboard:
        builder.query<
          AttendanceDashboard,
          void
        >({
          query: () => ({
            url: "/attendance-dashboard/today",

            method: "GET",
          }),

          providesTags: [
            tagTypes.AttendanceDashboard,
          ],
        }),
    }),
  });

// =========================================================
// HOOKS
// =========================================================

export const {
  useGetAttendanceDashboardQuery,

  useGetTodayAttendanceDashboardQuery,
} = attendanceDashboardApi;