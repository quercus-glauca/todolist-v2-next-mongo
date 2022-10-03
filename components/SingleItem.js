export default function SingleItem(props) {
  const { 
    listId,            // like 'listTitle' but kebab-case and URL safe
    listItem,          // full listItem with ._id
    onDeleteItem,      // callback to parent component
  
  } = props;

  function handleCheckboxChange(event) {
    event.preventDefault();
    onDeleteItem(listItem._id, listId);
  }

  return (
    <div className="item">
      <input
        type="checkbox"
        name="delete"
        value={listItem._id}
        onChange={handleCheckboxChange}
      />
      <p>{listItem.text}</p>
    </div>
  );
}