import { addTodoItem, getAllTodoItems } from "../../data/dummy-data-provider";

export default function handler(req, res) {
  if (req.method === 'GET') {
    const allTodoItems = getAllTodoItems();
    res.status(200).json(allTodoItems);
  }
  else if (req.method === 'POST') {
    const newItem = req.body.newItem;
    addTodoItem(newItem);
    // res.redirect("/");
    res.status(201).json({ message: 'New Item Processed', newItem });
  }
}
