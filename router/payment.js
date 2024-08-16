const express = require("express");
const { paymentdetails, getAllPaymentsData, updatePaymentData } = require("../controller/payment");
const auth = require("../middleware/auth");
const checkRole = require("../middleware/checkRole");

const paymentRouter = express.Router();

paymentRouter.post("/add/payment", auth, checkRole, paymentdetails);
paymentRouter.post("/get/allPayments", auth, getAllPaymentsData);
paymentRouter.post("/update/payment", auth, checkRole, updatePaymentData);

module.exports = paymentRouter;
