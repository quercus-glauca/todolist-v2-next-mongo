import { Fragment } from "react";
import ListItems from "../components/ListItems";
import ListSelector from "../components/ListSelector";

export default function Home() {
  return (
    <Fragment>
      <div className="container">
        <div className="row">
          <div className="col-3">
            <ListSelector 
              activeListId
              apiUrl='/api/list'
            />
          </div>
          <div className="col">
            <ListItems
              listTitle='Today'
              apiUrl='/api'
            />
          </div>
        </div>
      </div>
    </Fragment>
  );
}
