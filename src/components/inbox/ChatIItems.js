import { useSelector } from "react-redux";
import ChatItem from "./ChatItem";
import { useEffect } from "react";
import { useFriendsQuery } from "../../features/Conversation/ConversationApi";
import moment from "moment/moment";
import { Link } from "react-router-dom";

export default function ChatItems() {
  const { user } = useSelector((state) => state.auth);
  const { data, isLoading, isError } = useFriendsQuery(user);

  let content = null;
  if (isLoading) {
    content = <h1>data comming</h1>;
  }

  if (!isLoading && data?.length > 0) {
    content = data.map((item) => {

      const { id, message, timestamp, users } = item;

      const { name } = users.find((item) => item.email !== user.email) || {};

      return (
        <li key={id}>
          <Link to={`/inbox/${id}`}>
            <ChatItem
              avatar={`https://static.vecteezy.com/system/resources/thumbnails/005/545/335/small/user-sign-icon-person-symbol-human-avatar-isolated-on-white-backogrund-vector.jpg`}
              name={name}
              lastMessage={message}
              lastTime={moment(timestamp).fromNow()}
            />
          </Link>
        </li>
      );
    });
  }

  return <ul>{content}</ul>;
}
