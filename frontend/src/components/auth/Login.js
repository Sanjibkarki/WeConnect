import React, { useState } from "react";
import { Navigate,Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { login } from "../../reducers/auth";
import axios from "axios";
function Login1(){
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const dispatch = useDispatch();

  const { email, password } = formData;
  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async e => {
    e.preventDefault();
    dispatch(login(email, password));
  };
  if (isAuthenticated) {
    return <Navigate replace to="/" />;
    
    
  }

  return (
    <>
    <div className="container">
      <div className="form-wrapper">
        <h1 className="large text-primary">Sign In</h1>
        <p className="lead">
          <i className="fas fa-user"></i> Sign Into Your Account
        </p>
        <form className="form" onSubmit={onSubmit}>
          <div className="form-group">
            <input
              type="email"
              placeholder="Email Address"
              name="email"
              value={email}
              onChange={onChange}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              name="password"
              minLength="6"
              value={password}
              onChange={onChange}
            />
          </div>
          <input type="submit" className="btn btn-primary" value="Login" />
        </form>
        <p className="my-1">
          Don't have an account? <Link to="/register">Sign Up</Link>
        </p>
      </div>
    </div>
    </>
  );
};

export default Login1;
