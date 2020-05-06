import React from "react";
import { connect } from "react-redux";
import { getUserClients, TUser } from "../../store/user";
interface Props {
  getUserClients: () => Promise<TUser[] | unknown>;
  user: TUser;
}
interface State {
  loading: boolean;
}
class ContactsApp extends React.Component<Props, State> {
  state: State = {
    loading: true,
  };
  componentDidMount() {
    this.props.getUserClients();
    this.setState({ ...this.state, loading: false });
  }
  render() {
    if (this.props.user.loading || this.state.loading) {
      return <div>Loading</div>;
    } else {
      return <div>clients</div>;
    }
  }
}
function mapStateToProps(state: any) {
  const { router, user } = state;
  return {
    router,
    user,
  };
}
const mapDispatchToProps = { getUserClients };
export default connect(mapStateToProps, mapDispatchToProps)(ContactsApp);
