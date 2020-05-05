import React from "react";
import { connect } from "react-redux";

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
          <AppIcon text="Address Book" />
          <AppIcon text="Settings" />
          <AppIcon text="Appointments" />
          <AppIcon text="Payments" />
        </AppGrid>
      </main>
    );
  }
}

export default connect((state) => {}, {})(AppPicker);
