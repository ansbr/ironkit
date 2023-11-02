import { PropsWithChildren, createContext, useContext, useState } from "react";
import { createClient } from '@supabase/supabase-js'
import { useOnMount } from "hooks/useOnMount";

// define the props
type TwitterState = {
  twitterUser: string | undefined;
  isJoinedTwitter: boolean;
  verifyJoinTwitter: () => void;
  signInTwitter: () => void;
};

// 1. create a context with TwitterState and initialize it to null
export const TwitterContext = createContext<TwitterState>({
  twitterUser: undefined,
  isJoinedTwitter: false,
  verifyJoinTwitter: () => {},
  signInTwitter: () => {}
});

const useTwitter = (): TwitterState => {
  // 2. use the useContext hook
  const context = useContext(TwitterContext);

  // 3. Make sure it's not null!
  if (!context) {
    throw new Error("Please use TwitterProvider in parent component");
  }

  return context;
};

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export const TwitterProvider = ({ children }: PropsWithChildren) => {
  const [twitterUser, setTwitterUser] = useState<string>();
  const [isJoinedTwitter, setIsJoinedTwitter] = useState<boolean>(false);

  const signInTwitter = async () => {
    await supabase.auth.signInWithOAuth({ 
      provider: 'twitter',
      options: {
        redirectTo: document.location.href.split('#')[0]
      }
    })
  }

  const verifyJoinTwitter = async () => {
    const { data } = await supabase.auth.getSession();
    const access_token = data?.session?.access_token;
    if (!access_token) return;

    try {
      const res = await fetch('/api/twitter/verify',{
        method: 'POST',
        body: JSON.stringify({ access_token: access_token }),
        headers: { 'content-type': 'application/json' }
      })
      if(res.ok){
        const { data } = await res.json();
        setIsJoinedTwitter(true)
        console.log(data)
      }else{
        const { error } = await res.json();
        console.log(error)
      }
    } catch (error) {
        console.log(error)
    }
  }

  const getTwitterUser = async () => {
    const { data } = await supabase.auth.getSession();
    console.log(data)
    if (data?.session) {
      setTwitterUser(data?.session.user.user_metadata.full_name as string);
    }
  }

  useOnMount(() => {
    getTwitterUser()
    supabase.auth.onAuthStateChange((event, session) => {
      console.log(event, session)
    })
  })

  return (
    <TwitterContext.Provider value={{ twitterUser, signInTwitter, isJoinedTwitter, verifyJoinTwitter }}>
      {children}
    </TwitterContext.Provider>
  );
};

export default useTwitter;

// define the props