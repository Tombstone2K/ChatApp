import React, { useContext, useState } from "react";

const Side = React.createContext();
const Updadeside = React.createContext();
const Timesend = React.createContext();
const UpdateTimesend = React.createContext();
const Userdetail = React.createContext();
const Userdetaildisplay = React.createContext();
const Otherdetail = React.createContext();
const Chats = React.createContext();
const You = React.createContext();
const Singleuser = React.createContext();
const Ch = React.createContext();
const Chaka = React.createContext();
const DispCal = React.createContext();
const Dark = React.createContext();
export function useDispCal() {
  return DispCal;
}
export function useDark() {
  return Dark;
}
export function useChaka() {
  return Chaka;
}
export function useC() {
  return Ch;
}
export function useSingleuser() {
  return useContext(Singleuser);
}
export function useYou() {
  return useContext(You);
}
export function useChats() {
  return useContext(Chats);
}
export function useSide() {
  return useContext(Side);
}
export function useUpdateside() {
  return useContext(Updadeside);
}
export function useTimesend() {
  return useContext(Timesend);
}
export function useUpdateTimesend() {
  return useContext(UpdateTimesend);
}
export function useUserdetail() {
  return useContext(Userdetail);
}
export function useUSerdetaildisplay() {
  return useContext(Userdetaildisplay);
}
export function useOtherdetail() {
  return useContext(Otherdetail);
}
export function Helper({ children }) {
  const [Vis, setVis] = useState(false);
  const [Time, setTime] = useState(false);
  const [User, setUser] = useState(false);
  const [Other, setOther] = useState(false);
  const [dispcal, setDispcal] = useState(false);
  const [dark, setDark] = useState(false);
  const [c, setC] = useState(false);
  const [chats, setChats] = useState(""); // Main chat State
  const [you, setYou] = useState("");
  const [singleuser, setSingleuser] = useState({});
  function show() {
    // console.log(Vis)
    if (Vis) {
      setVis(false);
    } else {
      setVis(true);
    }
  }

  function Timer() {
    if (Time) {
      setTime(false);
    } else {
      setTime(true);
    }
  }
  function Chakala() {
    if (c) {
      setC(false);
      console.log("Yes");
    } else {
      setC(true);
      console.log("YESSSS");
    }
  }
  function ShowUser() {
    console.log("CALLED HOVER)");

    setUser(true);
    console.log(User);
  }
  function RemoveUser() {
    setUser(false);
    
  }
  function ShowOther() {
    setOther(true);
    console.log(Other);
  }
  function RemoveOther() {
    setOther(false);
  }
  function ShowDispcal() {
    console.log("fdfhfd");
    setOther(true);
  }
  function RemoveDispcal() {
    setOther(false);
  }

  return (
    <Side.Provider value={Vis}>
      <Updadeside.Provider value={show}>
        <Timesend.Provider value={Time}>
          <UpdateTimesend.Provider value={Timer}>
            <Userdetail.Provider value={User}>
              <Userdetaildisplay.Provider value={{ ShowUser, RemoveUser }}>
                <Otherdetail.Provider
                  value={{ Other, setOther, ShowOther, RemoveOther }}
                >
                  <Chats.Provider value={{ chats, setChats }}>
                    <You.Provider value={{ you, setYou }}>
                      <Ch.Provider value={{ c, setC }}>
                        <Singleuser.Provider
                          value={{ singleuser, setSingleuser }}
                        >
                          <Chaka.Provider value={{ Chakala }}>
                            <DispCal.Provider
                              value={{
                                dispcal,
                                setDispcal,
                                ShowDispcal,
                                RemoveDispcal,
                              }}
                            >
                              <Dark.Provider value={{ dark }}>
                                {children}
                              </Dark.Provider>
                            </DispCal.Provider>
                          </Chaka.Provider>
                        </Singleuser.Provider>
                      </Ch.Provider>
                    </You.Provider>
                  </Chats.Provider>
                </Otherdetail.Provider>
              </Userdetaildisplay.Provider>
            </Userdetail.Provider>
          </UpdateTimesend.Provider>
        </Timesend.Provider>
      </Updadeside.Provider>
    </Side.Provider>
  );
}
