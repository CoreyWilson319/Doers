const mongoose = require("mongoose");
const config = require("config");
const db = config.get("mongoURITest");

const connectDB = async () => {
	try {
		mongoose.set("strictQuery", true);
		await mongoose.connect(db, {
			useNewUrlParser: true,
		});

		console.log("MongoDB is Connected...");
	} catch (err) {
		console.error(err.message);
		process.exit();
	}
};

// exports.connectDB = connectDB;

// const disconnectDB = async () => {
// 	try {
// 		await mongoose.connection.close();
// 	} catch (err) {
// 		console.log(err);
// 		process.exit(1);
// 	}
// };

// exports.disconnectDB = disconnectDB;

module.exports = connectDB;
