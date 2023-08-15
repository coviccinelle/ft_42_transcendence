function SearchChat(props: {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
}) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    props.setSearch(e.target.value);
  };

  return (
    <div className="border-b-2 py-4 px-2 border-gray-700">
      <input
        type="text"
        placeholder="Search Chat"
        value={props.search}
        onChange={handleChange} // find how to change the display of the chat tabs
        className="py-2 px-2 border-2 border-gray-700 rounded-2xl w-full bg-gray-950 text-white"
      />
    </div>
  );
}

export default SearchChat;
