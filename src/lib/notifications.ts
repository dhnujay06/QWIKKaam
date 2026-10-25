/**
 * Qwikkaam Notification Service
 * ──────────────────────────────
 * Supports MSG91 WhatsApp + SMS for Indian numbers
 * All messages available in Hindi & English
 *
 * Environment variables required:
 *   MSG91_AUTH_KEY      — from msg91.com dashboard
 *   MSG91_SENDER_ID     — 6-char sender ID (e.g. QWIKKM)
 *   MSG91_WA_SENDER     — WhatsApp sender number (e.g. 917771111111)
 *   MSG91_WA_NAMESPACE  — WhatsApp template namespace
 *   ADMIN_PHONE         — Admin whatsapp/phone to receive alerts
 *   NOTIFICATION_LANG   — "hi" or "en" (default: "hi")
 */

const MSG91_AUTH_KEY    = process.env.MSG91_AUTH_KEY    || '';
const MSG91_SENDER_ID   = process.env.MSG91_SENDER_ID   || 'QWIKKM';
const MSG91_WA_SENDER   = process.env.MSG91_WA_SENDER   || '';
const ADMIN_PHONE       = process.env.ADMIN_PHONE        || '';
const LANG              = (process.env.NOTIFICATION_LANG || 'hi') as 'hi' | 'en';

// ─── SMS via MSG91 ────────────────────────────────────────────────────────────

async function sendSMS(phone: string, message: string): Promise<boolean> {
  if (!MSG91_AUTH_KEY) {
    console.log(`[SMS-DEV] ${phone}: ${message}`);
    return true; // dev mode: always succeed
  }

  const clean = phone.replace(/\D/g, '').slice(-10);
  const indianPhone = `91${clean}`;

  try {
    const response = await fetch('https://api.msg91.com/api/v5/flow/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'authkey': MSG91_AUTH_KEY,
      },
      body: JSON.stringify({
        sender: MSG91_SENDER_ID,
        route: '4',           // transactional route
        country: '91',
        sms: [
          {
            message,
            to: [indianPhone],
          },
        ],
      }),
    });
    const data = await response.json();
    const ok = data?.type === 'success';
    if (!ok) console.error('[MSG91 SMS error]', data);
    return ok;
  } catch (err) {
    console.error('[MSG91 SMS fetch error]', err);
    return false;
  }
}

// ─── WhatsApp via MSG91 ───────────────────────────────────────────────────────

async function sendWhatsApp(
  phone: string,
  templateName: string,
  params: string[]
): Promise<boolean> {
  if (!MSG91_AUTH_KEY || !MSG91_WA_SENDER) {
    console.log(`[WA-DEV] ${phone} | template:${templateName} | params:${params.join(',')}`);
    return true; // dev mode
  }

  const clean = phone.replace(/\D/g, '').slice(-10);
  const indianPhone = `91${clean}`;

  try {
    const response = await fetch('https://api.msg91.com/api/v5/whatsapp/whatsapp-outbound-message/bulk/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authkey': MSG91_AUTH_KEY,
      },
      body: JSON.stringify({
        integrated_number: MSG91_WA_SENDER,
        content_type: 'template',
        payload: {
          to: indianPhone,
          type: 'template',
          template: {
            name: templateName,
            language: { code: LANG === 'hi' ? 'hi' : 'en_US' },
            components: [
              {
                type: 'body',
                parameters: params.map(p => ({ type: 'text', text: p })),
              },
            ],
          },
        },
      }),
    });
    const data = await response.json();
    const ok = data?.message === 'Request Accepted.' || data?.type === 'success';
    if (!ok) console.error('[MSG91 WA error]', data);
    return ok;
  } catch (err) {
    console.error('[MSG91 WA fetch error]', err);
    return false;
  }
}

/**
 * Send both SMS and WhatsApp to a number.
 * SMS is always attempted; WhatsApp is a bonus.
 */
async function notify(
  phone: string,
  smsText: string,
  waTemplate: string,
  waParams: string[]
) {
  // Run both in parallel; don't block on either
  await Promise.allSettled([
    sendSMS(phone, smsText),
    sendWhatsApp(phone, waTemplate, waParams),
  ]);
}

// ─── Notification Events ──────────────────────────────────────────────────────

/** 1. Customer & Admin — New booking received */
export async function notifyBookingCreated(opts: {
  customerPhone: string;
  customerName: string;
  serviceName: string;
  bookingId: string;
  scheduledDate: string;
  timeSlot: string;
  totalAmount: number;
}) {
  const { customerPhone, customerName, serviceName, bookingId, scheduledDate, timeSlot, totalAmount } = opts;

  // ── Customer message ──
  const smsCustomer =
    LANG === 'hi'
      ? `Namaskar ${customerName}! Aapki Qwikkaam booking confirm ho gayi 🎉\n` +
        `Service: ${serviceName}\nDate: ${scheduledDate} | Time: ${timeSlot}\n` +
        `Total: ₹${totalAmount}\nBooking ID: ${bookingId}\n` +
        `Koi bhi samasya ke liye 9876543210 par call karein.`
      : `Hi ${customerName}! Your Qwikkaam booking is confirmed 🎉\n` +
        `Service: ${serviceName}\nDate: ${scheduledDate} at ${timeSlot}\n` +
        `Total: ₹${totalAmount} | Booking ID: ${bookingId}\n` +
        `For help call 9876543210.`;

  await notify(
    customerPhone,
    smsCustomer,
    'qwikkaam_booking_confirmed',
    [customerName, serviceName, scheduledDate, timeSlot, String(totalAmount), bookingId]
  );

  // ── Admin alert ──
  if (ADMIN_PHONE) {
    const smsAdmin =
      `🆕 New Booking!\nCustomer: ${customerName} (${customerPhone})\n` +
      `Service: ${serviceName}\nDate: ${scheduledDate} ${timeSlot}\n` +
      `Amount: ₹${totalAmount} | ID: ${bookingId}`;

    await notify(
      ADMIN_PHONE,
      smsAdmin,
      'qwikkaam_admin_new_booking',
      [customerName, customerPhone, serviceName, scheduledDate, timeSlot, String(totalAmount), bookingId]
    );
  }
}

/** 2. Helper — Assigned to a booking */
export async function notifyHelperAssigned(opts: {
  helperPhone: string;
  helperName: string;
  customerName: string;
  serviceName: string;
  scheduledDate: string;
  timeSlot: string;
  address: string;
  bookingId: string;
}) {
  const { helperPhone, helperName, customerName, serviceName, scheduledDate, timeSlot, address, bookingId } = opts;

  const sms =
    LANG === 'hi'
      ? `Namaste ${helperName}! Aapko ek naya kaam mila hai 🎯\n` +
        `Service: ${serviceName}\nCustomer: ${customerName}\n` +
        `Date: ${scheduledDate} | Time: ${timeSlot}\n` +
        `Address: ${address}\nBooking ID: ${bookingId}\n` +
        `Samay par pahunchin. Dhanyawad!`
      : `Hello ${helperName}! You have a new job assigned 🎯\n` +
        `Service: ${serviceName} | Customer: ${customerName}\n` +
        `Date: ${scheduledDate} at ${timeSlot}\n` +
        `Address: ${address} | Booking ID: ${bookingId}\n` +
        `Please be on time. Thank you!`;

  await notify(
    helperPhone,
    sms,
    'qwikkaam_helper_assigned',
    [helperName, serviceName, customerName, scheduledDate, timeSlot, address, bookingId]
  );
}

/** 3. Customer — Booking status changed (CONFIRMED / IN_PROGRESS / COMPLETED / CANCELLED) */
export async function notifyBookingStatusUpdate(opts: {
  customerPhone: string;
  customerName: string;
  serviceName: string;
  status: string;
  bookingId: string;
  helperName?: string;
}) {
  const { customerPhone, customerName, serviceName, status, bookingId, helperName } = opts;

  const statusMessages: Record<string, { hi: string; en: string }> = {
    CONFIRMED: {
      hi: `Aapki ${serviceName} booking confirm ho gayi! Helper: ${helperName || 'assign ho raha hai'}. ID: ${bookingId}`,
      en: `Your ${serviceName} booking is CONFIRMED! Helper: ${helperName || 'being assigned'}. ID: ${bookingId}`,
    },
    IN_PROGRESS: {
      hi: `${helperName || 'Helper'} kaam shuru kar chuke hain aapke ghar par. Service: ${serviceName}. ID: ${bookingId}`,
      en: `${helperName || 'Helper'} has started working at your place. Service: ${serviceName}. ID: ${bookingId}`,
    },
    COMPLETED: {
      hi: `Aapki ${serviceName} booking complete ho gayi! 🎉 Review dijiye: qwikkaam.in/review/${bookingId}`,
      en: `Your ${serviceName} booking is COMPLETED! 🎉 Leave a review: qwikkaam.in/review/${bookingId}`,
    },
    CANCELLED: {
      hi: `Aapki ${serviceName} booking (ID: ${bookingId}) cancel ho gayi. Refund 3-5 din mein milega. Help: 9876543210`,
      en: `Your ${serviceName} booking (ID: ${bookingId}) has been cancelled. Refund in 3-5 days. Help: 9876543210`,
    },
  };

  const msg = statusMessages[status];
  if (!msg) return;

  const sms = `Qwikkaam: Namaste ${customerName}! ${LANG === 'hi' ? msg.hi : msg.en}`;

  await notify(
    customerPhone,
    sms,
    `qwikkaam_status_${status.toLowerCase()}`,
    [customerName, serviceName, status, bookingId, helperName || '']
  );
}

/** 4. Helper — Verification status changed by Admin */
export async function notifyHelperVerification(opts: {
  helperPhone: string;
  helperName: string;
  level: 'admin' | 'aadhaar' | 'police' | 'vaccinated';
  approved: boolean;
}) {
  const { helperPhone, helperName, level, approved } = opts;

  const levelNames: Record<string, { hi: string; en: string }> = {
    admin:      { hi: 'Admin Verification',   en: 'Admin Verification'   },
    aadhaar:    { hi: 'Aadhaar Verification', en: 'Aadhaar Verification' },
    police:     { hi: 'Police Clearance',     en: 'Police Clearance'     },
    vaccinated: { hi: 'Vaccine Badge',        en: 'Vaccination Badge'    },
  };

  const levelName = levelNames[level];

  let sms: string;
  if (approved) {
    sms = LANG === 'hi'
      ? `🎉 Badhai ho ${helperName}! Aapka ${levelName.hi} complete ho gaya Qwikkaam par. Ab aap zyada bookings pa sakte hain!`
      : `🎉 Congratulations ${helperName}! Your ${levelName.en} is complete on Qwikkaam. You'll get more bookings now!`;
  } else {
    sms = LANG === 'hi'
      ? `Namaste ${helperName}, aapka ${levelName.hi} reject ho gaya. Jyada jaankari ke liye 9876543210 par call karein.`
      : `Hi ${helperName}, your ${levelName.en} was rejected. Please call 9876543210 for more information.`;
  }

  await notify(
    helperPhone,
    sms,
    `qwikkaam_helper_verification`,
    [helperName, approved ? 'approved' : 'rejected', LANG === 'hi' ? levelName.hi : levelName.en]
  );
}

/** 5. Customer — OTP for login/register (via SMS only) */
export async function sendOtpSMS(phone: string, otp: string): Promise<boolean> {
  const message =
    LANG === 'hi'
      ? `${otp} aapka Qwikkaam OTP hai. Yeh 10 minute mein expire hoga. Kisi ke saath share na karein.`
      : `${otp} is your Qwikkaam OTP. Valid for 10 minutes. Do not share with anyone.`;

  return sendSMS(phone, message);
}

/** 6. Admin — Contact form submission alert */
export async function notifyAdminContact(opts: {
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
}): Promise<void> {
  if (!ADMIN_PHONE) return;

  const sms =
    `📩 New Contact Form!\nFrom: ${opts.name} (${opts.phone})\nEmail: ${opts.email}\n` +
    `Subject: ${opts.subject}\nMsg: ${opts.message.slice(0, 100)}${opts.message.length > 100 ? '...' : ''}`;

  await Promise.allSettled([
    sendSMS(ADMIN_PHONE, sms),
    sendWhatsApp(ADMIN_PHONE, 'qwikkaam_contact_form', [
      opts.name, opts.phone, opts.email, opts.subject, opts.message.slice(0, 200),
    ]),
  ]);
}
