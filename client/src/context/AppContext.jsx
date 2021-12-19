import React, { useState, createContext } from "react";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const [login, setLogin] = useState(false);
  const [userData, setUserData] = useState({});
  

  return (
    <AppContext.Provider
      value={{
        login, setLogin, userData, setUserData
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};