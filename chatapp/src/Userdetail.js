import React from "react";
import "./Userdetail.css";
import { Avatar, IconButton } from "@material-ui/core";
function Userdetail(props) {
  return (
    <>
      {props.val.map((mem) => (
        <div className="userdetail">
          <div className="fitters">
            <Avatar
              src={mem.link}
              style={{ margin: "5px", height: "90px", width: "90px" }}
            />
            <h2 id="hovername">{mem.name}</h2>
          </div>
          <div className="nome" id="int">
            <span id="aim">My Interest/Aim:</span> {mem.interest}
          </div>
          <div className="nome">
            <span id="phone">Phone:</span>+91 {mem.numbers}
          </div>
        </div>
      ))}
    </>
  );
}

export default Userdetail;
