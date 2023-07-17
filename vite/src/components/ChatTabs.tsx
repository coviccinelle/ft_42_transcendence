function ChatTabs(props: {
  name: string;
  lastMessage: string;
  avatar: string;
}) {
  return (
    <div
      className="flex flex-row py-4 px-2 items-center border-b-2"
      onClick={() => {
        console.log('display chat');
      }}
    >
      <div className="w-1/4">
        <img
          src={props.avatar} // image from group chat or other user
          className="object-cover h-12 w-12 rounded-full"
          alt=""
        />
      </div>
      <div className="w-full">
        <div className="text-lg font-semibold">{props.name}</div>{' '}
        <span className="text-gray-500">{props.lastMessage}</span>{' '}
      </div>
    </div>
  );
}

export default ChatTabs;
