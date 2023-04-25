const jwt = require("jsonwebtoken");
const config = require("../config/default.json");

module.exports = function (req, res, next) {
	const token = req.header("x-auth-token");

	if (!token) {
		return res.status(401).json({ msg: "No Token, authorization denied" });
	}

	try {
		jwt.verify(token, config.jwt_secret, (error, decoded) => {
			if (error) {
				return res.status(401).json({ msg: "Token is not valid" });
			} else {
				req.user = decoded.user;
				next();
			}
		});
	} catch (err) {
		console.error("something wrong with auth middleware");
		res.status(500).json({ msg: "Server Error" });
	}
};
