import React, { useState, useEffect } from "react";
import "./Login.css";
import { useYou } from "./Helper";
import { Link } from "react-router-dom";
import axios from "axios";
function Login(props) {
  const { you, setYou } = useYou();
  const [lock, setLock] = useState(false); // to disable the input and submit
  const [error, setError] = useState(false); // to create a red div in registration on  error
  const [formData, setFormData] = useState({});

  function registration() {
    if (lock === false) {
      setLock(true);
    } else {
      setLock(false);
    }
  }

  const Showsign = () => {
    registration();
    if (lock === true) {
      document.getElementById("sign_up_show").innerHTML =
        "Have an account now ? Login";
      document.getElementById("s").style.display = "flex";
      document.getElementById("after_go").disabled = true;
      document.getElementById("login_name").disabled = true;
    } else {
      document.getElementById("sign_up_show").innerHTML = "No account? Sign Up";
      document.getElementById("s").style.display = "none";
      document.getElementById("after_go").disabled = false;
      document.getElementById("login_name").disabled = false;
    }
  };

  const login_and_toChats = () => {
    // console.log("Function login_and_toChats is called");
    setYou(document.getElementById("login_name").value);
    localStorage.setItem(
      "username",
      document.getElementById("login_name").value
    );
    props.set_user(document.getElementById("login_name").value);
    props.get_friends();
    console.log("GOING TO CHATS");
  };

  useEffect(() => {
    props.set_user(() => {
      return localStorage.getItem("username")
        ? localStorage.getItem("username")
        : you;
    });
  }, [you]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const name = event.target.elements.name.value;
    const numbers = event.target.elements.numbers.value;
    const link = event.target.elements.link.value;
    const interest = event.target.elements.interest.value;
    const organisation = event.target.elements.organisation.value.toUpperCase();
    const data = {
      name,
      numbers,
      link,
      interest,
      organisation,
    };
    // const jsonData = JSON.stringify(data);
    setFormData(data);
  };

  function putData() {
    try {
      // console.log("Function putData is called")
      axios.post("http://localhost:8021/users", formData);
      setError(false);
    } catch (error) {
      setError(true);
      console.log("There is a error");
    }
  }

  useEffect(() => {
    putData();
  }, [formData]);

  return (
    <div className="login">
      <div className="wrap">
        <div className="box">
          <h1 id="login_title">Login</h1>

          <form className="logs">
            <input type="text" placeholder="Enter your Name" id="login_name" />

            <Link to="/chats">
              <button type="submit" id="after_go" onClick={login_and_toChats}>
                Go to Chats
              </button>
            </Link>
          </form>

          <button type="button" id="sign_up_show" onClick={Showsign}>
            No account? Sign Up
          </button>
        </div>
        <div className="sign_up" id="s">
          <form onSubmit={handleSubmit} id="sign" className="logs">
            <input type="text" name="name" placeholder="Create username" />
            <input type="number" name="numbers" placeholder="Enter number" />
            <input
              type="text"
              name="organisation"
              placeholder="Enter Organisation"
            />
            <input type="text" name="link" placeholder="Enter DP link" />
            <input
              type="text"
              name="interest"
              placeholder="Enter you Aim/Interest"
            />
            {error ? (
              <div id="error_sign">Please Input correct values</div>
            ) : null}
            <button type="submit" id="sign_submit">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
