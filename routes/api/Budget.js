// Dependencies
const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const mongoose = require("mongoose");

// Models
const Budget = require("../../models/Budget");
const User = require("../../models/User");

// Test
router.get("/test", (req, res) => {
	res.send("Hello from /Budget/test");
});

// Create user budget
router.post("/create", auth, async (req, res) => {
	try {
		// search user by id
		let foundUser = await User.findById(req.user.id);
		// create user budget
		let { account, balance } = req.body;
		let budget = new Budget({ account, balance, user: req.user.id });

		let existingBudgets = await Budget.find({ user: req.user.id });

		// Don't allow creation if accountName is already being used
		if (existingBudgets.length > 0) {
			for (let i = 0; i < existingBudgets.length; i++) {
				if (existingBudgets[i].account === account) {
					return res.status(500).json({ msg: "Account Already Exists!" });
				}
			}
		}

		// save user
		budget.save();
		foundUser.budget.push(budget);
		foundUser.save();
		res.status(200).json({ foundUser });
	} catch (err) {
		res.status(500).json({ err });
	}
});

// Delete all user budget
router.delete("/delete/all", auth, async (req, res) => {
	try {
		let exisitngBudgets = await Budget.deleteMany({ user: req.user.id });
		let existingUser = await User.findById(req.user.id);
		existingUser.budget = [];
		existingUser.save();
		res.status(200).json(existingUser);
	} catch (err) {
		res.status(400).json({ err });
	}
});
// Edit user budget
router.put("/edit/:id", auth, async (req, res) => {
	try {
		let checkItemID = await Budget.findOneAndUpdate(
			{
				user: req.user.id,
				_id: req.params.id,
			},
			{
				account: req.body.account,
				balance: req.body.balance,
			},
			{ new: true }
		);
		if (!checkItemID) return res.status(500).json({ msg: "Incorrect User" });
		res.status(200).json(checkItemID);
	} catch (err) {
		res.status(500).json({ err });
	}
});

// Delete user budget
router.delete("/delete/:id", auth, async (req, res) => {
	try {
		let deletedBudget = await Budget.findOneAndDelete({
			_id: req.params.id,
			user: req.user.id,
		});
		let results = await User.findById(req.user.id).populate("budget");

		if (!deletedBudget) return res.status(500).json({ msg: "Incorrect User" });
		res.status(200).json(results.budget);
	} catch (err) {
		res.status(400).json({ err });
	}
});

// Get all user budget
router.get("/all", auth, async (req, res) => {
	try {
		let foundBudgets = await Budget.find({ user: req.user.id });
		res.status(200).json(foundBudgets);
	} catch (err) {
		res.status(400).json({ err });
	}
});

// Get user budget
router.get("/:id", auth, async (req, res) => {
	try {
		let budget = await Budget.findById(req.params.id);
		let results = await User.findById(req.user.id).populate("budget");

		res.status(200).json(budget);
	} catch (err) {
		res.status(400).json({ err });
	}
});

module.exports = router;
