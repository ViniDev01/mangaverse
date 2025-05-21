

const ModoLeitura = ({ modo, setModo}) => {
    return (
        <div className="filter-redimencao">
                {/* Selecionador de Modo de Leitura */}
                <select value={modo} onChange={(e) => setModo(e.target.value)}>
                  <option value="horizontal">Horizontal</option>
                  <option value="vertical">Vertical</option>
                </select>
              </div>
    );
}

export default ModoLeitura;