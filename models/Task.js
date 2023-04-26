const mongoose = require("mongoose");
const { Schema } = mongoose;

const taskSchema = new Schema({
	title: String,
	created: { type: Date, default: Date.now },
	context: {
		type: String,
		minLength: 20,
		maxLength: 500,
	},
	private: Boolean,
});

module.exports = Task = mongoose.model("Task", taskSchema);
