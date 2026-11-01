import { IExpense, IMeta } from "@/types/common";
import { baseApi } from "./baseApi";
import { tagTypes } from "../tag-types";

const Expense_URL = "/expense";

export const expenseApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // get all expense
    expenses: build.query({
      query: (arg: Record<string, any>) => {
        return {
          url: `${Expense_URL}`,
          method: "GET",
          params: arg,
        };
      },
      transformResponse: (response: IExpense[], meta: IMeta) => {
        return {
          expenses: response,
          meta,
        };
      },
      providesTags: [tagTypes.expense],
    }),
    // get single expense
    expense: build.query({
      query: (id: string | string[] | undefined) => ({
        url: `${Expense_URL}/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.expense],
    }),
    // create a new expense
    addExpense: build.mutation({
      query: (data) => ({
        url: Expense_URL,
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.expense],
    }),
    // update existing expense
    updateExpense: build.mutation({
      query: (data) => ({
        url: `${Expense_URL}/${data.id}`,
        method: "PATCH",
        data: data.body,
      }),
      invalidatesTags: [tagTypes.expense],
    }),
    // delete existing expense
    deleteExpense: build.mutation({
      query: (id) => ({
        url: `${Expense_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.expense],
    }),
  }),
});

export const {
  useAddExpenseMutation,
  useExpensesQuery,
  // useAddexpenseMutation,
  // useexpensesQuery,
  // useexpenseQuery,
  // useUpdateexpenseMutation,
  useDeleteExpenseMutation,
} = expenseApi;
