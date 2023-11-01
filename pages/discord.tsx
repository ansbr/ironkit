import Layout from 'components/Layout';
import type { NextPage } from 'next';
import Head from 'next/head';

const Home: NextPage = () => {
  return (<>
    <Head>
      <title>Auth with Discord</title>
    </Head>
    <Layout>
      <div className='text-center text-white fs-5'>
        Auth with Discord
      </div>
    </Layout>
  </>);
};

export default Home;
