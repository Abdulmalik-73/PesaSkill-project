const express = require('express');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const Transaction = require('../models/Transaction');
const Service = require('../models/Service');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

// ─── Safaricom Ethiopia helpers ──────────────────────────────────────────────

const BASE_URL = process.env.MPESA_BASE_URL || 'https://apisandbox.safaricom.et';

/**
 * Normalize phone to Ethiopian format: 251XXXXXXXXX (12 digits)
 * Accepts: 0912345678 → 251912345678
 *          +251912345678 → 251912345678
 *          251912345678 → 251912345678
 *          912345678 → 251912345678
 */
function normalizePhone(phone) {
  const digits = String(phone).replace(/\D/g, '');
  if (digits.startsWith('251') && digits.length === 12) return digits;
  if (digits.startsWith('0') && digits.length === 10) return '251' + digits.slice(1);
  if (digits.length === 9) return '251' + digits;
  if (digits.startsWith('251')) return digits; // already has country code
  return digits; // return as-is, let API validate
}

/** Get OAuth token from Safaricom Ethiopia */
async function getToken() {
  const { MPESA_CONSUMER_KEY, MPESA_CONSUMER_SECRET } = process.env;
  const res = await axios.get(
    `${BASE_URL}/v1/token/generate?grant_type=client_credentials`,
    {
      auth: { username: MPESA_CONSUMER_KEY, password: MPESA_CONSUMER_SECRET },
    }
  );
  return res.data.access_token;
}

/** STK Push v3 — C2B (customer pays into escrow) */
async function stkPush({ phone, amount, transactionId, serviceTitle }) {
  const token = await getToken();
  const normalizedPhone = normalizePhone(phone);
  const payload = {
    MerchantRequestID: `PesaSkill-${uuidv4()}`,
    BusinessShortCode: process.env.MPESA_SHORTCODE,
    Password: process.env.MPESA_PASSWORD,
    Timestamp: process.env.MPESA_TIMESTAMP,
    TransactionType: 'CustomerPayBillOnline',
    Amount: amount,
    PartyA: normalizedPhone,
    PartyB: process.env.MPESA_SHORTCODE,
    PhoneNumber: normalizedPhone,
    CallBackURL: `${process.env.MPESA_CALLBACK_URL}`,
    AccountReference: `PesaSkill-${transactionId.toString().slice(-8).toUpperCase()}`,
    TransactionDesc: `Payment for ${serviceTitle}`,
    ReferenceData: [{ Key: 'PlatformName', Value: 'PesaSkill' }],
  };
  const res = await axios.post(
    `${BASE_URL}/mpesa/stkpush/v3/processrequest`,
    payload,
    { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
  );
  return res.data;
}

/** B2C — release funds from escrow to seller */
async function b2cPayout({ phone, amount, transactionId }) {
  const token = await getToken();
  const normalizedPhone = normalizePhone(phone);
  const payload = {
    OriginatorConversationID: `PesaSkill-${uuidv4()}`,
    InitiatorName: process.env.MPESA_INITIATOR_NAME,
    SecurityCredential: process.env.MPESA_SECURITY_CREDENTIAL,
    CommandID: 'BusinessPayment',
    PartyA: process.env.MPESA_SHORTCODE,
    PartyB: normalizedPhone,
    Amount: amount,
    Remarks: `PesaSkill escrow release`,
    Occassion: `Release-${transactionId.toString().slice(-8).toUpperCase()}`,
    QueueTimeOutURL: process.env.MPESA_CALLBACK_URL,
    ResultURL: process.env.MPESA_CALLBACK_URL,
  };
  const res = await axios.post(
    `${BASE_URL}/mpesa/b2c/v2/paymentrequest`,
    payload,
    { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
  );
  return res.data;
}

/** Reversal — refund on dispute/cancel */
async function reverseTransaction({ mpesaTransactionId, amount, receiverPhone, transactionId }) {
  const token = await getToken();
  const payload = {
    OriginatorConversationID: `PesaSkill-Rev-${uuidv4()}`,
    Initiator: process.env.MPESA_INITIATOR_NAME,
    SecurityCredential: process.env.MPESA_SECURITY_CREDENTIAL,
    CommandID: 'TransactionReversal',
    TransactionID: mpesaTransactionId,
    Amount: amount,
    OriginalConversationID: `PesaSkill-${transactionId}`,
    PartyA: process.env.MPESA_SHORTCODE,
    RecieverIdentifierType: '4',
    ReceiverParty: receiverPhone,
    ResultURL: process.env.MPESA_CALLBACK_URL,
    QueueTimeOutURL: process.env.MPESA_CALLBACK_URL,
    Remarks: 'PesaSkill Refund',
    Occasion: 'Refund',
  };
  const res = await axios.post(
    `${BASE_URL}/mpesa/reversal/v2/request`,
    payload,
    { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
  );
  return res.data;
}

// ─── Routes ──────────────────────────────────────────────────────────────────

// GET /api/payments/token-test — verify credentials work
router.get('/token-test', async (req, res) => {
  try {
    const token = await getToken();
    res.json({ success: true, token: token.slice(0, 10) + '...' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/payments/initiate — STK Push (buyer pays)
router.post('/initiate', protect, async (req, res) => {
  try {
    const { serviceId, phone } = req.body;
    if (!phone) return res.status(400).json({ message: 'Phone number required' });

    const service = await Service.findById(serviceId).populate('seller');
    if (!service) return res.status(404).json({ message: 'Service not found' });
    if (service.seller._id.toString() === req.user._id.toString())
      return res.status(400).json({ message: 'Cannot buy your own service' });

    const amount = service.price;
    const platformFee = Math.round(amount * 0.05);
    const sellerAmount = amount - platformFee;

    // Create pending transaction first
    const transaction = await Transaction.create({
      buyer: req.user._id,
      seller: service.seller._id,
      service: serviceId,
      amount,
      platformFee,
      sellerAmount,
      buyerPhone: phone,
      status: 'pending_payment',
      autoReleaseAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
    });

    // Try real STK Push
    try {
      const result = await stkPush({
        phone,
        amount,
        transactionId: transaction._id,
        serviceTitle: service.title,
      });

      // Update with Safaricom's MerchantRequestID for tracking
      await Transaction.findByIdAndUpdate(transaction._id, {
        mpesaTransactionId: result.MerchantRequestID || result.CheckoutRequestID || '',
      });

      res.json({
        message: 'STK Push sent — check your phone for the M-Pesa prompt',
        transactionId: transaction._id,
        merchantRequestId: result.MerchantRequestID,
        checkoutRequestId: result.CheckoutRequestID,
        simulated: false,
      });
    } catch (mpesaErr) {
      // Fallback: simulate for demo if API fails
      console.error('M-Pesa STK error:', mpesaErr.response?.data || mpesaErr.message);
      const fakeId = `SIM-${Date.now()}`;
      await Transaction.findByIdAndUpdate(transaction._id, {
        status: 'in_escrow',
        mpesaTransactionId: fakeId,
        mpesaReceiptNumber: fakeId,
      });
      res.json({
        message: 'Payment simulated (M-Pesa sandbox fallback)',
        transactionId: transaction._id,
        simulated: true,
        mpesaId: fakeId,
        mpesaError: mpesaErr.response?.data?.errorMessage || mpesaErr.message,
      });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/payments/callback — Safaricom STK callback
router.post('/callback', async (req, res) => {
  try {
    console.log('M-Pesa Callback:', JSON.stringify(req.body, null, 2));
    const body = req.body?.Body?.stkCallback || req.body;
    const resultCode = body?.ResultCode ?? body?.Result?.ResultCode;
    const merchantRequestId = body?.MerchantRequestID || body?.Result?.OriginatorConversationID;

    if (resultCode === 0 || resultCode === '0') {
      const items = body?.CallbackMetadata?.Item || [];
      const receipt = items.find(i => i.Name === 'MpesaReceiptNumber')?.Value || merchantRequestId || '';
      const amount = items.find(i => i.Name === 'Amount')?.Value;

      // Find transaction by mpesaTransactionId (MerchantRequestID set at initiation)
      const tx = await Transaction.findOne({ mpesaTransactionId: merchantRequestId });
      if (tx) {
        await Transaction.findByIdAndUpdate(tx._id, {
          status: 'in_escrow',
          mpesaReceiptNumber: receipt,
        });
        console.log(`Transaction ${tx._id} moved to in_escrow`);
      }
    }
    res.json({ ResultCode: 0, ResultDesc: 'Accepted' });
  } catch (err) {
    console.error('Callback error:', err.message);
    res.json({ ResultCode: 0, ResultDesc: 'Accepted' }); // always ack Safaricom
  }
});

// POST /api/payments/b2c-result — B2C result callback
router.post('/b2c-result', async (req, res) => {
  try {
    console.log('B2C Result:', JSON.stringify(req.body, null, 2));
    res.json({ ResultCode: 0, ResultDesc: 'Accepted' });
  } catch (err) {
    res.json({ ResultCode: 0, ResultDesc: 'Accepted' });
  }
});

// PUT /api/payments/:id/mark-done — Seller marks work done
router.put('/:id/mark-done', protect, async (req, res) => {
  try {
    const tx = await Transaction.findById(req.params.id);
    if (!tx) return res.status(404).json({ message: 'Transaction not found' });
    if (tx.seller.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });
    if (!['in_escrow', 'in_progress'].includes(tx.status))
      return res.status(400).json({ message: `Cannot mark done from status: ${tx.status}` });

    await Transaction.findByIdAndUpdate(req.params.id, {
      status: 'completed',
      sellerMarkedDone: true,
      sellerNote: req.body.note || '',
    });
    res.json({ message: 'Marked as done. Waiting for buyer confirmation.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/payments/:id/confirm — Buyer confirms → release funds via B2C
router.put('/:id/confirm', protect, async (req, res) => {
  try {
    const tx = await Transaction.findById(req.params.id)
      .populate('service', 'title')
      .populate('seller', 'name phone');

    if (!tx) return res.status(404).json({ message: 'Transaction not found' });
    if (tx.buyer.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });
    if (tx.status !== 'completed')
      return res.status(400).json({ message: 'Seller must mark work as done first' });

    // Release funds to seller wallet (internal)
    await User.findByIdAndUpdate(tx.seller._id, {
      $inc: { walletBalance: tx.sellerAmount, jobsCompleted: 1 },
    });
    await Service.findByIdAndUpdate(tx.service._id, { $inc: { ordersCompleted: 1 } });
    await Transaction.findByIdAndUpdate(req.params.id, {
      status: 'released',
      buyerConfirmed: true,
      escrowReleasedAt: new Date(),
    });

    // Attempt real B2C payout to seller's phone
    if (tx.seller.phone) {
      try {
        const b2cResult = await b2cPayout({
          phone: tx.seller.phone,
          amount: tx.sellerAmount,
          transactionId: tx._id,
        });
        console.log('B2C payout initiated:', b2cResult);
      } catch (b2cErr) {
        console.error('B2C payout error (funds credited to wallet):', b2cErr.response?.data || b2cErr.message);
        // Funds already credited to wallet above — non-fatal
      }
    }

    res.json({ message: `Payment of KES ${tx.sellerAmount} released to ${tx.seller.name}!` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/payments/:id/dispute — Buyer raises dispute (locks funds)
router.put('/:id/dispute', protect, async (req, res) => {
  try {
    const tx = await Transaction.findById(req.params.id);
    if (!tx) return res.status(404).json({ message: 'Not found' });
    if (tx.buyer.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });
    if (!['in_escrow', 'in_progress', 'completed'].includes(tx.status))
      return res.status(400).json({ message: 'Cannot dispute at this stage' });

    await Transaction.findByIdAndUpdate(req.params.id, {
      status: 'disputed',
      disputeReason: req.body.reason || 'Dispute raised by buyer',
    });
    res.json({ message: 'Dispute raised. Funds are locked securely.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/payments/:id/refund — Admin/system refund via reversal
router.put('/:id/refund', protect, async (req, res) => {
  try {
    const tx = await Transaction.findById(req.params.id).populate('buyer', 'phone');
    if (!tx) return res.status(404).json({ message: 'Not found' });
    if (tx.status !== 'disputed')
      return res.status(400).json({ message: 'Can only refund disputed transactions' });

    let reversalResult = null;
    if (tx.mpesaReceiptNumber && !tx.mpesaReceiptNumber.startsWith('SIM')) {
      try {
        reversalResult = await reverseTransaction({
          mpesaTransactionId: tx.mpesaReceiptNumber,
          amount: tx.amount,
          receiverPhone: tx.buyerPhone,
          transactionId: tx._id,
        });
        console.log('Reversal initiated:', reversalResult);
      } catch (revErr) {
        console.error('Reversal error:', revErr.response?.data || revErr.message);
      }
    }

    await Transaction.findByIdAndUpdate(req.params.id, { status: 'refunded' });
    res.json({ message: 'Refund initiated', reversalResult });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/payments/my — user's transactions
router.get('/my', protect, async (req, res) => {
  try {
    const { role } = req.query;
    const query = role === 'seller' ? { seller: req.user._id } : { buyer: req.user._id };
    const transactions = await Transaction.find(query)
      .populate('service', 'title category price')
      .populate('buyer', 'name')
      .populate('seller', 'name')
      .sort({ createdAt: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/payments/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const tx = await Transaction.findById(req.params.id)
      .populate('service', 'title description category price')
      .populate('buyer', 'name email phone')
      .populate('seller', 'name email phone');
    if (!tx) return res.status(404).json({ message: 'Not found' });
    res.json(tx);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
