// Dependencies
const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");

// Models
const Journal = require("../../models/Journal");
const User = require("../../models/User");

// Test
router.get("/test", (req, res) => {
	res.send("Hello from /Journal/test");
});

// Create user Journal
router.post("/new", auth, async (req, res) => {
	try {
		let { title, body, hidden } = req.body;
		let user = await User.findById(req.user.id);
		let entry = new Journal({ title, body, hidden, user: req.user.id });
		entry.save();
		user.journal.push(entry);
		user.save();
		res.status(200).json(user);
	} catch (err) {
		res.status(500).json(err);
	}
});

router.get("/", auth, async (req, res) => {
	try {
		let journals = await Journal.find({ user: req.user.id });
		res.status(200).json(journals);
	} catch (err) {
		res.status(500).json(err);
	}
});
router.get("/:id", auth, async (req, res) => {
	try {
		let journal = await Journal.find({
			user: req.user.id,
			id: req.params.id,
		});

		if (!journal) return res.status(403).json({ msg: "Unauthorized" });
		res.status(200).json(journal);
	} catch (err) {
		res.status(500).json(err);
	}
});

// Delete user Journal
router.delete("/:id", auth, async (req, res) => {
	try {
		let deletedItem = await Journal.findOneAndDelete({
			id: req.params.id,
			user: req.user.id,
		});
		res.status(200).json(deletedItem);
	} catch (err) {
		res.status(500).json(err);
	}
});

// Edit user Journal
router.put("/:id", auth, async (req, res) => {
	try {
		let { body, title, hidden } = req.body;
		let updatedItem = await Journal.findOneAndUpdate(
			{
				id: req.params.id,
				user: req.user.id,
			},
			{ body, title, hidden },
			{ new: true }
		);
		if (!updatedItem) return res.status(403).json({ msg: "Unauthorized User" });
		res.status(200).json(updatedItem);
	} catch (err) {
		res.status(500).json(err);
	}
});

module.exports = router;
