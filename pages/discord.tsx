import Layout from 'components/Layout';
import useDiscord, { DiscordProvider } from 'components/context/DiscordContext';
import type { NextPage } from 'next';
import Head from 'next/head';

const Discord = () => {
  const { signInDiscord, discordUser, isJoinedDiscord, verifyJoinDiscord } = useDiscord();

  return (<>
    <Head>
      <title>Auth with Discord</title>
    </Head>
    <Layout>
      <ol className="list-group list-group-numbered w-100 mx-auto" style={{maxWidth: '500px'}}>
        <li className="list-group-item d-flex justify-content-between align-items-start">
          <div className="ms-2 me-auto">
            <div className="fw-bold">Sign In with Discord</div>
            {discordUser && <>Welcome {discordUser}</>}
          </div>
          {!discordUser && <button className="btn btn-primary btn-sm py-0" onClick={signInDiscord}>
            Sign in
          </button>}
          {discordUser && <button className="btn btn-success btn-sm py-0 disabled">
            Done
          </button>}
        </li>
        <li className="list-group-item d-flex justify-content-between align-items-start">
          <div className="ms-2 me-auto">
            <div className="fw-bold">Join our <a href="https://discord.gg/8axaNyd9" target="_blank">Discord channel</a></div>
            Verify that you have joined
          </div>
          {!isJoinedDiscord && <button className="btn btn-primary btn-sm py-0" onClick={verifyJoinDiscord}>
            Verify
          </button>}
          {isJoinedDiscord && <button className="btn btn-success btn-sm py-0 disabled" onClick={verifyJoinDiscord}>
            Done
          </button>}
        </li>
        <li className="list-group-item d-flex justify-content-between align-items-start">
          <div className="ms-2 me-auto">
            <div className="fw-bold">Congratulations!</div>
            Now you can claim your free chest.
          </div>
          {<button className="btn btn-primary btn-sm py-0" onClick={() => {}}>
            Claim
          </button>}
        </li>
      </ol>`
    </Layout>
  </>);
};

const DiscordPage: NextPage = () => {
  return <DiscordProvider>
    <Discord />
  </DiscordProvider>
}

export default DiscordPage;
