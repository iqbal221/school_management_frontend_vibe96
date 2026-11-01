
import { tagTypes } from "../../../tag-types";
import { baseApi } from "../../baseApi";

/* =========================================================
   NOTICE TYPES
========================================================= */

export interface INotice {
  notice_id: string;
  text: string;

  documentUrl?: string | null;
  documentName?: string | null;

  createdAt?: string;
  updatedAt?: string;
}

export interface INoticeResponse {
  success: boolean;
  message: string;
  data: INotice[];
}

/* =========================================================
   CREATE NOTICE
========================================================= */

export interface ICreateNotice {
  text: string;

  /*
   * File is uploaded directly to Cloudinary
   * from NewsNotice.tsx.
   *
   * Backend receives only the Cloudinary URL
   * and original file name.
   */
  documentUrl?: string;
  documentName?: string;
}

/* =========================================================
   UPDATE NOTICE
========================================================= */

export interface IUpdateNotice {
  id: string;

  data: {
    text: string;

    /*
     * Cloudinary document information
     */
    documentUrl?: string;
    documentName?: string;

    /*
     * true = remove existing document
     */
    removeDocument?: boolean;
  };
}

/* =========================================================
   NOTICE API
========================================================= */

export const NoticeApi =
  baseApi.injectEndpoints({
    endpoints: (builder) => ({
      /* ===================================================
         GET ALL NOTICE
      =================================================== */

      getNotice: builder.query<
        INoticeResponse,
        void
      >({
        query: () => ({
          url: "/notice",
          method: "GET",
        }),

        providesTags: [tagTypes.notice],
      }),

      /* ===================================================
         CREATE NOTICE
      =================================================== */

      createNotice: builder.mutation<
        INoticeResponse,
        ICreateNotice
      >({
        query: (data) => ({
          url: "/notice",
          method: "POST",

          /*
           * Send JSON directly.
           *
           * Example:
           * {
           *   text: "Important notice",
           *   documentUrl: "https://res.cloudinary.com/...",
           *   documentName: "notice.pdf"
           * }
           */
          data,
        }),

        invalidatesTags: [tagTypes.notice],
      }),

      /* ===================================================
         UPDATE NOTICE
      =================================================== */

      updateNotice: builder.mutation<
        INoticeResponse,
        IUpdateNotice
      >({
        query: ({ id, data }) => ({
          url: `/notice/${id}`,
          method: "PUT",

          /*
           * Send JSON directly.
           */
          data,
        }),

        invalidatesTags: [tagTypes.notice],
      }),

      /* ===================================================
         DELETE NOTICE
      =================================================== */

      deleteNotice: builder.mutation<
        INoticeResponse,
        string
      >({
        query: (id) => ({
          url: `/notice/${id}`,
          method: "DELETE",
        }),

        invalidatesTags: [tagTypes.notice],
      }),
    }),
  });

/* =========================================================
   HOOKS
========================================================= */

export const {
  useGetNoticeQuery,
  useCreateNoticeMutation,
  useUpdateNoticeMutation,
  useDeleteNoticeMutation,
} = NoticeApi;

