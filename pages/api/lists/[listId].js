import { getTodoListItems, postTodoListItem, deleteTodoListItem } from "../../../data/server-data-provider";


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// API Entry Point: /api/lists/[listId]
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
export default async function handler(req, res) {
  console.log('[API]', req.method, '/api/lists/[listId] HANDLER BEGIN...');
  
  const { listId } = req.query;

  if (req.method === 'GET') {
    try {
      const todoListItems = await getTodoListItems(listId);
      const itemsCount = !todoListItems ? 0 : todoListItems.length;
      const response = {
        message: `GET All From /api/lists/${listId} Succeeded! Returning ${itemsCount} list items.`,
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
      const insertedListItem = await postTodoListItem(simpleListItem, listId);
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
      const deletedListItem = await deleteTodoListItem(itemId, listId);
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
