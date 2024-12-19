import prisma from '@/db/prisma-client';
import { HandlerFunctionWrapper } from '@/lib/handler-wrapper';
import { stripe } from '@/lib/stripe';
import { NextRequest, NextResponse } from 'next/server';

export const POST = HandlerFunctionWrapper(async (req, _res, hankoSession) => {
  const { orderTotal, jobId, jobName } = await req.json();

  if (!orderTotal || !jobId || !jobName) {
    return new Response('Invalid request data', { status: 400 });
  }

  const unitAmount = Math.round(orderTotal * 100); // Ensure orderTotal is an integer (in pence for GBP)

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    customer_email: hankoSession?.email,
    client_reference_id: jobId,
    line_items: [
      {
        price_data: {
          currency: 'gbp',
          product_data: {
            name: jobName,
            images: ['https://res.cloudinary.com/duueci0ry/image/upload/v1719915638/logo_sii3je.png'],
          },
          unit_amount: unitAmount,
        },
        quantity: 1,
      },
    ],
    success_url: `${req.headers.get('origin')}/api/checkout_sessions?jobId=${jobId}&unitAmount=${unitAmount}&userEmail=${hankoSession?.email}`,
    cancel_url: `${req.headers.get('origin')}/request`,
  });

  return Response.json(session);
}, { useAuth: true });


export async function GET(req: NextRequest) {
  try {
    const jobId = Number(req.nextUrl.searchParams.get('jobId')!);
    const userEmail = req.nextUrl.searchParams.get('userEmail')!;
    const unitAmount = Number(req.nextUrl.searchParams.get('unitAmount')!);

    const user = await prisma.user.findFirst({
      where: {
        email: userEmail,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    await prisma.application.update({
      where: {
        jobId_applicantId: {
          jobId,
          applicantId: user.id,
        },
      },
      data: {
        isPaid: true,
        paymentAmount: unitAmount,
      },
    });

    return NextResponse.redirect(new URL('/applications?status=success-payment', req.url));
  } catch (error: any) {
    console.error('Error updating application payment:', error.message);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
