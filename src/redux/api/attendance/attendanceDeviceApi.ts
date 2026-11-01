import { baseApi } from "@/redux/api/baseApi";
import { tagTypes } from "@/redux/tag-types";

// =========================================================
// TYPES
// =========================================================

export type AttendanceDeviceTypeValue =
  | "FACE"
  | "BIOMETRIC"
  | "MOBILE"
  | "WEB";

export interface AttendanceDevice {
  id: string;

  name: string;

  deviceCode: string;

  type: AttendanceDeviceTypeValue;

  schoolId: string;

  isActive: boolean;

  lastSeenAt?: string | null;

  createdAt: string;

  updatedAt: string;
}


interface AttendanceDeviceQuery {
  searchTerm?: string;
  type?: AttendanceDeviceTypeValue;
  isActive?: boolean;
  schoolId?: string;
}

interface CreateAttendanceDevice {
  name: string;
  deviceCode: string;
  type: AttendanceDeviceTypeValue;
  schoolId: string;
  isActive?: boolean;
}

interface UpdateAttendanceDevice {
  name?: string;
  deviceCode?: string;
  type?: AttendanceDeviceTypeValue;
  schoolId?: string;
  isActive?: boolean;
  lastSeenAt?: string;
}

export const attendanceDeviceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // =====================================================
    // CREATE
    // =====================================================

    createAttendanceDevice: builder.mutation<
      AttendanceDevice,
      CreateAttendanceDevice
    >({
      query: (body) => ({
        url: "/attendance-devices",
        method: "POST",
        body,
      }),
      invalidatesTags: [tagTypes.AttendanceDevice],
    }),

    // =====================================================
    // GET ALL
    // =====================================================

    getAttendanceDevices: builder.query<
      AttendanceDevice[],
      AttendanceDeviceQuery | void
    >({
      query: (params) => ({
        url: "/attendance-devices",
        method: "GET",
        params,
      }),
      providesTags: [tagTypes.AttendanceDevice],
    }),

    // =====================================================
    // GET ACTIVE
    // =====================================================

    getActiveAttendanceDevices: builder.query<
      AttendanceDevice[],
      string | undefined
    >({
      query: (schoolId) => ({
        url: "/attendance-devices/active",
        method: "GET",
        params: schoolId ? { schoolId } : undefined,
      }),
      providesTags: [tagTypes.AttendanceDevice],
    }),

    // =====================================================
    // GET BY ID
    // =====================================================

    getAttendanceDeviceById: builder.query<
      AttendanceDevice,
      string
    >({
      query: (id) => ({
        url: `/attendance-devices/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.AttendanceDevice],
    }),

    // =====================================================
    // GET BY DEVICE CODE
    // =====================================================

    getAttendanceDeviceByCode: builder.query<
      AttendanceDevice,
      string
    >({
      query: (deviceCode) => ({
        url: `/attendance-devices/code/${deviceCode}`,
        method: "GET",
      }),
      providesTags: [tagTypes.AttendanceDevice],
    }),

    // =====================================================
    // UPDATE
    // =====================================================

    updateAttendanceDevice: builder.mutation<
      AttendanceDevice,
      {
        id: string;
        data: UpdateAttendanceDevice;
      }
    >({
      query: ({ id, data }) => ({
        url: `/attendance-devices/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: [tagTypes.AttendanceDevice],
    }),

    // =====================================================
    // ACTIVATE
    // =====================================================

    activateAttendanceDevice: builder.mutation<
      AttendanceDevice,
      string
    >({
      query: (id) => ({
        url: `/attendance-devices/${id}/activate`,
        method: "PATCH",
      }),
      invalidatesTags: [tagTypes.AttendanceDevice],
    }),

    // =====================================================
    // DEACTIVATE
    // =====================================================

    deactivateAttendanceDevice: builder.mutation<
      AttendanceDevice,
      string
    >({
      query: (id) => ({
        url: `/attendance-devices/${id}/deactivate`,
        method: "PATCH",
      }),
      invalidatesTags: [tagTypes.AttendanceDevice],
    }),

    // =====================================================
    // HEARTBEAT
    // =====================================================

    attendanceDeviceHeartbeat: builder.mutation<
      AttendanceDevice,
      {
        deviceCode: string;
      }
    >({
      query: (body) => ({
        url: "/attendance-devices/heartbeat",
        method: "POST",
        body,
      }),
      invalidatesTags: [tagTypes.AttendanceDevice],
    }),

    // =====================================================
    // DELETE
    // =====================================================

    deleteAttendanceDevice: builder.mutation<
      unknown,
      string
    >({
      query: (id) => ({
        url: `/attendance-devices/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.AttendanceDevice],
    }),
  }),
});

export const {
  useCreateAttendanceDeviceMutation,
  useGetAttendanceDevicesQuery,
  useGetActiveAttendanceDevicesQuery,
  useGetAttendanceDeviceByIdQuery,
  useGetAttendanceDeviceByCodeQuery,
  useUpdateAttendanceDeviceMutation,
  useActivateAttendanceDeviceMutation,
  useDeactivateAttendanceDeviceMutation,
  useAttendanceDeviceHeartbeatMutation,
  useDeleteAttendanceDeviceMutation,
} = attendanceDeviceApi;