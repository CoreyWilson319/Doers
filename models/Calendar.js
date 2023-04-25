const mongoose = require("mongoose");
const { Schema } = mongoose;

const calendarSchema = new Schema({
	name: String,
});

module.exports = Calendar = mongoose.model("Calendar", calendarSchema);
