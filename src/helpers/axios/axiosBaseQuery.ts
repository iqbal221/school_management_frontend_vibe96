import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import type { AxiosRequestConfig, AxiosError } from "axios";
import { instance as axiosInstance } from "./axiosInstance";
import { IMeta } from "@/types/common";

export function axiosBaseQuery(
  { baseUrl }: { baseUrl: string } = { baseUrl: "" }
): BaseQueryFn<
  {
    url: string;
    method: AxiosRequestConfig["method"];
    data?: AxiosRequestConfig["data"];
    params?: AxiosRequestConfig["params"];
    meta?: IMeta;
    contentType?: string;
  },
  unknown,
  unknown
> {
  return async ({ url, method, data, params, contentType }) => {
    try {
      const result = await axiosInstance({
        url: baseUrl + url,
        method,
        data,
        params,
        headers: {
          "Content-Type": contentType || "application/json",
        },
        withCredentials: true,
      });
      return result;
    } catch (axiosError) {
      let err = axiosError as AxiosError;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };
}

// import type { BaseQueryFn } from '@reduxjs/toolkit/query';
// import type {
//   AxiosError,
//   AxiosRequestConfig,
// } from 'axios';

// import { IMeta } from '@/types/common';
// import { instance as axiosInstance } from './axiosInstance';

// interface AxiosBaseQueryArgs {
//   url: string;
//   method: AxiosRequestConfig['method'];
//   data?: AxiosRequestConfig['data'];
//   params?: AxiosRequestConfig['params'];
//   meta?: IMeta;
//   contentType?: string;
// }

// interface AxiosErrorResponse {
//   success?: boolean;
//   message?: string;
//   errorMessages?: Array<{
//     message?: string;
//   }>;
//   data?: unknown;
// }

// export function axiosBaseQuery(
//   { baseUrl }: { baseUrl: string } = {
//     baseUrl: '',
//   },
// ): BaseQueryFn<
//   AxiosBaseQueryArgs,
//   unknown,
//   {
//     status?: number;
//     data?: AxiosErrorResponse | unknown;
//   }
// > {
//   return async ({
//     url,
//     method,
//     data,
//     params,
//     contentType,
//   }) => {
//     try {
//       const result = await axiosInstance({
//         url: baseUrl + url,
//         method,
//         data,
//         params,
//         headers: {
//           'Content-Type':
//             contentType || 'application/json',
//         },
//         withCredentials: true,
//       });

//       // IMPORTANT:
//       // RTK Query expects { data: ... }
//       return {
//         data: result.data,
//       };
//     } catch (axiosError) {
//       const err = axiosError as AxiosError<AxiosErrorResponse>;

//       // IMPORTANT:
//       // Axios 4xx/5xx errors MUST be returned as { error: ... }
//       return {
//         error: {
//           status: err.response?.status || 500,
//           data:
//             err.response?.data || {
//               success: false,
//               message:
//                 err.message ||
//                 &rsquo;something went wrong',
//             },
//         },
//       };
//     }
//   };
// }