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

// Get all user transactions
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
		let budget = await Budget.findById(req.params.budgetID);
		let transaction = new Transaction({
			category,
			label,
			value,
			frequency,
			amountPaid,
			paidForTheMonth,
			user: req.user.id,
			budget: req.params.budgetID,
		});
		if (!budget) {
			return res.status(404).json({ msg: "User budget not found" });
		}
		budget.transactions.push(transaction);
		transaction.save();
		budget.save();
		res.status(200).json(budget);
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
			{ category, label, value, frequency, amountPaid, paidForTheMonth },
			{ new: true }
		);
		if (!updatedItem) return res.status(400).json({ msg: "Incorrect User" });
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

		if (!deletedItem) return res.status(400).json({ msg: "Not Found" });
		res.status(200).json(deletedItem);
	} catch (err) {
		res.status(500).json(err);
	}
});

module.exports = router;
