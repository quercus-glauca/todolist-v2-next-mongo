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

    const todoListItems = await _getTodoListItems(collection, cursor);

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
async function _getTodoListItems(collection, cursor) {
  console.log(`[SERVER] Finding all the items in the 'Today's list...`);
  const todoListItems = [];

  await cursor.forEach((item) => {
    todoListItems.push(item);
  });

  if (todoListItems.length) {
    // Return the results
    console.log(`[SERVER] Found ${todoListItems.length} items in the 'Today's list.`);
    return todoListItems;
  }
  else {
    // If the collection is empty, return the default "Welcome Pack" Documents
    const result = await collection.insertMany(defaultTodoListItems);
    console.log('[MONGODB] result:', result);
    console.log(`[SERVER] Returning the default "Welcome pack" ${result.insertedIds.length} items for the 'Today's list.`);
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

    console.log(`[SERVER] Inserting a new item into the 'Today's list...`);
    const result = await collection.insertOne(simpleListItem);
    console.log('[MONGODB] result:', result);

    // Return a full 'listItem' with its final _id
    console.log(`[SERVER] Inserted the new item '${result.insertedId}' into the 'Today's list...`);
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

    // Delete the 'listItem._id' from the main Collection
    const db = client.db(todoListDBName);
    const collection = db.collection(todoListMainCollectionName);

    console.log(`[SERVER] Deleting the item '${itemId}' from the 'Today's list...`);
    const queryFilter = {
      _id: (typeof itemId === "string" && itemId.length === 24)
        ? new ObjectId(itemId)
        : itemId
    };
    const result = await collection.findOneAndDelete(queryFilter);
    console.log('[MONGODB] result:', result);

    // Return the deleted full 'listItem'
    const deletedListItem = result.value;
    return deletedListItem;
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
    console.log(`[SERVER] Found ${customLists.length} custom lists.`);
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

    console.log(`[SERVER] Inserting the '${simpleCustomList.listId}' list into the custom lists...`);
    const result = await collection.insertOne(newCustomList);
    console.log('[MONGODB] result:', result);

    // Return the full 'customList' with its final _id
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

    console.log(`[SERVER] Deleting the '${listId}' list from the custom lists...`);
    const queryFilter = { listId };
    const optionalSettings = {
      projection: {
        todoList: 0
      }
    };
    const result = await collection.findOneAndDelete(queryFilter, optionalSettings);
    console.log('[MONGODB] result:', result);

    // Return the deleted full 'customList'
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


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Find all the nested 'listItems' in a 'customList'
// identified by its 'listId' in the 'customLists' collection
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
export async function getCustomTodoListItems(listId) {
  // Connect to the MongoDB Database
  console.log('[SERVER] Connecting to the database...');
  try {
    await client.connect();
    console.log('[SERVER] Successfully connected!');

    // Find all the nested Documents in the custom Collection Document
    const db = client.db(todoListDBName);
    const collection = db.collection(todoListCustomCollectionName);

    console.log(`[SERVER] Finding all the items in the '${listId}'s list...`);
    const queryFilter = { listId };
    const cursor = collection.find(queryFilter);
    let listItems = null;
    await cursor.forEach((item) => {
      listItems = item.todoList;
    });

    // Return the results
    if (listItems) {
      console.log(`[SERVER] Found ${listItems.length} items in the '${listId}'s list.`);
    }
    else {
      console.log(`[SERVER] The list '${listId}' does not exist!`);
    }
    return listItems;
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
// Insert a nested 'simpleListItem' into a 'customList'
// identified by its 'listId' in the 'customLists' collection
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
export async function postCustomTodoListItem(listId, simpleListItem) {
  // Connect to the MongoDB Database
  console.log('[SERVER] Connecting to the database...');
  try {
    await client.connect();
    console.log('[SERVER] Successfully connected!');

    // Insert the nested Document in the custom Collection Document
    const db = client.db(todoListDBName);
    const collection = db.collection(todoListCustomCollectionName);

    console.log(`[SERVER] Inserting a new item into the '${listId}'s list...`);
    const queryFilter = { listId };
    const insertedListItem = {
      _id: new ObjectId(),
      ...simpleListItem,
    };
    const updateOperations = {
      $push: {
        todoList: insertedListItem
      }
    };
    const result = await collection.updateOne(queryFilter, updateOperations);
    console.log('[MONGODB] result:', result);

    // Return a full 'listItem' with its final _id
    console.log(`[SERVER] Inserted the new item '${insertedListItem._id}' into the '${listId}'s list...`);
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


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Delete a nested 'simpleListItem' from a 'customList'
// identified by its 'listId' in the 'customLists' collection
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
export async function deleteCustomTodoListItem(listId, itemId) {
  // Connect to the MongoDB Database
  console.log('[SERVER] Connecting to the database...');
  try {
    await client.connect();
    console.log('[SERVER] Successfully connected!');

    // Delete the nested Document from the custom Collection Document
    const db = client.db(todoListDBName);
    const collection = db.collection(todoListCustomCollectionName);

    console.log(`[SERVER] Deleting the item '${itemId}' from the '${listId}'s list...`);
    const queryFilter = { listId };
    const deletedListItem = {
      _id: (typeof itemId === "string" && itemId.length === 24)
        ? new ObjectId(itemId)
        : itemId
    };
    const updateOperations = {
      $pull: {
        todoList: deletedListItem
      }
    };
  const result = await collection.updateOne(queryFilter, updateOperations);
  console.log('[MONGODB] result:', result);

  // Return the deleted full 'listItem'
  return deletedListItem;
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
