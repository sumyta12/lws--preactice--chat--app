import { configureStore } from "@reduxjs/toolkit";
import ApiSlice from "../features/Api/ApiSlice";
import AuthSlice from "../features/Auth/AuthSlice";

export const store = configureStore({
  reducer: {
    [ApiSlice.reducerPath]: ApiSlice.reducer,
    auth : AuthSlice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(ApiSlice.middleware),
});
