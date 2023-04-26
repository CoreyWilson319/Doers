const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
	username: String,
	password: String,
	email: String,
	task: { type: mongoose.Schema.Types.ObjectId, ref: "Task" },
	budget: { type: mongoose.Schema.Types.ObjectId, ref: "Budget" },
	journal: { type: mongoose.Schema.Types.ObjectId, ref: "Journal" },
	calendar: { type: mongoose.Schema.Types.ObjectId, ref: "Calendar" },
	goals: { type: mongoose.Schema.Types.ObjectId, ref: "Goal" },
	created: { type: Date, default: Date.now },
	transactions: { type: mongoose.Schema.Types.ObjectId, ref: "Transaction" },
	settings: Object,
});

module.exports = User = mongoose.model("User", userSchema);
