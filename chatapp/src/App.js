import React, { useState, useMemo, useEffect } from "react";
import { useNavigate  } from "react-router-dom";
import "./App.css";
import Header from "./Header";
import People from "./People";
import ChatBottom from "./ChatBottom";
import { Helper } from "./Helper";
import Kanban from "./kanban/Kanban";
import axios from "axios";
import Login from "./Login";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import FileShare from "./FileShare";
import Cal from "./Cal";

function App() {
  // const navigate = useNavigate();
  // const navigate = useNavigate();
  // useEffect(() => {
  //   if (localStorage.length === 0 || localStorage.getItem("username") === "") {
  //     // Do something when the condition is met, if needed.
  //     navigate("/");
  //   } else {
  //     console.log(localStorage.getItem("username"));
      
  //   }
  // }, [navigate]);
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

  // useEffect(() => {
  //   if (localStorage.length === 0 || localStorage.getItem("username") === "") {
  //     // Redirect to the login page ("/") when the condition is met.
  //     navigate("/");
  //   }
  // }, [navigate]);

  const changeEvents = () => {
    async function edit_events() {
      try {
        console.log("Database post is called ");
        const newevents = JSON.parse(sessionStorage.getItem("events"));
        const organisation = localStorage.getItem("organisation");
        await axios.post("http://localhost:27017/projects", {
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
      const result = await axios.get("http://localhost:27017/projects", {
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
      const result = await axios.get("http://localhost:27017/chats", {
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
      const result = await axios.get("http://localhost:27017/users");
      // console.log("HELLO");
      const temp = result.data;
      // .slice(0,8);
      // console.log(result.data);
      setMembers(temp);
      const res = temp.filter((member) => member.name === mainuser);
      // console.log(res);
      setUserData(res);
      // console.log('This is the user',res[0])
      localStorage.setItem("organisation", res[0].organisation.toUpperCase());
      localStorage.setItem("userdata",JSON.stringify(res[0]));
      // console.log(result.data);
      // const others = temp.filter(
      //   (member) => member.name === document.getElementById("rec").value
      // );
      // // const others=result.data.filter(member=>member.name===sessionStorage.getItem('reciever'))
      // // console.log("Our other friends ", others);
      // setReceiverData(others);
    } catch (error) {
      console.log(error);
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


                (localStorage.length === 0 || localStorage.getItem("username") === "") ? (
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
