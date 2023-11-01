import { AuthenticationStatus } from "@rainbow-me/rainbowkit";
import { PropsWithChildren, createContext, useContext, useEffect, useState } from "react";
import { Chain, useNetwork } from 'wagmi';

// define the props
type AuthState = {
  isSignedIn: boolean;
  isSupportedChain: boolean;
};

// 1. create a context with AuthState and initialize it to null
export const AuthContext = createContext<AuthState>({
  isSignedIn: false,
  isSupportedChain: true
});

const useAuth = (): AuthState => {
  // 2. use the useContext hook
  const context = useContext(AuthContext);

  // 3. Make sure it's not null!
  if (!context) {
    throw new Error("Please use AuthProvider in parent component");
  }

  return context;
};

type AuthProviderProps = {
  status: AuthenticationStatus;
  chains: Chain[];
} & PropsWithChildren;

export const AuthProvider = ({ status, chains, children }: AuthProviderProps) => {
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
  const { chain } = useNetwork()
  const isSupportedChain = chain ? chains.map(chain => chain.id).includes(chain?.id) : false;

  useEffect(() => {
    setIsSignedIn(status === 'authenticated')
  }, [status])

  return (
    <AuthContext.Provider value={{ isSignedIn, isSupportedChain }}>
      {children}
    </AuthContext.Provider>
  );
};

export default useAuth;

// define the props