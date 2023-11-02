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
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" height="30" fill="none" ><path d="M19.879 13.796c-.489-1.19-.734-2.478-.734-3.864s.247-2.672.741-3.858 1.17-2.187 2.029-3.006 1.879-1.46 3.06-1.926S27.42.445 28.768.445a10.31 10.31 0 0 1 3.801.698c1.185.465 2.205 1.107 3.06 1.926s1.531 1.82 2.029 3.006.747 2.471.747 3.858-.249 2.673-.747 3.858-1.175 2.187-2.029 3.006-1.875 1.46-3.06 1.926a10.31 10.31 0 0 1-3.801.698 10.26 10.26 0 0 1-3.794-.698c-1.181-.465-2.201-1.107-3.06-1.926s-1.538-1.818-2.035-2.999h0zM0 30.084c0-1.431.253-2.749.76-3.952s1.198-2.205 2.074-3.006 1.903-1.422 3.079-1.865 2.431-.664 3.762-.664a9.41 9.41 0 0 1 2.313.275c.726.183 1.363.427 1.913.731a8.08 8.08 0 0 1 1.52 1.087c.464.42.854.852 1.172 1.295a8.92 8.92 0 0 1 .824 1.402l-4.496 2.388a4.26 4.26 0 0 0-1.282-1.61c-.571-.447-1.226-.671-1.965-.671-1.262 0-2.289.441-3.079 1.322s-1.185 1.97-1.185 3.267.395 2.386 1.185 3.267 1.817 1.322 3.079 1.322a4.07 4.07 0 0 0 1.849-.423c.563-.282 1.02-.646 1.372-1.093H9.16v-4.831h9.598c0 3.596-.857 6.369-2.57 8.319S12.132 39.57 9.16 39.57c-1.202 0-2.355-.224-3.459-.671a9.29 9.29 0 0 1-2.925-1.872c-.846-.801-1.52-1.803-2.023-3.006S0 31.506 0 30.084h0zm19.879 3.864c-.489-1.19-.734-2.478-.734-3.864s.247-2.672.741-3.858 1.17-2.187 2.029-3.006 1.879-1.46 3.06-1.926a10.26 10.26 0 0 1 3.794-.698 10.31 10.31 0 0 1 3.801.698c1.185.465 2.205 1.107 3.06 1.926s1.531 1.82 2.029 3.006.747 2.471.747 3.858-.249 2.672-.747 3.858-1.175 2.187-2.029 3.006-1.875 1.46-3.06 1.925a10.31 10.31 0 0 1-3.801.698 10.26 10.26 0 0 1-3.794-.698c-1.181-.465-2.201-1.107-3.06-1.925s-1.538-1.818-2.035-2.999h0zm5.884-26.79c-.712.799-1.067 1.794-1.067 2.985s.358 2.186 1.073 2.985 1.65 1.199 2.804 1.199 2.091-.4 2.81-1.199 1.079-1.794 1.079-2.985-.36-2.186-1.079-2.985-1.656-1.199-2.81-1.199-2.091.4-2.81 1.199zm0 20.152c-.712.799-1.067 1.794-1.067 2.985s.358 2.186 1.073 2.985 1.65 1.199 2.804 1.199 2.091-.4 2.81-1.199 1.079-1.794 1.079-2.985-.36-2.186-1.079-2.985-1.656-1.199-2.81-1.199-2.091.399-2.81 1.199zm-18.82-13.45h10.422a.27.27 0 0 1 .264.275v5.131a.27.27 0 0 1-.262.275l-16.139.089c-.035 0-.069-.007-.101-.02s-.061-.034-.086-.059-.044-.056-.058-.089-.02-.069-.021-.105V1.403a.18.18 0 0 1 .176-.183h5.629a.18.18 0 0 1 .176.183v12.458h0z" fill="#ffffff"></path></svg>
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
            <li className="nav-item px-1">
              <Link href="/twitter" className={`nav-link ${router.pathname == "/twitter" ? "active" : ""}`}>Twitter</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <div
      style={{
        display: 'flex',
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
      }}>
        { isMounted && !isSignedIn && <>
          <div className='text-white fs-5 text-center'>Please Sign In</div>
        </>}
      
        { isMounted && isSignedIn && !isSupportedChain && <>
          <div className='text-white fs-5 text-center'>Please Change Network</div>
        </>}

        { isMounted && isSignedIn && isSupportedChain && children}
      </main>
    </div>
  </>)
}