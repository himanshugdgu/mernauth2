import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    sendRequest().then(() => {
      navigate("/");
    });
  };

  const handleChange = (event) => {
    setInputs((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
    console.log(inputs);
  };

  const sendRequest = async () => {
    const res = await axios
      .post("http://localhost:5000/api/login", {
        email: inputs.email,
        password: inputs.password,
      })
      .catch((err) => {
        console.log("Error", err);
      });
    const data = await res.data;
    console.log(data);

    // if (response && response.data) {
    //   const data = response.data;
    //   console.log(data);
    //   return data;
    // } else {
    //   throw new Error("Invalid response from server");
    // }
  };

  return (
    <div className="signup">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={inputs.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={inputs.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account? <Link to="/signup">Sign up</Link>
      </p>
    </div>
  );
}

export default Login;
