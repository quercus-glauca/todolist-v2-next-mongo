import { getTodoListItems, postTodoListItem, deleteTodoListItem } from "../../data/server-data-provider";


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// API Entry Point: /api
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// When the handler function is not declared as 'async', we get this WARNING:
//   "API resolved without sending a response for /api, this may result in stalled requests."
// When the handler function is declared as 'async', all goes fine!
export default async function handler(req, res) {
  console.log('[API]', req.method, '/api HANDLER BEGIN...');

  if (req.method === 'GET') {
    try {
      const todoListItems = await getTodoListItems();
      const itemsCount = !todoListItems ? 0 : todoListItems.length;
      const response = {
        message: `GET All From /api Succeeded! Returning ${itemsCount} list items.`,
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
      const insertedListItem = await postTodoListItem(simpleListItem);
      const response = {
        message: 'POST Item To /api Succeeded!',
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
      const deletedListItem = await deleteTodoListItem(itemId);
      const response = {
        message: 'DELETE Item From /api Succeeded!',
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

  console.log('[API]', req.method, '/api HANDLER END');
}

function __handler(req, res) {
  console.log('[API] API', req.method, 'handler begin...');

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
        console.log('[API] API GET Succeeded');
        res.status(200).json(response);
      })
      .catch((error) => {
        console.log('[API] API GET Error:', error);
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
        console.log('[API] API POST Succeeded');
        res.status(201).json(response);
      })
      .catch((error) => {
        console.log('[API] API POST Error:', error);
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
        console.log('[API] API DELETE Succeeded');
        res.status(200).json(response);
      })
      .catch((error) => {
        console.log('[API] API DELETE Error:', error);
        res.status(500).json(error);
      });
  }

  console.log('[API] API', req.method, 'handler end.');
}
