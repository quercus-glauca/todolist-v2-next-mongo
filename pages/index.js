import { Fragment, useEffect, useState } from "react";
import ListItems from "../components/ListItems";

export default function Home() {

  const [listItems, setListItems] = useState([]);
  const [fetchData, setFetchData] = useState(0);

  useEffect(() => {
    fetch('/api')
      .then((response) => (response.json()))
      .then((data) => {
        console.log('API GET Response:', data);
        setListItems(data);
      })
      .catch((error) => {
        console.log('API GET Error:', error);
      });

  }, [fetchData]);

  function addNewItem(newItem) {
    fetch('/api', {
      method: 'POST',
      body: JSON.stringify({ newItem }),
      headers: {
        "Content-Type": "application/json",
      }
    })
      .then((response) => (response.json()))
      .then((data) => {
        console.log('API POST Response:', data);
        setFetchData((prev) => (prev + 1));
      })
      .catch((error) => {
        console.log('API POST Error:', error);
      });

  }

  const listTitle = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long"
  });

  return (
    <Fragment>
      <h1>HOME PAGE</h1>
      <ListItems
        listTitle={listTitle}
        listItems={listItems}
        showNewItemForm
        onNewItem={addNewItem}
      />
    </Fragment>
  );
}
