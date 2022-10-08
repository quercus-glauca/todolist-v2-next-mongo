export { getListTitleFromListId, getListIdFromListTitle } from "./some-data-helpers";

import { MongoClient, ObjectId } from "mongodb";
import _ from "lodash";

const useDummyFallbackImplementation = false;
const mongodbServerUri = process.env.MONGODB_LOCALSERVER_URI;
const client = new MongoClient(mongodbServerUri);
const todoListDBName = 'todoListDB';
const todoListMainCollectionName = 'listItems';
const todoListCustomCollectionName = 'customLists';


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Collection: 'listItems' 
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// A sample single item without _id
const sampleSimpleListItem = {
  date: new Date(),
  text: "Welcome to your ToDo list!",
};

// A sample single full item (our MongoDB basic Document)
const sampleListItem = {
  _id: 0,
  date: new Date(),
  text: "Welcome to your ToDo list!",
};

// Default "Welcome Pack" items (our MongoDB basic Collection content)
let defaultTodoListItems = [
  sampleListItem,
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


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Collection: 'customLists' 
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const sampleCustomList = {
  _id: new ObjectId(),
  date: new Date(),
  listId: "url-friendly-title",
  listTitle: "User Friendly Title",
  todoList: [],
};


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Find all the Documents in the correct Collection
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
export async function getTodoListItems(listId) {
  if (useDummyFallbackImplementation) {
    return __dummy_getTodoListItems(listId);
  }

  // Connect to the MongoDB Database
  // Find all the Documents in the correct Collection
  // Return the results
  console.log('[SERVER] Connecting to the database...');
  try {
    await client.connect();
    console.log('[SERVER] Successfully connected!');

    const db = client.db(todoListDBName);
    const collection = _getTodoListCollection(db, listId);
    const cursor = collection.find();

    if (!listId) {
      // Find all the Documents in the main Collection
      const todoListItems = await _getTodoListMainCollectionItems(collection, cursor);
      return todoListItems;
    }
    else {
      // Find all the Documents in the custom Collection
      const todoListItems = await _getTodoListCustomCollectionItems(collection, cursor, listId);
      return todoListItems;
    }

  }
  catch (error) {
    console.log('[SERVER] Error:', error);
  }
  finally {
    // Ensures that the client will close when you finish/error
    await client.close();
    console.log('[SERVER] Connection closed.');
  }
}

// Dummy fallback implementation
function __dummy_getTodoListItems(listId) {
  // Find all the Documents in the dummy Collection
  // Return the results
  return defaultTodoListItems;
}

// Helper
function _getTodoListCollection(db, listId) {
  const todoListCollectionName = !listId
    ? todoListMainCollectionName
    : todoListCustomCollectionName;
  const collection = db.collection(todoListCollectionName);
  return collection;
}

// Find all the Documents in the main Collection
async function _getTodoListMainCollectionItems(collection, cursor) {
  console.log('[SERVER] Finding all the items in the main collection...');
  const todoListItems = [];

  await cursor.forEach((item) => {
    todoListItems.push(item);
  });

  if (todoListItems.length) {
    // Return the results
    console.log('[SERVER] Found', todoListItems.length, 'list items in the main collection.');
    return todoListItems;
  }
  else {
    // If the collection is empty, return the default "Welcome Pack" Documents
    await _populateTodoListMainCollectionMany(collection, defaultTodoListItems);

    console.log('[SERVER] Returning the default "Welcome pack" list items for the main collection.');
    return defaultTodoListItems;
  }

}

// Find all the Documents in the custom Collection
async function _getTodoListCustomCollectionItems(collection, cursor, listId) {
  console.log('[SERVER] Finding all the items in the custom collection...');

  // <<TODO>>
}


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Insert the Document 'simpleListItem' in the correct Collection
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
export async function postTodoListItem(simpleListItem, listId) {
  if (useDummyFallbackImplementation) {
    return __dummy_postTodoListItem(simpleListItem, listId);
  }

  // Connect to the MongoDB Database
  // Insert the Document 'simpleListItem' in the correct Collection
  console.log('[SERVER] Connecting to the database...');
  try {
    await client.connect();
    console.log('[SERVER] Successfully connected!');

    const db = client.db(todoListDBName);
    const collection = _getTodoListCollection(db, listId);

    if (!listId) {
      // Insert the Document 'simpleListItem' in the main Collection
      // Returns a full 'listItem' with its final _id
      const listItem = await _populateTodoListMainCollection(collection, simpleListItem);
      return listItem;
    }
    else {
      // Insert the Document 'simpleListItem' in the custom Collection
      // Returns a full 'listItem' with its final _id
      const listItem = await _populateTodoListCustomCollection(collection, simpleListItem, listId);
      return listItem;
    }
  }
  catch (error) {
    console.log('[SERVER] Error:', error);
  }
  finally {
    // Ensures that the client will close when you finish/error
    await client.close();
    console.log('[SERVER] Connection closed.');
  }
}

// Dummy fallback implementation
function __dummy_postTodoListItem(simpleListItem, listId) {
  // Insert the Document 'simpleListItem' in the correct Collection
  const listItem = {
    _id: defaultTodoListItems.length,
    ...simpleListItem,
  };
  defaultTodoListItems.push(listItem);
  return listItem;
}

// Insert the Document 'listItem' in the main Collection
async function _populateTodoListMainCollection(collection, listItem) {
  console.log('[SERVER] Inserting the item in the main collection...');

  const result = await collection.insertOne(listItem);
  let insertedListItem = { ...listItem };
  insertedListItem._id = result.insertedId;
  return insertedListItem;
}

async function _populateTodoListMainCollectionMany(collection, listItems) {
  console.log('[SERVER] Inserting the items in the main collection...');

  const result = await collection.insertMany(listItems);
  return result.insertedIds.length;
}

// Insert the Document 'listItem' in the custom Collection
async function _populateTodoListCustomCollection(collection, listItem, listId) {
  console.log('[SERVER] Inserting the item in the custom collection...');
  // <<TODO>>
}

async function _populateTodoListCustomCollectionMany(collection, listItems, listId) {
  console.log('[SERVER] Inserting the items in the custom collection...');
  // <<TODO>>
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Delete the Document 'listItem._id' from the correct Collection
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
export async function deleteTodoListItem(itemId, listId) {
  if (useDummyFallbackImplementation) {
    return __dummy_deleteTodoListItem(itemId, listId);
  }

  // Connect to the MongoDB Database
  // Delete the Document 'listItem._id' from the correct Collection
  console.log('[SERVER] Connecting to the database...');
  try {
    await client.connect();
    console.log('[SERVER] Successfully connected!');

    const db = client.db(todoListDBName);
    const collection = _getTodoListCollection(db, listId);

    if (!listId) {
      // Delete the Document 'listItem._id' from the main Collection
      // Returns the deleted full 'listItem'
      const listItem = await _deleteTodoListMainCollection(collection, itemId);
      return listItem;
    }
    else {
      // Delete the Document 'listItem._id' from the custom Collection
      // Returns the deleted full 'listItem'
      console.log('[SERVER] Deleting the item from the custom collection...');
      const listItem = await _deleteTodoListCustomCollection(collection, itemId, listId);
      return listItem;
    }
  }
  catch (error) {
    console.log('[SERVER] Error:', error);
  }
  finally {
    // Ensures that the client will close when you finish/error
    await client.close();
    console.log('[SERVER] Connection closed.');
  }
}

// Dummy fallback implementation
function __dummy_deleteTodoListItem(itemId, listId) {
  // Delete the Document 'listItem._id' from the correct Collection
  defaultTodoListItems = defaultTodoListItems.filter((item) => (item._id !== itemId));
  return { itemId };
}

// Delete the Document 'listItem._id' from the main Collection
async function _deleteTodoListMainCollection(collection, itemId) {
  console.log('[SERVER] Deleting the item from the main collection...');

  const queryFilter = {
    _id: (typeof itemId === "string" && itemId.length === 24)
      ? new ObjectId(itemId)
      : itemId
  };
  const result = await collection.findOneAndDelete(queryFilter);
  console.log('[DEBUG] findOneAndDelete:', result);
  const deletedListItem = result.value;
  return deletedListItem;
}

// Delete the Document 'listItem._id' from the custom Collection
async function _deleteTodoListCustomCollection(collection, simpleListItem, listId) {
  console.log('[SERVER] Deleting the item from the custom collection...');
  // <<TODO>>
}


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Find all the Custom Lists
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
export async function getCustomLists() {
  // Connect to the MongoDB Database
  console.log('[SERVER] Connecting to the database...');
  try {
    await client.connect();
    console.log('[SERVER] Successfully connected!');
    
    // Find all the Custom Lists in the 'customList' Collection
    const db = client.db(todoListDBName);
    const collection = db.collection(todoListCustomCollectionName);
    const cursor = collection.find().project({ todoList: 0 });
    const customLists = [];
    await cursor.forEach((item) => {
      customLists.push(item);
    });
    
    // Return the results
    console.log('[SERVER] Found', customLists.length, 'custom lists.');
    return customLists;
  }
  catch (error) {
    console.log('[SERVER] Error:', error);
  }
  finally {
    // Ensures that the client will close when you finish/error
    await client.close();
    console.log('[SERVER] Connection closed.');
  }
}


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Insert a new Custom Lists
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
export async function postCustomList(simpleCustomList) {
  // <<TODO>>
  return NOT_IMPL;
}


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Delete the Custom Lists
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
export async function deleteCustomList(listId) {
  // <<TODO>>
  return NOT_IMPL;
}
