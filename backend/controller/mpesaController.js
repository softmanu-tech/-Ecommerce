const axios = require('axios');
require('dotenv').config();

const generateAccessToken = async () => {
  const consumer_key = process.env.MPESA_CONSUMER_KEY;
  const consumer_secret = process.env.MPESA_CONSUMER_SECRET;
  const auth = Buffer.from(`${consumer_key}:${consumer_secret}`).toString('base64');

  try {
    const response = await axios.get('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
      headers: {
        Authorization: `Basic ${auth}`
      }
    });
    return response.data.access_token;
  } catch (error) {
    console.error('Error generating access token:', error);
    throw error;
  }
};

const initiateSTKPush = async (req, res) => {
  try {
    const accessToken = await generateAccessToken();
    const phone = req.body.phone.substring(1); // Remove the leading zero
    const amount = req.body.amount;

    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
    const password = Buffer.from(`${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`).toString('base64');

    const response = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      {
        BusinessShortCode: process.env.MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: amount,
        PartyA: `254${phone}`,
        PartyB: process.env.MPESA_SHORTCODE,
        PhoneNumber: `254${phone}`,
        CallBackURL: `${process.env.CALLBACK_URL}/api/mpesa/callback`,
        AccountReference: 'YourCompany',
        TransactionDesc: 'Payment for goods/services'
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error('Error initiating STK push:', error);
    res.status(500).json({ error: 'Failed to initiate payment' });
  }
};

module.exports = { initiateSTKPush };