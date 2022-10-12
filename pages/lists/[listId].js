import { Fragment, useEffect, useState } from "react";
import { useRouter } from 'next/router';
import ListItems from "../../components/ListItems";
import ListSelector from "../../components/ListSelector";
import { getListTitleFromListId } from "../../data/some-data-helpers";
import _ from "lodash";

export default function CustomListPage() {
  const router = useRouter();
  console.log('[DEBUG] CustomListPage router:', router);
  console.log('[DEBUG] CustomListPage router.pathname:', router.pathname);
  console.log('[DEBUG] CustomListPage router.query:', router.query);
  // router.pathname: "/lists/[listId]"
  // router.query: { listId: "tommorrow" }

  const [singletonCompleted, setSingletonCompleted] = useState(false);
  const [listId, setListId] = useState(router.query.listId);
  const [listTitle, setListTitle] = useState('');

  useEffect(() => {
    if (!_.isEmpty(router.query.listId)) {
      setListId(router.query.listId);
      setListTitle(getListTitleFromListId(router.query.listId));
      setSingletonCompleted(true);
    }

  }, [router.query.listId]);

  if (!singletonCompleted) {
    return (
      <Fragment>
        <div className="container">
          <div className="row">
            <div className="col-3">
              <h1>Loading...</h1>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }

  return (
    <Fragment>
      <div className="container">
        <div className="row">
          <div className="col-3">
            <ListSelector
              activeListId={listId}
              apiUrl="/api/lists"
            />
          </div>
          <div className="col">
            <ListItems
              listTitle={listTitle}
              apiUrl={`/api/lists/${listId}`}
            />
          </div>
        </div>
      </div>
    </Fragment>
  );
}
