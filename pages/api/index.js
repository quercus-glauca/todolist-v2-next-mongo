import { getTodoListItems, postTodoListItem } from "../../data/server-data-provider";

export default function handler(req, res) {
  if (req.method === 'GET') {
    console.log('[DEBUG] API handler:', req.method);
    getTodoListItems()
      .then((todoListItems) => {
        const itemsCount = !todoListItems ? 0 : todoListItems.length;
        const response = {
          message: `GET / Succeeded! Returning ${itemsCount} list items.`,
          result: {
            listItems: todoListItems,
          },
        };
        res.status(200).json(response);
      })
      .catch((error) => {
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
        res.status(201).json(response);
      })
      .catch((error) => {
        res.status(500).json(error);
      });
  }
}
