const express = require("express");
const router = express.Router();

const Journal = require("../../models/Journal");

router.get("/test", (req, res) => {
	res.send("Hello from /Journal/test");
});

module.exports = router;
