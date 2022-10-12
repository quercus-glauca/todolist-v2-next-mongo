import { 
  getCustomLists, 
  postCustomList, 
  deleteCustomList, 
  getNextServerOperationId 
} from "../../../data/server-data-provider";
import { 
  buildGetResponse, 
  buildPostResponse, 
  buildDeleteResponse 
} from "../../../helpers/api-response-helper";

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// API Entry Point: /api/lists
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
export default async function handler(req, res) {
  const opId = getNextServerOperationId(1);
  console.log(`[API] #${opId} > ${req.method} /api/lists HANDLER BEGIN...`);

  if (req.method === 'GET') {
    try {
      const customLists = await getCustomLists(opId);

      const [, status, response] = buildGetResponse(
        "/api/lists",
        customLists,
        "all the lists in the 'customLists' collection");
        console.log(`[API] #${opId} > ${req.method} Responding to client...`);
        res.status(status).json(response);
    }
    catch (error) {
      console.error(`[API] #${opId} > ${req.method} Error:`, error);
      res.status(500).json(error);
    }
  }

  else if (req.method === 'POST') {
    try {
      const simpleCustomList = req.body.simpleCustomList;
      const insertedCustomList = await postCustomList(opId, simpleCustomList);

      const [, status, response] = buildPostResponse(
        "/api/lists",
        insertedCustomList,
        "the list into the 'customLists' collection");
        console.log(`[API] #${opId} > ${req.method} Responding to client...`);
        res.status(status).json(response);
    }
    catch (error) {
      console.error(`[API] #${opId} > ${req.method} Error:`, error);
      res.status(500).json(error);
    }
  }

  else if (req.method === 'DELETE') {
    try {
      const listId = req.body.listId;
      const deletedCustomList = await deleteCustomList(opId, listId);

      const [, status, response] = buildDeleteResponse(
        "/api/lists",
        deletedCustomList,
        "the list from the 'customLists' collection");
        console.log(`[API] #${opId} > ${req.method} Responding to client...`);
        res.status(status).json(response);
    }
    catch (error) {
      console.error(`[API] #${opId} > ${req.method} Error:`, error);
      res.status(500).json(error);
    }
  }

  console.log(`[API] #${opId} > ${req.method} /api/lists HANDLER END`);
}
