// Chat Bottom is the area where the chats text and scheduled messages are entered
import React, { useEffect, useState, useRef } from "react";
import "./ChatBottom.css";
import "./RecMes.css";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import MicIcon from "@mui/icons-material/Mic";
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";
import { IconButton } from "@mui/material";
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
  const { dispcal, setDispcal } = useDispCal();
  const { Other, setOther } = useOtherdetail();
  const { chats, setChats } = useChats();
  const { you, setYou } = useYou();
  const [input, setInput] = useState("");
  const chatAreaRef = useRef(null);
  const [scheduledTime, setScheduledTime] = useState(0);
  const [scheduledMessage, setScheduledMessage] = useState("");

  useEffect(() => {
    chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
  }, [chats, messages]);

  setYou(localStorage.getItem("username"));

  const sendMessage = async (e) => {
    e.preventDefault();
    
    // Get current IST Time
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

    // Post the chat
    async function putData() {
      try {
        const dates = getCurrentISTTime();
        const newMessage = {
          message: input,
          receivername: chats,
          sendername: you,
          timestamp: dates,
          dateval: Date.now(),
          received: false,
        };
        await axios.post("http://localhost:27017/chats", newMessage);
        setMessages([...messages, newMessage]);
        setInput("");
      } catch (error) {
        console.log(error);
      }
    }
    await putData();
    setChats(chats);
  };

  // Handle the scheduled messages
  const sch = async (e) => {
    e.preventDefault();

    function getCurrentISTTime() {
      const now = scheduledTime;
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
        console.log(new Date(scheduledTime).getTime());
        console.log("The sender is :" + you);
        console.log("The receiver is :" + chats);
        const newMessage = {
          message: scheduledMessage,
          receivername: chats,
          sendername: you,
          timestamp: dates,
          dateval: new Date(scheduledTime).getTime(),
          received: false,
        };
        await axios.post("http://localhost:27017/chats", newMessage);
        setMessages([...messages, newMessage]);
        setInput("");
      } catch (error) {
        console.log(error);
      }
    }
    await putData();
    setChats(chats);
  };

  return (
    <>
      {Other ? <Otherdetail receiverdata={receiverdata} /> : null}
      {dispcal ? <Cal /> : null}
      <div className="chatbottom">
        <div className="chatarea" ref={chatAreaRef}>
          {/* This is the messaging area */}
          {messages.map((message) => (
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
          {/* Code for Scheduled messages below */}
          {Timesend ? (
            <div className="sendtime">
              <input
                type="datetime-local"
                onChange={(e) => setScheduledTime(new Date(e.target.value))}
              />
              <input
                type="text"
                placeholder="Type the scheduled message"
                value={scheduledMessage}
                onChange={(e) => setScheduledMessage(e.target.value)}
              />
              <button type="submit" onClick={sch}>
                Schedule Message
              </button>
              <IconButton>
                <SendIcon style={{ color: "#2A3166" }} />
              </IconButton>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}

export default ChatBottom;
