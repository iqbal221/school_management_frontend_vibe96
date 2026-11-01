import { IMeta, IStudent } from "@/types/common";
import { baseApi } from "./baseApi";
import { tagTypes } from "../tag-types";

const STUDENT_URL = "/student";
export const studentApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // get all students
    students: build.query({
      query: (arg: Record<string, any>) => {
        return {
          url: `${STUDENT_URL}`,
          method: "GET",
          params: arg,
        };
      },
      transformResponse: (response: IStudent[], meta: IMeta) => {
        return {
          students: response,
          meta,
        };
      },
      providesTags: [tagTypes.student],
    }),
    // get student result
    studentResult: build.query({
      query: (arg: Record<string, any>) => {
        return {
          url: `${STUDENT_URL}/result`,
          method: "GET",
          params: arg,
        };
      },
      transformResponse: (response: IStudent[], meta: IMeta) => {
        return {
          studentResult: response,
          meta,
        };
      },
      providesTags: [tagTypes.studentResult],
    }),
    // get single student
    student: build.query({
      query: (id: string | string[] | undefined) => ({
        url: `${STUDENT_URL}/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.student],
    }),
    // create a new student
    addStudentWithFormData: build.mutation({
      query: (data) => ({
        url: "/student",
        method: "POST",
        data,
        contentType: "multipart/form-data",
      }),
      invalidatesTags: [tagTypes.student],
    }),

    // upload student result
    uploadResultWithFormData: build.mutation({
      query: (data) => ({
        url: "/student/result",
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.student],
    }),

    // update student
    updateStudent: build.mutation({
      query: ({ id, data }) => ({
        url: `/student/${id}`,
        method: "PATCH",
        data,
        contentType: "multipart/form-data",
      }),
      invalidatesTags: [tagTypes.student],
    }),
    // delete student
    deleteStudent: build.mutation({
      query: (id) => ({
        url: `${STUDENT_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.student],
    }),
  }),
});

export const {
  useAddStudentWithFormDataMutation, // create
  useUploadResultWithFormDataMutation, // upload result
  useStudentsQuery, // get all
  useStudentQuery, // get single
  useStudentResultQuery, // get result
  useUpdateStudentMutation, // update
  useDeleteStudentMutation, // delete
  // // my courses
  // useMyCoursesQuery,
  // useMyCourseSchedulesQuery,
  // useMyAcademicInfosQuery,
} = studentApi;
