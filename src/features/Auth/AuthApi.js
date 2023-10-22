import ApiSlice from "../Api/ApiSlice";
import { userLoggedIn } from "./AuthSlice";

const AuthApi = ApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (data) => ({
        url: `/register`,
        method: "POST",
        body: data,
      }),
      onQueryStarted: async (result, { dispatch,getState, queryFulfilled }) => {
        try {
          const response = await queryFulfilled;
          const { accessToken, user } = response.data;

          localStorage.setItem(
            "auth",
            JSON.stringify({
              accessToken: accessToken,
              user: user,
            })
          );
          dispatch(
            userLoggedIn({
              accessToken,
              user,
            })
          );
         
        } catch (e) {
          console.log(e);
        }
      },
    }),
    login: builder.mutation({
      query: (data) => ({
        url: `/login`,
        method: "POST",
        body: data,
      }),
      onQueryStarted: async (result, { dispatch, queryFulfilled }) => {
        try {
          const response = await queryFulfilled;
          const { accessToken, user } = response.data;

          localStorage.setItem(
            "auth",
            JSON.stringify({
              accessToken: accessToken,
              user: user,
            })
          );
          dispatch(
            userLoggedIn({
              accessToken,
              user,
            })
          );
        } catch (e) {
          console.log(e);
        }
      },
    }),
    checkUser : builder.query({
      query : (email) => {
        return `/users?email=${email}`
      }
    })
  }),
});

export const { 
  useLoginMutation, 
  useRegisterMutation,
  useCheckUserQuery
 } = AuthApi;
