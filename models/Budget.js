const mongoose = require("mongoose");
const { Schema } = mongoose;

const budgetSchema = new Schema({
	account: String,
	balance: Number,
	transaction: { type: mongoose.Schema.Types.ObjectId, ref: "Transaction" },
	user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

module.exports = Budget = mongoose.model("Budget", budgetSchema);
