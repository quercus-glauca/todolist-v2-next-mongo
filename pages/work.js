import { Fragment } from "react";
import ListItems from "../components/ListItems";
import { getAllWorkItems } from "../data/dummy-data-provider";

export default function Work(props) {
  const { listItems } = props;
  const listTitle = "Work Items";

  return (
    <Fragment>
      <h1>WORK PAGE</h1>
      <ListItems
        listTitle={listTitle}
        listItems={listItems}
      />
    </Fragment>
  );
}

export async function getServerSideProps() {
  const allTodoItems = getAllWorkItems();

  return {
    props: {
      listItems: allTodoItems
    }
  };
}