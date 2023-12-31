import Layout from 'components/Layout';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useAccount} from 'wagmi';

const Home: NextPage = () => {
  const { address } = useAccount();

  return (<>
    <Head>
      <title>Web3 App</title>
    </Head>
    <Layout>
      <div className='text-center text-white fs-5'>
        My Address:<br />{address}
      </div>
    </Layout>
  </>);
};

export default Home;
