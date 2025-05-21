import React, { useState, useEffect } from "react";
import LoginModal from "./LoginModal.jsx";
import RegisterModal from "./RegisterModal";
function Login({ isOpen, onClose }) {
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }

    return () => document.body.classList.remove("modal-open");
  }, [isOpen]);

  if (!isOpen) return null; // Se o modal não estiver aberto, não renderiza nada

  const toggleForms = () => {
    setShowRegister(!showRegister);
  };

  return (
    <div className="container-usersession">
      <div
        className="box-login"
        style={{ display: showRegister ? "none" : "flex" }}
      >
        <LoginModal onClose={onClose} toggleForms={toggleForms} />
      </div>

      <div
        className="box-register"
        style={{ display: showRegister ? "flex" : "none" }}
      >
        <RegisterModal onClose={onClose} toggleForms={toggleForms} />
      </div>
    </div>
  );
}

export default Login;
