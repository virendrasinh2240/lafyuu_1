const express = require("express");
const auth = require("../middleware/auth");
const { add_address, get_address, editAddress, deleteAddress } = require("../controller/address");
const addressRouter = express.Router();

addressRouter.post("/address", auth, add_address); // Use POST for creating a new address
addressRouter.get("/address", auth, get_address);  // Use GET for fetching addresses
addressRouter.put("/address", auth, editAddress);  // Use PUT for updating an address
addressRouter.delete("/address", auth, deleteAddress); // Use DELETE for removing an address

module.exports = addressRouter;
