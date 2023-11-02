import Layout from 'components/Layout';
import useTwitter, { TwitterProvider } from 'components/context/TwitterContext';
import type { NextPage } from 'next';
import Head from 'next/head';

const Twitter = () => {
  const { signInTwitter, twitterUser, isJoinedTwitter, verifyJoinTwitter } = useTwitter();

  return (<>
    <Head>
      <title>Auth with Twitter</title>
    </Head>
    <Layout>
      <ol className="list-group list-group-numbered w-100 mx-auto" style={{maxWidth: '500px'}}>
        <li className={`list-group-item d-flex justify-content-between align-items-start ${twitterUser ? 'disabled' : '' }`}>
          <div className="ms-2 me-auto">
            <div className="fw-bold">Sign In with Twitter</div>
            {!twitterUser && <>Authorize yourself using Twitter platform</>}
            {twitterUser && <>Welcome {twitterUser}</>}
          </div>
          {!twitterUser && <button className="btn btn-primary btn-sm py-0" onClick={signInTwitter}>
            Sign in
          </button>}
          {twitterUser && <button className="btn btn-success btn-sm py-0 disabled">
            Done
          </button>}
        </li>
        <li className={`list-group-item d-flex justify-content-between align-items-start ${!twitterUser ? 'pe-none opacity-75' : '' } ${twitterUser && isJoinedTwitter? 'disabled' : '' }`}>
          <div className="ms-2 me-auto">
            <div className="fw-bold">Join our <a href="https://twitter.gg/8axaNyd9" target="_blank">Twitter channel</a></div>
            {!twitterUser || !isJoinedTwitter && <>Verify that you have joined</>}
            {twitterUser && isJoinedTwitter && <>You are successfuliy verified</>}
          </div>
          {!isJoinedTwitter && <button className="btn btn-primary btn-sm py-0" onClick={verifyJoinTwitter}>
            Verify
          </button>}
          {isJoinedTwitter && <button className="btn btn-success btn-sm py-0 disabled" onClick={verifyJoinTwitter}>
            Done
          </button>}
        </li>
        <li className={`list-group-item d-flex justify-content-between align-items-start  ${!twitterUser || !isJoinedTwitter ? 'pe-none opacity-75' : '' }`}>
          <div className="ms-2 me-auto">
            <div className="fw-bold">Congratulations!</div>
            Now you can claim your free chest
          </div>
          {<button className="btn btn-primary btn-sm py-0" onClick={() => {}}>
            Claim
          </button>}
        </li>
      </ol>`
    </Layout>
  </>);
};

const TwitterPage: NextPage = () => {
  return <TwitterProvider>
    <Twitter />
  </TwitterProvider>
}

export default TwitterPage;
