import React, { createContext, useReducer, useContext, ReactNode } from "react";

type StateType = {
  user: string | null;
  mode: "light" | "dark";
};

type ActionType = {
  type: "SET_USER" | "SET_MODE";
  payload?: any;
};

const initialState: StateType = {
  user: null,
  mode: "light",
};

const reducer = (state: StateType, action: ActionType): StateType => {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload };
    case "SET_MODE":
      return { ...state, mode: action.payload };
    default:
      return state;
  }
};

const GlobalStateContext = createContext<
  [StateType, React.Dispatch<ActionType>]
>([initialState, () => initialState]);

export const GlobalStateProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <GlobalStateContext.Provider value={[state, dispatch]}>
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = () => useContext(GlobalStateContext);
