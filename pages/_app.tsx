// This example is based on the wagmi SIWE tutorial
// https://wagmi.sh/examples/sign-in-with-ethereum
import '../styles/global.css';
import '@rainbow-me/rainbowkit/styles.css';
import type { AppProps } from 'next/app';
import {
  RainbowKitProvider,
  connectorsForWallets,
  createAuthenticationAdapter,
  RainbowKitAuthenticationProvider,
  AuthenticationStatus,
  Wallet,
  darkTheme
} from '@rainbow-me/rainbowkit';
import {
  metaMaskWallet,
  trustWallet,
  ledgerWallet,
  coinbaseWallet,
  okxWallet,
  bitgetWallet
} from '@rainbow-me/rainbowkit/wallets';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import {
  linea,
  lineaTestnet
} from 'wagmi/chains';
import { RoninConnector, ronin, saigon } from 'ronin-connector'
import { publicProvider } from 'wagmi/providers/public';
import { SiweMessage } from 'siwe';
import { useEffect, useMemo, useRef, useState } from 'react';
import { AuthProvider } from 'components/context/AuthContext';

const evmChains = process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [lineaTestnet] : [linea]
const roninChains = process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [saigon] : [ronin]
const chainList = [...evmChains, ...roninChains];

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [...evmChains],
  [publicProvider()]
);

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!;

const roninWallet = ({ projectId }: { projectId: string }): Wallet => ({
  id: 'ronin',
  name: 'Ronin',
  iconUrl: 'https://docs.skymavis.com/img/ronin.svg',
  iconBackground: '#004de5',
  createConnector: () => {
    return {
      connector: new RoninConnector({
        chains: roninChains,
        options: {
          projectId
        }
      })
    }
  }
})

const connectors = connectorsForWallets([
  {
    groupName: 'Popular',
    wallets: [
      metaMaskWallet({ projectId, chains }),
      roninWallet({ projectId }),
      coinbaseWallet({ appName: 'Battlemon', chains }),
      okxWallet({ projectId, chains }),
      bitgetWallet({ projectId, chains }),
      trustWallet({ projectId, chains }),
      ledgerWallet({ projectId, chains }),
    ],
  },
]);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

export default function App({ Component, pageProps }: AppProps) {
  const fetchingStatusRef = useRef(false);
  const verifyingRef = useRef(false);
  const [authStatus, setAuthStatus] = useState<AuthenticationStatus>('loading');

  // Fetch user when:
  useEffect(() => {
    const fetchStatus = async () => {
      if (fetchingStatusRef.current || verifyingRef.current) {
        return;
      }

      fetchingStatusRef.current = true;

      try {
        const response = await fetch('/api/me');
        const json = await response.json();
        setAuthStatus(json.address ? 'authenticated' : 'unauthenticated');
      } catch (_error) {
        setAuthStatus('unauthenticated');
      } finally {
        fetchingStatusRef.current = false;
      }
    };

    // 1. page loads
    fetchStatus();

    // 2. window is focused (in case user logs out of another window)
    window.addEventListener('focus', fetchStatus);
    return () => window.removeEventListener('focus', fetchStatus);
  }, []);

  const authAdapter = useMemo(() => {
    return createAuthenticationAdapter({
      
      getNonce: async () => {
        const response = await fetch('/api/nonce');
        return await response.text();
      },

      createMessage: ({ nonce, address, chainId }) => {
        return new SiweMessage({
          domain: window.location.hostname,
          address,
          uri: window.location.origin,
          version: '1',
          chainId,
          nonce,
          statement: 'Sign in with Ethereum to the app.',
        });
      },

      getMessageBody: ({ message }) => {
        const msg = message.prepareMessage();
        return msg;
      },

      verify: async ({ message, signature }) => {
        verifyingRef.current = true;

        try {
          const response = await fetch('/api/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message, signature }),
          });

          const authenticated = Boolean(response.ok);

          if (authenticated) {
            setAuthStatus(authenticated ? 'authenticated' : 'unauthenticated');
          }

          return authenticated;
        } catch (error) {
          return false;
        } finally {
          verifyingRef.current = false;
        }
      },

      signOut: async () => {
        setAuthStatus('unauthenticated');
        await fetch('/api/logout');
      },
    });
  }, []);

  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitAuthenticationProvider
        adapter={authAdapter}
        status={authStatus}
      >
        <RainbowKitProvider chains={chains} theme={darkTheme()}>
          <AuthProvider status={authStatus} chains={chainList}>
            <Component {...pageProps} />
          </AuthProvider>
        </RainbowKitProvider>
      </RainbowKitAuthenticationProvider>
    </WagmiConfig>
  );
}
