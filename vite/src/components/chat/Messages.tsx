function Messages(props: { message: string; author: string; avatar: string }) {
  if (props.author === 'you') {
    return (
      <div className="flex justify-end mb-4">
        <div className="mr-2 py-3 px-4 dark:bg-blue-800 bg-rose-100 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl dark:text-white text-black max-w-[50%]">
          {props.author}
          <p className="break-words">{props.message}</p>
        </div>
        <img src={props.avatar} className="object-cover h-8 w-8 rounded-full" />
      </div>
    );
  } else {
    return (
      <div className="flex justify-start mb-4">
        <img src={props.avatar} className="object-cover h-8 w-8 rounded-full" />
        <div className="ml-2 py-3 px-4 bg-gray-400 rounded-br-3xl rounded-tr-3xl rounded-tl-xl text-white">
          {props.message}
        </div>
      </div>
    );
  }
}

export default Messages;
