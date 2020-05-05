import React from "react";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface Props {}
interface State {}
export class AppPicker extends React.Component<Props, State> {
  render() {
    return (
      <main className="AppPicker">
        <FontAwesomeIcon icon="address-book" />
      </main>
    );
  }
}

export default connect({}, {})(AppPicker);
