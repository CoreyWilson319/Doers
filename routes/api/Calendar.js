const express = require("express");
const router = express.Router();

const Calendar = require("../../models/Calendar");

router.get("/test", (req, res) => {
	res.send("Hello from /Calendar/test");
});

module.exports = router;
