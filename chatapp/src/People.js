import React, { useState, useEffect } from "react";
import "./People.css";
import Indivisual from "./Indivisual";
import { useChats, useSide, useUserdetail } from "./Helper";
import Toolbar from "./Toolbar";
import "./Header.css";
import Userdetail from "./Userdetail";

function People(props) {
  const Vis = useSide();
  const User = useUserdetail();
  const { chats, setChats } = useChats();
  const friends = props.members;

  useEffect(() => {
    props.get_friends();
    props.fetchData();
  }, [chats]);

  const handleButtonClick = (e) => {
    e.preventDefault();
    localStorage.setItem("reciever", document.getElementById("rec").value);
    sessionStorage.setItem("reciever", document.getElementById("rec").value);
    setChats(document.getElementById("rec").value);
    props.fetchData();
    props.get_friends();
  };


  return (
    <>
      {User ? <Userdetail val={props.userdata} /> : null}

      <div className="mainpeople">
        {Vis ? <Toolbar getEvents={props.getEvents} /> : null}
        <div className="people">
          <form onSubmit={handleButtonClick}>
            <input
              type="text"
              placeholder="Enter the Name"
              className="searchname"
              id="rec"
            />
            <button type="submit" className="namesub">
              Get a name
            </button>
          </form>
          {/* <button onClick={create}>Hit it to generate chat</button> */}

          <Indivisual
            members={friends}
            // setChats={setChats}
            fetchData={props.fetchData}
            get_friends={props.get_friends}
          />

          {/* <Indivisual members={friends} /> */}
        </div>
      </div>
    </>
  );
}

export default People;
