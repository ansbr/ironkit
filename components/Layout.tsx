import { PropsWithChildren } from "react";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import useAuth from 'components/context/AuthContext';
import { useIsMounted } from "hooks/useIsMounted";
import Link from "next/link";
import { useRouter } from 'next/router';

export default function Layout({ children }: PropsWithChildren) {
  const isMounted = useIsMounted()
  const { isSignedIn, isSupportedChain } = useAuth();
  const router = useRouter();
  
  return (<>
    <nav className="navbar fixed-top navbar-expand-lg py-3">
      <div className="container">
        <Link href="/" className="navbar-brand d-flex">
          <img src="https://upload.wikimedia.org/wikipedia/commons/e/e3/Discord_White_Text_Logo_%282015-2021%29.svg" alt="Bootstrap" width="130"/>
        </Link>
        
        <div className="order-lg-2 navbar-connectbutton">
          <ConnectButton accountStatus={'address'} showBalance={false}/>
        </div>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse justify-content-center" id="navbarNavDropdown">
          <ul className="navbar-nav navbar-dark fs-5">
            <li className="nav-item px-1">
              <Link href="/" className={`nav-link ${router.pathname == "/" ? "active" : ""}`}>Home</Link>
            </li>
            <li className="nav-item px-1">
              <Link href="/discord" className={`nav-link ${router.pathname == "/discord" ? "active" : ""}`}>Discord</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
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
      <main style={{
        flex: '1 1 auto',
        alignSelf: 'center',
        display: 'flex',
        alignItems: 'center',
      }}>
        { isMounted && !isSignedIn && <>
          <div className='text-white fs-5'>Please Sign In</div>
        </>}
      
        { isMounted && isSignedIn && !isSupportedChain && <>
          <div className='text-white fs-5'>Please Change Network</div>
        </>}

        { isMounted && isSignedIn && isSupportedChain && children}
      </main>
    </div>
  </>)
}