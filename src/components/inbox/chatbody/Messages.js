import Message from "./Message";

export default function Messages({ message, email: senderEmail }) {
  
  const messageRender = message.map((item) => {
    const { message, id } = item;
    const messageChecker = item.sender.email === senderEmail ?  "end" : "start" ;

    return <Message key={id} justify={messageChecker} message={message} />;
  });

  return (
    <div className="relative w-full h-[calc(100vh_-_197px)] p-6 overflow-y-auto flex flex-col-reverse">
      <ul className="space-y-2">{messageRender}</ul>
    </div>
  );
}
