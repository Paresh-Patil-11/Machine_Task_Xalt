import { useState } from "react";
import Blog from './Blog'
import axios from 'axios';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");

  let handleChange = (event) => {
    setForm([...form, { [event.target.name]: event.target.value }]);
  };

   let handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/login", form);
      setMessage(res.data.message);
      console.log("login successfully");
      window.location.href = './blog'
    } catch (err) {
      console.log("Form not submit", err);
    }
  };

  return (
    <>
      <div style={{ textAlign: "center", marginTop: "20px" }} id="forms">
        <h2>Login</h2>
        <input
          type="text"
          name="username"
          placeholder="Enter user name"
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Enter Password"
          onChange={handleChange}
        />
        <br></br>
         <br></br>
        <Button variant="outlined" onClick={handleLogin}>Login</Button>
      </div>
    </>
  );
}
