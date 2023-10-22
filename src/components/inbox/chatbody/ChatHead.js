import { useSelector } from "react-redux";
import { useMessageHeaderQuery } from "../../../features/Message/MessagesApi";

export default function ChatHead({ id }) {
  const { data: message } = useMessageHeaderQuery(id);
  const { user: loggedinuser } = useSelector((state) => state.auth);
  // console.log(user.email)
  // console.log(message);

  const { name = "" } =
    message?.length > 0 &&
    message[0]?.users?.find((user) => user.email !== loggedinuser.email);

  return (
    <div className="relative flex items-center p-3 border-b border-gray-300">
      <img
        className="object-cover w-10 h-10 rounded-full"
        src={`https://static.vecteezy.com/system/resources/thumbnails/005/545/335/small/user-sign-icon-person-symbol-human-avatar-isolated-on-white-backogrund-vector.jpg`}
        alt={""}
      />
      <span className="block ml-2 font-bold text-gray-600">{name || ""}</span>
    </div>
  );
}
