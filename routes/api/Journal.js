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
router.post("/", auth, async (req, res) => {
	try {
		let { title, body, private } = req.body;
		let user = await User.findById(req.user.id);
		let entry = new Journal({ title, body, private, user: req.user.id });
		entry.save();
		user.journal.push(entry);
		user.save();
		res.status(200).json(user);
	} catch (err) {
		res.status(500).json(err);
	}
});

// Delete user Journal
router.delete("/:id", auth, async (req, res) => {
	try {
		let deletedItem = await Journal.findOneAndDelete({
			_id: req.params.id,
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
		let { body, title, private } = req.body;
		await Journal.findOneAndUpdate(
			{
				_id: req.params.id,
				user: req.user.id,
			},
			{ body, title, private }
		);
		let updatedItem = await Journal.findById(req.params.id);
		res
			.status(200)
			.json({ msg: "Successfully Edited Journal Item", updatedItem });
	} catch (err) {
		res.status(500).json(err);
	}
});

module.exports = router;
