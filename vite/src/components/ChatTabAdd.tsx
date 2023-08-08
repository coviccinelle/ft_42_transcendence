import { useState } from 'react';
import CreateChannelDialog from './dialog/CreateChannelDialog';

function ChatTabAdd(props: {
  channels: any;
  setChannels: React.Dispatch<React.SetStateAction<any>>;
}) {
  const [createChannelDialog, setCreateChannelDialog] = useState(false);
  return (
    <div
      className="flex flex-row py-4 px-2 items-center text-white border-b-2 border-gray-700 hover:bg-gradient-to-r hover:from-sky-950 hover:to-violet-900 cursor-pointer"
      onClick={() => {
        console.log('Add a chat');
        setCreateChannelDialog(true);
      }}
    >
      <div className="w-1/4">
        <img
          src={
            'https://cdn.icon-icons.com/icons2/495/PNG/512/add-circle-1_icon-icons.com_48714.png'
          } // image from group chat or other user
          className="object-cover h-12 w-12 rounded-full"
          alt=""
        />
      </div>
      <div className="w-full">
        <div className="text-lg font-semibold">{'Create a new channel'}</div>{' '}
      </div>
      <CreateChannelDialog
        createChannelDialog={createChannelDialog}
        setCreateChannelDialog={setCreateChannelDialog}
        channels={props.channels}
        setChannels={props.setChannels}
      />
    </div>
  );
}

export default ChatTabAdd;
