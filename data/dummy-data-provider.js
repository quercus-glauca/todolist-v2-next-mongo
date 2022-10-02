const items = ["Buy Food", "Cook Food", "Eat Food"];
const workItems = [];

export function getAllTodoItems() {
  return items;
}

export function getAllWorkItems() {
  return workItems;
}

export function addTodoItem(item) {
  items.push(item);
}

export function addWorkItem(item) {
  workItems.push(item);
}