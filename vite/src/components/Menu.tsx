import { Menu } from '@headlessui/react';
import { Transition } from '@headlessui/react';
import MyDialog from './Modal';
import { useState } from 'react';

function MyMenu(props: { channelName: string }) {
  {
    return (
      <div className="flex">
        <div className="relative inline-block">
          <Menu>
            {({ open }) => (
              <>
                <span className="rounded-md shadow-sm">
                  <Menu.Button className="inline-flex justify-center w-full px-4 py-2 text-sm transition duration-150 bg-white border border-gray-300 rounded-md hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800">
                    <span>Options</span>
                    <svg viewBox="0 0 20 20" fill="currentColor"></svg>
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
                    className="absolute w-56 right-0 mt-2 origin-top-right bg-white border border-gray-200 rounded-md shadow-lg outline-none"
                  >
                    <div className="gap-1 px-4 py-3 border-b-2">
                      <p className="text-sm">Settings for :</p>
                      <p className="text-sm font-medium leading-5 text-blue-500">
                        {props.channelName}
                      </p>
                    </div>

                    <div className="py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            className={`${
                              active
                                ? 'bg-gray-100 text-gray-900'
                                : 'text-gray-700'
                            } flex justify-between w-full px-4 py-2 text-sm leading-5 text-left`}
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
                                ? 'bg-gray-100 text-gray-900'
                                : 'text-gray-700'
                            } flex justify-between w-full px-4 py-2 text-sm leading-5 text-left`}
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
                                ? 'bg-gray-100 text-gray-900'
                                : 'text-gray-700'
                            } flex justify-between w-full px-4 py-2 text-sm leading-5 text-left`}
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
                                ? 'bg-gray-100 text-gray-900'
                                : 'text-red-400'
                            } flex justify-between w-full px-4 py-2 text-sm leading-5 text-left`}
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
