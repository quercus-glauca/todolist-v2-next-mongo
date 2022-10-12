//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// API Response Helper - Only for the Server
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// @apiUrl  : '/api' or something similar
// @items   : a valid object or an Error string with further details of failure
// @details : basic details of the operation as for success or failure
export function buildGetResponse(apiUrl, items, details) {
  let ok = false;
  let status = 404;
  let getItemsCount = 0;
  let getDetatils = `Failed to find ${details}.`;
  if (typeof items === "string") {
    getDetatils += ` ${items}`;
  }
  else if (items !== null && typeof items === "object") {
    ok = true;
    status = 200;
    getItemsCount = items.length;
    getDetatils = items;
  }

  const response = {
    message: `GET '${apiUrl}' to find ${details} ${ok ? 'succeeded' : 'failed'}!`,
    result: {
      itemsCount: getItemsCount,
      items: getDetatils,
    },
  }
  return [ok, status, response];
}

export function buildPostResponse(apiUrl, item, details) {
  let ok = false;
  let status = 400;
  let getDetatils = `Failed to insert ${details}.`;
  if (typeof item === "string") {
    getDetatils += ` ${item}`;
  }
  else if (item !== null && typeof item === "object") {
    ok = true;
    status = 201;
    getDetatils = item;
  }

  const response = {
    message: `POST '${apiUrl}' to insert ${details} ${ok ? 'succeeded' : 'failed'}!`,
    result: {
      item: getDetatils,
    },
  }
  return [ok, status, response];
}

export function buildDeleteResponse(apiUrl, item, details) {
  let ok = false;
  let status = 400;
  let getDetatils = `Failed to delete ${details}.`;
  if (typeof item === "string") {
    getDetatils += ` ${item}`;
  }
  else if (item !== null && typeof item === "object") {
    ok = true;
    status = 200;
    getDetatils = item;
  }

  const response = {
    message: `DELETE '${apiUrl}' to delete ${details} ${ok ? 'succeeded' : 'failed'}!`,
    result: {
      item: getDetatils,
    },
  }
  return [ok, status, response];
}
