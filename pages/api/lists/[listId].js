import { getCustomTodoListItems, postCustomTodoListItem, deleteCustomTodoListItem } from "../../../data/server-data-provider";


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// API Entry Point: /api/lists/[listId]
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
export default async function handler(req, res) {
  console.log('[API]', req.method, '/api/lists/[listId] HANDLER BEGIN...');
  
  const { listId } = req.query;

  if (req.method === 'GET') {
    try {
      const todoListItems = await getCustomTodoListItems(listId);
      const itemsCount = !todoListItems ? 0 : todoListItems.length;
      const details = (todoListItems === null 
        ? "The list does not exist!"
        : `Returning ${itemsCount} list items.`);
      const response = {
        message: `GET All From /api/lists/${listId} Succeeded! ${details}`,
        result: {
          listItems: todoListItems,
        },
      };
      console.log('[API] GET: Responding to client...');
      res.status(200).json(response);
    }
    catch (error) {
      console.log('[API] GET Error:', error);
      res.status(500).json(error);
    }
  }

  else if (req.method === 'POST') {
    try {
      const simpleListItem = req.body.simpleListItem;
      console.log('[DEBUG] simpleListItem:', simpleListItem);
      console.log('[DEBUG] listId:', listId);
      const insertedListItem = await postCustomTodoListItem(listId, simpleListItem);
      const response = {
        message: `POST Item To /api/lists/${listId} Succeeded!`,
        result: {
          listItem: insertedListItem,
        },
      };
      console.log('[API] POST: Responding to client...');
      res.status(201).json(response);
    }
    catch (error) {
      console.log('[API] POST Error:', error);
      res.status(500).json(error);
    }
  }

  else if (req.method === 'DELETE') {
    try {
      const itemId = req.body.itemId;
      const deletedListItem = await deleteCustomTodoListItem(listId, itemId);
      const response = {
        message: `DELETE Item From /api/lists/${listId} Succeeded!`,
        result: {
          listItem: deletedListItem,
        },
      };
      console.log('[API] DELETE: Responding to client...');
      res.status(200).json(response);
    }
    catch (error) {
      console.log('[API] DELETE Error:', error);
      res.status(500).json(error);
    }
  }

  console.log('[API]', req.method, '/api/lists/[listId] HANDLER END');
}
