import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { userLoggedOut } from "../Auth/AuthSlice";

const otherQuery = fetchBaseQuery({
  baseUrl: `http://localhost:9000`,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = getState()?.auth?.accessToken;

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

const ApiSlice = createApi({
  reducerPath: "api",
  baseQuery: async (args, api, extraOptions) => {
    let result = await otherQuery(args, api, extraOptions);
    if (result?.error?.status === 401) {
      api.dispatch(userLoggedOut())
    }
   
    return result;
  },
  tagTypes: [],
  endpoints: (builder) => ({}),
});

export default ApiSlice;
