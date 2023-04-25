const mongoose = require("mongoose");
const { Schema } = mongoose;

const budgetSchema = new Schema({
	name: String,
});

module.exports = Budget = mongoose.model("Budget", budgetSchema);
