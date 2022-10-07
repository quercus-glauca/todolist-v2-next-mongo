import { Fragment } from "react";

export default function ListSelector() {
  return (
    <Fragment>
      <h1>Pick a List</h1>
      <div className="list-group">
        <a href="#" className="list-group-item list-group-item-action active" aria-current="true">
          Today
        </a>
        <a href="#" className="list-group-item list-group-item-action">A Second List</a>
        <a href="#" className="list-group-item list-group-item-action">A Third List</a>
        <a href="#" className="list-group-item list-group-item-action">A Fourth List</a>
      </div>
    </Fragment>
  );
}
