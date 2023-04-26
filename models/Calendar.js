const mongoose = require("mongoose");
const { Schema } = mongoose;

const calendarSchema = new Schema({
	year: {
		type: Number,
		min: 2023,
		max: 2099,
	},
	day: {
		type: Number,
		min: 1,
		max: 31,
	},
	month: {
		type: Number,
		min: 1,
		max: 12,
	},
	created: { type: Date, default: Date.now },
});

module.exports = Calendar = mongoose.model("Calendar", calendarSchema);
