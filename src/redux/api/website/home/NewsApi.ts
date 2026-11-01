
import { baseApi } from "@/redux/api/baseApi";
import { tagTypes } from "@/redux/tag-types";

/* =========================================================
   TYPES
========================================================= */

export interface INews {
  news_id: string;
  text: string;
  documentUrl?: string | null;
  documentName?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ICreateNews {
  text: string;
  documentUrl?: string;
  documentName?: string;
}

export interface IUpdateNewsData {
  text: string;
  documentUrl?: string;
  documentName?: string;
  removeDocument?: boolean;
}

export interface IUpdateNews {
  id: string;
  data: IUpdateNewsData;
}

export interface INewsResponse {
  success?: boolean;
  message?: string;
  data?: INews;
}

export interface INewsListResponse {
  success?: boolean;
  message?: string;
  data?: INews[];
}

/* =========================================================
   API
========================================================= */

const NewsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /* =====================================================
       GET NEWS
    ===================================================== */

    getNews: builder.query<
      INews[] | INewsListResponse,
      void
    >({
      query: () => ({
        url: "/news",
        method: "GET",
      }),

      providesTags: [tagTypes.news],
    }),

    /* =====================================================
       CREATE NEWS
    ===================================================== */

    createNews: builder.mutation<
      INewsResponse | INews,
      ICreateNews
    >({
      query: (data) => ({
        url: "/news",
        method: "POST",
        data,
      }),

      invalidatesTags: [tagTypes.news],
    }),

    /* =====================================================
       UPDATE NEWS
    ===================================================== */

    updateNews: builder.mutation<
      INewsResponse | INews,
      IUpdateNews
    >({
      query: ({ id, data }) => ({
        url: `/news/${id}`,
        method: "PATCH",
        data,
      }),

      invalidatesTags: [tagTypes.news],
    }),

    /* =====================================================
       DELETE NEWS
    ===================================================== */

    deleteNews: builder.mutation<
      { success?: boolean; message?: string },
      string
    >({
      query: (id) => ({
        url: `/news/${id}`,
        method: "DELETE",
      }),

      invalidatesTags: [tagTypes.news],
    }),
  }),

  overrideExisting: false,
});

export const {
  useGetNewsQuery,
  useCreateNewsMutation,
  useUpdateNewsMutation,
  useDeleteNewsMutation,
} = NewsApi;

