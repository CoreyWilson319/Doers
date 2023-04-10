const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
	username: String,
	password: String,
	email: String,
	task: String,
	budget: String,
	journal: String,
	calendar: String,
	goals: String,
	date: { type: Date, default: Date.now },
	expense: String,
	income: String,
	settings: String,
});

module.exports = User = mongoose.model("User", userSchema);
