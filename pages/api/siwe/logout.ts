export const runtime = 'edge'
import { NextRequest, NextResponse } from 'next/server';

const handler = async (req: NextRequest) => {
  const { method } = req;

  if (method == 'POST') {
    const res = NextResponse.json({ ok: true });
    res.cookies.delete('siwe');
    return res;
  }
  
  return NextResponse.json({
    message: `Method ${method} Not Allowed`,
  }, {
    status: 405
  });
};

export default handler;