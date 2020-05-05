import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./AppIcon.css";

type Props = {
  text: string;
};

export default function AppIcon(props: Props) {
  return (
    <div className="AppIcon">
      <FontAwesomeIcon icon="address-book" />
      {props.text}
    </div>
  );
}
