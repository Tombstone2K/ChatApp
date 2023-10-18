import "./People.css";
import React, { useState, useEffect } from "react";
import { Avatar } from "@mui/material";
import "./Header.css";
import { useChats, useSide, useUserdetail } from "./Helper";
function Indivisual({ members, fetchData, get_friends }) {
  const { chats, setChats } = useChats();
  // useEffect(() => {
    
    
  // }, [chats]);
  const changeReceiver = (e, memberName) => {
    e.preventDefault();
    localStorage.setItem("reciever", memberName);
    sessionStorage.setItem("reciever", memberName);
    setChats(sessionStorage.getItem("reciever"));
    console.log('This is seesion storage before sending ',sessionStorage.getItem("reciever"))
    fetchData();
    get_friends();
    // get_friends();
    // fetchData();
   
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
