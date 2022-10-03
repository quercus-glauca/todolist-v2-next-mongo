import { Fragment, useEffect, useRef, useState } from "react";
import _ from 'lodash';
import { getTodoListItems, postTodoListItem } from "../data/client-data-provider";

export default function ListItems(props) {
  const {
    listId,            // like 'listTitle' but kebab-case and URL safe
    listTitle,         // user frendly Capitalized version
    apiUrl,            // '/api' route to GET, POST and DELETE listItems

  } = props;

  const [singletonCompleted, setSingletonCompleted] = useState(false);
  const [listItems, setListItems] = useState([]);
  const [updateList, setUpdateList] = useState(0);

  const emptyListText = !singletonCompleted
    ? 'Loading...'
    : 'The list is empty. Consider to add new items.';

  const newItemInputRef = useRef();

  // Populate the LIST from the Client-side
  useEffect(() => {
    getTodoListItems(apiUrl, listId)
      .then((todoListItems) => {
        console.log('[DEBUG] ListItems useEffect:', todoListItems);
        setListItems(todoListItems);
        setSingletonCompleted(true);
      })
      .catch((error) => {
        console.log(error);
      });

  }, [apiUrl, listId, updateList]);

  // Add a new item to the LIST at User Action
  function handleAddNewItem(event) {
    event.preventDefault();

    const newItemText = newItemInputRef.current.value;
    const simpleNewItem = {
      date: new Date(),
      text: newItemText
    };

    postTodoListItem(apiUrl, simpleNewItem, listId)
      .then(() => {
        setUpdateList((prevValue) => (prevValue + 1));
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        newItemInputRef.current.value = '';
      });

  }

  // Render the component contents
  return (
    <Fragment>
      <div className="box" id="heading">
        <h1>{listTitle}</h1>
      </div>
      <div className="box">
        {!(singletonCompleted && !_.isEmpty(listItems))
          ? <div className="item">
            <p>{emptyListText}</p>
          </div>
          : listItems.map((item) => {
            return (
              <div className="item" key={item._id}>
                <input type="checkbox" /><p>{item.text}</p>
              </div>
            );
          })}
        <form className="item" onSubmit={handleAddNewItem}>
          <input
            type="text"
            name="newItem"
            placeholder="New Item"
            autoComplete="off"
            ref={newItemInputRef}
          />
          <button type="submit" name="list">+</button>
        </form>
      </div>
    </Fragment>
  );
}