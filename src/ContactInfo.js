import React from "react";
import "./ContactInfo.css";
import TextAndIcon from "./TextAndIcon";

function ContactInfo() {
  let icon_list = [
    { icon: "fa-solid fa-envelope-open-text", text: "mailto:petru@pbng.co.il" },
    { icon: "fa-solid fa-phone", text: "972-86239841" },
    { icon: "fa-solid fa-print", text: "972-86239841" },
  ];

  return (
    <div className="contact-info">
      <div className="contact-info-top">
        {icon_list.map((icon_obj, index) => {
          return (
            <TextAndIcon
              key={index}
              icon={icon_obj.icon}
              text={icon_obj.text}
            />
          );
        })}
      </div>
      <TextAndIcon
        icon="fa-solid fa-envelope"
        text="P.O. Box 3390 Be'er Sheva ת.ד 3390 באר שבע 8413301"
      />
      <TextAndIcon
        icon="fa-solid fa-city"
        text="Omer Industrial Park, building 10 פארק תעשיות עומר, בניין  "
      />
    </div>
  );
}

export default ContactInfo;