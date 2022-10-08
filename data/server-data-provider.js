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
// Find all the 'listItems' in the 'main' Collection
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
export async function getTodoListItems() {
  if (useDummyFallbackImplementation) {
    return __dummy_getTodoListItems();
  }

  // Connect to the MongoDB Database
  console.log('[SERVER] Connecting to the database...');
  try {
    await client.connect();
    console.log('[SERVER] Successfully connected!');

    // Find all the Documents in the main Collection
    const db = client.db(todoListDBName);
    const collection = db.collection(todoListMainCollectionName);
    const cursor = collection.find();

    const todoListItems = await _getTodoListItems(collection, cursor, "Today");

    // Return the 'listItems' array
    return todoListItems;
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

//-----------------------------------------------------------------------------
// Dummy fallback implementation
function __dummy_getTodoListItems() {
  // Find all the Documents in the dummy Collection
  // Return the results
  return defaultTodoListItems;
}

//-----------------------------------------------------------------------------
// Find all the 'listItems' in the Collection (private helper)
async function _getTodoListItems(collection, cursor, listTitle) {
  console.log(`[SERVER] Finding all the items in the '${listTitle}'s list...`);
  const todoListItems = [];

  await cursor.forEach((item) => {
    todoListItems.push(item);
  });

  if (todoListItems.length) {
    // Return the results
    console.log(`[SERVER] Found ${todoListItems.length} items in the '${listTitle}'s list.`);
    return todoListItems;
  }
  else {
    // If the collection is empty, return the default "Welcome Pack" Documents
    await _populateTodoListMany(collection, defaultTodoListItems, listTitle);

    console.log(`[SERVER] Returning the default "Welcome pack" items for the '${listTitle}'s list.`);
    return defaultTodoListItems;
  }

}


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Insert a 'simpleListItem' in the 'main' Collection
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
export async function postTodoListItem(simpleListItem) {
  if (useDummyFallbackImplementation) {
    return __dummy_postTodoListItem(simpleListItem);
  }

  // Connect to the MongoDB Database
  console.log('[SERVER] Connecting to the database...');
  try {
    await client.connect();
    console.log('[SERVER] Successfully connected!');

    // Insert the Document 'simpleListItem' in the main Collection
    const db = client.db(todoListDBName);
    const collection = db.collection(todoListMainCollectionName);

    const result = await collection.insertOne(simpleListItem);

    // Returns a full 'listItem' with its final _id
    let insertedListItem = { ...simpleListItem };
    insertedListItem._id = result.insertedId;
    return insertedListItem;
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

//-----------------------------------------------------------------------------
// Dummy fallback implementation
function __dummy_postTodoListItem(simpleListItem) {
  // Insert the Document 'simpleListItem' in the correct Collection
  const listItem = {
    _id: defaultTodoListItems.length,
    ...simpleListItem,
  };
  defaultTodoListItems.push(listItem);
  return listItem;
}

//-----------------------------------------------------------------------------
// Insert all the 'listItems' into the Collection (private helper)
async function _populateTodoListMany(collection, listItems, listTitle) {
  console.log(`[SERVER] Inserting the items in the '${listTitle}'s list...`);

  const result = await collection.insertMany(listItems);
  return result.insertedIds.length;
}


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Delete the 'listItem._id' from the 'main' Collection
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
export async function deleteTodoListItem(itemId) {
  if (useDummyFallbackImplementation) {
    return __dummy_deleteTodoListItem(itemId);
  }

  // Connect to the MongoDB Database
  console.log('[SERVER] Connecting to the database...');
  try {
    await client.connect();
    console.log('[SERVER] Successfully connected!');

    const db = client.db(todoListDBName);
    const collection = db.collection(todoListMainCollectionName);

    // Delete the 'listItem._id' from the main Collection
    const listItem = await _deleteTodoListItem(collection, itemId, "Today");

    // Return the deleted full 'listItem'
    return listItem;
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

//-----------------------------------------------------------------------------
// Dummy fallback implementation
function __dummy_deleteTodoListItem(itemId) {
  // Delete the Document 'listItem._id' from the correct Collection
  defaultTodoListItems = defaultTodoListItems.filter((item) => (item._id !== itemId));
  return { itemId };
}

//-----------------------------------------------------------------------------
// Delete the Document 'listItem._id' from the Collection (private helper)
async function _deleteTodoListItem(collection, itemId, listTitle) {
  console.log(`[SERVER] Deleting the item from the '${listTitle}'s list...`);

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
// Insert a new Custom List
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
export async function postCustomList(simpleCustomList) {
  // Connect to the MongoDB Database
  console.log('[SERVER] Connecting to the database...');
  try {
    await client.connect();
    console.log('[SERVER] Successfully connected!');

    // Insert the new Custom List in the 'customList' Collection
    // <<TODO>> Avoid duplications!
    const db = client.db(todoListDBName);
    const collection = db.collection(todoListCustomCollectionName);

    const newCustomList = {
      ...simpleCustomList,
      todoList: [],
    };

    const result = await collection.insertOne(newCustomList);
    let insertedCustomList = { ...newCustomList };
    insertedCustomList._id = result.insertedId;
    return insertedCustomList;
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
// Delete the Custom List
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
export async function deleteCustomList(listId) {
  // Connect to the MongoDB Database
  console.log('[SERVER] Connecting to the database...');
  try {
    await client.connect();
    console.log('[SERVER] Successfully connected!');

    // Delete the Custom List from the 'customList' Collection
    const db = client.db(todoListDBName);
    const collection = db.collection(todoListCustomCollectionName);

    const result = await collection.findOneAndDelete(
      { listId: listId },
      { projection: { todoList: 0 } }
    );
    console.log('[DEBUG] findOneAndDelete:', result);
    const deletedCustomList = result.value;
    return deletedCustomList;
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
