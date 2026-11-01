import { IMeta, IOfficial } from "@/types/common";
import { baseApi } from "./baseApi";
import { tagTypes } from "../tag-types";

const OFFICIAL_URL = "/official";
export const officialApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // get all officials
    officials: build.query({
      query: (arg: Record<string, any>) => {
        return {
          url: `${OFFICIAL_URL}`,
          method: "GET",
          params: arg,
        };
      },
      transformResponse: (response: IOfficial[], meta: IMeta) => {
        return {
          officials: response,
          meta,
        };
      },
      providesTags: [tagTypes.official],
    }),

    // get single official
    official: build.query({
      query: (id: string | string[] | undefined) => ({
        url: `${OFFICIAL_URL}/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.official],
    }),
    // create a new official
    addOfficialWithFormData: build.mutation({
      query: (data) => ({
        url: "/official",
        method: "POST",
        data,
        contentType: "multipart/form-data",
      }),
      invalidatesTags: [tagTypes.official],
    }),

    // update official
    updateOfficial: build.mutation({
      query: (data) => ({
        url: `${OFFICIAL_URL}/${data.id}`,
        method: "PATCH",
        data: data.data,
      }),
      invalidatesTags: [tagTypes.official],
    }),
    // delete official
    deleteOfficial: build.mutation({
      query: (id) => ({
        url: `${OFFICIAL_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.official],
    }),
    // myCourses: build.query({
    //   query: (arg: Record<string, any>) => {
    //     return {
    //       url: `${OFFICIAL_URL}/my-courses`,
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
    //   providesTags: [tagTypes.official],
    // }),
    // myCourseSchedules: build.query({
    //   query: (arg: Record<string, any>) => {
    //     return {
    //       url: `${OFFICIAL_URL}/my-course-schedules`,
    //       method: "GET",
    //       params: arg,
    //     };
    //   },
    //   transformResponse: (response: Iofficial[], meta: IMeta) => {
    //     return {
    //       myCourseSchedules: response,
    //       meta,
    //     };
    //   },
    //   providesTags: [tagTypes.official],
    // }),
    // myAcademicInfos: build.query({
    //   query: (arg: Record<string, any>) => ({
    //     url: `${OFFICIAL_URL}/my-academic-infos`,
    //     method: "GET",
    //     params: arg,
    //   }),
    //   providesTags: [tagTypes.official],
    // }),
  }),
});

export const {
  useAddOfficialWithFormDataMutation, // create
  useOfficialQuery, // get all
  useOfficialsQuery, // get single
  useUpdateOfficialMutation, // update
  useDeleteOfficialMutation, // delete
} = officialApi;
