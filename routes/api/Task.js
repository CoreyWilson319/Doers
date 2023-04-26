// Dependencies
const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");

// Models
const Task = require("../../models/Task");

// Test
router.get("/test", (req, res) => {
	res.send("Hello from /Task/test");
});

// Create user Task
router.post("/task", auth, async (req, res) => res.status(200));
// Delete user Task
router.delete("/task", auth, async (req, res) => res.status(200));
// Edit user Task
router.put("/task", auth, async (req, res) => res.status(200));

module.exports = router;
