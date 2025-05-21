import { BookOpenText } from "lucide-react";
import { TvMinimal } from "lucide-react";
import { LibraryBig } from "lucide-react";
import { UserRoundPen } from "lucide-react";
import { Globe } from "lucide-react";
import { Settings } from "lucide-react";
import { Info } from "lucide-react";

import Visualizacao from "./Visualizacao.jsx"; // Importando o componente Visualizacao
import React from "react";
import "../../css/BoxConfig.css"; // Importando o arquivo CSS para estilização

function BoxConfig() {
  const [abaAtiva, setAbaAtiva] = React.useState("visualizacao"); // Estado para controlar a aba ativa

  const renderComponente = () => {
    switch (abaAtiva) {
      case "visualizacao":
        return <Visualizacao />; // Renderiza o componente Visualizacao
      default:
        return null; // Renderiza o componente padrão Visualizacao
    }
  };
  return (
    <div className="box-config">
      <div className="box-config-left">
        <h2>Configurações</h2>
        <button onClick={() => setAbaAtiva("visualizacao")}>
          <TvMinimal /> <p>Visualização</p>
        </button>
        <button onClick={() => setAbaAtiva("")}>
          <BookOpenText /> Leitura
        </button>
        <button onClick={() => setAbaAtiva("")}>
          <LibraryBig /> Histórico & Biblioteca
        </button>
        <button onClick={() => setAbaAtiva("")}>
          <UserRoundPen /> Conta
        </button>
        <button onClick={() => setAbaAtiva("")}>
          <Globe /> Idioma
        </button>
        <button onClick={() => setAbaAtiva("")}>
          <Settings /> Avançado
        </button>
        <button onClick={() => setAbaAtiva("")}>
          <Info /> Ajuda
        </button>
      </div>

      <div className="box-config-right">{renderComponente()}</div>
    </div>
  );
}

export default BoxConfig;
