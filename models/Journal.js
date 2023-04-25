const mongoose = require("mongoose");
const { Schema } = mongoose;

const journalSchema = new Schema({
	name: String,
});

module.exports = Journal = mongoose.model("Journal", journalSchema);
