export const runtime = 'edge'
import { unsealData, sealData } from 'iron-session/edge';
import { NextResponse, NextRequest } from "next/server";
import { SiweMessage } from 'siwe';
import { ironOptions } from 'utils/iron';

const handler = async (req: NextRequest) => {
  const { method } = req;

  if (method == 'POST') {
    try {
      const siwe = req.cookies.get('siwe')?.value

      if (!siwe) return NextResponse.json({
        message: `Invalid session`,
      }, { status: 422 });

      const { nonce }  = await unsealData(siwe, ironOptions)
      const { message, signature } = await req.json();
      const siweMessage = new SiweMessage(message);
      const { success, error, data } = await siweMessage.verify({
        signature,
      });

      if (!success) throw error;

      if (data.nonce !== nonce) return NextResponse.json({
        message: `Invalid nonce`,
      }, { status: 422 });

      const res = NextResponse.json({ ok: true });
      res.cookies.set('siwe', await sealData(data, ironOptions))
      
      return res;
    } catch (_error) {
      return NextResponse.json({ ok: false })
    }
  }

  return NextResponse.json({
    message: `Method ${method} Not Allowed`,
  }, {
    status: 405
  });
};

export default handler;
