// Dependencies
const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");

// Models

const Transaction = require("../../models/Transaction");
const User = require("../../models/User");
const Budget = require("../../models/Budget");

// Test
router.get("/test", (req, res) => {
	res.send("Hello from /Transaction/test");
});

// Get user transactions
router.get("/", auth, async (req, res) => {
	try {
		let transactions = await Transaction.find({ user: req.user.id });
		res.status(200).json(transactions);
	} catch (err) {
		res.status(500).json(err);
	}
});
// Get user transactions
router.get("/:id", auth, async (req, res) => {
	try {
		let transaction = await Transaction.find({
			user: req.user.id,
			_id: req.params.id,
		});
		res.status(200).json(transaction);
	} catch (err) {
		res.status(500).json(err);
	}
});
// Create user transactions
router.post("/:budgetID/new", auth, async (req, res) => {
	try {
		let { category, label, value, frequency, amountPaid, paidForTheMonth } =
			req.body;
		let user = await User.findById(req.user.id);
		let budget = await Budget.findById(req.params.budgetID);
		let transaction = new Transaction({
			category,
			label,
			value,
			frequency,
			amountPaid,
			paidForTheMonth,
			user,
			budget,
		});
		budget.transaction.push(transaction);
		transaction.save();
		budget.save();
		res.status(200).json(user);
	} catch (err) {
		res.status(500).json(err);
	}
});

// Edit user transaction
router.put("/edit/:id", auth, async (req, res) => {
	try {
		let { category, label, value, frequency, amountPaid, paidForTheMonth } =
			req.body;
		let updatedItem = await Transaction.findOneAndUpdate(
			{
				user: req.user.id,
				_id: req.params.id,
			},
			{ category, label, value, frequency, amountPaid, paidForTheMonth }
		);
		res.status(200).json(updatedItem);
	} catch (err) {
		res.status(500).json(err);
	}
});

// Delete user transactions
router.delete("/delete/:id", auth, async (req, res) => {
	try {
		let deletedItem = await Transaction.findOneAndDelete({
			user: req.user.id,
			_id: req.params.id,
		});

		res.status(200).json(deletedItem);
	} catch (err) {
		res.status(500).json(err);
	}
});

module.exports = router;
