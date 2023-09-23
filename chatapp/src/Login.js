import React, { useState, useEffect } from "react";
import "./Login.css";
import { useYou } from "./Helper";
import { Link, useNavigate  } from "react-router-dom";
import axios from "axios";
function Login(props) {
  const { you, setYou } = useYou();
  const [lock, setLock] = useState(false); // to disable the input and submit
  const [error, setError] = useState(false); // to create a red div in registration on  error
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.length === 0 || localStorage.getItem("username") === "") {
      // Do something when the condition is met, if needed.
    } else {
      console.log(localStorage.getItem("username"));
      navigate("/chats");
    }
  }, []);


  const [formData, setFormData] = useState({
    login_name: '', // Initialize with an empty string
    login_pass: '', // Initialize with an empty string
  });
  
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    // console.log(e.target);
    setFormData({ ...formData, [id]: value });
  };
  

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



  const login_and_toChats = async (e) => {

    e.preventDefault();

    // Check if both fields are filled
    if (formData['login_name'].trim() === '' || formData['login_pass'].trim() === '') {
      alert('Please fill in both fields');
      return;
    }



    try {
      // const hashedPassword = await bcrypt.hash(formData['login_pass'], 10);
      const response = await fetch('http://localhost:27017/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: formData['login_name'], password:formData['login_pass'] }),
      });

      if (response.ok) {
        // console.log("Function login_and_toChats is called");
        setYou(formData.login_name);
        
        // setYou(document.getElementById("login_name").value);
        localStorage.setItem(
          "username",
          formData.login_name
        );
        props.set_user(formData.login_name);
        props.get_friends();
        console.log(you);
        console.log("GOING TO CHATS");
        navigate('/chats');
        // Login successful
        // Redirect the user to another page or perform any desired action
      } else {
        // Login failed
        // Display an error message to the user
        alert('Incorrect Username Password');
        console.error('Login failed');
      }
    } catch (error) {
      alert('Incorrect Username Password');
      console.error(error);
    }





    
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
    const password = event.target.elements.password.value;
    const numbers = event.target.elements.numbers.value;
    const link = event.target.elements.link.value;
    const interest = event.target.elements.interest.value;
    const organisation = event.target.elements.organisation.value.toUpperCase();
    const data = {
      name,
      password,
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
      axios.post("http://localhost:27017/users", formData);
      setError(false);
    } catch (error) {
      setError(true);
      console.log("There is a error");
    }
  }

  useEffect(() => {
    putData();
  }, [formData]);

  const [passwordVisible, setPasswordVisible] = useState(false);
  // const [password, setPassword] = useState('');
  
  const togglePasswordVisibility = (e) => {
    e.preventDefault(); 
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="login">
      <div className="wrap">
        <div className="box">
          <h1 id="login_title">Login</h1>

          <form className="logs">

          <input
            type="text"
            placeholder="Enter your Name"
            id="login_name"
            required
            value={formData.login_name}
            onChange={handleInputChange}
          />
          <input
            type={passwordVisible ? 'text' : 'password'}
            placeholder="Enter your Password"
            id="login_pass"
            required
            value={formData.login_pass}
            onChange={handleInputChange}
          />

            {/* <input type="text" placeholder="Enter your Name" id="login_name" required onChange={handleInputChange}/>
            <input type={passwordVisible ? 'text' : 'password'} placeholder="Enter your Password" id="login_pass" required onChange={handleInputChange}/> */}
            <button
              className="toggle-password-button"
              onClick={togglePasswordVisibility}
              type="button"
            >
              {passwordVisible ? '🙈' : '👁️'}
            </button>
            

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
            <input type="password" name="password" placeholder="Create Password" />
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
