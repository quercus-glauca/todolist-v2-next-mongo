import { getCustomLists, postCustomList, deleteCustomList } from "../../../data/server-data-provider";


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// API Entry Point: /api/list
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
export default async function handler(req, res) {
  console.log('[API]', req.method, 'HANDLER BEGIN...');

  if (req.method === 'GET') {
    try {
      const customLists = await getCustomLists();
      const listsCount = !customLists ? 0 : customLists.length;
      const response = {
        message: `GET /list Succeeded! Returning ${listsCount} custom lists.`,
        result: {
          customLists: customLists,
        },
      };
      console.log('[API] GET: Responding to client...');
      res.status(200).json(response);
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
      const response = {
        message: 'POST /list Succeeded!',
        result: {
          customList: insertedCustomList,
        },
      };
      console.log('[API] POST: Responding to client...');
      res.status(201).json(response);
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
      const response = {
        message: 'DELETE /list Succeeded!',
        result: {
          customList: deletedCustomList,
        },
      };
      console.log('[API] DELETE: Responding to client...');
      res.status(200).json(response);
    }
    catch (error) {
      console.log('[API] DELETE Error:', error);
      res.status(500).json(error);
    }
  }

  console.log('[API]', req.method, 'HANDLER END');
}
