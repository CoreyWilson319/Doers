// Dependencies
const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");

// Models
const Calendar = require("../../models/Calendar");
const User = require("../../models/User");

// Test
router.get("/test", (req, res) => {
	res.send("Hello from /Calendar/test");
});

// Create user calendaritem
router.post("/create", auth, async (req, res) => {
	try {
		let { year, day, month, event } = req.body;
		let userID = req.user.id;
		let user = await User.findById(userID);
		let newEntry = new Calendar({ year, day, month, event, user: userID });
		user.calendar.push(newEntry);

		user.save();
		newEntry.save();

		res.status(200).json(user);
	} catch (err) {
		res.status(500).json(err);
	}
});

// Get all user calendar items
router.get("/", auth, async (req, res) => {
	try {
		let userCalendarItems = await Calendar.find({ user: req.user.id });
		res.status(200).json(userCalendarItems);
	} catch (err) {
		res.status(500).json(err);
	}
});
// Get single calendar items
router.get("/:id", auth, async (req, res) => {
	try {
		let calendarItem = await Calendar.find({
			_id: req.params.id,
			user: req.user.id,
		});
		return res.status(200).json({ calendarItem });
	} catch (err) {
		res.status(500).json(err);
	}
});

// Delete user calendaritem
router.delete("/:id", auth, async (req, res) => {
	try {
		let deletedItem = await Calendar.findOneAndDelete({
			_id: req.params.id,
			user: req.user.id,
		});
		res
			.status(200)
			.json({ msg: "Successfully Deleted Calendar Item", deletedItem });
	} catch (err) {
		res.status(500).json(err);
	}
});

// Edit user calendaritem
router.put("/:id", auth, async (req, res) => {
	try {
		let { month, day, year, event } = req.body;
		await Calendar.findOneAndUpdate(
			{
				_id: req.params.id,
				user: req.user.id,
			},
			{
				month,
				day,
				year,
				event,
			}
		);
		let updatedItem = await Calendar.findById(req.params.id);
		res
			.status(200)
			.json({ msg: "Successfully Edited Calendar Item", updatedItem });
	} catch (err) {
		res.status(500).json(err);
	}
});

module.exports = router;
