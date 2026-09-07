import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Generate a 6-digit OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendSMSviaFast2SMS(phone: string, otp: string): Promise<boolean> {
  const apiKey = process.env.FAST2SMS_API_KEY;
  if (!apiKey) return false;

  try {
    const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
      method: 'POST',
      headers: {
        'authorization': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        route: 'otp',
        variables_values: otp,
        numbers: phone,
      }),
    });

    const data = await response.json();
    console.log('Fast2SMS response:', data);
    return data.return === true;
  } catch (err) {
    console.error('Fast2SMS error:', err);
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { phone } = await req.json();

    if (!phone || phone.length !== 10) {
      return NextResponse.json({ error: 'Valid 10-digit phone number required' }, { status: 400 });
    }

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Invalidate old OTPs for this phone
    await prisma.otpCode.updateMany({
      where: { phone, used: false },
      data: { used: true },
    });

    // Save new OTP to database
    await prisma.otpCode.create({
      data: { phone, code: otp, expiresAt },
    });

    // Try to send real SMS via Fast2SMS
    const smsSent = await sendSMSviaFast2SMS(phone, otp);

    if (smsSent) {
      console.log(`✅ Real SMS sent to ${phone}`);
      return NextResponse.json({ success: true, message: 'OTP aapke phone par bheja gaya!' });
    }

    // Fallback: dev mode — return OTP in response
    console.log(`📱 [DEV] OTP for ${phone}: ${otp}`);
    return NextResponse.json({
      success: true,
      message: 'OTP sent (dev mode)',
      devOtp: otp,
    });

  } catch (error) {
    console.error('OTP Error:', error);
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 });
  }
}
