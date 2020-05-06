import React from "react";
import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from "@fortawesome/react-fontawesome";

import "./AppIcon.css";

interface Props extends FontAwesomeIconProps {
  text: string;
}

export default function AppIcon(props: Props) {
  const { text, id, name } = props;
  return (
    <div id={id} className="AppIcon">
      <FontAwesomeIcon {...props} />
      <p>{text}</p>
    </div>
  );
}
