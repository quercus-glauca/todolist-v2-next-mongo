export { getListTitleFromListId, getListIdFromListTitle } from "../helpers/some-data-helpers";

import { MongoClient, ObjectId } from "mongodb";
import _ from "lodash";

const useDummyFallbackImplementation = false;
const mongodbServerUri = process.env.MONGODB_LOCALSERVER_URI;
const todoListDBName = 'todoListDB';
const todoListMainCollectionName = 'listItems';
const todoListCustomCollectionName = 'customLists';


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// To help identify each Server Operation and watch concurrency in action!
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
let serverOperationId = new Uint32Array([1001, 2001, 3001]);
export function getNextServerOperationId(index) {
  return Atomics.add(serverOperationId, index, 1);
}


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
export async function getTodoListItems(opId) {
  if (useDummyFallbackImplementation) {
    return __dummy_getTodoListItems();
  }

  // Connect to the MongoDB Database
  const client = new MongoClient(mongodbServerUri);
  console.log(`[SVR] #${opId} > Connecting to the database...`);

  try {
    await client.connect();
    console.log(`[SVR] #${opId} > Successfully connected!`);

    // Find all the Documents in the main Collection
    const db = client.db(todoListDBName);
    const collection = db.collection(todoListMainCollectionName);
    const cursor = collection.find();

    const todoListItems = await _getTodoListItems(opId, collection, cursor);

    // Return the 'listItems' array
    return todoListItems;
  }
  catch (error) {
    console.error(`[SVR] #${opId} > Error:`, error);
  }
  finally {
    // Ensures that the client will close when you finish/error
    await client.close();
    console.log(`[SVR] #${opId} > Connection closed.`);
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
async function _getTodoListItems(opId, collection, cursor) {
  console.log(`[SVR] #${opId} > Finding all the items in the 'Today' list...`);
  const todoListItems = [];

  await cursor.forEach((item) => {
    todoListItems.push(item);
  });

  if (todoListItems.length) {
    // Return the results
    console.log(`[SVR] #${opId} > Found ${todoListItems.length} items in the 'Today' list.`);
    return todoListItems;
  }
  else {
    // If the collection is empty, return the default "Welcome Pack" Documents
    const result = await collection.insertMany(defaultTodoListItems);
    console.log('[MONGODB] result:', result);
    console.log(`[SVR] #${opId} > Returning the default "Welcome pack" ${result.insertedIds.length} items for the 'Today' list.`);
    return defaultTodoListItems;
  }

}


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Insert a 'simpleListItem' in the 'main' Collection
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
export async function postTodoListItem(opId, simpleListItem) {
  if (useDummyFallbackImplementation) {
    return __dummy_postTodoListItem(simpleListItem);
  }

  // Connect to the MongoDB Database
  const client = new MongoClient(mongodbServerUri);
  console.log(`[SVR] #${opId} > Connecting to the database...`);
  
  try {
    await client.connect();
    console.log(`[SVR] #${opId} > Successfully connected!`);

    // Insert the Document 'simpleListItem' in the main Collection
    const db = client.db(todoListDBName);
    const collection = db.collection(todoListMainCollectionName);

    console.log(`[SVR] #${opId} > Inserting a new item into the 'Today' list...`);
    const result = await collection.insertOne(simpleListItem);
    console.log('[MONGODB] result:', result);

    // Check the 'result' and ONFAIL return an Error string
    if (!("acknowledged" in result) || !result.acknowledged) {
      return `Failed to insert the new item into the 'Today' list.`;
    }
    // Return a full 'listItem' with its final _id
    console.log(`[SVR] #${opId} > Inserted the new item '${result.insertedId}' into the 'Today' list...`);
    let insertedListItem = { ...simpleListItem };
    insertedListItem._id = result.insertedId;
    return insertedListItem;
  }
  catch (error) {
    console.error(`[SVR] #${opId} > Error:`, error);
  }
  finally {
    // Ensures that the client will close when you finish/error
    await client.close();
    console.log(`[SVR] #${opId} > Connection closed.`);
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
export async function deleteTodoListItem(opId, itemId) {
  if (useDummyFallbackImplementation) {
    return __dummy_deleteTodoListItem(itemId);
  }

  // Connect to the MongoDB Database
  const client = new MongoClient(mongodbServerUri);
  console.log(`[SVR] #${opId} > Connecting to the database...`);

  try {
    await client.connect();
    console.log(`[SVR] #${opId} > Successfully connected!`);

    // Delete the 'listItem._id' from the main Collection
    const db = client.db(todoListDBName);
    const collection = db.collection(todoListMainCollectionName);

    console.log(`[SVR] #${opId} > Deleting the item '${itemId}' from the 'Today' list...`);
    const queryFilter = {
      _id: (typeof itemId === "string" && itemId.length === 24)
        ? new ObjectId(itemId)
        : itemId
    };
    const result = await collection.findOneAndDelete(queryFilter);
    console.log('[MONGODB] result:', result);

    // Check the 'result' and ONFAIL return an Error string
    if (_.isEmpty(result)) {
      return `Failed to find the item '${itemId}' in the 'Today' list.`;
    }
    // Return the deleted full 'listItem'
    const deletedListItem = result.value;
    return deletedListItem;
  }
  catch (error) {
    console.error(`[SVR] #${opId} > Error:`, error);
  }
  finally {
    // Ensures that the client will close when you finish/error
    await client.close();
    console.log(`[SVR] #${opId} > Connection closed.`);
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
export async function getCustomLists(opId) {
  // Connect to the MongoDB Database
  const client = new MongoClient(mongodbServerUri);
  console.log(`[SVR] #${opId} > Connecting to the database...`);

  try {
    await client.connect();
    console.log(`[SVR] #${opId} > Successfully connected!`);

    // Find all the Custom Lists in the 'customList' Collection
    const db = client.db(todoListDBName);
    const collection = db.collection(todoListCustomCollectionName);
    const cursor = collection.find().project({ todoList: 0 });
    const customLists = [];
    await cursor.forEach((item) => {
      customLists.push(item);
    });

    // Return the results
    console.log(`[SVR] #${opId} > Found ${customLists.length} custom lists.`);
    return customLists;
  }
  catch (error) {
    console.error(`[SVR] #${opId} > Error:`, error);
  }
  finally {
    // Ensures that the client will close when you finish/error
    await client.close();
    console.log(`[SVR] #${opId} > Connection closed.`);
  }
}


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Insert a new Custom List
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
export async function postCustomList(opId, simpleCustomList) {
  // Connect to the MongoDB Database
  const client = new MongoClient(mongodbServerUri);
  console.log(`[SVR] #${opId} > Connecting to the database...`);

  try {
    await client.connect();
    console.log(`[SVR] #${opId} > Successfully connected!`);

    // Insert the new Custom List in the 'customList' Collection
    // Avoiding duplications **DONE**!
    const db = client.db(todoListDBName);
    const collection = db.collection(todoListCustomCollectionName);

    const newCustomList = {
      ...simpleCustomList,
      todoList: [],
    };

    console.log(`[SVR] #${opId} > Inserting the '${simpleCustomList.listId}' list into the custom lists...`);
    const queryFilter = { 
      listId: simpleCustomList.listId,
    };
    const updateOperations = { 
      $setOnInsert: newCustomList,
    };
    const updateOptions = { upsert: true };
    const result = await collection.updateOne(queryFilter, updateOperations, updateOptions);
    console.log('[MONGODB] result:', result);

    // Check the 'result' and ONFAIL return an Error string
    if (!("acknowledged" in result) || !result.acknowledged) {
      return `Failed to insert the '${simpleCustomList.listId}' list into the custom lists.`;
    }
    // Return the full 'customList' with its final _id
    let insertedCustomList = { ...newCustomList };
    insertedCustomList._id = result.upsertedId;
    return insertedCustomList;
  }
  catch (error) {
    console.error(`[SVR] #${opId} > Error:`, error);
  }
  finally {
    // Ensures that the client will close when you finish/error
    await client.close();
    console.log(`[SVR] #${opId} > Connection closed.`);
  }
}


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Delete the Custom List
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
export async function deleteCustomList(opId, listId) {
  // Connect to the MongoDB Database
  const client = new MongoClient(mongodbServerUri);
  console.log(`[SVR] #${opId} > Connecting to the database...`);

  try {
    await client.connect();
    console.log(`[SVR] #${opId} > Successfully connected!`);

    // Delete the Custom List from the 'customList' Collection
    const db = client.db(todoListDBName);
    const collection = db.collection(todoListCustomCollectionName);

    console.log(`[SVR] #${opId} > Deleting the '${listId}' list from the custom lists...`);
    const queryFilter = { listId };
    const optionalSettings = {
      projection: {
        todoList: 0
      }
    };
    const result = await collection.findOneAndDelete(queryFilter, optionalSettings);
    console.log('[MONGODB] result:', result);

    // Check the 'result' and and ONFAIL return an Error string
    if (_.isEmpty(result)) {
      return `Failed to find the item '${itemId}' in the '${listId}' list.`;
    }
    // Return the deleted full 'customList'
    const deletedCustomList = result.value;
    return deletedCustomList;
  }
  catch (error) {
    console.error(`[SVR] #${opId} > Error:`, error);
  }
  finally {
    // Ensures that the client will close when you finish/error
    await client.close();
    console.log(`[SVR] #${opId} > Connection closed.`);
  }
}


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Find all the nested 'listItems' in a 'customList'
// identified by its 'listId' in the 'customLists' collection
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
export async function getCustomTodoListItems(opId, listId) {
  // Connect to the MongoDB Database
  const client = new MongoClient(mongodbServerUri);
  console.log(`[SVR] #${opId} > Connecting to the database...`);

  try {
    await client.connect();
    console.log(`[SVR] #${opId} > Successfully connected!`);

    // Find all the nested Documents in the custom Collection Document
    const db = client.db(todoListDBName);
    const collection = db.collection(todoListCustomCollectionName);

    console.log(`[SVR] #${opId} > Finding all the items in the '${listId}' list...`);
    const queryFilter = { listId };
    const cursor = collection.find(queryFilter);
    let listItems;
    await cursor.forEach((item) => {
      listItems = item.todoList;
    });

    // Check the 'result' and ONFAIL return an Error string
    if (!listItems) {
      return `The '${listId}' list does not exist!`;
    }
    // Return the results
    return listItems;
  }
  catch (error) {
    console.error(`[SVR] #${opId} > Error:`, error);
  }
  finally {
    // Ensures that the client will close when you finish/error
    await client.close();
    console.log(`[SVR] #${opId} > Connection closed.`);
  }
}


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Insert a nested 'simpleListItem' into a 'customList'
// identified by its 'listId' in the 'customLists' collection
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
export async function postCustomTodoListItem(opId, listId, simpleListItem) {
  // Connect to the MongoDB Database
  const client = new MongoClient(mongodbServerUri);
  console.log(`[SVR] #${opId} > Connecting to the database...`);

  try {
    await client.connect();
    console.log(`[SVR] #${opId} > Successfully connected!`);

    // Insert the nested Document in the custom Collection Document
    const db = client.db(todoListDBName);
    const collection = db.collection(todoListCustomCollectionName);

    console.log(`[SVR] #${opId} > Inserting a new item into the '${listId}' list...`);
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

    // Check the 'result' and ONFAIL return an Error string
    if (!("acknowledged" in result) || result.modifiedCount === 0) {
      return `Failed to insert a new item into the '${listId}' list.`;
    }
    // Return a full 'listItem' with its final _id
    console.log(`[SVR] #${opId} > Inserted the new item '${insertedListItem._id}' into the '${listId}' list...`);
    return insertedListItem;
  }
  catch (error) {
    console.error(`[SVR] #${opId} > Error:`, error);
  }
  finally {
    // Ensures that the client will close when you finish/error
    await client.close();
    console.log(`[SVR] #${opId} > Connection closed.`);
  }
}


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Delete a nested 'simpleListItem' from a 'customList'
// identified by its 'listId' in the 'customLists' collection
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
export async function deleteCustomTodoListItem(opId, listId, itemId) {
  // Connect to the MongoDB Database
  const client = new MongoClient(mongodbServerUri);
  console.log(`[SVR] #${opId} > Connecting to the database...`);

  try {
    await client.connect();
    console.log(`[SVR] #${opId} > Successfully connected!`);

    // Delete the nested Document from the custom Collection Document
    const db = client.db(todoListDBName);
    const collection = db.collection(todoListCustomCollectionName);

    console.log(`[SVR] #${opId} > Deleting the item '${itemId}' from the '${listId}' list...`);
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

    // Check the 'result' and ONFAIL return an Error string
    if (!("acknowledged" in result) || result.modifiedCount === 0) {
      return `Failed to find the item '${itemId}' in the '${listId}' list.`;
    }
    // Return the deleted full 'listItem'
    return deletedListItem;
  }
  catch (error) {
    console.error(`[SVR] #${opId} > Error:`, error);
  }
  finally {
    // Ensures that the client will close when you finish/error
    await client.close();
    console.log(`[SVR] #${opId} > Connection closed.`);
  }
}
