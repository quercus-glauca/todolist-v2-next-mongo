const sampleSimpleListItem  = {
  date: new Date(),
  text: "Sample List Item",
};

const sampleListItem  = {
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

const defaultTodoListItems = [
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
  
  // Dummy fallback implementation
  return defaultTodoListItems;
}

export async function postTodoListItem(simpleListItem, listId) {
  // Connect to the MongoDB Database
  // Insert the Document 'simpleListItem' in the correct Collection
  
  // Dummy fallback implementation
  const listItem = {
    _id: defaultTodoListItems.length,
    ...simpleListItem,
  };
  defaultTodoListItems.push(listItem);
}

export async function deleteTodoListItem(listItem, listId) {
  // Connect to the MongoDB Database
  // Delete the Document 'simpleListItem' from the correct Collection

  return NOT_IMPL;    
}
