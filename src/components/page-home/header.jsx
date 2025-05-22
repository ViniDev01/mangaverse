import React, { useState, useEffect, useRef } from "react";
import { db } from "../../firebase/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import { useUser } from "../../context/useUser";
import Perfil from "../Perfil";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";

function Header({ openLogin, showComments }) {
  const [visivel, setVisivel] = useState(false);
  const [valor, setValor] = useState("");
  const [resultados, setResultados] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const menuRef = useRef(null);
  const { user } = useUser();

  const buscarMangas = async (termo) => {
    try {
      const q = query(
        collection(db, "containerMangas"),
        where("title", ">=", termo),
        where("title", "<=", termo + "\uf8ff")
      );

      const querySnapshot = await getDocs(q);
      const dados = [];
      querySnapshot.forEach((doc) => {
        dados.push({ id: doc.id, ...doc.data() });
      });
      setResultados(dados);
    } catch (e) {
      console.error("Erro ao buscar mangás: ", e);
    }
  };

  useEffect(() => {
    const termo = valor.trim().toLowerCase();
    if (termo === "") {
      setResultados([]);
      return;
    }

    const debounceTimer = setTimeout(() => {
      buscarMangas(termo);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [valor]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        visivel &&
        containerRef.current &&
        !containerRef.current.contains(e.target)
      ) {
        setVisivel(false);
      }
      if (isOpen && menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [visivel, isOpen]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("Saiu com sucesso!");
      // Aqui você pode fechar o dropdown, redirecionar, etc.
    } catch (error) {
      console.error("Erro ao sair:", error);
    }
  };

  return (
    <header className={`${showComments ? "show" : ""}`}>
      <div
        className="container-pesquisa"
        ref={containerRef}
        style={{ display: visivel ? "block" : "none" }}
      >
        <div className="input-pesquisa">
          <input
            type="text"
            id="pesq"
            placeholder="Buscar mangá..."
            value={valor}
            onChange={(e) => setValor(e.target.value)}
          />
          <button>Buscar</button>
        </div>

        {resultados.length > 0 && (
          <div className="box-pesquisa">
            {resultados.map((manga) => (
              <Link
                key={manga.id}
                to={`manga/${manga.id}`}
                style={{ textDecoration: "none" }}
                onClick={() => setVisivel(false)}
              >
                <div className="box">
                  <img src={manga.image} alt={manga.title} />
                  <div className="info-box-pesquisa">
                    <h1>{manga.title}</h1>
                    <span>
                      em andamento <i></i> cap
                    </span>
                    <span className="generos">ação, aventura, comédia</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="center">
        <div className="logo-header">
          <Link to="/" className="logo">
            MangaVerse
          </Link>
        </div>

        <nav className="desktop">
          <ul>
            <li>Projetos</li>
            <li>Blog</li>
            <li>Grupos</li>
            <li>Discord</li>
          </ul>
        </nav>

        <nav className="mobile" ref={menuRef}>
          <i
            onClick={toggleMenu}
            className="fa-solid fa-bars closh-menu"
            aria-label="Abrir menu"
          />
          <div style={{ display: isOpen ? "block" : "none" }}>
            <ul>
              <li>
                <span>Projetos</span>
              </li>
              <li>
                <span>Blog</span>
              </li>
              <li>
                <span>Grupos</span>
              </li>
              <li>
                <span>Discord</span>
              </li>
              <li>
                <a href="#" onClick={openLogin}>
                  <span>Login</span>
                </a>
              </li>
            </ul>
          </div>
        </nav>

        <div className="site-controls">
          <div>
            <input
              type="checkbox"
              className="checkbox"
              id="chk"
              aria-label="Alternar tema"
            />
            <label className="label" htmlFor="chk">
              <i className="fa-solid fa-moon"></i>
              <i className="fa-solid fa-sun"></i>
              <div className="ball"></div>
            </label>
          </div>
          <button
            onClick={() => setVisivel(!visivel)}
            className="search-button"
            aria-label="Abrir busca"
            aria-expanded={visivel}
          >
            <i className="fa-solid fa-magnifying-glass"></i>
          </button>
          {user ? (
            <Perfil handleLogout={handleLogout} />
          ) : (
            <span className="login-button" onClick={openLogin}>
              Login
            </span>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
