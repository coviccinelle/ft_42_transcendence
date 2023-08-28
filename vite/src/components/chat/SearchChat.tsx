function SearchChat(props: {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
}) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    props.setSearch(e.target.value);
  };

  return (
    <div className="border-b-2 border-t-2 py-4 px-2 border-gray-950">
      <input
        type="text"
        placeholder="Search"
        value={props.search}
        onChange={handleChange} // find how to change the display of the chat tabs
        className="py-2.5 dark:py-2 px-2 dark:border-2 dark:border-gray-950 rounded-2xl w-full dark:bg-gray-950 bg-rose-100 dark:text-white text-black focus:outline-none focus:ring-2 focus:ring-sky-950 focus:border-transparent"
      />
    </div>
  );
}

export default SearchChat;
