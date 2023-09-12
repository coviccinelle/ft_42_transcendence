import { useNavigate } from 'react-router-dom';

function Message(props: {
  role: string;
  message: string;
  author: string;
  avatar: string;
  id: number;
  user: any;
}) {
  const navigate = useNavigate();
  let avatar = props.avatar;
  if (!props.avatar) {
    avatar = 'https://i.imgur.com/6VBx3io.png';
  }
  if (props.id === props.user?.id) {
    return (
      <div className="flex justify-end mb-4">
        <div className="mr-2 py-3 px-4 dark:bg-blue-800 bg-rose-100 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl dark:text-white text-black max-w-[50%]">
          {props.author}
          <p className="break-all">{props.message}</p>
        </div>
        <img
          src={avatar}
          className="object-cover h-8 w-8 rounded-full hover:opacity-80 cursor-pointer"
          onClick={() => {
            return navigate('/profile');
          }}
        />
      </div>
    );
  } else {
    return (
      <div className="flex justify-start mb-4">
        <img
          src={avatar}
          className="object-cover h-8 w-8 rounded-full hover:opacity-80 cursor-pointer"
          onClick={() => {
            return navigate(`/profile/${props.id}`);
          }}
        />
        <div className="ml-2 py-3 px-4 bg-purple-200 dark:bg-gray-400 rounded-br-3xl rounded-tr-3xl rounded-tl-xl dark:text-white text-black max-w-[50%]">
          {props.author}
          <p className="break-words">{props.message}</p>
        </div>
      </div>
    );
  }
}

export default Message;
