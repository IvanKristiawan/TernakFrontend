import { createContext, useEffect, useReducer } from "react";

const INITIAL_STATE = {
  setting: JSON.parse(localStorage.getItem("setting")) || null,
  user: JSON.parse(localStorage.getItem("user")) || null,
  loading: false,
  error: null
};

window.onbeforeunload = function () {
  localStorage.clear();
};

export const AuthContext = createContext(INITIAL_STATE);

const AuthReducer = (state, action) => {
  switch (action.type) {
    case "REGISTER_START":
      return {
        setting: null,
        user: null,
        loading: true,
        error: null
      };
    case "REGISTER_SUCCESS":
      return {
        setting: action.setting,
        user: action.payload,
        loading: false,
        error: null
      };
    case "REGISTER_FAILURE":
      return {
        setting: null,
        user: null,
        loading: false,
        error: action.payload
      };
    case "LOGIN_START":
      return {
        setting: null,
        user: null,
        loading: true,
        error: null
      };
    case "LOGIN_SUCCESS":
      return {
        setting: action.setting,
        user: action.payload,
        loading: false,
        error: null
      };
    case "LOGIN_FAILURE":
      return {
        setting: null,
        user: null,
        loading: false,
        error: action.payload
      };
    case "LOGOUT":
      return {
        setting: null,
        user: null,
        loading: false,
        error: null
      };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(state.user));
    localStorage.setItem("setting", JSON.stringify(state.setting));
  }, [state.user, state.setting]);

  return (
    <AuthContext.Provider
      value={{
        setting: state.setting,
        user: state.user,
        loading: state.loading,
        error: state.error,
        dispatch
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
