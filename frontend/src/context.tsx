import { createContext, ReactNode, useMemo, useState } from "react";

export interface UserContext {
  nickname: string;
  setNickname: React.Dispatch<React.SetStateAction<string>>;
}

export const AppContext = createContext<UserContext>({
  nickname: "",
  setNickname: (() => {}) as React.Dispatch<React.SetStateAction<string>>,
});

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [nickname, setNickname] = useState("");

  const contextValue = useMemo(
    () => ({ nickname, setNickname }),
    [nickname]
  );

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};
