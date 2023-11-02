import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js'
import { REST } from '@discordjs/rest';
import { WebSocketManager } from '@discordjs/ws';
import { GatewayIntentBits, Client } from '@discordjs/core';
// Create REST and WebSocket managers directly
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN!);

const gateway = new WebSocketManager({
	token: process.env.DISCORD_TOKEN!,
	intents: GatewayIntentBits.GuildMessages | GatewayIntentBits.MessageContent,
	rest,
});

// Create a client to emit relevant events.
const discordClient = new Client({ rest, gateway });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  switch (method) {
    case 'POST':
      const { data, error } = await supabase.auth.getUser(req.body.access_token as string);
      let discordUserId = data?.user?.user_metadata?.provider_id;
      let guildMember = await discordClient.api.guilds.getMember(process.env.DISCORD_SERVER_ID!, discordUserId);
    
      if (error) {
        res.status(502).json({ error });
      } else {
        res.status(200).json({ isMember: !!guildMember });
      }
      break;
    default:
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default handler;
