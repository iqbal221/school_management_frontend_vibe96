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
  | "MANUAL"
  | "WEB";

interface StudentAttendance {
  id: string;

  studentId: string;

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

  student?: {
    id: string;
    name?: string;
    studentName?: string;
    studentId?: string;
    roll?: string | number;
  };
}


interface StudentAttendanceQuery {
  studentId?: string;
  startDate?: string;
  endDate?: string;
  date?: string;
  status?: AttendanceStatusType;
  method?: AttendanceMethodType;
  page?: number;
  limit?: number;
}

interface CreateStudentAttendance {
  studentId: string;
  attendanceDate?: string;
  checkInTime?: string;
  checkOutTime?: string;
  status?: AttendanceStatusType;
  method: AttendanceMethodType;
  confidence?: number;
  deviceId?: string;
  verificationId?: string;
}

interface UpdateStudentAttendance {
  attendanceDate?: string;
  checkInTime?: string;
  checkOutTime?: string;
  status?: AttendanceStatusType;
  method?: AttendanceMethodType;
  confidence?: number;
  deviceId?: string;
  verificationId?: string;
}

export const studentAttendanceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createStudentAttendance: builder.mutation<
      StudentAttendance,
      CreateStudentAttendance
    >({
      query: (data) => ({
        url: "/student-attendance",
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.StudentAttendance, tagTypes.AttendanceDashboard],
    }),

    getStudentAttendance: builder.query<
      StudentAttendance[],
      StudentAttendanceQuery | void
    >({
      query: (params) => ({
        url: "/student-attendance",
        method: "GET",
        params,
      }),
      providesTags: [tagTypes.StudentAttendance, tagTypes.AttendanceDashboard],
    }),

    getStudentAttendanceById: builder.query<
      StudentAttendance,
      string
    >({
      query: (id) => ({
        url: `/student-attendance/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.StudentAttendance, tagTypes.AttendanceDashboard],
    }),

    updateStudentAttendance: builder.mutation<
      StudentAttendance,
      {
        id: string;
        data: UpdateStudentAttendance;
      }
    >({
      query: ({ id, data }) => ({
        url: `/student-attendance/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: [tagTypes.StudentAttendance, tagTypes.AttendanceDashboard, ],
    }),

    deleteStudentAttendance: builder.mutation<
      unknown,
      string
    >({
      query: (id) => ({
        url: `/student-attendance/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.StudentAttendance, tagTypes.AttendanceDashboard, ],
    }),

    studentCheckIn: builder.mutation<
      StudentAttendance,
      {
        studentId: string;
        method: AttendanceMethodType;
        confidence?: number;
        deviceId?: string;
        verificationId?: string;
      }
    >({
      query: (body) => ({
        url: "/student-attendance/check-in",
        method: "POST",
        body,
      }),
      invalidatesTags: [tagTypes.StudentAttendance, tagTypes.AttendanceDashboard, ],
    }),

    studentCheckOut: builder.mutation<
      StudentAttendance,
      {
        studentId: string;
        method?: AttendanceMethodType;
        deviceId?: string;
      }
    >({
      query: (body) => ({
        url: "/student-attendance/check-out",
        method: "POST",
        body,
      }),
      invalidatesTags: [tagTypes.StudentAttendance, tagTypes.AttendanceDashboard, ],
    }),
  }),
});

export const {
  useCreateStudentAttendanceMutation,
  useGetStudentAttendanceQuery,
  useGetStudentAttendanceByIdQuery,
  useUpdateStudentAttendanceMutation,
  useDeleteStudentAttendanceMutation,
  useStudentCheckInMutation,
  useStudentCheckOutMutation,
} = studentAttendanceApi;