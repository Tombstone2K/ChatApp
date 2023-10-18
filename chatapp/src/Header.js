import { useState } from "react";
import "./Header.css";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { Avatar, IconButton } from "@mui/material";
import { useYou } from "./Helper";

import { Link, useNavigate  } from "react-router-dom";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import MessageOutlinedIcon from "@mui/icons-material/MessageOutlined";
import {
  useChats,
  useSide,
  useUpdateside,
  useUSerdetaildisplay,
  useOtherdetail,
} from "./Helper";
import "./People.css";
import ListIcon from "@mui/icons-material/List";
function Header(props) {
  const { ShowUser, RemoveUser } = useUSerdetaildisplay();
  const { Other, setOther, ShowOther, RemoveOther } = useOtherdetail();
  const { you, setYou } = useYou();
  const updateside = useUpdateside();
  const Vis = useSide();
  const { chats, setChats } = useChats();
  const [smallshow, setSmallShow] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Set the "username" in localStorage to an empty string
    localStorage.setItem("username", "");
    setYou("");
    setYou("");
    localStorage.clear();
    console.log("HELLO");
    navigate('/');
    
  };

  const showsmall = () => {
    {
      smallshow ? setSmallShow(false) : setSmallShow(true);
    }
  };

  return (
    <>
      <div className="header">
        <div
          className="user_info"
          onMouseOver={ShowUser}
          onMouseOut={RemoveUser}
        >
          {props.userdata.map((mem) => (
            <div className="logo">
              <Avatar
                src={mem.link}
                style={{ height: "60px", width: "60px" }}
              />
            </div>
          ))}
          <div className="name">
            <h2>{localStorage.getItem("username")}</h2>
          </div>
        </div>

        <div className="contact_info">
          <div
            className="contacts"
            onMouseOver={ShowOther}
            onMouseOut={RemoveOther}
          >
            {props.receiverdata.map((mem) => (
              <div className="contact_logo">
                <Avatar
                  src={mem.link}
                  style={{ height: "60px", width: "60px" }}
                />
              </div>
            ))}
            <div className="contact_name">
              <h2>{chats}</h2>
            </div>
          </div>
        </div>
        <div className="header_buttons">
          <div className="innerbut">
            {Vis ? (
              <IconButton
                style={{ backgroundColor: "white", color: "#2A3166" }}
                onClick={updateside}
              >
                <CloseIcon />
              </IconButton>
            ) : (
              <IconButton
                style={{ backgroundColor: "white", color: "#2A3166" }}
                onClick={updateside}
              >
                <MenuIcon />
              </IconButton>
            )}
            <IconButton
              style={{ backgroundColor: "white", color: "#2A3166" }}
              onClick={props.fetchData}
            >
              <MessageOutlinedIcon
                style={{ backgroundColor: "white", color: "#2A3166" }}
              />
            </IconButton>

            
              <IconButton
                style={{ backgroundColor: "white", color: "#2A3166" }}
                onClick={handleLogout}
              >
                <LogoutOutlinedIcon />
              </IconButton>
            
          </div>
        </div>
        <div className="header_buttons_list">
          <div className="innerbut_small">
            <IconButton
              style={{ backgroundColor: "white", color: "#2A3166" }}
              onClick={showsmall}
            >
              <ListIcon />
            </IconButton>

            {smallshow ? (
              <div className="inner_small_buts">
                {Vis ? (
                  <IconButton
                    style={{ backgroundColor: "white", color: "#2A3166" }}
                    onClick={updateside}
                  >
                    <CloseIcon />
                  </IconButton>
                ) : (
                  <IconButton
                    style={{ backgroundColor: "white", color: "#2A3166" }}
                    onClick={updateside}
                  >
                    <MenuIcon />
                  </IconButton>
                )}

                <IconButton
                  style={{ backgroundColor: "white", color: "#2A3166" }}
                  onClick={props.fetchData}
                >
                  <MessageOutlinedIcon
                    style={{ backgroundColor: "white", color: "#2A3166" }}
                  />
                </IconButton>

                
                  <IconButton
                    style={{ backgroundColor: "white", color: "#2A3166" }}
                    onClick={handleLogout}
                  >
                    <LogoutOutlinedIcon />
                  </IconButton>
                
              </div>
            ) : null}
          </div>
        </div>
        
      </div>
    </>
  );
}

export default Header;
