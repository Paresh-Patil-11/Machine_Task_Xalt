import { useState } from "react";
import axios from 'axios';
import Button from '@mui/material/Button';

export default function Register() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");

  let handleChange = (event) => {
    setForm([...form, { [event.target.name]: event.target.value }]);
  };
  let handleRegister = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/register", form);
      setMessage(res.data.message);
      console.log("Form submit");
    } catch (err) {
      console.log("Form not submit", err);
    }
  };

  return (
    <>
      <div style={{ textAlign: "center", marginTop: "20px" }}  id="forms">
        <h2>Register</h2>
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
        <Button variant="outlined" onClick={handleRegister}>Register</Button>
        <p>{message}</p>
      </div>
    </>
  );
}
