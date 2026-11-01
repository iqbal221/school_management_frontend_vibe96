import { baseApi } from "./baseApi";
import { tagTypes } from "../tag-types";
import { IUser, IMeta } from "@/types/common";

const User_URL = "/user";

export const UserApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    addUserWithFormData: build.mutation({
      query: (data) => ({
        url: User_URL,
        method: "POST",
        data,
        contentType: "multipart/form-data",
      }),
      invalidatesTags: [tagTypes.user],
    }),

    Users: build.query({
      query: (arg: Record<string, any>) => {
        return {
          url: User_URL,
          method: "GET",
          params: arg,
        };
      },
      transformResponse: (response: IUser[], meta: IMeta) => {
        return {
          Users: response,
          meta,
        };
      },
      providesTags: [tagTypes.user],
    }),
    User: build.query({
      query: (id: string | string[] | undefined) => ({
        url: `${User_URL}/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.user],
    }),
    updateUser: build.mutation({
      query: ({ id, data }) => ({
        url: `${User_URL}/${id}`,
        method: "PATCH",
        data,
        contentType: "multipart/form-data",
      }),
      invalidatesTags: [tagTypes.user],
    }),
    deleteUser: build.mutation({
      query: (id) => ({
        url: `${User_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.user],
    }),
  }),
});

export const {
  useUsersQuery,
  useUserQuery,
  useAddUserWithFormDataMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = UserApi;
