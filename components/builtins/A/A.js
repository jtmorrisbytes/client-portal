import React from "react";

import "./A.scss";

export default class A extends React.Component {
  render() {
    return <a href={this.props.href}>{this.props.children}</a>;
  }
}
