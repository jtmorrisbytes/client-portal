import React from "react";
import { connect } from "react-redux";

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
        </AppGrid>
      </main>
    );
  }
}

export default connect({}, {})(AppPicker);
