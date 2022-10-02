import { Fragment } from "react";
import MainHeader from "./MainHeader";
import MainFooter from "./MainFooter";

export default function Layout(props) {
  return (
    <Fragment>
      <MainHeader />
      <main>
        {props.children}
      </main>
      <MainFooter />
    </Fragment>
  );
}