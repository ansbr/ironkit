import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js'
import { TwitterApi } from 'twitter-api-v2';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

const credentials = { 
  appKey: process.env.TWITTER_API_KEY!,
  appSecret: process.env.TWITTER_API_KEY_SECRET!,
  accessToken: process.env.TWITTER_ACCESS_TOKEN!,
  accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET!
}

const twitterClient = new TwitterApi(credentials);

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  switch (method) {
    case 'POST':
      const { data, error } = await supabase.auth.getUser(req.body.access_token as string);
      const twitterData: {[key: string]: string} | undefined = data?.user?.identities?.find(x => x.provider === 'twitter')?.identity_data;

      if (twitterData) {
        const { provider_id: twitterUserId, user_name: twitterUserName } = twitterData
        // that not working without paid access to Twitter Api
        const friendships = await twitterClient.v1.friendships({ user_id: twitterUserId });
      }

      if (error) {
        res.status(502).json({ error });
      } else {
        res.status(200).json({ isMember: false });
      }
      break;
    default:
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default handler;
