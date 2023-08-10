import React, { useRef } from "react";
import { Avatar } from "@material-ui/core";
import "./People.css";

function Indivisual({ members }) {

  return (
    <>
      {members.map((member) => (
        <div className="indivisual" key={member.name} id="indivisual">
          <div className="person">
            <div className="perlogo">
              <Avatar
                src={member.link}
                style={{ height: "60px", width: "60px", marginTop: "0px" }}
              />
            </div>
            <div className="pername">
              <h3>{member.name}</h3>
              <p className="aim_for_life">{member.interest}</p>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

export default Indivisual;
