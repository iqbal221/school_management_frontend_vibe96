import { tagTypes } from "@/redux/tag-types";
import { baseApi } from "../../baseApi";

// =========================================================
// SCHOOL HEADER TYPE
// =========================================================

export interface ISchoolHeader {
  id: string;
  logo?: string | null;
  schoolName: string;
  slogan?: string | null;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// =========================================================
// API RESPONSE
// =========================================================

export interface ISchoolHeaderResponse {
  success: boolean;
  message: string;
  data: ISchoolHeader[] | ISchoolHeader | null;
}

// =========================================================
// API
// =========================================================

export const schoolHeaderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // =====================================================
    // GET SCHOOL HEADER
    // =====================================================

    getSchoolHeader: builder.query<ISchoolHeaderResponse, void>({
      query: () => ({
        url: "/school-header",
        method: "GET",
      }),

      providesTags: [tagTypes.schoolHeader],
    }),

    // =====================================================
    // GET ACTIVE SCHOOL HEADER
    // =====================================================

    getActiveSchoolHeader: builder.query<ISchoolHeaderResponse, void>({
      query: () => ({
        url: "/school-header/active",
        method: "GET",
      }),

      providesTags: [tagTypes.schoolHeader],
    }),

    // =====================================================
    // GET SCHOOL HEADER BY ID
    // =====================================================

    getSchoolHeaderById: builder.query<ISchoolHeaderResponse, string>({
      query: (id) => ({
        url: `/school-header/${id}`,
        method: "GET",
      }),

      providesTags: (_result, _error, id) => [
        {
          type: tagTypes.schoolHeader,
          id,
        },
      ],
    }),

    // =====================================================
    // CREATE SCHOOL HEADER
    // =====================================================

    createSchoolHeader: builder.mutation({
      query: (data) => ({
        url: "/school-header",
        method: "POST",
        data,
        contentType: "multipart/form-data",
      }),

      invalidatesTags: [tagTypes.schoolHeader],
    }),

    // =====================================================
    // UPDATE SCHOOL HEADER
    // =====================================================

    updateSchoolHeader: builder.mutation<
      ISchoolHeaderResponse,
      {
        id: string;
        data: FormData;
      }
    >({
      query: ({ id, data }) => ({
        url: `/school-header/${id}`,
        method: "PATCH",
        data: data,
        contentType: "multipart/form-data",
      }),

      invalidatesTags: [tagTypes.schoolHeader],
    }),

    // =====================================================
    // DELETE SCHOOL HEADER
    // =====================================================

    deleteSchoolHeader: builder.mutation<ISchoolHeaderResponse, string>({
      query: (id) => ({
        url: `/school-header/${id}`,
        method: "DELETE",
      }),

      invalidatesTags: [tagTypes.schoolHeader],
    }),
  }),

  overrideExisting: false,
});

// =========================================================
// EXPORT HOOKS
// =========================================================

export const {
  useGetSchoolHeaderQuery,
  useGetActiveSchoolHeaderQuery,
  useGetSchoolHeaderByIdQuery,
  useCreateSchoolHeaderMutation,
  useUpdateSchoolHeaderMutation,
  useDeleteSchoolHeaderMutation,
} = schoolHeaderApi;
