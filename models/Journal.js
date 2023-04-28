const mongoose = require("mongoose");
const { Schema } = mongoose;

const journalSchema = new Schema({
	title: String,
	created: { type: Date, default: Date.now },
	body: {
		type: String,
		minLength: 20,
		maxLength: 1000,
	},
	private: Boolean,
	user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

module.exports = Journal = mongoose.model("Journal", journalSchema);
