const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Calendar = require("../../models/Calendar");

router.get("/test", (req, res) => {
	res.send("Hello from /Calendar/test");
});

// Create user calendaritem
router.post("/calendar", auth, async (req, res) => res.status(200));
// Delete user calendaritem
router.delete("/calendar", auth, async (req, res) => res.status(200));
// Edit user calendaritem
router.put("/calendar", auth, async (req, res) => res.status(200));

module.exports = router;
