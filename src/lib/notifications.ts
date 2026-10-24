// Notification Service for Qwikkaam: WhatsApp & SMS Integration

export interface BookingNotificationData {
  bookingId: string;
  customerName: string;
  customerPhone: string;
  serviceName: string;
  scheduledDate: string;
  timeSlot?: string;
  totalAmount: number;
  addressText?: string;
  helperName?: string;
  helperPhone?: string;
}

// 1. Send SMS via Fast2SMS (Indian Gateway) or Custom SMS Provider
export async function sendSMS(phone: string, message: string): Promise<{ success: boolean; error?: string }> {
  const cleanPhone = phone.replace(/\D/g, '').slice(-10);
  if (cleanPhone.length !== 10) {
    return { success: false, error: 'Invalid 10-digit phone number' };
  }

  const apiKey = process.env.FAST2SMS_API_KEY;

  if (apiKey) {
    try {
      const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
        method: 'POST',
        headers: {
          'authorization': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          route: 'q',
          message: message,
          numbers: cleanPhone,
        }),
      });

      const data = await response.json();
      console.log(`[SMS Sent to ${cleanPhone}]:`, data);
      return { success: data?.return === true };
    } catch (err: any) {
      console.error('[SMS Delivery Error]:', err);
      return { success: false, error: err?.message };
    }
  }

  // Fallback log if API key is not yet configured in .env
  console.log(`[SIMULATED SMS to ${cleanPhone}]: ${message}`);
  return { success: true };
}

// 2. Format Customer Confirmation Message (Hindi + English)
export function formatCustomerMessage(data: BookingNotificationData): string {
  const slot = data.timeSlot || 'Normal business hours';
  const addr = data.addressText || 'Bhilai';
  return (
    `*Qwikkaam Booking Confirmed!*\n\n` +
    `Namaste *${data.customerName}*! Aapki service booking safalta-poorvak confirm ho chuki hai.\n\n` +
    `*Booking ID:* #${data.bookingId}\n` +
    `*Service:* ${data.serviceName}\n` +
    `*Date & Time:* ${data.scheduledDate} (${slot})\n` +
    `*Address:* ${addr}\n` +
    `*Total Amount:* ₹${data.totalAmount}\n\n` +
    `Humare verified professional helper samay par aapke ghar pahunchenge.\n` +
    `Support ke liye call ya WhatsApp karein: +91 98765 43210`
  );
}

// 3. Format Helper & Admin Alert Message
export function formatHelperAlertMessage(data: BookingNotificationData): string {
  const slot = data.timeSlot || 'Normal business hours';
  const addr = data.addressText || 'Bhilai';
  return (
    `*Nayi Qwikkaam Booking Alert!*\n\n` +
    `*Booking ID:* #${data.bookingId}\n` +
    `*Service:* ${data.serviceName}\n` +
    `*Customer:* ${data.customerName}\n` +
    `*Customer Phone:* ${data.customerPhone}\n` +
    `*Address:* ${addr}\n` +
    `*Date & Time:* ${data.scheduledDate} (${slot})\n` +
    `*Total Charge:* ₹${data.totalAmount}\n\n` +
    `Kripya turant customer se coordinate karein aur samay par service dein!`
  );
}

// 4. Generate direct WhatsApp Click-to-Chat Link (wa.me)
export function getWhatsAppLink(phone: string, message: string): string {
  const cleanPhone = phone.replace(/\D/g, '').slice(-10);
  const formattedPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
  return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
}

// 5. Main Notification Dispatcher
export async function sendBookingNotifications(data: BookingNotificationData) {
  const customerMsg = formatCustomerMessage(data);
  const helperMsg = formatHelperAlertMessage(data);

  // Send SMS to Customer
  const customerSMSPromise = sendSMS(
    data.customerPhone,
    `Qwikkaam: Aapki booking #${data.bookingId} (${data.serviceName}) confirm ho gayi hai. Helper jaldi hi pahunchenge. Info: +919876543210`
  );

  // Send SMS to Helper / Admin if phone provided
  let helperSMSPromise = Promise.resolve({ success: true });
  const adminPhone = process.env.ADMIN_PHONE || '9876543210';
  const targetAlertPhone = data.helperPhone || adminPhone;
  if (targetAlertPhone) {
    helperSMSPromise = sendSMS(
      targetAlertPhone,
      `Qwikkaam Alert: Nayi booking #${data.bookingId} (${data.serviceName}). Customer: ${data.customerName} (${data.customerPhone}). Address: ${data.addressText || 'Bhilai'}`
    );
  }

  await Promise.allSettled([customerSMSPromise, helperSMSPromise]);

  return {
    customerWhatsAppLink: getWhatsAppLink(data.customerPhone, customerMsg),
    helperWhatsAppLink: targetAlertPhone ? getWhatsAppLink(targetAlertPhone, helperMsg) : null,
    customerMessage: customerMsg,
    helperMessage: helperMsg,
  };
}
