import apiUser from '../../../api/chat/user';

function User(props: {
  user: any;
  onClick: any;
  listOfUsersDialog: boolean;
  channelId: number;
  userMe: any;
  role: string;
  dialog: any;
  adminDialog: boolean;
}) {
  if (!props.user.picture) {
    props.user.picture = 'https://i.imgur.com/6VBx3io.png';
  }
  return (
    <div className="flex flex-row">
      {props.user.id !== props.userMe.id && (
        <div
          className="flex flex-row py-4 px-2 items-center dark:hover:bg-gray-600 cursor-pointer dark:text-white text-gray-900 hover:bg-rose-300 w-full"
          onClick={props.onClick}
        >
          <div className="w-1/4">
            <img
              src={props.user.picture}
              className="object-cover h-12 w-12 rounded-full"
            />
          </div>
          <div className="w-full">
            <div className="textLg font-semibold">{props.user.firstName}</div>{' '}
          </div>
        </div>
      )}
      {props.listOfUsersDialog &&
        props.user.id !== props.userMe.id &&
        (props.role === 'OWNER' || props.role === 'ADMIN') &&
        props.user.members[0].role !== 'OWNER' && (
          <div className="flex flex-row space w-1/4 justify-center py-7">
            <div
              className="flex cursor-pointer"
              onClick={async () => {
                await apiUser.muteUser(props.channelId, props.user.id, 60);
                props.dialog(false);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6 dark:text-white text-gray-900"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6l4.72-4.72a.75.75 0 011.28.531V19.94a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.506-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.395C2.806 8.757 3.63 8.25 4.51 8.25H6.75z"
                />
              </svg>
            </div>
            <div
              className="flex cursor-pointer"
              onClick={async () => {
                await apiUser.kickUser(props.channelId, props.user.id);
                props.dialog(false);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6 dark:text-white text-gray-900"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <div
              className="flex cursor-pointer"
              onClick={async () => {
                apiUser.banUser(props.channelId, props.user.id);
                props.dialog(false);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6 dark:text-white text-gray-900"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                />
              </svg>
            </div>
          </div>
        )}
      {props.adminDialog &&
        props.role === 'OWNER' &&
        props.user.id !== props.userMe.id &&
        props.user.members[0].role !== 'ADMIN' && (
          <div className="flex flex-row space w-1/4 justify-center py-7">
            <div
              className="flex cursor-pointer"
              onClick={async () => {
                await apiUser.promoteAdmin(props.channelId, props.user.id);
                props.dialog(false);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6 dark:text-white text-gray-900"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
            </div>
          </div>
        )}
      {props.adminDialog &&
        props.role === 'OWNER' &&
        props.user.id !== props.userMe.id &&
        props.user.members[0].role === 'ADMIN' && (
          <div className="flex flex-row space w-1/4 justify-center py-7">
            <div
              className="flex cursor-pointer"
              onClick={async () => {
                await apiUser.demoteAdmin(props.channelId, props.user.id);
                props.dialog(false);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6 dark:text-white text-gray-900"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 12h-15"
                />
              </svg>
            </div>
          </div>
        )}
    </div>
  );
}

export default User;
