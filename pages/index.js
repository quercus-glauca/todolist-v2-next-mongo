import { Fragment } from "react";
import ListItems from "../components/ListItems";
import ListSelector from "../components/ListSelector";

export default function HomePage() {
  return (
    <Fragment>
      <div className="container">
        <div className="row">
          <div className="col-3">
            <ListSelector 
              activeListId="0"
              apiUrl="/api/lists"
            />
          </div>
          <div className="col">
            <ListItems
              listTitle="Today"
              apiUrl="/api"
            />
          </div>
        </div>
      </div>
    </Fragment>
  );
}
