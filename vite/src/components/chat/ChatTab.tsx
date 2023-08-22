function ChatTab(props: {
  name: string;
  lastMessage: string;
  avatar: string;
  id: number;
  setCurrentChannel: React.Dispatch<React.SetStateAction<number>>;
}) {
  return (
    <div
      className="flex flex-row py-4 px-2 items-center dark:text-white text-black border-b-2 border-gray-950 dark:hover:bg-gradient-to-r hover:bg-gradient-to-r dark:hover:from-sky-950 hover:from-amber-300 dark:hover:to-violet-900 hover:to-rose-300 cursor-pointer"
      onClick={() => {
        props.setCurrentChannel(props.id);
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
        <span className="dark:text-gray-300 text-gray-800">
          {props.lastMessage}
        </span>{' '}
      </div>
    </div>
  );
}

export default ChatTab;
