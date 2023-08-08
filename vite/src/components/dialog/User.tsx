function User(props: { user: any }) {
  return (
    <div
      className="flex flex-row py-4 px-2 items-center hover:bg-gray-600 cursor-pointer"
      onClick={() => {
        console.log('Go to user profile');
      }}
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
