import { Menu } from '@headlessui/react';
import { Transition } from '@headlessui/react';

function MyMenu(props: {
  channelName: string;
  changeNameDialog: any;
  setChangeNameDialog: any;
  addSomeoneDialog: any;
  setAddSomeoneDialog: any;
  listOfUsersDialog: any;
  setListOfUsersDialog: any;
  leaveChannelDialog: any;
  setLeaveChannelDialog: any;
}) {
  {
    return (
      <div className="flex">
        <div className="relative inline-block">
          <Menu>
            {({ open }) => (
              <>
                <span className="rounded-md shadow-sm">
                  <Menu.Button className="inline-flex justify-center w-full px-4 py-2 text-sm transition duration-150 dark:bg-gray-900 bg-rose-100 dark:border border-gray-700 dark:text-gray-200 text-black rounded-md hover:text-gray-500 focus:outline-none focus:border-gray-4 	00 focus:shadow-outline-blue active:bg-blue-200 active:text-gray-800">
                    <span>Options</span>
                    <svg
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-0"
                    ></svg>
                  </Menu.Button>
                </span>

                <Transition
                  show={open}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items
                    static
                    className="absolute w-56 right-0 mt-2 origin-top-right dark:bg-gray-950 bg-rose-100 dark:border border-gray-700 rounded-md shadow-lg outline-none"
                  >
                    <div className="px-4 py-3 border-b-2 dark:border-gray-700 border-amber-300 dark:text-gray-400 text-gray-900">
                      <p className="text-sm truncate">
                        Settings :{' '}
                        <a className="text-blue-500">{props.channelName}</a>
                      </p>
                    </div>

                    <div className="py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            className={`${
                              active
                                ? 'dark:bg-gray-700 bg-rose-200 dark:text-gray-200 text-gray-900'
                                : 'dark:text-gray-400 text-gray-900'
                            } flex justify-between w-full px-4 py-2 text-sm leading-5 text-left`}
                            onClick={() => {
                              props.setChangeNameDialog(true);
                            }}
                          >
                            Change the name of {props.channelName}
                          </button>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#add_user"
                            className={`${
                              active
                                ? 'dark:bg-gray-700 bg-rose-200 dark:text-gray-200 text-gray-900'
                                : 'dark:text-gray-400 text-gray-900'
                            } flex justify-between w-full px-4 py-2 text-sm leading-5 text-left`}
                            onClick={() => {
                              props.setAddSomeoneDialog(true);
                            }}
                          >
                            Add someone to {props.channelName}
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#list_user"
                            className={`${
                              active
                                ? 'dark:bg-gray-700 bg-rose-200 dark:text-gray-200 text-gray-900'
                                : 'dark:text-gray-400 text-gray-900'
                            } flex justify-between w-full px-4 py-2 text-sm leading-5 text-left`}
                            onClick={() => {
                              props.setListOfUsersDialog(true);
                            }}
                          >
                            List of users in {props.channelName}
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#leave_channel"
                            className={`${
                              active
                                ? 'dark:bg-gray-700 bg-rose-200 dark:text-gray-200 text-gray-900'
                                : 'dark:text-gray-400 text-gray-900'
                            } flex justify-between w-full px-4 py-2 text-sm leading-5 text-left`}
                            onClick={() => {
                              props.setLeaveChannelDialog(true);
                            }}
                          >
                            Leave {props.channelName}
                          </a>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </>
            )}
          </Menu>
        </div>
      </div>
    );
  }
}

export default MyMenu;
