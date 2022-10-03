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

  // Use the JavaScript fetch API to GET from our Server
  // Return a listItems Array with the API result
  return new Promise((resolve, reject) => {
    fetch(apiEntrypoint)
      .then((response) => (response.json()))
      .then((data) => {
        const { message, result } = data;
        console.log('[DEBUG] getTodoListItems:', data);
        console.log('API GET Response:', message);
        resolve(result.listItems);
      })
      .catch((error) => {
        console.log('API GET Error:', error);
        reject(error);
      });
  });

}

export async function postTodoListItem(apiUrl, simpleListItem, listId) {
  // Construct the API Entrypoint URL with [optional] 'listId'
  const apiEntrypoint = (listId ? `${apiUrl}/${listId}` : apiUrl);

  // Use the JavaScript fetch API to POST to our Server
  fetch(apiEntrypoint, {
    method: 'POST',
    body: JSON.stringify({ simpleListItem }),
    headers: {
      "Content-Type": "application/json",
    }
  })
    .then((response) => (response.json()))
    .then((data) => {
      const { message } = data;
      console.log('API POST Response:', message);
    })
    .catch((error) => {
      console.log('API POST Error:', error);
      throw error;
    });

}

export async function deleteTodoListItem(apiUrl, listItem, listId) {
  // Construct the API Entrypoint URL with [optional] 'listId'
  // Use the JavaScript fetch API to DELETE to our Server
  return NOT_IMPL;
}
