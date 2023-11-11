// Login and Sign-up Page
// Handles regex checks for both Login and Sign-up
import React, { useState, useEffect } from "react";
import "./Login.css";
import { useYou } from "./Helper";
import { Link, useNavigate } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { IconButton } from "@mui/material";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import axios from "axios";
var bcrypt = require("bcryptjs");
function Login(props) {
  const { you, setYou } = useYou();
  const [lock, setLock] = useState(false);
  const [error, setError] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.length === 0 || localStorage.getItem("username") === "") {
    } else {
      console.log(localStorage.getItem("username"));
      navigate("/chats");
    }
  }, []);

  // LOGIN

  const [isNameValid, setIsNameValid] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);

  const [touchedFields, setTouchedFields] = useState({
    login_name: false,
    login_pass: false,
  });

  // REGEX based form validation for Login
  const validateForm = () => {
    const { login_name, login_pass } = formData;

    const usernameRegex = /^[a-zA-Z0-9_]{3,}$/;
    const isNameValid = usernameRegex.test(login_name);


    const passwordRegex = /^(?=.*[a-z])(?=.*\d).{8,}$/;
    const isPasswordValid = passwordRegex.test(login_pass);

    setIsNameValid(isNameValid);
    setIsPasswordValid(isPasswordValid);
  };

  const [formData, setFormData] = useState({
    login_name: "", // Initialize with an empty string
    login_pass: "", // Initialize with an empty string
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });

    setTouchedFields({
      ...touchedFields,
      [id]: true,
    });
  };

  useEffect(() => {
    validateForm();
  }, [formData]);

  // Try to Login and proceed to Chats if Login Credentials match
  const login_and_toChats = async (e) => {
    e.preventDefault();

    if (
      formData["login_name"].trim() === "" ||
      formData["login_pass"].trim() === ""
    ) {
      alert("Please fill in both fields");
      return;
    }

    try {
      const response = await fetch("http://localhost:27017/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData["login_name"],
          password: formData["login_pass"],
        }),
      });

      if (response.ok) {
        setYou(formData.login_name);

        localStorage.setItem("username", formData.login_name);
        props.set_user(formData.login_name);
        props.get_friends();
        navigate("/chats");
        // Login successful
      } else {
        // Login failed
        // Display an error message to the user
        alert("Incorrect Username Password");
        console.error("Login failed");
      }
    } catch (error) {
      alert("Incorrect Username Password");
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


  // SIGN_UP
  // Encrypt Password and wrap data into Mongoose Schema
  const handleSubmit = async (event) => {
    event.preventDefault();
    const name = event.target.elements.name.value;
    const password = await bcrypt.hash(
      event.target.elements.password.value,
      10
    );
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
    putData(data);
  };

  // Verify whether username is available and insert data into MongoDB 
  function putData(data) {
    try {
      axios
        .post("http://localhost:27017/users", data, {
          validateStatus: function (status) {
            return status === 200 || status === 409; // Treat 409 as a successful response
          },
        })
        .then((response) => {
          if (response.status === 200) {
            setYou(data["name"]);
            localStorage.setItem("username", data["name"]);
            props.set_user(data["name"]);
            props.get_friends();

            navigate("/chats");
            // User updated successfully
          } else if (response.status === 409) {
            alert("Username is taken");
            // Username conflict, handle accordingly
            console.log("Username already exists");
          } // Access the response data here
        })
        .catch((error) => {
          // This block of code will run if there's an error with the request (e.g., network error, status code 4xx or 5xx)
          setError(true);
          console.error("Error:", error);
        });
    } catch (error) {
      // This block of code will catch any synchronous errors that occur before the request is made
      setError(true);
      console.error("Synchronous error:", error);
    }
  }

  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = (e) => {
    e.preventDefault();
    setPasswordVisible(!passwordVisible);
  };

  const toggleLock = () => {
    setLock(!lock);
  };

  const [signUpFormData, setSignUpFormData] = useState({
    name: "",
    password: "",
    numbers: "",
    organisation: "",
    link: "",
    interest: "",
  });

  const [signUpErrors, setSignUpErrors] = useState({
    name: "",
    password: "",
    numbers: "",
    organisation: "",
    link: "",
    interest: "",
  });

  const handleSubmitSignUp = (e) => {
    e.preventDefault();
    handleSubmit(e);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignUpFormData({
      ...signUpFormData,
      [name]: value,
    });

    validateField(name, value);
  };

  // REGEX based form validation for Sign-Up Fields
  const validateField = (fieldName, fieldValue) => {
    const newErrors = { ...signUpErrors };

    switch (fieldName) {
      case "name":
        if (!fieldValue.trim() || fieldValue.length < 3) {
          newErrors.name = "Name is required and must be at least 3 characters";
        } else {
          newErrors.name = "";
        }
        break;

      case "password":
        const passwordRegex = /^(?=.*[a-z])(?=.*\d).{8,}$/;
        if (!passwordRegex.test(fieldValue)) {
          newErrors.password =
            "Password is required and must be at least 8 characters with one lowercase letter and one number";
        } else {
          newErrors.password = "";
        }
        break;

      case "numbers":
        const mobileRegex = /^\d{10}$/;
        if (!mobileRegex.test(fieldValue)) {
          newErrors.numbers = "Mobile number must be exactly 10 digits";
        } else {
          newErrors.numbers = "";
        }
        break;

      case "link":
        if (fieldValue.trim() && !isValidUrl(fieldValue)) {
          newErrors.link = "Please enter a valid URL";
        } else {
          newErrors.link = "";
        }
        break;

      default:
        break;
    }

    // Update errors state
    setSignUpErrors(newErrors);
  };

  // Helper function to check if a string is a valid URL
  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  };

  const isSubmitDisabled = Object.values(signUpErrors).some(
    (error) => error !== ""
  );
  
  // Return
  return (
    <div className="login">
      <div className="wrap">
        {!lock && (
          <div className="login_box" id="logIN">
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
              {touchedFields.login_name && (
                <div className="validation-message">
                  {isNameValid ? (
                    <span className="valid"></span>
                  ) : (
                    <span className="invalid">
                      Please enter username properly
                    </span>
                  )}
                </div>
              )}
              <input
                type={passwordVisible ? "text" : "password"}
                placeholder="Enter your Password"
                id="login_pass"
                required
                value={formData.login_pass}
                onChange={handleInputChange}
              />

              <button
                className="toggle-password-button"
                onClick={togglePasswordVisibility}
                type="button"
              >
                {passwordVisible ? (
                  <IconButton style={{ color: "#FFF" }}>
                    <VisibilityOffIcon />
                  </IconButton>
                ) : (
                  <IconButton style={{ color: "#FFF" }}>
                    <VisibilityIcon />
                  </IconButton>
                )}
              </button>

              {touchedFields.login_pass && (
                <div className="validation-message">
                  {isPasswordValid ? (
                    <span className="valid"></span>
                  ) : (
                    <span className="invalid">
                      Please enter password properly
                    </span>
                  )}
                </div>
              )}

              <Link to="/chats">
                <button
                  type="submit"
                  id="after_go"
                  onClick={login_and_toChats}
                  disabled={!(isPasswordValid && isNameValid)}
                >
                  Go to Chats
                </button>
              </Link>
            </form>

            <button type="button" id="sign_up_show" onClick={toggleLock}>
              No account? Sign Up
            </button>
          </div>
        )}

        {lock && (
          <div className="sign_up" id="signUP">
            <h1 id="login_title">Sign Up</h1>

            <form onSubmit={handleSubmitSignUp} id="sign" className="logs">
              <input
                type="text"
                name="name"
                placeholder="Create username"
                value={signUpFormData.name}
                onChange={handleChange}
              />
              {signUpErrors.name && (
                <div className="error">{signUpErrors.name}</div>
              )}
              <input
                type="password"
                name="password"
                placeholder="Create Password"
                value={signUpFormData.password}
                onChange={handleChange}
              />
              {signUpErrors.password && (
                <div className="error">{signUpErrors.password}</div>
              )}
              <input
                type="number"
                name="numbers"
                placeholder="Enter number"
                value={signUpFormData.numbers}
                onChange={handleChange}
              />
              {signUpErrors.numbers && (
                <div className="error">{signUpErrors.numbers}</div>
              )}
              <input
                type="text"
                name="organisation"
                placeholder="Enter Organisation"
                value={signUpFormData.organisation}
                onChange={handleChange}
              />
              {signUpErrors.organisation && (
                <div className="error">{signUpErrors.organisation}</div>
              )}
              <input
                type="text"
                name="link"
                placeholder="Enter DP link"
                value={signUpFormData.link}
                onChange={handleChange}
              />
              {signUpErrors.link && (
                <div className="error">{signUpErrors.link}</div>
              )}
              <input
                type="text"
                name="interest"
                placeholder="Enter your Aim/Interest"
                value={signUpFormData.interest}
                onChange={handleChange}
              />
              {signUpErrors.interest && (
                <div className="error">{signUpErrors.interest}</div>
              )}
              <button
                type="submit"
                id="sign_submit"
                disabled={isSubmitDisabled}
              >
                Submit
              </button>
            </form>
            <br></br>
            <br></br>
            <button type="button" id="sign_up_show" onClick={toggleLock}>
              Have an account. Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;
