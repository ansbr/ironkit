export const runtime = 'edge'
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

const handler = async (req: NextRequest) => {
  const { method } = req;

  if (method == 'POST') {
    const { access_token }: {[key: string]: string} = await req.json()
    const { data, error } = await supabase.auth.getUser(access_token);
    let discordUserId: string | undefined = data?.user?.identities?.find(x => x.provider === 'discord')?.identity_data?.provider_id;

    let guildMember: {[key: string]: any} | undefined = undefined;

    const response = await fetch(`https://discord.com/api/v10/guilds/${process.env.DISCORD_SERVER_ID}/members/${discordUserId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bot ${process.env.DISCORD_TOKEN_BOT}`
      }
    });

    guildMember = await response.json();
  
    if (error) {
      return NextResponse.json({ error }, { status: 502 })
    } else {
      return NextResponse.json({ isMember: !!guildMember  })
    }
  }
  
  return NextResponse.json({
    message: `Method ${method} Not Allowed`,
  }, {
    status: 405
  });
};

export default handler;