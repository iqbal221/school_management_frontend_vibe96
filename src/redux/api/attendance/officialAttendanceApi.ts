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


  export interface OfficialAttendance {
  id: string;

  officialId: string;

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

  official?: {
    id: string;

    name?: string;

    officialName?: string;

    employeeId?: string;
  };
}


interface OfficialAttendanceQuery {
  officialId?: string;
  startDate?: string;
  endDate?: string;
  date?: string;
  status?: AttendanceStatusType;
  method?: AttendanceMethodType;
}

interface CreateOfficialAttendance {
  officialId: string;
  attendanceDate?: string;
  checkInTime?: string;
  checkOutTime?: string;
  status?: AttendanceStatusType;
  method: AttendanceMethodType;
  confidence?: number;
  deviceId?: string;
  verificationId?: string;
}

export const officialAttendanceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createOfficialAttendance: builder.mutation<
      OfficialAttendance,
      CreateOfficialAttendance
    >({
      query: (data) => ({
        url: "/official-attendance",
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.OfficialAttendance, tagTypes.AttendanceDashboard],
    }),

    getOfficialAttendance: builder.query<
      OfficialAttendance[],
      OfficialAttendanceQuery | void
    >({
      query: (params) => ({
        url: "/official-attendance",
        method: "GET",
        params,
      }),
      providesTags: [tagTypes.OfficialAttendance, tagTypes.AttendanceDashboard],
    }),

    getOfficialAttendanceById: builder.query<
      OfficialAttendance,
      string
    >({
      query: (id) => ({
        url: `/official-attendance/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.OfficialAttendance, tagTypes.AttendanceDashboard],
    }),

    updateOfficialAttendance: builder.mutation<
      OfficialAttendance,
      {
        id: string;
        data: Partial<CreateOfficialAttendance>;
      }
    >({
      query: ({ id, data }) => ({
        url: `/official-attendance/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: [tagTypes.OfficialAttendance, tagTypes.AttendanceDashboard],
    }),

    deleteOfficialAttendance: builder.mutation<
      unknown,
      string
    >({
      query: (id) => ({
        url: `/official-attendance/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.OfficialAttendance, tagTypes.AttendanceDashboard],
    }),

    officialCheckIn: builder.mutation<
      OfficialAttendance,
      {
        officialId: string;
        method: AttendanceMethodType;
        confidence?: number;
        deviceId?: string;
        verificationId?: string;
      }
    >({
      query: (body) => ({
        url: "/official-attendance/check-in",
        method: "POST",
        body,
      }),
      invalidatesTags: [tagTypes.OfficialAttendance, tagTypes.AttendanceDashboard],
    }),

    officialCheckOut: builder.mutation<
      OfficialAttendance,
      {
        officialId: string;
        method?: AttendanceMethodType;
        deviceId?: string;
      }
    >({
      query: (body) => ({
        url: "/official-attendance/check-out",
        method: "POST",
        body,
      }),
      invalidatesTags: [tagTypes.OfficialAttendance, tagTypes.AttendanceDashboard],
    }),
  }),
});

export const {
  useCreateOfficialAttendanceMutation,
  useGetOfficialAttendanceQuery,
  useGetOfficialAttendanceByIdQuery,
  useUpdateOfficialAttendanceMutation,
  useDeleteOfficialAttendanceMutation,
  useOfficialCheckInMutation,
  useOfficialCheckOutMutation,
} = officialAttendanceApi;