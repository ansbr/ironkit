import { PropsWithChildren, createContext, useContext, useEffect, useState } from "react";
import { Session, createClient } from '@supabase/supabase-js'
import { useOnMount } from "hooks/useOnMount";

// define the props
type DiscordState = {
  discordUser: string | undefined;
  isJoinedDiscord: boolean;
  verifyJoinDiscord: () => void;
  signInDiscord: () => void;
};

// 1. create a context with DiscordState and initialize it to null
export const DiscordContext = createContext<DiscordState>({
  discordUser: undefined,
  isJoinedDiscord: false,
  verifyJoinDiscord: () => {},
  signInDiscord: () => {}
});

const useDiscord = (): DiscordState => {
  // 2. use the useContext hook
  const context = useContext(DiscordContext);

  // 3. Make sure it's not null!
  if (!context) {
    throw new Error("Please use DiscordProvider in parent component");
  }

  return context;
};

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export const DiscordProvider = ({ children }: PropsWithChildren) => {
  const [discordUser, setDiscordUser] = useState<string>();
  const [isJoinedDiscord, setIsJoinedDiscord] = useState<boolean>(false);

  const signInDiscord = async () => {
    await supabase.auth.signInWithOAuth({ 
      provider: 'discord',
      options: {
        redirectTo: document.location.href.split('#')[0]
      }
    })
  }

  const verifyJoinDiscord = async () => {
    const { data } = await supabase.auth.getSession();
    const access_token = data?.session?.access_token;
    if (!access_token) return;

    try {
      const res = await fetch('/api/discord/verify',{
        method: 'POST',
        body: JSON.stringify({ access_token: access_token }),
        headers: { 'content-type': 'application/json' }
      })
      if(res.ok){
        const { data } = await res.json();
        setIsJoinedDiscord(true)
        console.log(data)
      }else{
        const { error } = await res.json();
        console.log(error)
      }
    } catch (error) {
        console.log(error)
    }
  }

  const getDiscordUser = async () => {
    const { data } = await supabase.auth.getSession();
    if (data?.session) {
      setDiscordUser(data?.session.user.user_metadata.full_name as string);
    }
  }

  useOnMount(() => {
    getDiscordUser()
    supabase.auth.onAuthStateChange((event, session) => {
      console.log(event, session)
    })
  })

  return (
    <DiscordContext.Provider value={{ discordUser, signInDiscord, isJoinedDiscord, verifyJoinDiscord }}>
      {children}
    </DiscordContext.Provider>
  );
};

export default useDiscord;

// define the props