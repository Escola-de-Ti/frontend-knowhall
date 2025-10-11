import React from "react";
import "../styles/SlideLogin.css";
import { useNavigate } from "react-router-dom";

export default function SlideLogin() {
  const navigate = useNavigate();

  return (
    <div className="slide-container">
      <div className="slide-register" onClick={() => navigate("/cadastro")}>
        Cadastre-se
      </div>
      <div className="slide-login" onClick={() => navigate("/login")}>
        Login
      </div>
    </div>
  );
}