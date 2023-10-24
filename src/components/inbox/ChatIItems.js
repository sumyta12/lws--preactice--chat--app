import { useDispatch, useSelector } from "react-redux";
import ChatItem from "./ChatItem";
import { useEffect, useState } from "react";
import {
  ConversationApi,
  useFriendsQuery,
} from "../../features/Conversation/ConversationApi";
import moment from "moment/moment";
import { Link } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";

export default function ChatItems() {
  const [page, setPageCount] = useState(1);
  const [hasmore, sethasmore] = useState(true);

  const { user } = useSelector((state) => state.auth);

  const { data: conversation, isLoading, isError } = useFriendsQuery(user);

  const { data, totalCount } = conversation || {};

  let content = null;
  if (isLoading) {
    content = <h1>data comming</h1>;
  }
  const fetchData = () => {
    setPageCount((prev) => prev + 1);
  };

  const dispatch = useDispatch();

  useEffect(() => {
    if (page > 1) {
      dispatch(
        ConversationApi.endpoints.getmorefriends.initiate({ user, page })
      );
    }
  }, [page, dispatch, user]);

  useEffect(() => {
    //12 - 10 , 10 - 10 , 2
    if (totalCount > 0) {
      const generate = Math.ceil(totalCount / 10) > page;
      sethasmore(generate);
    }
  }, [totalCount, page]);

  if (!isLoading && data?.length > 0) {
    content = (
      <InfiniteScroll
        dataLength={data?.length} //This is important field to render the next data
        next={fetchData}
        hasMore={hasmore} // jokon finish hoy jabe sob data tokon hasmore false kore dite hobe
        loader={<h4>Loading...</h4>}
        height={window.innerHeight - 129}>
        {data.map((item) => {
          const { id, message, timestamp, users } = item;

          const { name } =
            users.find((item) => item.email !== user.email) || {};

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
        })}
      </InfiniteScroll>
    );
  }

  return <ul>{content}</ul>;
}
