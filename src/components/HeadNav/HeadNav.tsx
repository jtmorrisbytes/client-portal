import React from "react";
import { connect } from "react-redux";
import { TRouter } from "../../store/routes";
interface ReduxState {
  router: TRouter;
}
interface Props extends ReduxState {}
interface State {}
class HeadNav extends React.Component<Props, State> {
  render() {
    return (
      <nav id={"HeadNav"}>
        <h1>{this.props.router.title}</h1>
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
export default connect(mapStateToProps)(HeadNav);
