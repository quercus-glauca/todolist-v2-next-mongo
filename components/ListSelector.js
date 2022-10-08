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
    apiUrl,            // '/api/list' route to GET, POST and DELETE customLists

  } = props;

  const [singletonCompleted, setSingletonCompleted] = useState(false);
  const [customLists, setCustomLists] = useState([]);
  const [updateSelector, setUpdateSelector] = useState(0);

  const emptySelectorText = !singletonCompleted
    ? 'Loading...'
    : 'No custom lists yet.';

  const newListInputRef = useRef();

  // Populate the SELECTOR from the Client-side
  useEffect(() => {
    getCustomLists(apiUrl)
      .then((selectorLists) => {
        console.log('[DEBUG] ListSelector useEffect:', selectorLists);
        setCustomLists(selectorLists);
        setSingletonCompleted(true);
      })
      .catch((error) => {
        console.log(error);
      });

  }, [apiUrl, updateSelector]);

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
        console.log('[DEBUG] ListSelector handleAddNewList:', customList);
        setUpdateSelector((prevValue) => (prevValue + 1));
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        newListInputRef.current.value = '';
      });

  }

  // Delete a list from the SELECTOR at User Action
  function handleDeleteList(listId) {
    deleteCustomList(apiUrl, listId)
      .then((result) => {
        console.log('[DEBUG] ListSelector handleDeleteList:', result);
        setUpdateSelector((prevValue) => (prevValue + 1));
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // Render the component contents
  console.log('[DEBUG] activeListId:', activeListId);
  return (
    <Fragment>
      <h1>Chose a list</h1>
      <div className="list-group">
        <Link href="/" key="0">
          {activeListId === 0
            ? <a className="list-group-item list-group-item-action">Today</a>
            : <a className="list-group-item list-group-item-action active" aria-current="true">Today</a>
          }
        </Link>
        {!(singletonCompleted && !_.isEmpty(customLists))
          ? <a className="list-group-item list-group-item-action disabled">{emptySelectorText}</a>
          : customLists.map((item) => {
            return (
              <Link href={`/list/${item.listId}`} key={item.listId}>
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
