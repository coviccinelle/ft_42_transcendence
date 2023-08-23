function User(props: { user: any; onClick: any }) {
  return (
    <div
      className="flex flex-row py-4 px-2 items-center dark:hover:bg-gray-600 cursor-pointer dark:text-white text-gray-900 hover:bg-rose-300"
      onClick={props.onClick}
    >
      <div className="w-1/4">
        <img
          src={props.user.avatar}
          className="object-cover h-12 w-12 rounded-full"
          alt=""
        />
      </div>
      <div className="w-full">
        <div className="text-lg font-semibold">{props.user.name}</div>{' '}
      </div>
    </div>
  );
}

export default User;
