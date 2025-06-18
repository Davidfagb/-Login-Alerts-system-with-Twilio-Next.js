// pages/api/notify-login.js

import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { email, ip } = req.body;

  if (!email || !ip) {
    return res.status(400).json({ message: 'Missing email or IP address.' });
  }

  try {
    await client.messages.create({
      body: `🔐 Login Alert: ${email} logged in from IP ${ip}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: process.env.ALERT_RECIPIENT_NUMBER,
    });

    res.status(200).json({ message: 'Alert sent!' });
  } catch (error) {
    console.error('Twilio Error:', error);
    res.status(500).json({ message: 'Failed to send alert.' });
  }
}
