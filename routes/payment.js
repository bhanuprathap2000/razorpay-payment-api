require('dotenv').config();
const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const router = express.Router();

router.post('/orders', async (req, res) => {
	console.log('in orders');
	try {
		const instance = new Razorpay({
			key_id: process.env.RAZORPAY_KEY_ID,
			key_secret: process.env.RAZORPAY_SECRET,
		});

		console.log(req.body, 'amount to be paid');

		const options = {
			amount: 300 * 100, // amount in smallest currency unit
			currency: 'INR',
			receipt: 'receipt_order_74394',
		};

		const order = await instance.orders.create(options);

		console.log(order);

		if (!order) return res.status(500).send('Some error occured');

		res.json(order);
	} catch (error) {
		res.status(400).send(error);
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

		console.log(
			orderCreationId,
			razorpayPaymentId,
			razorpayOrderId,
			razorpaySignature
		);

		const shasum = crypto.createHmac('sha256', 'JdoSWBeA7CbeYZHUWfeZqcT1');
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
		console.log(error);
		res.status(500).send(error);
	}
});

module.exports = router;
