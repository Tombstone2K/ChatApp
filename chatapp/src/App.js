import React, { useState, useMemo } from "react";
import "./App.css";
import Header from "./Header";
import People from "./People";
import ChatBottom from "./ChatBottom";
import { Helper } from "./Helper";
import Kanban from "./kanban/Kanban";
import axios from "axios";
import Login from "./Login";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import FileShare from "./FileShare";
import Cal from "./Cal";

function App() {
  const [messages, setMessages] = useState([]);
  const [members, setMembers] = useState([]);
  const [userdata, setUserData] = useState([]);
  const [receiverdata, setReceiverData] = useState([]);
  const [mainuser, setMainUser] = useState(() => {
    return localStorage.getItem("username")
      ? localStorage.getItem("username")
      : "";
  });
  sessionStorage.setItem("reciever", "Placeholder");
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
        const newevents = JSON.parse(sessionStorage.getItem("events"));
        const organisation = localStorage.getItem("organisation");
        await axios.post("http://localhost:27017/projects", {
          organisation: organisation,
          events: newevents,
        });
      } catch (error) {
        console.log(error);
      }
    }
    edit_events();
  };

  async function getEvents() {
    try {
      const organisation = localStorage.getItem("organisation");
      const result = await axios.get("http://localhost:27017/projects", {
        params: { organisation: organisation },
      });
      sessionStorage.setItem("events", JSON.stringify(result.data.events));
      setEvents(JSON.parse(sessionStorage.getItem("events")));
    } catch (error) {
      console.log(error);
    }
  }

  // Fetch and filter the chats accroding to timestamp
  async function fetchData() {
    try {
      document.getElementById("rec").value === ""
        ? sessionStorage.setItem("reciever", sessionStorage.getItem("reciever"))
        : sessionStorage.setItem(
            "reciever",
            document.getElementById("rec").value
          );
      
      const result = await axios.get("http://localhost:27017/chats", {
        params: {
          sendername: mainuser,
          receivername: sessionStorage.getItem("reciever"),
        },
      });

      const currentEpoch = Date.now();
      const filteredMessages = result.data.filter((message) => {
        return message.dateval <= currentEpoch;
      });

      setMessages(filteredMessages);
    } catch (error) {
      console.log(error);
    }
  }

  // Fetch list of all friends
  async function get_friends() {
    try {
      const result = await axios.get("http://localhost:27017/users");
      const temp = result.data;
      setMembers(temp);
      const res = temp.filter((member) => member.name === mainuser);
      setUserData(res);
      localStorage.setItem("organisation", res[0].organisation.toUpperCase());
      localStorage.setItem("userdata", JSON.stringify(res[0]));
      const others = temp.filter(
        (member) => member.name === localStorage.getItem("reciever")
      );

      setReceiverData(others);
    } catch (error) {
      console.log(error);
    }
  }

  const set_user = (logger) => {
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
                  <Login get_friends={get_friends} set_user={set_user} />
                </>
              }
            />
            <Route
              path="/chats"
              element={
                localStorage.length === 0 ||
                localStorage.getItem("username") === "" ? (
                  // Render the Login component when the condition is true (redirect case)
                  // <Login get_friends={get_friends} set_user={set_user} />
                  <>
                    <Navigate to="/" />
                  </>
                ) : (
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
                          setMessages={setMessages}
                        />
                      </div>
                    </main>
                  </>
                  // Render a different component when the condition is false (e.g., your main app)
                )
              }
            />
          </Routes>
        </div>
      </Router>
    </Helper>
  );
}

export default App;
