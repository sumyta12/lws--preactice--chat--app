import { useState, useEffect } from "react";
import { useCheckUserQuery } from "../../features/Auth/AuthApi";
import Error from "./../ui/Error";
import { useSelector } from "react-redux";
import validateEmail from "./../utils/EmailValidate";
import { useDispatch } from "react-redux";
import { ConversationApi } from "./../../features/Conversation/ConversationApi";
import { useAddMessageMutation } from "../../features/Message/MessagesApi";

export default function Modal({ open, control }) {
  const dispatch = useDispatch();
  const [to, setTo] = useState("");
  const [message, setMessage] = useState("");
  const [checker, setchecker] = useState(true);
  const { user: activeUser } = useSelector((state) => state.auth);
  const [conversation, setConversation] = useState(undefined);

  const { data: user } = useCheckUserQuery(to, {
    skip: checker,
  });

  //const [addMessage, { data: messageadd, error }] = useAddMessageMutation();

  useEffect(() => {
    if (
      user?.length > 0 &&
      user[0]?.email &&
      user[0]?.email !== activeUser?.email
    ) {
      dispatch(
        ConversationApi.endpoints.exitsConversation.initiate({
          senderEmail: activeUser.email,
          reciverEmail: to,
        })
      )
        .unwrap()
        .then((res) => {
          setConversation(res);
        })
        .catch((err) => console.log(err.message));
    }
  }, [activeUser, user, dispatch, to, message]);

  const handlerText = (e) => {
    if (validateEmail(e)) {
      setTo(e);
      setchecker(false);
    }
  };

  const debouce = (callback, wait) => {
    let timeoutId = null;
    return (...args) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        callback(...args);
      }, wait);
    };
  };

  const handlerTo = debouce(handlerText, 300);

  const handlerFrom = (event) => {
    event.preventDefault();
    if (conversation?.length > 0) {
      const nrw = {
        participants: `${activeUser.email}-${user[0].email}`,
        users: [
          {
            email: activeUser.email,
            name: activeUser.name,
            id: activeUser.id,
          },
          {
            email: user[0].email,
            name: user[0].name,
            id: user[0].id,
          },
        ],
        message,
        timestamp: new Date().getTime(),
      };
      //edit conversation
      dispatch(
        ConversationApi.endpoints.editConversation.initiate({
          id: conversation[0].id,
          data: nrw,
        })
      );
    }
    if (conversation?.length === 0) {
      const newuser = {
        participants: `${activeUser.email}-${user[0].email}`,
        users: [
          {
            email: activeUser.email,
            name: activeUser.name,
            id: activeUser.id,
          },
          {
            email: user[0].email,
            name: user[0].name,
            id: user[0].id,
          },
        ],
        message,
        timestamp: new Date().getTime(),
      };

      //add conversation
      dispatch(ConversationApi.endpoints.addConversation.initiate(newuser));
    }
  };

  return (
    open && (
      <>
        <div
          onClick={control}
          className="fixed w-full h-full inset-0 z-10 bg-black/50 cursor-pointer"></div>
        <div className="rounded w-[400px] lg:w-[600px] space-y-8 bg-white p-10 absolute top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Send message
          </h2>
          <form className="mt-8 space-y-6" onSubmit={handlerFrom}>
            <input type="hidden" name="remember" value="true" />
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="to" className="sr-only">
                  To
                </label>
                <input
                  id="to"
                  name="to"
                  type="to"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm"
                  placeholder="Send to"
                  onChange={(event) => handlerTo(event.target.value)}
                />
              </div>
              <div>
                <label htmlFor="message" className="sr-only">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  type="message"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm"
                  placeholder="Message"
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500">
                Send Message
              </button>
            </div>

            {(user && user?.length === 0 && (
              <Error message="There no email on that name" />
            )) ||
              (user && user[0]?.email === activeUser.email && (
                <Error message="You can't email yourself" />
              ))}
          </form>
        </div>
      </>
    )
  );
}
