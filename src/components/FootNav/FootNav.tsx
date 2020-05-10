import React from "react";
import { connect } from "react-redux";
import { TRouter } from "../../store/routes";
import { Link } from "react-router-dom";

import "./FootNav.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
interface ReduxState {
  router: TRouter;
}
interface Props extends ReduxState {}
interface State {}
export function FootNav(props: Props) {
  return (
    <footer id={"FootNav"}>
      <Link to="/">
        <FontAwesomeIcon fixedWidth size="3x" icon="home" />
        <span className="label">Home</span>
      </Link>
    </footer>
  );
}

function mapStateToProps(state): ReduxState {
  const { router } = state;
  return {
    router,
  };
}
export default connect(mapStateToProps)(FootNav);
