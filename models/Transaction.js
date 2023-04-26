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
	amountPaid: null,
	paidForTheMonth: Boolean,
});

module.exports = Transaction = mongoose.model("Transaction", transactionSchema);
