import React from "react";
import { connect } from "react-redux";

interface Props {}
interface State {}
export class AppPicker extends React.Component<Props, State> {
  render() {
    return <div className="AppGrid">{this.props.children}</div>;
  }
}

export default connect({}, {})(AppPicker);
