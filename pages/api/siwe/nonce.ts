export const runtime = 'edge'
import { sealData } from 'iron-session/edge';
import { NextRequest, NextResponse } from 'next/server';
import { generateNonce } from 'siwe';
import { ironOptions } from 'utils/iron';

const handler = async (req: NextRequest) => {
  const { method } = req;

  if (method == 'GET') {
    const nonce = generateNonce();
    const res = new NextResponse(nonce);
    res.cookies.set('siwe', await sealData({ nonce }, ironOptions))
    return res;
  }
  
  return NextResponse.json({
    message: `Method ${method} Not Allowed`,
  }, {
    status: 405
  });
};

export default handler;
