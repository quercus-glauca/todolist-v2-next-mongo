export { getListTitleFromListId, getListIdFromListTitle } from "../helpers/some-data-helpers";

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Documents of type: 'listItem' 
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const sampleSimpleListItem = {
  date: new Date(),
  text: "Sample List Item",
};

const sampleListItem = {
  _id: 0,
  date: new Date(),
  text: "Sample List Item",
};

export async function getTodoListItems(apiUrl, listId) {
  // Construct the API Entrypoint URL with [optional] 'listId'
  const apiEntrypoint = (listId ? `${apiUrl}/${listId}` : apiUrl);

  // Use the JavaScript fetch API to GET to our Server from the Client
  // Return an explicit Promise to let the Client to Synch to the Result:
  // - Resolve : a listItems Array with the API result
  // - Reject : the same standard JavaScript error Object already catched
  return new Promise((resolve, reject) => {
    fetch(apiEntrypoint)
      .then((response) => (response.json()))
      .then((data) => {
        const { message, result } = data;
        console.log('[API]', message);
        resolve(result.items);
      })
      .catch((error) => {
        console.error('[API] GET Error:', error);
        reject(error);
      });
  });

}

export async function postTodoListItem(apiUrl, simpleListItem, listId) {
  // Construct the API Entrypoint URL with [optional] 'listId'
  const apiEntrypoint = (listId ? `${apiUrl}/${listId}` : apiUrl);

  // Use the JavaScript fetch API to POST to our Server from the Client
  // Return an explicit Promise to let the Client to Synch to the Result:
  // - Resolve : a simple Object with the API result
  // - Reject : the same standard JavaScript error Object already catched
  return new Promise((resolve, reject) => {
    fetch(apiEntrypoint, {
      method: 'POST',
      body: JSON.stringify({ simpleListItem }),
      headers: {
        "Content-Type": "application/json",
      }
    })
      .then((response) => (response.json()))
      .then((data) => {
        const { message, result } = data;
        console.log('[API] POST Response:', message);
        resolve(result.item);
      })
      .catch((error) => {
        console.error('[API] POST Error:', error);
        reject(error);
      });
  });

}

export async function deleteTodoListItem(apiUrl, itemId, listId) {
  // Construct the API Entrypoint URL with [optional] 'listId'
  const apiEntrypoint = (listId ? `${apiUrl}/${listId}` : apiUrl);

  // Use the JavaScript fetch API to DELETE to our Server from the Client
  // Return an explicit Promise to let the Client to Synch to the Result:
  // - Resolve : a simple Object with the API result
  // - Reject : the same standard JavaScript error Object already catched
  return new Promise((resolve, reject) => {
    fetch(apiEntrypoint, {
      method: 'DELETE',
      body: JSON.stringify({ itemId }),
      headers: {
        "Content-Type": "application/json",
      }
    })
      .then((response) => (response.json()))
      .then((data) => {
        const { message, result } = data;
        console.log('[API] DELETE Response:', message);
        resolve(result);
      })
      .catch((error) => {
        console.error('[API] DELETE Error:', error);
        reject(error);
      });
  });

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Documents of type: 'customList' 
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const sampleCustomList = {
  _id: 0,
  date: new Date(),
  listId: "url-friendly-title",
  listTitle: "User Friendly Title",
  todoList: [],
};

export async function getCustomLists(apiUrl) {
  // Construct the API Entrypoint URL
  const apiEntrypoint = apiUrl;

  // Use the JavaScript fetch API to GET to our Server from the Client
  // Return an explicit Promise to let the Client to Synch to the Result:
  // - Resolve : a customLists Array with the API result
  // - Reject : the same standard JavaScript error Object already catched
  return new Promise((resolve, reject) => {
    fetch(apiEntrypoint)
      .then((response) => (response.json()))
      .then((data) => {
        const { message, result } = data;
        console.log('[API]', message);
        resolve(result.items);
      })
      .catch((error) => {
        console.error('[API] GET Error:', error);
        reject(error);
      });
  });

}

// Helping MongoDB to **AVOID** early document duplications!!
// EXPLANATION: useEffect() may be called twice by React/Next in 'NODE_END=development'
let lastCustomList = {
  listId: "",
  timestamp: new Date().valueOf()
};

export async function postCustomList(apiUrl, simpleCustomList) {
  // Construct the API Entrypoint URL
  const apiEntrypoint = apiUrl;

  // Helping MongoDB to **AVOID** early document duplications!!
  const now = new Date().valueOf();
  if (lastCustomList.listId === simpleCustomList.listId && (now - lastCustomList.timestamp < 5000)) {
    console.log(`[API] POST ${apiUrl} > Detected early duplication for '${lastCustomList.listId}'!`);
    return simpleCustomList;
  }
  lastCustomList.listId = simpleCustomList.listId;
  lastCustomList.timestamp = now;

  // Use the JavaScript fetch API to POST to our Server from the Client
  // Return an explicit Promise to let the Client to Synch to the Result:
  // - Resolve : a simple Object with the API result
  // - Reject : the same standard JavaScript error Object already catched
  return new Promise((resolve, reject) => {
    fetch(apiEntrypoint, {
      method: 'POST',
      body: JSON.stringify({ simpleCustomList }),
      headers: {
        "Content-Type": "application/json",
      }
    })
      .then((response) => (response.json()))
      .then((data) => {
        const { message, result } = data;
        console.log('[API] POST Response:', message);
        resolve(result.item);
      })
      .catch((error) => {
        console.error('[API] POST Error:', error);
        reject(error);
      });
  });

}

export async function deleteCustomList(apiUrl, listId) {
  // Construct the API Entrypoint URL
  const apiEntrypoint = apiUrl;

  // Use the JavaScript fetch API to DELETE to our Server from the Client
  // Return an explicit Promise to let the Client to Synch to the Result:
  // - Resolve : a simple Object with the API result
  // - Reject : the same standard JavaScript error Object already catched
  return new Promise((resolve, reject) => {
    fetch(apiEntrypoint, {
      method: 'DELETE',
      body: JSON.stringify({ listId }),
      headers: {
        "Content-Type": "application/json",
      }
    })
      .then((response) => (response.json()))
      .then((data) => {
        const { message, result } = data;
        console.log('[API] DELETE Response:', message);
        resolve(result);
      })
      .catch((error) => {
        console.error('[API] DELETE Error:', error);
        reject(error);
      });
  });

}
