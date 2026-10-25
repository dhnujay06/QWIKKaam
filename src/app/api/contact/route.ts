import { NextRequest, NextResponse } from 'next/server';
import { notifyAdminContact } from '@/lib/notifications';

// POST /api/contact — handle contact form submissions
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, email, subject, message } = body;

    // Validate required fields
    if (!name || !phone || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Try to send email via Nodemailer if SMTP is configured
    const smtpHost = process.env.SMTP_HOST;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const contactEmail = process.env.CONTACT_EMAIL || 'support@qwikkaam.com';

    if (smtpHost && smtpUser && smtpPass) {
      // Dynamic import to avoid issues if nodemailer is not configured
      const nodemailer = await import('nodemailer');

      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      await transporter.sendMail({
        from: `"Qwikkaam Contact" <${smtpUser}>`,
        to: contactEmail,
        replyTo: email,
        subject: `[Qwikkaam Contact] ${subject} — from ${name}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #0d9488; border-bottom: 2px solid #0d9488; padding-bottom: 8px;">
              New Contact Message
            </h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #334155;">Name:</td>
                <td style="padding: 8px 0; color: #475569;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #334155;">Phone:</td>
                <td style="padding: 8px 0; color: #475569;">${phone}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #334155;">Email:</td>
                <td style="padding: 8px 0; color: #475569;">${email}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #334155;">Subject:</td>
                <td style="padding: 8px 0; color: #475569;">${subject}</td>
              </tr>
            </table>
            <div style="margin-top: 16px; padding: 16px; background: #f1f5f9; border-radius: 8px;">
              <p style="font-weight: bold; color: #334155; margin-bottom: 8px;">Message:</p>
              <p style="color: #475569; white-space: pre-wrap;">${message}</p>
            </div>
            <p style="margin-top: 24px; font-size: 12px; color: #94a3b8;">
              Sent via Qwikkaam Contact Form
            </p>
          </div>
        `,
      });

      console.log(`✅ Contact email sent from ${name} (${email})`);

      // Also alert admin via WhatsApp/SMS
      notifyAdminContact({ name, phone, email, subject, message })
        .catch(e => console.error('Admin contact notif error (non-fatal):', e));

      return NextResponse.json({
        success: true,
        message: 'Message sent successfully! We will get back to you soon.',
      });
    }

    // Fallback: Log to console if SMTP is not configured (dev mode)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 NEW CONTACT FORM SUBMISSION (Dev Mode)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Name:    ${name}`);
    console.log(`Phone:   ${phone}`);
    console.log(`Email:   ${email}`);
    console.log(`Subject: ${subject}`);
    console.log(`Message: ${message}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // Also alert admin via WhatsApp/SMS in dev mode
    notifyAdminContact({ name, phone, email, subject, message })
      .catch(e => console.error('Admin contact notif error (non-fatal):', e));

    return NextResponse.json({
      success: true,
      message: 'Message received! (SMTP not configured — logged to console)',
    });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again.' },
      { status: 500 }
    );
  }
}
