import { Fragment, useRef } from "react";
import _ from 'lodash';

export default function ListItems(props) {
  const { listTitle, listItems, showNewItemForm, onNewItem } = props;

  const newItemInputRef = useRef();

  function handleSubmit(event) {
    event.preventDefault();
    const newItem = newItemInputRef.current.value;
    onNewItem(newItem);
    newItemInputRef.current.value = '';
  }

  return (
    <Fragment>
      <div className="box" id="heading">
        <h1>{listTitle}</h1>
      </div>
      <div className="box">
        {_.isEmpty(listItems)
          ? <div className="item"><p>Loading...</p></div>
          : listItems.map((item, index) => {
          return (
            <div className="item" key={index}>
              <input type="checkbox" /><p>{item}</p>
            </div>
          );
        })}
        {showNewItemForm && (
          <form className="item" onSubmit={handleSubmit}>
            <input type="text" name="newItem" placeholder="New Item" autoComplete="off" ref={newItemInputRef} />
            <button type="submit" name="list">+</button>
          </form>
        )}
      </div>
    </Fragment>
  );
}