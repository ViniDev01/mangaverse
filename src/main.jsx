import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./css/index.css";
import Home from "./home.jsx";
import Manga from "./pages/manga.jsx";
import Chapter from "./pages/chapter.jsx";
import Configuracoes from "./pages/config.jsx";
import { UserProvider } from "./context/UserContext";
import { ConfigProvider } from "./context/ConfigContext"; // Importa o ConfigProvider
import { ThemaProvider } from "./context/ThemaContext"; // Importa o ThemaProvider

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <UserProvider>
      <ConfigProvider>
        <ThemaProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />{" "}
              {/* Rota para a página inicial */}
              <Route path="/manga/:id" element={<Manga />} />{" "}
              {/* Rota para a página de detalhes do mangá */}
              <Route path="/manga/:mangaId/:chapterId" element={<Chapter />} />
              <Route path="mangaverse/config" element={<Configuracoes />} />
              <Route path="*" element={<div>404 Not Found</div>} />{" "}
              {/* Rota para páginas não encontradas */}
            </Routes>
          </Router>
        </ThemaProvider>
      </ConfigProvider>
    </UserProvider>
  </React.StrictMode>
);
