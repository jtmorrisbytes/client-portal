import React from "react";
import { connect } from "react-redux";
import { TRouter } from "../../store/routes";
import { Link } from "react-router-dom";

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
        <FontAwesomeIcon icon="house" />
        <p className="label">Home</p>
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
