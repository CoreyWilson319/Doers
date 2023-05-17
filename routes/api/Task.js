// Dependencies
const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");

// Models
const Task = require("../../models/Task");
const User = require("../../models/User");

// Test
router.get("/test", (req, res) => {
	res.send("Hello from /Task/test");
});

// Get user Task
router.get("/", auth, async (req, res) => {
	try {
		let foundTasks = await Task.find({ user: req.user.id });
		res.status(200).json(foundTasks);
	} catch (err) {
		res.status(500).json({ err });
	}
});
// Get user Task by id
router.get("/:id", auth, async (req, res) => {
	try {
	} catch (err) {
		res.status(500).json({ err });
	}
	{
		let foundTasks = await Task.find({ user: req.user.id, _id: req.params.id });
		res.status(200).json(foundTasks);
	}
});

// Create user Task
router.post("/new", auth, async (req, res) => {
	try {
		let { title, context, hidden } = req.body;
		let user = await User.findById(req.user.id);
		let entry = new Task({ title, context, hidden, user: req.user.id });
		entry.save();
		user.task.push(entry);
		user.save();
		res.status(200).json(user);
	} catch (err) {
		res.status(500).json(err);
	}
});
// Delete user Task
router.delete("/:id", auth, async (req, res) => {
	try {
		let deletedItem = await Task.findOneAndDelete({
			_id: req.params.id,
			user: req.user.id,
		});
		res.status(200).json(deletedItem);
	} catch (err) {
		res.status(500).json(err);
	}
});
// Edit user Task
router.put("/:id", auth, async (req, res) => {
	try {
		let { context, title, hidden } = req.body;
		let updatedItem = await Task.findOneAndUpdate(
			{
				_id: req.params.id,
				user: req.user.id,
			},
			{ context, title, hidden },
			{ new: true }
		);

		if (!updatedItem) return res.status(403).json({ msg: "Unathorized" });
		res.status(200).json(updatedItem);
	} catch (err) {
		res.status(500).json(err);
	}
});

module.exports = router;
