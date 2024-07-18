import { fetchBaseQuery, createApi } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../constants';

// Updated baseQuery with credentials included
const baseQuery = fetchBaseQuery({ 
    baseUrl: BASE_URL,
    credentials: 'include', // Include credentials for cross-origin requests
});

export const apiSlice = createApi({
    baseQuery,
    tagTypes: ["Product", "Order", "User", "Category"],
    endpoints: () => ({})
});
