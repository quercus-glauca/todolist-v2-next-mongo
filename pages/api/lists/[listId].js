import { getCustomTodoListItems, postCustomTodoListItem, deleteCustomTodoListItem } from "../../../data/server-data-provider";
import { buildGetResponse, buildPostResponse, buildDeleteResponse } from "../../../data/api-response-helper";


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// API Entry Point: /api/lists/[listId]
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
export default async function handler(req, res) {
  console.log('[API]', req.method, '/api/lists/[listId] HANDLER BEGIN...');
  
  const { listId } = req.query;

  if (req.method === 'GET') {
    try {
      const todoListItems = await getCustomTodoListItems(listId);
      
      const [, status, response] = buildGetResponse(
        `/api/lists/${listId}`, 
        todoListItems, 
        `all the items in the list '${listId}' in the 'customLists' collection`);
      console.log('[API] GET: Responding to client...');
      res.status(status).json(response);
    }
    catch (error) {
      console.log('[API] GET Error:', error);
      res.status(500).json(error);
    }
  }

  else if (req.method === 'POST') {
    try {
      const simpleListItem = req.body.simpleListItem;
      const insertedListItem = await postCustomTodoListItem(listId, simpleListItem);

      const [, status, response] = buildPostResponse(
        `/api/lists/${listId}`, 
        insertedListItem,
        `the item into the list '${listId}' in the 'customLists' collection`);
      console.log('[API] POST: Responding to client...');
      res.status(status).json(response);
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

      const [, status, response] = buildDeleteResponse(
        `/api/lists/${listId}`, 
        deletedListItem,
        `the item from the list '${listId}' in the 'customLists' collection`);
      console.log('[API] DELETE: Responding to client...');
      res.status(status).json(response);
    }
    catch (error) {
      console.log('[API] DELETE Error:', error);
      res.status(500).json(error);
    }
  }

  console.log('[API]', req.method, '/api/lists/[listId] HANDLER END');
}
