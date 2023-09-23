import React, { useRef, useState, useEffect } from "react";
import "./FileShare.css";
import axios from "axios";
import { Link, useNavigate  } from "react-router-dom";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import { Avatar, IconButton } from "@material-ui/core";

function FileShare() {
  const [file, setFile] = useState("");
  const [result, setResult] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const fileInputRef = useRef();
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.length === 0 || localStorage.getItem("username") === "") {
      // Do something when the condition is met, if needed.
      navigate("/");
    } else {
      console.log(localStorage.getItem("username"));
      
    }
  }, []);

  function handleClick() {
    const text = result;
    navigator.clipboard
      .writeText(text)
      .then(() => setIsCopied(true))
      .catch((err) => console.error("Failed to copy text: ", err));
  }

  const uploadfile = async (data) => {
    try {
      let response = await axios.post("http://localhost:27017/upload", data);
      return response.data;
    } catch (error) {
      console.error("This is error ", error.message);
    }
  };

  useEffect(() => {
    const getImage = async () => {
      if (file) {
        const data = new FormData();
        data.append("name", file.name);
        data.append("file", file);

        let response = await uploadfile(data);
        setResult(response.path);
      }
    };
    getImage();
  }, [file]);

  const onuploads = () => {
    fileInputRef.current.click();
  };

  console.log(file);
  return (
    <div className="fille">
      <div className="filebox">
        <Link to="/chats">
          <IconButton
            style={{
              backgroundColor: "#2A3166",
              color: "white",
              display: "flex",
              float: "right",
            }}
          >
            <ArrowForwardIosOutlinedIcon />
          </IconButton>
        </Link>
        <h1 id="file_head">File Share</h1>
        <div id="notes">
          Click the button input and generate the Link
          <button onClick={onuploads} id="uploadbut">
            Upload
          </button>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={(e) => setFile(e.target.files[0])}
          />
          Link to Download
          <a href={result} target="_blank" id="filelink">
            {result}
          </a>
          Link to Copy
          <div onClick={handleClick} id="copier">
            {result}
            {isCopied && <span> (Copied!)</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FileShare;
