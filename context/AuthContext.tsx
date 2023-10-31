import { AuthenticationStatus } from "@rainbow-me/rainbowkit";
import { PropsWithChildren, createContext, useContext, useEffect, useState } from "react";

// define the props
type AuthState = {
  status: AuthenticationStatus;
  isSignedIn: boolean;
};

// 1. create a context with ThemeState and initialize it to null
export const AuthContext = createContext<AuthState>({
  status: 'unauthenticated',
  isSignedIn: false
});

const useAuth = (): AuthState => {
  // 2. use the useContext hook
  const context = useContext(AuthContext);

  // 3. Make sure it's not null!
  if (!context) {
    throw new Error("Please use ThemeProvider in parent component");
  }

  return context;
};

type AuthProviderProps = {
  status: AuthenticationStatus;
} & PropsWithChildren;

export const AuthProvider = ({ status, children }: AuthProviderProps) => {
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);

  useEffect(() => {
    setIsSignedIn(status === 'authenticated')
  }, [status])

  return (
    <AuthContext.Provider value={{ status, isSignedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export default useAuth;

// define the props