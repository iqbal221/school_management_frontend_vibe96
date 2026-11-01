import { tagTypes } from "../../../tag-types";
import { baseApi } from "../../baseApi";

export interface IRecentNews {
  id: string;
  text: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface IRecentNewsResponse {
  success: boolean;
  message: string;
  data: IRecentNews[];
}

export interface ICreateRecentNews {
  text: string;
}

export const recentNewsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // =========================
    // GET ALL RECENT NEWS
    // =========================
    getRecentNews: builder.query<IRecentNewsResponse, void>({
      query: () => ({
        url: "/recent-news",
        method: "GET",
      }),

      providesTags: [tagTypes.recentNews],
    }),

    // =========================
    // CREATE RECENT NEWS
    // =========================
    createRecentNews: builder.mutation<IRecentNewsResponse, ICreateRecentNews>({
      query: (data) => ({
        url: "/recent-news",
        method: "POST",
        data,
      }),

      invalidatesTags: [tagTypes.recentNews],
    }),

    // =========================
    // DELETE RECENT NEWS
    // =========================
    deleteRecentNews: builder.mutation<IRecentNewsResponse, string>({
      query: (id) => ({
        url: `/recent-news/${id}`,
        method: "DELETE",
      }),

      invalidatesTags: [tagTypes.recentNews],
    }),
  }),
});

export const {
  useGetRecentNewsQuery,
  useCreateRecentNewsMutation,
  useDeleteRecentNewsMutation,
} = recentNewsApi;
