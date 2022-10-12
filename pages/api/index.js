import { 
  getTodoListItems, 
  postTodoListItem, 
  deleteTodoListItem, 
  getNextServerOperationId 
} from "../../data/server-data-provider";
import { 
  buildGetResponse, 
  buildPostResponse, 
  buildDeleteResponse 
} from "../../helpers/api-response-helper";


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// API Entry Point: /api
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// When the handler function is not declared as 'async', we get this WARNING:
//   "API resolved without sending a response for /api, this may result in stalled requests."
// When the handler function is declared as 'async', all goes fine!
export default async function handler(req, res) {
  const opId = getNextServerOperationId(0);
  console.log(`[API] #${opId} > ${req.method} /api HANDLER BEGIN...`);

  if (req.method === 'GET') {
    try {
      const todoListItems = await getTodoListItems(opId);

      const [, status, response] = buildGetResponse(
        "/api",
        todoListItems,
        "all the items in the main 'listItems' collection");
      console.log(`[API] #${opId} > ${req.method} Responding to client...`);
      res.status(status).json(response);
    }
    catch (error) {
      console.error(`[API] #${opId} > ${req.method} Error:`, error);
      res.status(500).json(error);
    }
  }

  else if (req.method === 'POST') {
    try {
      const simpleListItem = req.body.simpleListItem;
      const insertedListItem = await postTodoListItem(opId, simpleListItem);

      const [, status, response] = buildPostResponse(
        "/api",
        insertedListItem,
        "the item to the main 'listItems' collection");
      console.log(`[API] #${opId} > ${req.method} Responding to client...`);
      res.status(status).json(response);
    }
    catch (error) {
      console.error(`[API] #${opId} > ${req.method} Error:`, error);
      res.status(500).json(error);
    }
  }

  else if (req.method === 'DELETE') {
    try {
      const itemId = req.body.itemId;
      const deletedListItem = await deleteTodoListItem(opId, itemId);

      const [, status, response] = buildDeleteResponse(
        "/api",
        deletedListItem,
        "the item from the main 'listItems' collection");
      console.log(`[API] #${opId} > ${req.method} Responding to client...`);
      res.status(status).json(response);
    }
    catch (error) {
      console.error(`[API] #${opId} > ${req.method} Error:`, error);
      res.status(500).json(error);
    }
  }

  console.log(`[API] #${opId} > ${req.method} /api HANDLER END`);
}

function __handler(req, res) {
  console.log(`[API-S] API', req.method, 'handler begin...`);

  if (req.method === 'GET') {
    getTodoListItems()
      .then((todoListItems) => {
        const itemsCount = !todoListItems ? 0 : todoListItems.length;
        const response = {
          message: `GET / Succeeded! Returning ${itemsCount} list items.`,
          result: {
            listItems: todoListItems,
          },
        };
        console.log(`[API-S] API GET Succeeded`);
        res.status(200).json(response);
      })
      .catch((error) => {
        console.error('[API-S] API GET Error:', error);
        res.status(500).json(error);
      });
  }
  else if (req.method === 'POST') {
    const newListItem = req.body.simpleListItem;
    postTodoListItem(newListItem)
      .then((listItem) => {
        const response = {
          message: 'POST / Succeeded!',
          result: {
            listItem: listItem,
          },
        };
        console.log(`[API-S] API POST Succeeded`);
        res.status(201).json(response);
      })
      .catch((error) => {
        console.error('[API-S] API POST Error:', error);
        res.status(500).json(error);
      });
  }
  else if (req.method === 'DELETE') {
    const itemId = req.body.itemId;
    deleteTodoListItem(itemId)
      .then((listItem) => {
        const response = {
          message: 'DELETE / Succeeded!',
          result: {
            ...listItem
          },
        };
        console.log(`[API-S] API DELETE Succeeded`);
        res.status(200).json(response);
      })
      .catch((error) => {
        console.error('[API-S] API DELETE Error:', error);
        res.status(500).json(error);
      });
  }

  console.log(`[API-S] API', req.method, 'handler end.`);
}
