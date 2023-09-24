import React, { useEffect, useState, useRef } from "react";
import "./ChatBottom.css";
import "./RecMes.css";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import MicIcon from "@mui/icons-material/Mic";
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";
import { Avatar, IconButton } from "@material-ui/core";
import SendIcon from "@mui/icons-material/Send";
import {
  useYou,
  useChats,
  useTimesend,
  useUpdateTimesend,
  useOtherdetail,
  useDispCal,
} from "./Helper";
import axios from "axios";
import Otherdetail from "./Otherdetail";
import Cal from "./Cal";

function ChatBottom({ messages, fetchData, receiverdata, setMessages }) {
  const Timesend = useTimesend();
  const UpdateTimesend = useUpdateTimesend();
  const { dispcal, setDispcal, Showdispcalr, Removedispcal } = useDispCal();
  const { Other, setOther, ShowOther, RemoveOther } = useOtherdetail();
  const { chats, setChats } = useChats();
  const { you, setYou } = useYou();
  const [input, setInput] = useState("");
  const chatAreaRef = useRef(null);

  // useEffect(() => {
  //   // console.log("Before scroll: ", chatAreaRef.current.scrollTop);
  //   chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
  //   // console.log("After scroll: ", chatAreaRef.current.scrollTop);
  // }, [messages]);

  useEffect(() => {
    // Scroll to the bottom of the chat area when component mounts
    chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
  }, [chats, messages]);
  // const [messages, setMessages] = useState("");

  setYou(localStorage.getItem("username"));
  const sendMessage = async (e) => {
    e.preventDefault();

    function getCurrentISTTime() {
      const now = new Date();
      const options = {
        timeZone: "Asia/Kolkata",
        hour12: true,
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      };

      return now.toLocaleTimeString("en-IN", options);
    }

    async function putData() {
      try {
        const dates = getCurrentISTTime();
        // console.log();
        console.log("The sender is :" + you);
        console.log("The receiver is :" + chats);
        const newMessage = {
          sendername: you,
          message: input,
          timestamp: dates,
          receivername: chats,
          received: false,
        };
        await axios.post("http://localhost:27017/chats", newMessage);
        setMessages([...messages, newMessage]);
        setInput("");
        // chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
        // fetchData();
      } catch (error) {
        console.log(error);
      }
    }
    await putData();
    setChats(chats);
    // fetchDataFromServer();
    // fetchData();
  };
  // useEffect(() => {
  //   fetchData();
  // }, [input]);

  return (
    <>
      {Other ? <Otherdetail receiverdata={receiverdata} /> : null}
      {dispcal ? <Cal /> : null}
      <div className="chatbottom">
        <div className="chatarea" ref={chatAreaRef}>
          {/* This is the messaging area */}
          {messages.map((message) => (
            // <p className={`chat__message ${message.received && "chat__reciever"} `} key={message._id}>
            <p
              className={`chat__message ${
                message.receivername === you ? "chat__reciever" : ""
              } `}
              key={message._id}
            >
              <span className="chat__name">
                {message.received ? message.receivername : message.sendername}
              </span>

              {message.message}
              <span className="chat__timeStamp">{message.timestamp}</span>
            </p>
          ))}

          {/* This is the end of the messaging area */}
        </div>
        <div className="message">
          <div className="send">
            <IconButton>
              <InsertEmoticonIcon style={{ color: "#2A3166" }} />
            </IconButton>
            <form>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                type="text"
                placeholder="Type a message"
                id="normalmessage"
              />
              <button
                type="submit"
                onClick={sendMessage}
                disabled={input.length === 0}
              >
                Send a message
              </button>
            </form>
            <IconButton>
              <MicIcon style={{ color: "#2A3166" }} />
            </IconButton>
            <IconButton onClick={UpdateTimesend}>
              <AccessAlarmIcon style={{ color: "#2A3166" }} />
            </IconButton>
          </div>
          {/* Code for delayed messages below */}
          {Timesend ? (
            <div className="sendtime">
              <form>
                <input type="date" name="" id="" />
                <input type="time" name="" id="" />
                <input type="text" placeholder="Type the scheduled message" />
                <button type="submit">Send a message</button>
                <IconButton>
                  <SendIcon style={{ color: "#2A3166" }} />
                </IconButton>
              </form>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}

export default ChatBottom;
