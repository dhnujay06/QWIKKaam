import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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

    // Save new OTP
    await prisma.otpCode.create({
      data: { phone, code: otp, expiresAt },
    });

    // TODO: In production, send OTP via SMS (Msg91/Twilio)
    // For now, we log it (development mode)
    console.log(`📱 OTP for ${phone}: ${otp}`);

    // In development, return OTP directly so you can test
    if (process.env.NODE_ENV === 'development') {
      return NextResponse.json({
        success: true,
        message: 'OTP sent successfully',
        devOtp: otp, // Remove in production!
      });
    }

    return NextResponse.json({ success: true, message: 'OTP sent successfully' });

  } catch (error) {
    console.error('OTP Error:', error);
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 });
  }
}
