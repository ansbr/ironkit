import { PropsWithChildren } from "react";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import useAuth from 'components/context/AuthContext';
import { useIsMounted } from "hooks/useIsMounted";

export default function Layout({ children }: PropsWithChildren) {
  const isMounted = useIsMounted()
  const { isSignedIn, isSupportedChain } = useAuth();
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignContent: 'stretch',
        alignItems: 'flex-start',
        minHeight: '100vh',
        boxSizing: 'border-box'
      }}
    >
      <div style={{
        flex: '0 1 auto',
        alignSelf: 'flex-end',
        padding: 15
      }}>
        <ConnectButton />
      </div>
      <main style={{
        flex: '1 1 auto',
        alignSelf: 'center',
        display: 'flex',
        alignItems: 'center',
      }}>
        { isMounted && !isSignedIn && <>
          Please Sign In
        </>}
        
        { isMounted && isSignedIn && !isSupportedChain && <>
          Please Change Network
        </>}

        { isMounted && isSignedIn && isSupportedChain && children}
      </main>
    </div>
  )
}