import { apiSlice } from "./apiSlice";
import { USERS_URL } from "../constants";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/auth`,
        method: "POST",
        body: data,
      }),
    }),

    verifyEmail: builder.query({
      query: (token) => ({
        url: `${USERS_URL}/verify-email/${token}`,
        method: "GET",
      }),
    }),

    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: "POST",
      }),
    }),

    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}`,
        method: "POST",
        body: data,
      }),
    }),

    profile: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile`,
        method: "PUT",
        body: data,
      }),
    }),

    getUsers: builder.query({
      query: () => ({
        url: `${USERS_URL}`,
        method: "GET",
      }),
      providesTags: ["User"], //this is used to invalidate the cache when the data is updated means when the user is deleted or added or updated then the cache will be invalidated, invalidating the cache means that the cache will be updated with the new data
      keepUnusedDataFor: 5, //this is used to keep the data in the cache for 5 seconds even if the data is not used, this is used to prevent the data from being deleted from the cache if the data is not used for a long time
    }),

    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `${USERS_URL}/${userId}`,
        method: "DELETE",
      }),
    }),

    getUsersDetails: builder.query({
      query: (userId) => ({
        url: `${USERS_URL}/${userId}`,
        method: "GET",
      }),
      keepUnusedDataFor: 5,
    }),

    updateUser: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/${data.userId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    addFavoriteProduct: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/favorites`,
        method: "POST",
        body: data,
      }),
    }),

    removeFavoriteProduct: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/favorites`,
        method: "DELETE",
        body: data,
      }),
    }),

    getUserFavoriteProducts: builder.query({
      query: () => ({
        url: `${USERS_URL}/favorites`,
        method: "GET",
      }),
      
    }),

    addAndUpdateProductToCart: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/cart`,
        method: "POST",
        body: data,
      }),
    }),

    getUserCart: builder.query({
      query: () => ({
        url: `${USERS_URL}/cart`,
        method: "GET",
      }),
    }),

    removeProductFromCart: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/cart`,
        method: "DELETE",
        body: data,
      }),
    }),

    clearCart: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/clearcart`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useProfileMutation,
  useGetUsersQuery,
  useDeleteUserMutation,
  useGetUsersDetailsQuery,
  useUpdateUserMutation,
  useAddFavoriteProductMutation,
  useRemoveFavoriteProductMutation,
  useGetUserFavoriteProductsQuery,
  useAddAndUpdateProductToCartMutation,
  useGetUserCartQuery,
  useRemoveProductFromCartMutation,
  useClearCartMutation,
  useVerifyEmailQuery,
} = userApiSlice;
