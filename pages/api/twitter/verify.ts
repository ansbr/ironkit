import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js'
import { TwitterApi } from 'twitter-api-v2';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

const client = new TwitterApi(process.env.TWITTER_BEARER_TOKEN!);

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  switch (method) {
    case 'POST':
      const { data, error } = await supabase.auth.getUser(req.body.access_token as string);
      let twitterUserId: string | undefined = data?.user?.identities?.find(x => x.provider === 'twitter')?.identity_data?.provider_id;

      if (twitterUserId) {
        const friendships = await client.v1.friendships({ user_id: [ twitterUserId ] });
  
        for (const friendship of friendships) {
          console.log(JSON.stringify(friendship));
          // if (friendship.connections.includes('following')) {
          //   console.log(`You are following @${friendship.screen_name}.`);
          // }
        }
      }

      if (error) {
        res.status(502).json({ error });
      } else {
        res.status(200).json({ twitterUserId: twitterUserId });
      }
      break;
    default:
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default handler;
