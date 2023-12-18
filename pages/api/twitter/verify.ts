export const runtime = 'edge'
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

const credentials = { 
  appKey: process.env.TWITTER_API_KEY!,
  appSecret: process.env.TWITTER_API_KEY_SECRET!,
  accessToken: process.env.TWITTER_ACCESS_TOKEN!,
  accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET!
}


const handler = async (req: NextRequest) => {
  const { method } = req;

  if (method == 'POST') {
    const { access_token }: {[key: string]: string} = await req.json()
    const { data, error } = await supabase.auth.getUser(access_token);
    const twitterData: {[key: string]: string} | undefined = data?.user?.identities?.find(x => x.provider === 'twitter')?.identity_data;


    if (twitterData) {
      // need to make Twitter rest api with credentials
    }
    if (error) {
      NextResponse.json({ error }, { status: 502 })
    } else {
      NextResponse.json({ isMember: false  })
    }

    const res = NextResponse.json({ ok: true });
    return res;
  }
  
  return NextResponse.json({
    message: `Method ${method} Not Allowed`,
  }, {
    status: 405
  });
};

export default handler;