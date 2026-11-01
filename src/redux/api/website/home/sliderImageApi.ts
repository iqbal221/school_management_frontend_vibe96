// src/redux/api/website/home/SliderBannerApi.ts

import { tagTypes } from "@/redux/tag-types";
import { baseApi } from "../../baseApi";

export interface ISliderBanner {
  id: string;
  image: string | null;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ISliderBannerResponse {
  success: boolean;
  message: string;
  data: ISliderBanner[] | ISliderBanner | null;
}

export const SliderBannerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // =====================================================
    // GET ALL SLIDERS
    // =====================================================

    getSliderBanners: builder.query<ISliderBannerResponse, void>({
      query: () => ({
        url: "/slider-banner",
        method: "GET",
      }),

      providesTags: [tagTypes.sliderImage],
    }),

    // =====================================================
    // CREATE SLIDER
    // =====================================================

    createSliderBanner: builder.mutation({
      query: (data) => ({
        url: "/slider-banner",
        method: "POST",
        data,
        contentType: "multipart/form-data",
      }),

      invalidatesTags: [tagTypes.sliderImage],
    }),

    // =====================================================
    // UPDATE SLIDER
    // =====================================================

    updateSliderBanner: builder.mutation<
      ISliderBannerResponse,
      {
        id: string;
        data: FormData;
      }
    >({
      query: ({ id, data }) => ({
        url: `/slider-banner/${id}`,
        method: "PATCH",
        data,
        contentType: "multipart/form-data",
      }),

      invalidatesTags: [tagTypes.sliderImage],
    }),
  }),

  overrideExisting: false,
});

export const {
  useGetSliderBannersQuery,
  useCreateSliderBannerMutation,
  useUpdateSliderBannerMutation,
} = SliderBannerApi;
