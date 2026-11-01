import { IRevenue, IMeta } from "@/types/common";
import { baseApi } from "./baseApi";
import { tagTypes } from "../tag-types";

const Revenue_URL = "/revenue";

export const revenueApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // get all revenue
    revenues: build.query({
      query: (arg: Record<string, any>) => {
        return {
          url: Revenue_URL,
          method: "GET",
          params: arg,
        };
      },
      transformResponse: (response: IRevenue[], meta: IMeta) => {
        return {
          revenues: response,
          meta,
        };
      },
      providesTags: [tagTypes.revenue],
    }),
    // get single revenue
    revenue: build.query({
      query: (id: string | string[] | undefined) => ({
        url: `${Revenue_URL}/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.revenue],
    }),
    // create a new revenue
    addRevenue: build.mutation({
      query: (data) => ({
        url: Revenue_URL,
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.revenue],
    }),
    // update existing revenue
    updateRevenue: build.mutation({
      query: (data) => ({
        url: `${Revenue_URL}/${data.id}`,
        method: "PATCH",
        data: data.body,
      }),
      invalidatesTags: [tagTypes.revenue],
    }),
    // delete existing revenue
    deleteRevenue: build.mutation({
      query: (id) => ({
        url: `${Revenue_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.revenue],
    }),
  }),
});

export const {
  useAddRevenueMutation,
  useRevenuesQuery,
  // useAddrevenueMutation,
  // userevenuesQuery,
  // userevenueQuery,
  // useUpdaterevenueMutation,
  useDeleteRevenueMutation,
} = revenueApi;
