import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const ApiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: `http://localhost:9000`,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      const token = getState()?.auth?.accessToken;
      
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  tagTypes:[],
  endpoints: (builder) => ({}),
});

export default ApiSlice;

