import { PropsWithChildren, createContext, useContext, useState } from "react";
import { createClient } from '@supabase/supabase-js'
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
        const { isMember } = await res.json();
        if (isMember) {
          setIsJoinedDiscord(true)
        } else {
          // Alert about unsuccsesful verifying
        }
      } else {
        const { error } = await res.json();
        // Alert about unsuccsesful verifying
        console.log(error)
      }
    } catch (error) {
        // Alert about unsuccsesful verifying
        console.log(error)
    }
  }

  const getDiscordUser = async () => {
    const { data } = await supabase.auth.getSession();
    if (data?.session) {
      const discordUser: {[key: string]: string} | undefined = data?.session.user.identities?.find(x => x.provider === 'discord')?.identity_data
      if (discordUser) {
        setDiscordUser(discordUser.full_name);
      }
    }
  }

  useOnMount(() => {
    getDiscordUser();
  })

  return (
    <DiscordContext.Provider value={{ discordUser, signInDiscord, isJoinedDiscord, verifyJoinDiscord }}>
      {children}
    </DiscordContext.Provider>
  );
};

export default useDiscord;

// define the props