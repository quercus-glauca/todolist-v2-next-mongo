import { Fragment } from "react";
import ListItems from "../components/ListItems";

export default function Home() {
  return (
    <Fragment>
      <ListItems
        listTitle='Today'
        apiUrl='/api'
      />
    </Fragment>
  );
}
