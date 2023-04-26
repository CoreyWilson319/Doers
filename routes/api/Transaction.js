// Dependencies
const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");

// Models

const Transaction = require("../../models/Transaction");

// Test
router.get("/test", (req, res) => {
	res.send("Hello from /Transaction/test");
});

// Create user transactions
router.post("/transaction", auth, async (req, res) => {
	res.status(200);
});
// Edit user transaction
router.put("/transaction", auth, async (req, res) => {
	res.status(200);
});
// Delete user transactions
router.delete("/transaction", auth, async (req, res) => {
	res.status(200);
});

module.exports = router;
