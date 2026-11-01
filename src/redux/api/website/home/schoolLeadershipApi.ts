import { tagTypes } from '../../../tag-types';
import { baseApi } from '../../baseApi';

export interface ISchoolLeadership {
  id: string;

  founderName: string;
  founderImage: string | null;

  principalName: string;
  principalImage: string | null;

  createdAt?: string;
  updatedAt?: string;
}

export interface ISchoolLeadershipResponse {
  success: boolean;
  message: string;
  data: ISchoolLeadership | null;
}

export interface IUpdateSchoolLeadershipRequest {
  id:string,
  data: FormData;
  
}

export const SchoolLeadershipApi =
  baseApi.injectEndpoints({
    endpoints: builder => ({

      // =====================================================
      // GET
      // =====================================================

      getSchoolLeadership: builder.query<
        ISchoolLeadership ,
        void
      >({
        query: () => ({
          url: '/school-leadership',
          method: 'GET',
        }),

        providesTags: [
          tagTypes.schoolLeadership,
        ],
      }),

      // =====================================================
      // CREATE
      // =====================================================

      createSchoolLeadership: builder.mutation<
        ISchoolLeadershipResponse,
        FormData
      >({
        query: (data) => ({
          url: '/school-leadership',
          method: 'POST',
          data,
          contentType: "multipart/form-data",
        }),

        invalidatesTags: [
          tagTypes.schoolLeadership,
        ],
      }),

      // =====================================================
      // UPDATE
      // =====================================================

      updateSchoolLeadership: builder.mutation<
        ISchoolLeadershipResponse,
       IUpdateSchoolLeadershipRequest
      >({
        query: ({id,data}:any) => ({
          url: `/school-leadership/${id}`,
          method: "PATCH",
          body: data,
          contentType: "multipart/form-data",
        }),

        invalidatesTags: [
          tagTypes.schoolLeadership,
        ],
      }),

      // =====================================================
      // DELETE
      // =====================================================

      deleteSchoolLeadership: builder.mutation<
        ISchoolLeadershipResponse,
        string
      >({
        query: (id) => ({
          url: `/school-leadership/${id}`,
          method: 'DELETE',
        }),

        invalidatesTags: [
          tagTypes.schoolLeadership,
        ],
      }),
    }),
  });

export const {
  useGetSchoolLeadershipQuery,
  useCreateSchoolLeadershipMutation,
  useUpdateSchoolLeadershipMutation,
  useDeleteSchoolLeadershipMutation,
} = SchoolLeadershipApi;