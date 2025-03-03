import React, { createContext, useContext, useState, ReactNode } from 'react';

// Defina a interface das propriedades do contexto
interface LayoutContextProps {
  inputStyle: string;
  colorScheme: string;
  // Adicione outras propriedades se necessário
}

// Crie o contexto com um valor padrão
const LayoutContext = createContext<LayoutContextProps>({
  inputStyle: 'filled', // ou qualquer valor padrão
  colorScheme: 'light', // ou qualquer valor padrão
});

// Defina a interface das propriedades do provedor
interface LayoutProviderProps {
  children: ReactNode;
}

export const LayoutProvider: React.FC<LayoutProviderProps> = ({ children }) => {
  const [inputStyle, setInputStyle] = useState('filled');
  const [colorScheme, setColorScheme] = useState('light');

  return (
    <LayoutContext.Provider value={{ inputStyle, colorScheme }}>
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayoutContext = () => useContext(LayoutContext);
