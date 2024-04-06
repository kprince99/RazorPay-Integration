require('dotenv').config({path: './.env'});
import { Router } from 'express';
import Razorpay from 'razorpay';
import { createHmac } from 'crypto';

const router = Router();

router.post('/orders', async (req, res) => {
  const { inputAmount } = req.body;

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

    if (!order) return res.status(500).send('Some error occured');

    res.json(order);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post('/success', async (req, res) => {
  try {
    const {
      orderCreationId,
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,
    } = req.body;

    const shasum = createHmac('sha256', '1fBRi1UpFDacmQUpl7W8lPcc');
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

export default router;
