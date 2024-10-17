import React from "react";
import "./TextAndIcon.css";

function TextAndIcon(props) {
  let href;
  let aria_label;
  if (props.icon.includes("envelope-open-text")) {
    href = "mailto:petru@pbng.co.il";
    aria_label = "Email: petru@pbng.co.il";
  } else if (props.icon.includes("phone")) {
    href = "tel:972-86239841";
    aria_label = "Phone: 972-86239841";
  } else if (props.icon.includes("print")) {
    href = "tel:972-86239841";
    aria_label = "Fax: 08-6460721";
  } else if (props.icon.includes("city")) {
    href = "https://maps.app.goo.gl/6sxjnR9YBWZbKAWD9";
    aria_label = "Address: פארק תעשיות עומר, בניין 10";
  }

  return (
    <p className="icon-text">
      <i className={props.icon}></i>
      <a href={href} aria-label={aria_label} target="_blank">
        {props.text}
      </a>
    </p>
  );
}

export default TextAndIcon;
