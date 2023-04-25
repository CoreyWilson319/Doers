const express = require("express");
const router = express.Router();

const Budget = require("../../models/Budget");

router.get("/test", (req, res) => {
	res.send("Hello from /Budget/test");
});

module.exports = router;
