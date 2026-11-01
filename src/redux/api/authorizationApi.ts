import { baseApi } from "./baseApi";
import { tagTypes } from "../tag-types";
import { IAuthorization, IMeta } from "@/types/common";

const Authorization_URL = "/authorization";

export const authorizationApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    addAuthorizationData: build.mutation({
      query: (data) => ({
        url: `/entryFees/${Authorization_URL}`,
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.authorization],
    }),

    authorizations: build.query({
      query: (arg: Record<string, any>) => {
        return {
          url: `/entryFees/${Authorization_URL}`,
          method: "GET",
          params: arg,
        };
      },
      transformResponse: (response: IAuthorization[], meta: IMeta) => {
        return {
          Authorizations: response,
          meta,
        };
      },
      providesTags: [tagTypes.authorization],
    }),
    authorization: build.query({
      query: (id: string | string[] | undefined) => ({
        url: `/entryFees/${Authorization_URL}/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.authorization],
    }),
    updateAuthorization: build.mutation({
      query: (data) => ({
        url: `/entryFees/${Authorization_URL}/${data.id}`,
        method: "PATCH",
        data: data.data,
        // contentType: "multipart/form-data",
      }),
      invalidatesTags: [tagTypes.authorization],
    }),
    deleteAuthorization: build.mutation({
      query: (id) => ({
        url: `${Authorization_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.authorization],
    }),
  }),
});

export const {
  useAuthorizationsQuery,
  useAuthorizationQuery,
  useAddAuthorizationDataMutation,
  useUpdateAuthorizationMutation,
  useDeleteAuthorizationMutation,
} = authorizationApi;
