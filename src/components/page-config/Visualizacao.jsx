import { useConfig } from '../../context/ConfigContext';
import { useThema } from '../../context/ThemaContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';
function Visualizacao() {

  const { fontSize, setFontSize, visualizacao, setVisualizacao } = useConfig();
  const { theme, setTheme } = useThema();  
  const handleChange = (e) => {
    setTheme(e.target.value); // 'claro', 'escuro' ou 'padrao'
  };



  return (
    <div className="visualizacao">
      <h2>Visualização de Dados</h2>
      <div className="visualizacao__container">

        <div className="visualizacao__item">
          <label>Tema claro/escuro</label>
          <label className="visualizacao__checkbox">
            <input 
            type="radio" 
            name="tema" 
            value="escuro" 
            checked={theme === 'escuro'}
            onChange={handleChange}
            />
            Escuro
          </label>
          <label className="visualizacao__checkbox">
            <input 
            type="radio" 
            name="tema" 
            value="claro" 
            checked={theme === 'claro'}
            onChange={handleChange}
            />
            Claro
          </label>

          <label className="visualizacao__checkbox">
            <input 
            type="radio" 
            name="tema" 
            value="padrao" 
            checked={theme === 'padrao'}
            onChange={handleChange}
            />
            Padrão
          </label>
        </div>

        <div className="visualizacao__item">
        <label>Tamanho da fonte:</label>
        <select value={fontSize} onChange={(e) => setFontSize(e.target.value)}>
          <option value="small">Pequeno</option>
          <option value="medium">Médio</option>
          <option value="large">Grande</option>
        </select>
        </div>

        <div className="visualizacao__item">
          <label>Visualização por página única ou dupla</label>
          <div className='exemplo-container'>
            <div className={`exemplo-box ${visualizacao === 'single' ? 'ativo' : ''}`} onClick={() => setVisualizacao('single')}>
              <div className='exemplo'>
                <h2>Page1</h2>
                <ul>
                  <li><ChevronLeft /></li>
                  <li><ChevronRight /></li>
                </ul>
                </div>
            </div>
            <div className={`exemplo-box ${visualizacao === 'double' ? 'ativo' : ''}`} onClick={() => setVisualizacao('double')}>
              <div className='exemplo'>
                <h2>Page1</h2>
                </div>
                <ul>
                  <li><ChevronLeft /></li>
                  <li><ChevronRight /></li>
                </ul>
              <div className='exemplo'>
                <h2>Page2</h2>       
              </div>
            </div>
          </div>
        </div>

        <div className="visualizacao__item">
          <label>Modo de leitura</label>
          <div className="visualizacao__options">
            <div className="visualizacao__box">
              <div className="visualizacao__preview horizontal">
                <div className="pagina" />
                <div className="pagina" />
                <div className="pagina" />
              </div>
              <p>Horizontal</p>
            </div>
            
            <div className="visualizacao__box">
              <div className="visualizacao__preview vertical">
                <div className="pagina" />
                <div className="pagina" />
                <div className="pagina" />
              </div>
              <p>Vertical</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Visualizacao;