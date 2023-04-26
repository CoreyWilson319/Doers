// Dependencies
const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");

// Models
const Journal = require("../../models/Journal");

// Test
router.get("/test", (req, res) => {
	res.send("Hello from /Journal/test");
});

// Create user Journal
router.post("/journal", auth, async (req, res) => res.status(200));
// Delete user Journal
router.delete("/journal", auth, async (req, res) => res.status(200));
// Edit user Journal
router.put("/journal", auth, async (req, res) => res.status(200));

module.exports = router;
