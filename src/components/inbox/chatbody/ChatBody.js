// import Blank from "./Blank";
import { useParams } from "react-router-dom";
import ChatHead from "./ChatHead";
import Messages from "./Messages";
import Options from "./Options";
import { useMessageQuery } from "../../../features/Message/MessagesApi";
import { useSelector } from "react-redux";

export default function ChatBody() {
  const { id } = useParams();
  const { user } = useSelector((state) => state.auth);
  const { data: messages, isLoading, isError } = useMessageQuery(id);

  let content = null;

  if (isLoading) {
    content = <h1>loading ...</h1>;
  }

  if (!isLoading && messages?.length > 0) {
    content = (
      <>
        {" "}
        <Messages message={messages} email={user.email} />
      </>
    );
  }

  return (
    <div className="w-full lg:col-span-2 lg:block">
      <div className="w-full grid conversation-row-grid">
        <ChatHead id={id} />
        {content}
        <Options id={id} userinfo={user} />
        {/* <Blank /> */}
      </div>
    </div>
  );
}
