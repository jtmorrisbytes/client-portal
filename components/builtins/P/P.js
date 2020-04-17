import React from "react";

import "./P.scss";

export default class P extends React.Component {
  render() {
    return <p>{this.props.children}</p>;
  }
}
