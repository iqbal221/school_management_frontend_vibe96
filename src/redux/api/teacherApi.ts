import { IMeta, ITeacher } from "@/types/common";
import { baseApi } from "./baseApi";
import { tagTypes } from "../tag-types";

const TEACHER_URL = "/teacher";
export const teacherApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // get all teachers
    teachers: build.query({
      query: (arg: Record<string, any>) => {
        return {
          url: `${TEACHER_URL}`,
          method: "GET",
          params: arg,
        };
      },
      transformResponse: (response: ITeacher[], meta: IMeta) => {
        return {
          teachers: response,
          meta,
        };
      },
      providesTags: [tagTypes.teacher],
    }),

    // get single teacher
    teacher: build.query({
      query: (id: string | string[] | undefined) => ({
        url: `${TEACHER_URL}/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.teacher],
    }),
    // create a new teacher
    addTeacherWithFormData: build.mutation({
      query: (data) => ({
        url: "/teacher",
        method: "POST",
        data,
        contentType: "multipart/form-data",
      }),
      invalidatesTags: [tagTypes.teacher],
    }),

    // update teacher
    updateTeacher: build.mutation({
      query: (data) => ({
        url: `${TEACHER_URL}/${data.id}`,
        method: "PATCH",
        data: data.data,
      }),
      invalidatesTags: [tagTypes.teacher],
    }),
    // delete teacher
    deleteTeacher: build.mutation({
      query: (id) => ({
        url: `${TEACHER_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.teacher],
    }),
    // myCourses: build.query({
    //   query: (arg: Record<string, any>) => {
    //     return {
    //       url: `${TEACHER_URL}/my-courses`,
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
    //   providesTags: [tagTypes.teacher],
    // }),
    // myCourseSchedules: build.query({
    //   query: (arg: Record<string, any>) => {
    //     return {
    //       url: `${TEACHER_URL}/my-course-schedules`,
    //       method: "GET",
    //       params: arg,
    //     };
    //   },
    //   transformResponse: (response: Iteacher[], meta: IMeta) => {
    //     return {
    //       myCourseSchedules: response,
    //       meta,
    //     };
    //   },
    //   providesTags: [tagTypes.teacher],
    // }),
    // myAcademicInfos: build.query({
    //   query: (arg: Record<string, any>) => ({
    //     url: `${TEACHER_URL}/my-academic-infos`,
    //     method: "GET",
    //     params: arg,
    //   }),
    //   providesTags: [tagTypes.teacher],
    // }),
  }),
});

export const {
  useAddTeacherWithFormDataMutation, // create
  useTeacherQuery, // get all
  useTeachersQuery, // get single
  useUpdateTeacherMutation, // update
  useDeleteTeacherMutation, // delete
} = teacherApi;
