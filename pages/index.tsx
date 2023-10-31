import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import useAuth from 'context/AuthContext';

const Home: NextPage = () => {
  const { isSignedIn } = useAuth();

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        padding: 12,
      }}
    >
      <ConnectButton />
      {isSignedIn && <>
        Контент
      </>}
      {!isSignedIn && <>
        Залогинтесь пожалуйста
      </>}
    </div>
  );
};

export default Home;
