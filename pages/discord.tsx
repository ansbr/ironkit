import Layout from 'components/Layout';
import useDiscord, { DiscordProvider } from 'components/context/DiscordContext';
import type { NextPage } from 'next';
import Head from 'next/head';

const Discord = () => {
  const { signInDiscord, discordUser } = useDiscord();

  return (<>
    <Head>
      <title>Auth with Discord</title>
    </Head>
    <Layout>
      <div className='text-white'>
        <ol className="list-group list-group-numbered" style={{width: '340px'}}>
          <li className="list-group-item d-flex justify-content-between align-items-start">
            <div className="ms-2 me-auto">
              <div className="fw-bold">
                {discordUser ? <s>Sign In with Discord</s> : <>Sign In with Discord</>}
                </div>
              {discordUser && <>Welcome {discordUser}</>}
            </div>
            {!discordUser && <button className="btn btn-success btn-sm py-0" onClick={signInDiscord}>
              Sign in
            </button>}
            {discordUser && <span className="badge bg-primary rounded-pill">Done</span>}
          </li>
          <li className="list-group-item d-flex justify-content-between align-items-start">
            <div className="ms-2 me-auto">
              <div className="fw-bold">Verify yourself</div>
              Verification using on Battlemon Server
            </div>
            {<button className="btn btn-success btn-sm py-0" onClick={() => {}}>
              Verify
            </button>}
          </li>
          <li className="list-group-item d-flex justify-content-between align-items-start">
            <div className="ms-2 me-auto">
              <div className="fw-bold">Congratulations!</div>
              Now you can claim your free chest.
            </div>
            {<button className="btn btn-success btn-sm py-0" onClick={() => {}}>
              Claim
            </button>}
          </li>
        </ol>

      </div>
    </Layout>
  </>);
};

const DiscordPage: NextPage = () => {
  return <DiscordProvider>
    <Discord />
  </DiscordProvider>
}

export default DiscordPage;
