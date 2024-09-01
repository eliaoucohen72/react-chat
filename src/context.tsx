import { createContext, ReactNode, useMemo, useState } from "react";
import { Context } from "./interface";

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [isCalling, setIsCalling] = useState(false);

  const contextValue = useMemo(
    () => ({ isCalling, setIsCalling }),
    [isCalling]
  );

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

export const AppContext = createContext<Context>({
  isCalling: false,
  setIsCalling: () => {},
});
