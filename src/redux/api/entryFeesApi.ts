import { IEntryFees, IMeta, IStudent } from "@/types/common";
import { baseApi } from "./baseApi";
import { tagTypes } from "@/redux/tag-types";

const Entry_Fees = "/entryFees";
export const entryFeesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // get all feesManagements
    entryFeess: build.query({
      query: (arg: Record<string, any>) => {
        return {
          url: `${Entry_Fees}`,
          method: "GET",
          params: arg,
        };
      },
      transformResponse: (response: IEntryFees[], meta: IMeta) => {
        return {
          entryFees: response,
          meta,
        };
      },
      providesTags: [tagTypes.student],
    }),
    // get single student
    entryFees: build.query({
      query: (id: string | string[] | undefined) => ({
        url: `${Entry_Fees}/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.entryFees],
    }),
    // create a new feesManagement
    addEntryFeesWithFormData: build.mutation({
      query: (data) => ({
        url: Entry_Fees,
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.entryFees],
    }),

    // update student
    // updateStudent: build.mutation({
    //   query: (data) => ({
    //     url: `${Entry_Fees}/${data.id}`,
    //     method: "PATCH",
    //     data: data.body,
    //   }),
    //   invalidatesTags: [tagTypes.student],
    // }),
    // delete student
    deleteEntryFees: build.mutation({
      query: (id) => ({
        url: `${Entry_Fees}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.entryFees],
    }),
    // myCourses: build.query({
    //   query: (arg: Record<string, any>) => {
    //     return {
    //       url: `${Entry_Fees}/my-courses`,
    //       method: "GET",
    //       params: arg,
    //     };
    //   },
    //   transformResponse: (response: IMyCourse[], meta: IMeta) => {
    //     return {
    //       myCourses: response,
    //       meta,
    //     };
    //   },
    //   providesTags: [tagTypes.student],
    // }),
    // myCourseSchedules: build.query({
    //   query: (arg: Record<string, any>) => {
    //     return {
    //       url: `${Entry_Fees}/my-course-schedules`,
    //       method: "GET",
    //       params: arg,
    //     };
    //   },
    //   transformResponse: (response: IStudent[], meta: IMeta) => {
    //     return {
    //       myCourseSchedules: response,
    //       meta,
    //     };
    //   },
    //   providesTags: [tagTypes.student],
    // }),
    // myAcademicInfos: build.query({
    //   query: (arg: Record<string, any>) => ({
    //     url: `${Entry_Fees}/my-academic-infos`,
    //     method: "GET",
    //     params: arg,
    //   }),
    //   providesTags: [tagTypes.student],
    // }),
  }),
});

export const {
  useAddEntryFeesWithFormDataMutation,
  useEntryFeessQuery, // get all
  useEntryFeesQuery, // get single
  // useUpdateStudentMutation, // update
  useDeleteEntryFeesMutation, // delete
  // // my courses
  // useMyCoursesQuery,
  // useMyCourseSchedulesQuery,
  // useMyAcademicInfosQuery,
} = entryFeesApi;
