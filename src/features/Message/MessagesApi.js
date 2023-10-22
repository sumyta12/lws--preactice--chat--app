import ApiSlice from "../Api/ApiSlice";
import { io } from "socket.io-client";

export const MessagesApi = ApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    message: builder.query({
      query: (id) => {
        const limit = 15;
        return `/messages?conversationId_like=${id}&_page=1&_limit=${limit}`;
      },
      onCacheEntryAdded: async (
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) => {
        const socket = io("http://localhost:9000/", {
          reconnectionDelay: 1000,
          reconnection: true,
          reconnectionAttemps: 10,
          transports: ["websocket"],
          agent: false,
          upgrade: false,
          rejectUnauthorizes: false,
        });
        try {
          await cacheDataLoaded;
          socket.on("messages", (data) => {
            updateCachedData((draft) => {
              draft.push(data.body);
            });
          });
        } catch (e) {}
        await cacheEntryRemoved;
        socket.close()
      },
    }),
    messageHeader: builder.query({
      query: (id) => {
        return `/conversations?id_like=${id}`;
      },
    }),
    addMessage: builder.mutation({
      query: (data) => ({
        url: `/messages`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useMessageQuery, useMessageHeaderQuery, useAddMessageMutation } =
  MessagesApi;
