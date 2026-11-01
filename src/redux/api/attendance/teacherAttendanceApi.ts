import { baseApi } from "@/redux/api/baseApi";
import { tagTypes } from "@/redux/tag-types";

// =========================================================
// TYPES
// =========================================================

export type AttendanceStatusType =
  | "PRESENT"
  | "ABSENT"
  | "LATE"
  | "LEAVE";

export type AttendanceMethodType =
  | "FACE"
  | "BIOMETRIC"
  | "MANUAL";

// =========================================================
// TEACHER ATTENDANCE
// =========================================================

export interface TeacherAttendance {
  id: string;

  teacherId: string;

  attendanceDate: string;

  checkInTime?: string | null;

  checkOutTime?: string | null;

  status: AttendanceStatusType;

  method: AttendanceMethodType;

  confidence?: number | null;

  deviceId?: string | null;

  verificationId?: string | null;

  createdAt?: string;

  updatedAt?: string;

  teacher?: {
    id: string;
    name?: string;
    teacherName?: string;
    employeeId?: string;
  };
}

// =========================================================
// QUERY
// =========================================================

export interface TeacherAttendanceQuery {
  teacherId?: string;

  startDate?: string;

  endDate?: string;

  date?: string;

  status?: AttendanceStatusType;

  method?: AttendanceMethodType;
}

// =========================================================
// CREATE
// =========================================================

export interface CreateTeacherAttendance {
  teacherId: string;

  attendanceDate?: string;

  checkInTime?: string;

  checkOutTime?: string;

  status?: AttendanceStatusType;

  method: AttendanceMethodType;

  confidence?: number;

  deviceId?: string;

  verificationId?: string;
}

// =========================================================
// UPDATE
// =========================================================

export interface UpdateTeacherAttendance {
  attendanceDate?: string;

  checkInTime?: string;

  checkOutTime?: string;

  status?: AttendanceStatusType;

  method?: AttendanceMethodType;

  confidence?: number;

  deviceId?: string;

  verificationId?: string;
}

// =========================================================
// API
// =========================================================

export const teacherAttendanceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // =====================================================
    // CREATE
    // POST /teacher-attendance
    // =====================================================

    createTeacherAttendance: builder.mutation<
      TeacherAttendance,
      CreateTeacherAttendance
    >({
      query: (body) => ({
        url: "/teacher-attendance",
        method: "POST",
        data:body,
      }),

      invalidatesTags: [
        tagTypes.TeacherAttendance,
        tagTypes.DashboardAttendance,
      ],
    }),

    // =====================================================
    // GET ALL
    // GET /teacher-attendance
    // =====================================================

    getTeacherAttendance: builder.query<
      TeacherAttendance[],
      TeacherAttendanceQuery | void
    >({
      query: (params) => ({
        url: "/teacher-attendance",
        method: "GET",
        params,
      }),

      providesTags: [
        tagTypes.TeacherAttendance,
      ],
    }),

    // =====================================================
    // GET BY ID
    // GET /teacher-attendance/:id
    // =====================================================

    getTeacherAttendanceById: builder.query<
      TeacherAttendance,
      string
    >({
      query: (id) => ({
        url: `/teacher-attendance/${id}`,
        method: "GET",
      }),

      providesTags: [
        tagTypes.TeacherAttendance,
      ],
    }),

    // =====================================================
    // UPDATE
    // PATCH /teacher-attendance/:id
    // =====================================================

    updateTeacherAttendance: builder.mutation<
      TeacherAttendance,
      {
        id: string;
        data: UpdateTeacherAttendance;
      }
    >({
      query: ({ id, data }) => ({
        url: `/teacher-attendance/${id}`,
        method: "PATCH",
        body: data,
      }),

      invalidatesTags: [
        tagTypes.TeacherAttendance,
        tagTypes.DashboardAttendance,
      ],
    }),

    // =====================================================
    // DELETE
    // DELETE /teacher-attendance/:id
    // =====================================================

    deleteTeacherAttendance: builder.mutation<
      unknown,
      string
    >({
      query: (id) => ({
        url: `/teacher-attendance/${id}`,
        method: "DELETE",
      }),

      invalidatesTags: [
        tagTypes.TeacherAttendance,
        tagTypes.DashboardAttendance,
      ],
    }),

    // =====================================================
    // CHECK IN
    // POST /teacher-attendance/check-in
    // =====================================================

    teacherCheckIn: builder.mutation<
      TeacherAttendance,
      {
        teacherId: string;

        method: AttendanceMethodType;

        confidence?: number;

        deviceId?: string;

        verificationId?: string;
      }
    >({
      query: (body) => ({
        url: "/teacher-attendance/check-in",
        method: "POST",
        body,
      }),

      invalidatesTags: [
        tagTypes.TeacherAttendance,
        tagTypes.DashboardAttendance,
      ],
    }),

    // =====================================================
    // CHECK OUT
    // POST /teacher-attendance/check-out
    // =====================================================

    teacherCheckOut: builder.mutation<
      TeacherAttendance,
      {
        teacherId: string;

        method?: AttendanceMethodType;

        deviceId?: string;
      }
    >({
      query: (body) => ({
        url: "/teacher-attendance/check-out",
        method: "POST",
        body,
      }),

      invalidatesTags: [
        tagTypes.TeacherAttendance,
        tagTypes.DashboardAttendance,
      ],
    }),
  }),
});

// =========================================================
// HOOKS
// =========================================================

export const {
  useCreateTeacherAttendanceMutation,

  useGetTeacherAttendanceQuery,

  useGetTeacherAttendanceByIdQuery,

  useUpdateTeacherAttendanceMutation,

  useDeleteTeacherAttendanceMutation,

  useTeacherCheckInMutation,

  useTeacherCheckOutMutation,
} = teacherAttendanceApi;