import { useContacts } from "../context/ContactsContext";

const SearchBox = () => {
  const { actions } = useContacts();

  return (
    <input
      placeholder="جستجو..."
      onChange={(e) => actions.setSearch(e.target.value)}
      style={{ marginBottom: "1rem", width: "100%", padding: "0.5rem" }}
    />
  );
};

export default SearchBox;
