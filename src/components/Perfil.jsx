import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
import imgPerfil from "../assets/img/default_profile.png";

function Perfil({ handleLogout }) {
  const { user } = useUser();
  const [ativo, setAtivo] = useState(false);

  const toggleAtivo = () => {
    setAtivo(!ativo);
  };

  return (
    <div className="perfil">
      <div className="perfil-image" onClick={toggleAtivo}>
        <img src={user?.photoURL || imgPerfil} alt="User Avatar" />
      </div>
      <ul
        style={{ display: ativo ? "flex" : "none" }}
        className="perfil-dropdown"
      >
        <li>
          <Link to="/mangaverse/config">
            <i className="fa-solid fa-cog"></i>
            <span>Configurações</span>
          </Link>
        </li>
        <li onClick={handleLogout}>
          <i className="fa-solid fa-right-from-bracket"></i>
          <span>Sair</span>
        </li>
      </ul>
    </div>
  );
}

export default Perfil;
