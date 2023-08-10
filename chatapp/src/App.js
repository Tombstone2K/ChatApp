import React, { useState, useMemo } from "react";
import "./App.css";
import Header from "./Header";
import People from "./People";
import ChatBottom from "./ChatBottom";
import { Helper } from "./Helper";
import Kanban from "./kanban/Kanban";
import axios from "axios";
import Login from "./Login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FileShare from "./FileShare";
import Cal from "./Cal";

function App() {
  // console.log("App is the start");
  const [messages, setMessages] = useState([]);
  const [members, setMembers] = useState([]);
  const [userdata, setUserData] = useState([]);
  const [receiverdata, setReceiverData] = useState([]);
  const [mainuser, setMainUser] = useState(() => {
    return localStorage.getItem("username")
      ? localStorage.getItem("username")
      : "";
  });
  sessionStorage.setItem("reciever", "Athithi Devo Bhava");
  const initEvent = useMemo(
    () => [
      {
        title: "Add a new Event",
        ["To do"]: [],
        ["In progress"]: [],
        ["Completed"]: [],
      },
    ],
    []
  );

  const [events, setEvents] = useState(() => {
    return sessionStorage.getItem("events")
      ? JSON.parse(sessionStorage.getItem("events"))
      : initEvent;
  });
  const [currentEvent, setCurrentEvent] = useState(events[0]);

  const changeEvents = () => {
    async function edit_events() {
      try {
        console.log("Database post is called ");
        const newevents = JSON.parse(sessionStorage.getItem("events"));
        const organisation = localStorage.getItem("organisation");
        await axios.post("http://localhost:8021/projects", {
          organisation: organisation,
          events: newevents,
        });
      } catch (error) {
        console.log("There is an error in updating projects");
      }
    }
    edit_events();
  };

  async function getEvents() {
    try {
      const organisation = localStorage.getItem("organisation");
      console.log('This is the organisation  of user : ',organisation)
      const result = await axios.get("http://localhost:8021/projects", {
        params: { organisation: organisation },
      });
      sessionStorage.setItem("events", JSON.stringify(result.data.events));
      setEvents(JSON.parse(sessionStorage.getItem("events")));
    } catch (error) {
      console.log("There is a error in getting the events");
    }
  }

  async function fetchData() {
    try {
      document.getElementById("rec").value === ""
        ? sessionStorage.setItem("reciever", sessionStorage.getItem("reciever"))
        : sessionStorage.setItem(
            "reciever",
            document.getElementById("rec").value
          );
      // console.log(sessionStorage.getItem("reciever"), "This is the receiver");
      // console.log("Function is called");
      // console.log("The User here is " + mainuser);
      const result = await axios.get("http://localhost:8021/chats", {
        params: {
          sendername: mainuser,
          receivername: sessionStorage.getItem("reciever"),
        },
      });
      setMessages(result.data);
      // console.log("These are the chats ", result.data);
    } catch (error) {
      console.log("There is error in setting chats");
    }
  }

  async function get_friends() {
    try {
      // console.log('The function get_friends is called')
      // console.log("This is the current user: ", mainuser);
      const result = await axios.get("http://localhost:8021/users");
      // console.log(result.data);
      setMembers(result.data);
      const res = result.data.filter((member) => member.name === mainuser);
      setUserData(res);
      // console.log('This is the user',res[0])
      localStorage.setItem("organisation", res[0].organisation.toUpperCase());
      localStorage.setItem("userdata",JSON.stringify(res[0]));

      const others = result.data.filter(
        (member) => member.name === document.getElementById("rec").value
      );
      // const others=result.data.filter(member=>member.name===sessionStorage.getItem('reciever'))
      // console.log("Our other friends ", others);
      setReceiverData(others);
    } catch (error) {
      console.log("Errorrrrrrr is here");
    }
  }

  const set_user = (logger) => {
    // console.log("Function set_user is called")
    setMainUser(logger);
  };

  return (
    <Helper>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/upload" element={<FileShare />} />
            <Route
              path="/projects"
              element={
                <Kanban
                  events={events}
                  setEvents={setEvents}
                  currentEvent={currentEvent}
                  setCurrentEvent={setCurrentEvent}
                  changeEvents={changeEvents}
                  initEvent={initEvent}
                />
              }
            />
            <Route path="/cal" element={<Cal />} />
            <Route
              path="/"
              element={
                <>
                  <Login
                    get_friends={get_friends}
                    set_user={set_user}
                  />
                </>
              }
            />
            <Route
              path="/chats"
              element={
                <>
                  <Header
                    userdata={userdata}
                    receiverdata={receiverdata}
                    fetchData={fetchData}
                  />
                  <main>
                    <aside>
                      <People
                        members={members}
                        get_friends={get_friends}
                        set_user={set_user}
                        fetchData={fetchData}
                        userdata={userdata}
                        getEvents={getEvents}
                      />
                    </aside>
                    <div className="aside">
                      <ChatBottom
                        messages={messages}
                        fetchData={fetchData}
                        receiverdata={receiverdata}
                      />
                    </div>
                  </main>
                </>
              }
            />
          </Routes>
        </div>
      </Router>
    </Helper>
  );
}

export default App;
