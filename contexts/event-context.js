import React, { createContext, useState } from "react";

export const EventContext = React.createContext();

export const EventProvider = ({ children }) => {
  const [event, setEvent] = useState({});
  return (
    <EventContext.Provider value={{ event, setEvent }}>{children}</EventContext.Provider>
  );
};
