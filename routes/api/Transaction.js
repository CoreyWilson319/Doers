const express = require("express");
const router = express.Router();

const Transaction = require("../../models/Transaction");

router.get("/test", (req, res) => {
	res.send("Hello from /Transaction/test");
});

module.exports = router;
