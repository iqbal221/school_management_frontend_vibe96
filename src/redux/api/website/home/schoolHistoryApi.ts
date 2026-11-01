import { tagTypes } from '../../../tag-types';
import { baseApi } from '../../baseApi';

export interface ISchoolHistory {
  id: string;
  sectionTitle: string;
  aboutSchool: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ISchoolHistoryResponse {
  success: boolean;
  message: string;
  data: ISchoolHistory | null;
}

// Create
export interface ICreateSchoolHistory {
  sectionTitle: string;
  aboutSchool: string;
}

// Update
export interface IUpdateSchoolHistory {
  sectionTitle: string;
  aboutSchool: string;
}

export const SchoolHistoryApi =
  baseApi.injectEndpoints({
    endpoints: builder => ({
      // ===============================
      // GET School History
      // ===============================
      getSchoolHistory: builder.query<
        ISchoolHistoryResponse,
        void
      >({
        query: () => ({
          url: '/school-history',
          method: 'GET',
        }),

        providesTags: [tagTypes.schoolHistory],
      }),

      // ===============================
      // CREATE School History
      // ===============================
      createSchoolHistory: builder.mutation<
        ISchoolHistoryResponse,
        ICreateSchoolHistory
      >({
        query: data => ({
          url: '/school-history',
          method: 'POST',
          data,
        }),

        invalidatesTags: [tagTypes.schoolHistory],
      }),

      // ===============================
      // UPDATE School History
      // ===============================
      updateSchoolHistory: builder.mutation<
        ISchoolHistoryResponse,
        IUpdateSchoolHistory
      >({
        query: data => ({
          url: '/school-history',
          method: 'PUT',
          data,
        }),

        invalidatesTags: [tagTypes.schoolHistory],
      }),
    }),
  });

export const {
  useGetSchoolHistoryQuery,
  useCreateSchoolHistoryMutation,
  useUpdateSchoolHistoryMutation,
} = SchoolHistoryApi;