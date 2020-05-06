import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import "./AppPicker.css";

import AppGrid from "./AppGrid";
import AppIcon from "./AppIcon";

interface Props {}
interface State {}
export class AppPicker extends React.Component<Props, State> {
  render() {
    return (
      <main className="AppPicker">
        <AppGrid>
          <Link to="/contacts">
            <AppIcon
              id="contacts"
              name="contacts"
              icon="address-book"
              text="Contacts"
            />
          </Link>
          {/* the below are to remain disabled until completed */}
          {/* <Link to="/settings">
            <AppIcon name="settings" icon="cog" text="Settings" />
          </Link>
          <Link to="/calendar">
            <AppIcon name="calendar" icon="calendar" text="Appointments" />
          </Link>
          <Link to="/payments">
            <AppIcon name="payments" icon="credit-card" text="Payments" />
          </Link> */}
        </AppGrid>
      </main>
    );
  }
}

export default connect((state) => {}, {})(AppPicker);
