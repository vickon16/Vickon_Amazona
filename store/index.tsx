import { createContext, useContext, useReducer } from "react";
import { storeAction, storeInitialState, storeReducer, storeState } from "./storeReducer";

type userContextType = {
  state: storeState;
  dispatch: React.Dispatch<storeAction>;
};

const StoreContext = createContext({} as userContextType);

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(storeReducer, storeInitialState);

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStoreContext = () => useContext(StoreContext);
