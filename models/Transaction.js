const mongoose = require("mongoose");
const { Schema } = mongoose;

const transactionSchema = new Schema({
	name: String,
});

module.exports = Transaction = mongoose.model("Transaction", transactionSchema);
