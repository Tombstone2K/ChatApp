import React from "react";
import { Avatar, IconButton } from "@mui/material";
import "./Otherdetail.css";
function Otherdetail(props) {
  return (
    <>
      {props.receiverdata.map((mem) => (
        <div className="otherdetial">
          <div className="otherfits">
            <Avatar
              src={mem.link}
              style={{ margin: "5px", height: "90px", width: "90px" }}
            />
            <h2 id="hovernames">{mem.name}</h2>
          </div>
          <div className="nome" id="ints">
            <span id="aims">My Interest/Aim:</span> {mem.interest}
          </div>
          <div className="nome">
            <span id="phones">Phone:</span>+91 {mem.numbers}
          </div>
        </div>
      ))}
    </>
  );
}

export default Otherdetail;
