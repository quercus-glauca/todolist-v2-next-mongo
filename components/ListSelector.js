import { Fragment, useEffect, useRef, useState } from "react";
import Link from "next/link";
import _ from 'lodash';
import {
  getCustomLists, postCustomList, deleteCustomList,
  getListIdFromListTitle, getListTitleFromListId
} from "../data/client-data-provider";

export default function ListSelector(props) {
  const {
    activeListId,      // the customList.listId which is active, 0 is for "Today" main list
    apiUrl,            // '/api/lists' route to GET, POST and DELETE customLists

  } = props;

  console.debug('[DEBUG] ListSelector props:', props);

  const [activeListInSync, setActiveListInSync] = useState(activeListId === "0");
  const [singletonCompleted, setSingletonCompleted] = useState(false);
  const [customLists, setCustomLists] = useState([]);
  const [updateSelector, setUpdateSelector] = useState(0);

  const emptySelectorText = !singletonCompleted
    ? 'Loading...'
    : 'No custom lists yet.';

  const newListInputRef = useRef();

  useEffect(() => {
    async function fetchData() {
      // Populate the 'customList' /w 'activeListId' IIF it doesn't exist!
      if (!activeListInSync) {
        try {
          const simpleNewList = {
            date: new Date(),
            listId: activeListId,
            listTitle: getListTitleFromListId(activeListId),
          };
          const customList = await postCustomList(apiUrl, simpleNewList);
          console.debug('[DEBUG] ListSelector useEffect.1:', customList);
          setActiveListInSync(true);
        }
        catch (error) {
          console.error(error);
        }
      }

      // Populate the SELECTOR from the Client-side
      try {
        const selectorLists = await getCustomLists(apiUrl);
        console.debug('[DEBUG] ListSelector useEffect.2:', selectorLists);
        setCustomLists(selectorLists);
        setSingletonCompleted(true);
      }
      catch (error) {
        console.error(error);
      }
    }
    fetchData();

}, [activeListId, apiUrl, activeListInSync, updateSelector]);

// Add a new list to the SELECTOR at User Action
function handleAddNewList(event) {
  event.preventDefault();

  const wishedListTitle = newListInputRef.current.value;
  const normalizedListId = getListIdFromListTitle(wishedListTitle);
  const simpleNewList = {
    date: new Date(),
    listId: normalizedListId,
    listTitle: wishedListTitle,
  };

  postCustomList(apiUrl, simpleNewList)
    .then((customList) => {
      console.debug('[DEBUG] ListSelector handleAddNewList:', customList);
      setUpdateSelector((prevValue) => (prevValue + 1));
    })
    .catch((error) => {
      console.error(error);
    })
    .finally(() => {
      newListInputRef.current.value = '';
    });

}

// Delete a list from the SELECTOR at User Action
function handleDeleteList(listId) {
  deleteCustomList(apiUrl, listId)
    .then((result) => {
      console.debug('[DEBUG] ListSelector handleDeleteList:', result);
      setUpdateSelector((prevValue) => (prevValue + 1));
    })
    .catch((error) => {
      console.error(error);
    });
}

// Render the component contents
console.debug('[DEBUG] activeListId:', activeListId);
return (
  <Fragment>
    <h1>Chose a list</h1>
    <div className="list-group">
      <Link href="/" key="0">
        {activeListId === "0"
          ? <a className="list-group-item list-group-item-action active" aria-current="true">Today</a>
          : <a className="list-group-item list-group-item-action">Today</a>
        }
      </Link>
      {!(singletonCompleted && _.isArray(customLists) && !_.isEmpty(customLists))
        ? <a className="list-group-item list-group-item-action disabled">{emptySelectorText}</a>
        : customLists.map((item) => {
          return (
            <Link href={`/lists/${item.listId}`} key={item.listId}>
              {activeListId === item.listId
                ? <a className="list-group-item list-group-item-action active" aria-current="true">{item.listTitle}</a>
                : <a className="list-group-item list-group-item-action">{item.listTitle}</a>
              }
            </Link>
          );
        })}
    </div>
  </Fragment>
);
}
