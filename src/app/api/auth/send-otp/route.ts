import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendOtpSMS } from '@/lib/notifications';

// Generate a 6-digit OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
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

    // Send OTP via MSG91 SMS + WhatsApp
    const smsSent = await sendOtpSMS(phone, otp);

    if (smsSent) {
      console.log(`✅ OTP sent to ${phone}`);
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
