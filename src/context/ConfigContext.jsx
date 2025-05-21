
import { createContext, useContext, useState, useEffect } from 'react';

const ConfigContext = createContext();

export function ConfigProvider({ children }) {
  const [visualizacao, setVisualizacao] = useState('single'); // valores: 'grid', 'list'
  const [fontSize, setFontSize] = useState('medium'); // valores: 'small', 'medium', 'large'

  useEffect(() => {
    const savedSize = localStorage.getItem('fontSize');
    if (savedSize) setFontSize(savedSize);
  }, []);

  useEffect(() => {
    localStorage.setItem('fontSize', fontSize);
  }, [fontSize]);

  return (
    <ConfigContext.Provider value={{ visualizacao, setVisualizacao, fontSize, setFontSize }}>
      {children}
    </ConfigContext.Provider>
  );
}

export const useConfig = () => useContext(ConfigContext);
