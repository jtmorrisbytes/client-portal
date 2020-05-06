import React from "react";
import { connect } from "react-redux";
import { TRouter } from "../../store/routes";
import { RouteComponentProps, Route, withRouter } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./HeadNav.css";

interface ReduxState {
  router: TRouter;
}

interface Props extends ReduxState, RouteComponentProps {}
interface State {}
class HeadNav extends React.Component<Props, State> {
  l(s: any) {
    console.log("history changed", s);
  }
  u() {}
  componentDidMount() {
    this.u = this.props.history.listen(this.l);
  }
  goBack() {
    this.props.history.goBack();
  }
  componentWillUnmount() {
    this.u();
  }
  parseTitle(t: string): string {
    t = t.substr(t.lastIndexOf("/") + 1);
    t = t[0].toUpperCase() + t.substr(1);
    return t;
  }
  render() {
    const { pathname } = this.props.history.location;
    let title = "";
    if (pathname) {
      title = this.parseTitle(pathname);
    }
    return (
      <nav id={"HeadNav"}>
        {/* <span className="backControl" onClick={this.goBack.bind(this)}>
          <FontAwesomeIcon icon="chevron-left" />
          <span className="label">Back</span>
        </span> */}
        <span id=".title">{title}</span>
      </nav>
    );
  }
}
function mapStateToProps(state): ReduxState {
  const { router } = state;
  return {
    router,
  };
}
export default withRouter(connect(mapStateToProps)(HeadNav));
