import React from "react";
import "./Cal.css";
import { Link } from "react-router-dom";
import { Avatar, IconButton } from "@material-ui/core";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
function Cal() {
  return (
    <div className="cal">
      <div className="smallcal">
        <h2 className="getcal">Monthly Calender</h2>

        <Link to="/chats">
          <IconButton
            style={{
              backgroundColor: "#2A3166",
              color: "white",
              margin: "5px",
              marginRight: "15px",
            }}
          >
            <ArrowForwardIosOutlinedIcon />
          </IconButton>
        </Link>
      </div>
      <div className="ifcal">
        <iframe
          src="https://calendar.google.com/calendar/embed?height=600&wkst=1&bgcolor=%23039BE5&ctz=Asia%2FKolkata&mode=MONTH&src=ZW4uaW5kaWFuI2hvbGlkYXlAZ3JvdXAudi5jYWxlbmRhci5nb29nbGUuY29t&color=%234285F4"
          style={{
            border: "solid 1px #777",
            width: "100%",
            height: "100%",
            frameborder: "0",
            scrolling: "no",
          }}
        ></iframe>
      </div>
    </div>
  );
}

export default Cal;
