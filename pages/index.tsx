import Layout from 'components/Layout';
import type { NextPage } from 'next';
import Head from 'next/head';

const Home: NextPage = () => {
  return (<>
    <Head>
      <title>My page title</title>
    </Head>
    <Layout>
      Battlemon Content Page
    </Layout>
  </>);
};

export default Home;
