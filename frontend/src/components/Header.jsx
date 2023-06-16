import React from "react";
import { Link } from "react-router-dom";

function Header() {
  return (
    <div className="header">
      <div className="header__left">
        <Link to="/" className="header__logo">
          <h2>MernAuth</h2>
        </Link>
      </div>
      <div className="header__right">
        <Link to="/login" className="header__button">
          Login
        </Link>
        <Link to="/signup" className="header__button header__button--alt">
          Sign Up
        </Link>
      </div>
    </div>
  );
}

export default Header;