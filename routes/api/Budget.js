const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");

const Budget = require("../../models/Budget");

router.get("/test", (req, res) => {
	res.send("Hello from /Budget/test");
});

// Create user budget
router.post("/budget", auth, async (req, res) => res.status(200));
// Delete user budget
router.delete("/budget", auth, async (req, res) => res.status(200));
// Edit user budget
router.put("/budget", auth, async (req, res) => res.status(200));

module.exports = router;
