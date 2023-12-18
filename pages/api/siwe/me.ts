export const runtime = 'edge'
import { unsealData } from 'iron-session/edge';
import { NextRequest, NextResponse } from 'next/server';
import { ironOptions } from 'utils/iron';

const handler = async (req: NextRequest) => {
  const { method } = req;

  if (method == 'GET') {
    const siwe = req.cookies.get('siwe')?.value
    const { address }  = await unsealData(siwe || '', ironOptions)
    return NextResponse.json({ address })
  }
  
  return NextResponse.json({
    message: `Method ${method} Not Allowed`,
  }, {
    status: 405
  });
};

export default handler;