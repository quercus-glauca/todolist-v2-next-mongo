import { getCustomLists, postCustomList, deleteCustomList } from "../../../data/server-data-provider";
import { buildGetResponse, buildPostResponse, buildDeleteResponse } from "../../../data/some-api-helpers";

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// API Entry Point: /api/lists
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
export default async function handler(req, res) {
  console.log('[API]', req.method, '/api/lists HANDLER BEGIN...');

  if (req.method === 'GET') {
    try {
      const customLists = await getCustomLists();

      const [, status, response] = buildGetResponse(
        "/api/lists",
        customLists,
        "all the lists in the 'customLists' collection");
      console.log('[API] GET: Responding to client...');
      res.status(status).json(response);
    }
    catch (error) {
      console.log('[API] GET Error:', error);
      res.status(500).json(error);
    }
  }

  else if (req.method === 'POST') {
    try {
      const simpleCustomList = req.body.simpleCustomList;
      const insertedCustomList = await postCustomList(simpleCustomList);

      const [, status, response] = buildPostResponse(
        "/api/lists",
        insertedCustomList,
        "the list into the 'customLists' collection");
      console.log('[API] POST: Responding to client...');
      res.status(status).json(response);
    }
    catch (error) {
      console.log('[API] POST Error:', error);
      res.status(500).json(error);
    }
  }

  else if (req.method === 'DELETE') {
    try {
      const listId = req.body.listId;
      const deletedCustomList = await deleteCustomList(listId);

      const [, status, response] = buildDeleteResponse(
        "/api/lists",
        deletedCustomList,
        "the list from the 'customLists' collection");
      console.log('[API] DELETE: Responding to client...');
      res.status(status).json(response);
    }
    catch (error) {
      console.log('[API] DELETE Error:', error);
      res.status(500).json(error);
    }
  }

  console.log('[API]', req.method, '/api/lists HANDLER END');
}
