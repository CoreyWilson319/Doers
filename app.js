const express = require("express");
const connectDB = require("./config/db");

const bodyParser = require("body-parser");
const app = express();

// Parse incoming json data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect Database
connectDB();

app.get("/", (req, res) => res.send("Hello World"));

// Routes
const users = require("./routes/api/User");
app.use("/user", users);
const budget = require("./routes/api/Budget");
app.use("/budget", budget);
const transactions = require("./routes/api/Transaction");
app.use("/transactions", transactions);
const task = require("./routes/api/Task");
app.use("/task", task);
const journals = require("./routes/api/Journal");
app.use("/journal", journals);
const calendar = require("./routes/api/Calendar");
app.use("/calendar", calendar);

const port = process.env.PORT || 8082;

app.listen(port, async () => {
	console.log(`Server running on port ${port}`);
});

// Users will have many but the many will only have one user
// Budget obj, Tasks (Now will change to Habit) Obj, Calendar Obj, Journal Obj

module.exports = app;
