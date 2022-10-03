const sampleSimpleListItem = {
  date: new Date(),
  text: "Sample List Item",
};

const sampleListItem = {
  _id: 0,
  date: new Date(),
  text: "Sample List Item",
};

const defaultSimpleTodoListItems = [
  {
    date: new Date(),
    text: "Welcome to your ToDo list!",
  },
  {
    date: new Date(),
    text: "Click the '+' button to add a new item.",
  },
  {
    date: new Date(),
    text: "← Check here to delete the item.",
  },
];

let defaultTodoListItems = [
  {
    _id: 0,
    date: new Date(),
    text: "Welcome to your ToDo list!",
  },
  {
    _id: 1,
    date: new Date(),
    text: "Click the '+' button to add a new item.",
  },
  {
    _id: 2,
    date: new Date(),
    text: "← Check here to delete the item.",
  },
];

const serverUri = 'mongodb://localhost:27017';
const todoListDBName = 'todoListDB';                       // `db`
const todoListMainCollectionName = 'listItems';            // `mainCol`
const todoListCustomCollectionName = 'customListItems';    // `customCol`

export async function getTodoListItems(listId) {
  // Connect to the MongoDB Database
  // Find all the Documents in the correct Collection
  // Return the results
  // <<TODO>>

  // Dummy fallback implementation
  return defaultTodoListItems;
}

export async function postTodoListItem(simpleListItem, listId) {
  // Connect to the MongoDB Database
  // Insert the Document 'simpleListItem' in the correct Collection
  // <<TODO>>

  // Dummy fallback implementation
  const listItem = {
    _id: defaultTodoListItems.length,
    ...simpleListItem,
  };
  defaultTodoListItems.push(listItem);
  return listItem;
}

export async function deleteTodoListItem(itemId, listId) {
  // Connect to the MongoDB Database
  // Delete the Document 'listItem._id' from the correct Collection
  // <<TODO>>

  // Dummy fallback implementation
  defaultTodoListItems = defaultTodoListItems.filter((item) => (item._id !== itemId));
  return { itemId };
}
