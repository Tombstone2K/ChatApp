import React from "react";
import "./Toolbar.css";
import { Avatar, IconButton } from "@material-ui/core";
import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { Link } from "react-router-dom";
function Toolbar(props) {
  return (
    <div className="toolbar" id="tool">
      <Link to="/projects">
        <IconButton
          style={{
            background:' rgb(0,0,126)',
            color: "#EE7879",
            marginBottom: "10px",
          }}
          onClick={props.getEvents}
        >
          <ListAltOutlinedIcon style={{ height: "35px", width: "35px" }} />
        </IconButton>
      </Link>
      <Link to="/upload">
        <IconButton
          style={{
            background:' rgb(0,0,126)',            color: "#EE7879",
            marginBottom: "10px",
          }}
        >
          <AttachFileIcon style={{ height: "35px", width: "35px" }} />
        </IconButton>
      </Link>
      <Link to="/cal">
        <IconButton
          style={{
            background:' rgb(0,0,126)',            color: "#EE7879",
            marginBottom: "10px",
          }}
        >
          <CalendarMonthOutlinedIcon
            style={{ height: "35px", width: "35px" }}
          />
        </IconButton>
      </Link>
    </div>
  );
}

export default Toolbar;
