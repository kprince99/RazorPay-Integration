const test = require('dotenv').config()
const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');

console.log(test);

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ status: '200', message: 'Payment route reached!' });
});

router.get('/options', async (req, res) => {
  const {amount} = req.query;
  res.json({ 
    amount: amount,  
    status: '200', 
    message: 'Testing options only (for refrence)!' });
});

router.get('/orders', async (req, res) => {
  const { inputAmount } = req.query;

  try {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID, // YOUR RAZORPAY KEY
      key_secret: process.env.RAZORPAY_SECRET, // YOUR RAZORPAY SECRET
    });

    const options = {
      amount: (inputAmount.toString()) * 100,
      currency: 'INR',
      receipt: 'receipt_order_74394',
    };

    const order = await instance.orders.create(options);

    if (!order) {
    return res.status(500).send('Some error occured');
    }

    res.json(order);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get('/success', async (req, res) => {
  try {
    const {
      orderCreationId,
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,
    } = req.body;

    const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET);
    shasum.update(`${orderCreationId}|${razorpayPaymentId}`);
    const digest = shasum.digest('hex');

    if (digest !== razorpaySignature)
      return res.status(400).json({ msg: 'Transaction not legit!' });

    res.json({
      msg: 'success',
      orderId: razorpayOrderId,
      paymentId: razorpayPaymentId,
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
