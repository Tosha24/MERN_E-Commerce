import { apiSlice } from "./apiSlice";
import { CATEGORY_URL } from "../constants";

export const categoryApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createCategory: builder.mutation({
      query: (category) => ({
        url: `${CATEGORY_URL}`,
        method: "POST",
        body: category,
      }),
    }),

    updateCategory: builder.mutation({
      query: ({ id, category }) => ({
        url: `${CATEGORY_URL}/${id}`,
        method: "PUT",
        body: category,
      }),
    }),

    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `${CATEGORY_URL}/${id}`,
        method: "DELETE",
      }),
    }),

    getCategories: builder.query({
      query: () => ({
        url: `${CATEGORY_URL}/categories`,
        method: "GET",
      }),
    }),

    getTotalProductsByCategory: builder.query({
      query: () => ({
        url: `${CATEGORY_URL}/total-products-by-category`,
        method: "GET",
      }),
    }),

  }),
});

export const {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
  useGetTotalProductsByCategoryQuery,
} = categoryApiSlice;
