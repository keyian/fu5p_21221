import React, { useState, createContext } from "react";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const [login, setLogin] = useState(false);
  const [userData, setUserData] = useState({});
  let fr = '/client/public';
  if(process.env.NODE_ENV === 'production') {
    fr = '/client/build';
  } 
  
  const [fileRoot, setFileRoot] = useState(""+fr);
  

  return (
    <AppContext.Provider
      value={{
        login, setLogin, userData, setUserData, fileRoot, setFileRoot
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};