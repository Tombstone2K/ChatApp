import "./People.css";
import React, { useState, useEffect } from "react";
import { Avatar } from "@material-ui/core";
import "./Header.css";

function Indivisual({ members, setChats, fetchData, get_friends }) {
  const changeReceiver = (e, memberName) => {
    e.preventDefault();
    e.preventDefault();
    // console.log(memberName);

    // Call the setChats and props functions here
    sessionStorage.setItem("reciever", memberName);
    setChats(memberName);
    fetchData();
    get_friends();
    // console.log("Hello");
    // console.log(sessionStorage.getItem("reciever"));
    // setChats(document.getElementById("rec").value);
    // props.fetchData();
    // props.get_friends();
    // console.log(memberName);
    // setPasswordVisible(!passwordVisible);
  };

  return (
    <>
      {members.map((member) => (
        <div key={member.name}>
          <button
            className="indivisual"
            type="button"
            onClick={(e) => changeReceiver(e, member.name)}
          >
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
          </button>
        </div>
      ))}
    </>
  );
}

export default Indivisual;
