import { useState } from "react";
import { useMessageHeaderQuery } from "../../../features/Message/MessagesApi";
import { useEditConversationMutation } from "../../../features/Conversation/ConversationApi";
import { useSelector } from "react-redux";
export default function Options({ id }) {
  const [messages, setMessage] = useState("");
  const currentLoggedInuser = useSelector((state) => state.auth.user) || {};

  const { data: messageReciver } = useMessageHeaderQuery(id);
  const [editConversation, { data }] = useEditConversationMutation();

  const handlerSubmit = (event) => {
    event.preventDefault();

    if (messageReciver?.length > 0) {
      const reciverInfo = messageReciver[0].users.find(
        (item) => item.email !== currentLoggedInuser.email
      );

      const updateConversation = {
        id: parseInt(id),
        participants: `${currentLoggedInuser.email}-${reciverInfo.email}`,
        users: [
          {
            ...currentLoggedInuser,
          },
          {
            ...reciverInfo,
          },
        ],
        message: messages,
        timestamp: new Date().getTime(),
      };

      editConversation({ id: id, data: updateConversation });

      setMessage("");
    }
  };

  return (
    <div className="flex items-center justify-between w-full p-3 border-t border-gray-300">
      <input
        type="text"
        placeholder="Message"
        className="block w-full py-2 pl-4 mx-3 bg-gray-100 focus:ring focus:ring-violet-500 rounded-full outline-none focus:text-gray-700"
        name="message"
        required
        value={messages || ""}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button type="submit" onClick={handlerSubmit}>
        <svg
          className="w-5 h-5 text-gray-500 origin-center transform rotate-90"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor">
          <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
        </svg>
      </button>
    </div>
  );
}
