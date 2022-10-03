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

  // Use the JavaScript fetch API to GET from our Server from the Client
  // Return an explicit Promise to let the Client to Synch to the Result:
  // - Resolve : a listItems Array with the API result
  // - Reject : the same standard JavaScript error Object already catched
  return new Promise((resolve, reject) => {
    fetch(apiEntrypoint)
      .then((response) => (response.json()))
      .then((data) => {
        const { message, result } = data;
        console.log('[API] GET Response:', message);
        resolve(result.listItems);
      })
      .catch((error) => {
        console.log('[API] GET Error:', error);
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
        resolve(result.listItem);
      })
      .catch((error) => {
        console.log('[API] POST Error:', error);
        reject(error);
      });
  });

}

export async function deleteTodoListItem(apiUrl, listItem, listId) {
  // Construct the API Entrypoint URL with [optional] 'listId'
  // Use the JavaScript fetch API to DELETE to our Server
  return NOT_IMPL;
}
