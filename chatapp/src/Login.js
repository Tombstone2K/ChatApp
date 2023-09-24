import React, { useState, useEffect } from "react";
import "./Login.css";
import { useYou } from "./Helper";
import { Link, useNavigate } from "react-router-dom";

import axios from "axios";
var bcrypt = require("bcryptjs");
function Login(props) {
  const { you, setYou } = useYou();
  const [lock, setLock] = useState(false); // to disable the input and submit
  const [error, setError] = useState(false);

  const [touchedFields, setTouchedFields] = useState({
    login_name: false,
    login_pass: false,
  });

  // to create a red div in registration on  error
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.length === 0 || localStorage.getItem("username") === "") {
      // Do something when the condition is met, if needed.
    } else {
      console.log(localStorage.getItem("username"));
      navigate("/chats");
    }
  }, []);

  const [isNameValid, setIsNameValid] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);

  const validateForm = () => {
    const { login_name, login_pass } = formData;

    const usernameRegex = /^[a-zA-Z0-9_]{3,}$/;
    const isNameValid = usernameRegex.test(login_name);

    // Password validation regex
    //(?=.*[A-Z])
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
    // console.log(e.target);
    setFormData({ ...formData, [id]: value });

    setTouchedFields({
      ...touchedFields,
      [id]: true,
    });

    // validateLoginField(id, value);
    // validateForm();
  };

  // const validateLoginField = (fieldName, fieldValue) => {
  //   // Initialize error message for the field
  //   let errorMessage = '';

  //   switch (fieldName) {
  //     case 'login_name':
  //       // Example validation for the login_name field (required)
  //       if (!fieldValue.trim()) {
  //         errorMessage = 'Name is required';
  //       }
  //       break;

  //     case 'login_pass':
  //       // Example validation for the login_pass field (required)
  //       if (!fieldValue.trim()) {
  //         errorMessage = 'Password is required';
  //       }
  //       break;

  //     // Add more cases for other fields as needed

  //     default:
  //       break;
  //   }

  //   // Update error message for the field
  //   setFieldErrorMessage(fieldName, errorMessage);
  // };

  // const setFieldErrorMessage = (fieldName, errorMessage) => {
  //   // Check if there is an error message for the field
  //   const fieldHasError = errorMessage !== '';

  //   // Set the error message for the field
  //   setTouchedFields({
  //     ...touchedFields,
  //     [fieldName]: fieldHasError,
  //   });

  //   // Check if the entire form is valid
  //   const formIsValid = Object.values(touchedFields).every((field) => field === false);

  //   // Update the form validity state
  //   setIsFormValid(formIsValid);
  // };

  useEffect(() => {
    // Call validateForm whenever formData changes
    validateForm();
  }, [formData]);

  const login_and_toChats = async (e) => {
    e.preventDefault();

    // Check if both fields are filled
    if (
      formData["login_name"].trim() === "" ||
      formData["login_pass"].trim() === ""
    ) {
      alert("Please fill in both fields");
      return;
    }

    try {
      // const hashedPassword = await bcrypt.hash(formData['login_pass'], 10);
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
        // console.log("Function login_and_toChats is called");
        setYou(formData.login_name);

        // setYou(document.getElementById("login_name").value);
        localStorage.setItem("username", formData.login_name);
        props.set_user(formData.login_name);
        props.get_friends();
        console.log(you);
        console.log("GOING TO CHATS");
        navigate("/chats");
        // Login successful
        // Redirect the user to another page or perform any desired action
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    const name = event.target.elements.name.value;
    // const password = event.target.elements.password.value;
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
            console.log(you);
            console.log("GOING TO CHATS");
            navigate("/chats");
            // User updated successfully
          } else if (response.status === 409) {
            alert("Username is taken");
            // Username conflict, handle accordingly
            console.log("Username already exists");
            // You might want to display a message to the user or take some other action
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
  // const [password, setPassword] = useState('');

  const togglePasswordVisibility = (e) => {
    e.preventDefault();
    setPasswordVisible(!passwordVisible);
  };

  const toggleLock = () => {
    setLock(!lock);
  };

  ///////

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
    // console.log("HERERERE");
    // // Validate form fields
    // const newErrors = {};
    // let hasErrors = false;

    // // Validation logic for the name field (required, min 3 chars)
    // if (!signUpFormData.name.trim() || signUpFormData.name.length < 3) {
    //   newErrors.name = 'Name is required and must be at least 3 characters';
    //   hasErrors = true;
    // }

    // // Validation logic for the password field (required, min 8 chars, one lowercase, and one number)
    // const passwordRegex = /^(?=.*[a-z])(?=.*\d).{8,}$/;
    // if (!passwordRegex.test(signUpFormData.password)) {
    //   newErrors.password =
    //     'Password is required and must be at least 8 characters with one lowercase letter and one number';
    //   hasErrors = true;
    // }

    // // Validation logic for the numbers field (numeric, 10 digits)
    // const mobileRegex = /^\d{10}$/;
    // if (!mobileRegex.test(signUpFormData.numbers)) {
    //   newErrors.numbers = 'Mobile number must be exactly 10 digits';
    //   hasErrors = true;
    // }

    // // Validation logic for the link field (optional, valid URL)
    // if (signUpFormData.link.trim() && !isValidUrl(signUpFormData.link)) {
    //   newErrors.link = 'Please enter a valid URL';
    //   hasErrors = true;
    // }

    // // Update errors state
    // setSignUpErrors(newErrors);

    // If there are no errors, submit the form

    handleSubmit(e);
    // Perform form submission logic here
    // For now, you can just display a success message
    // alert("Form submitted successfully");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignUpFormData({
      ...signUpFormData,
      [name]: value,
    });

    validateField(name, value);
  };

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

      // Handle other fields as needed

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

              {/* <input type="text" placeholder="Enter your Name" id="login_name" required onChange={handleInputChange}/>
            <input type={passwordVisible ? 'text' : 'password'} placeholder="Enter your Password" id="login_pass" required onChange={handleInputChange}/> */}
              <button
                className="toggle-password-button"
                onClick={togglePasswordVisibility}
                type="button"
              >
                {passwordVisible ? "🙈" : "👁️"}
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
            {/* <form onSubmit={handleSubmit} id="sign" className="logs">
              <input type="text" name="name" placeholder="Create username" />
              <input
                type="password"
                name="password"
                placeholder="Create Password"
              />
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
            </form> */}
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
