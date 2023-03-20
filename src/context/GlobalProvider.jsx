import { ChakraProvider } from "@chakra-ui/react";

const { createContext, useContext, useState } = require("react");

const GlobalContext = createContext();

export default function GlobalProvider({ children }) {
  const [globalState, setGlobalState] = useState({});

  function setGlobalValue(name, value) {
    setGlobalState({ ...globalState, [name]: value });
  }

  return (
    <GlobalContext.Provider value={{ globalState, setGlobalValue }}>      
      {children}
    </GlobalContext.Provider>
  )
}

export function useGlobalContext() {
  return useContext(GlobalContext);
}

export function useGlobalState(name, defaultValue) {
  const { globalState, setGlobalValue } = useGlobalContext();
  const value = globalState[name] ?? defaultValue;
  const setValue = input => setGlobalValue(name, typeof input === "function" ? input(value) : input);
  return [value, setValue];
}

export function useSetGlobalValue() {
  return useGlobalContext().setGlobalValue;
}