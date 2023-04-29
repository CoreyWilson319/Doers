// Dependencies
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("../../config/default.json");
const auth = require("../../middleware/auth");

// Models
const User = require("../../models/User");
// const Calendar = require("../../models/Calendar");
// const Budget = require("../../models/Budget");
// const Transaction = require("../../models/Transaction");
// const Journal = require("../../models/Journal");

// Tests
router.get("/test", (req, res) => {
	res.send("Hello from /user/test");
});

// Register User
router.post("/register", async (req, res) => {
	console.log(req);
	const { email, password } = req.body;

	try {
		let user = await User.findOne({ email });
		if (user) {
			return res.status(400).json({ msg: "Email already exists!" });
		}

		user = new User({
			email,
			password,
		});

		const salt = await bcrypt.genSalt(10);
		user.password = await bcrypt.hash(password, salt);
		await user.save();

		const payload = {
			user: {
				id: user.id,
			},
		};

		jwt.sign(
			payload,
			config.jwt_secret,
			{ expiresIn: "7 days" },
			(err, token) => {
				if (err) throw err;
				res.json({ token });
			}
		);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server Error");
	}
});

// Login User
router.post("/login", async (req, res) => {
	const { email, password } = req.body;

	try {
		// check if the user exists
		let user = await User.findOne({ email });
		if (!user) {
			return res.status(400).json({ msg: "Email or password incorrect" });
		}

		// check is the encrypted password matches
		const isMatch = await bcrypt.compare(password, user.password);
		console.log(isMatch);
		console.log(password);
		console.log(user.password);

		if (!isMatch) {
			return res.status(400).json({ msg: "Email or password incorrect" });
		}

		// return jwt
		const payload = {
			user: {
				id: user.id,
			},
		};

		jwt.sign(
			payload,
			config.jwt_secret,
			{ expiresIn: "30 days" },
			(err, token) => {
				if (err) throw err;
				res.json({ token });
			}
		);
	} catch (err) {
		console.error(err.message);
		// console.log(req.body);
		res.status(500).send("Server error");
	}
});

// Fetch User Info -Password
router.get("/info", auth, async (req, res) => {
	try {
		console.log(req.user);
		const user = await User.findById(req.user.id).select("-password");
		console.log(user);
		res.status(200).json({ user });
	} catch (error) {
		res.status(500).json({ error });
	}
});

// Logout and destroy token

module.exports = router;
