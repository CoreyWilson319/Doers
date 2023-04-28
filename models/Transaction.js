const mongoose = require("mongoose");
const { Schema } = mongoose;

const transactionSchema = new Schema({
	category: String,
	label: String,
	value: Number,
	frequency: {
		type: Number,
		min: 1,
		max: 4,
	},
	amountPaid: String,
	paidForTheMonth: Boolean,
	user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	budget: { type: mongoose.Schema.Types.ObjectId, ref: "Budget" },
});

module.exports = Transaction = mongoose.model("Transaction", transactionSchema);
