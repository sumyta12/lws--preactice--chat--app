import ApiSlice from "../Api/ApiSlice";
import { MessagesApi } from "../Message/MessagesApi";
import { io } from "socket.io-client";

export const ConversationApi = ApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    friends: builder.query({
      query: (data) => {
        const { email } = data;
        const limit = 5;
        return `/conversations?participants_like=${email}&_page=1&_limit=${limit}&_sort=timestamp&_order=desc`;
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
          socket.on("conversation", (data) => {
            updateCachedData((draft) => {
              const updateconv = draft.find(
                (item) => item.id == data?.body?.id
              );
              
              updateconv.message = data?.body?.message;
              updateconv.timestamp = data?.body?.timestamp;
            });
          });
        } catch (e) {}
        await cacheEntryRemoved;
        socket.close()
      },
    }),

    exitsConversation: builder.query({
      query: ({ senderEmail, reciverEmail }) => {
        return `/conversations?participants_like=${senderEmail}-${reciverEmail}&&participants_like=${reciverEmail}-${senderEmail}`;
      },
    }),

    addConversation: builder.mutation({
      query: (data) => ({
        url: `/conversations`,
        method: "POST",
        body: data,
      }),
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        const [sender, reciver] = arg.users;

        const optimisticaddOne = dispatch(
          ApiSlice.util.updateQueryData("friends", sender, (draft) => {
            const lastlength = draft.length + 1;
            draft.push({ id: lastlength, ...arg });
          })
        );
        try {
          const requestfullfill = await queryFulfilled;

          const { id, users, message, timestamp } = requestfullfill.data;

          const newmessage = {
            conversationId: id,
            sender: {
              ...users[0],
            },
            receiver: {
              ...users[1],
            },
            message,
            timestamp: timestamp,
          };
          dispatch(MessagesApi.endpoints.addMessage.initiate(newmessage));
        } catch (e) {
          optimisticaddOne.undo();
        }
      },
    }),

    editConversation: builder.mutation({
      query: ({ id, data }) => ({
        url: `/conversations/${id}`,
        method: "PATCH",
        body: data,
      }),

      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        const { id, data } = arg;
        const [sender, reciver] = data.users;

        const optimisticUpdateOne = dispatch(
          ApiSlice.util.updateQueryData("friends", sender, (draft) => {
            const drafselectedchange = draft.find((item) => item.id == id);
            drafselectedchange.message = arg.data.message;
            drafselectedchange.timestamp = arg.data.timestamp;
          })
        );

        try {
          const requestfullfill = await queryFulfilled;

          const { id, users, message, timestamp } = requestfullfill.data;

          const newmessage = {
            conversationId: id,
            sender: {
              ...users[0],
            },
            receiver: {
              ...users[1],
            },
            message,
            timestamp: timestamp,
          };

          dispatch(MessagesApi.endpoints.addMessage.initiate(newmessage))
            .unwrap()
            .then((res) => {
                
              // dispatch(
              //   ApiSlice.util.updateQueryData(
              //     "message",
              //     res.conversationId.toString(),
              //     (draft) => {
              //       draft.push(res);
              //     }
              //   )
              // );
            });
        } catch (e) {
          optimisticUpdateOne.undo();
        }
      },
    }),
  }),
});

export const {
  useFriendsQuery,
  useEditConversationMutation,
  useAddConversationMutation,
  useExitsConversationQuery,
} = ConversationApi;
