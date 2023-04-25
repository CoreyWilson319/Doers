const express = require("express");
const connectDB = require("./config/db");

const app = express();

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
const journals = require("./routes/api/Journal");
app.use("/journal", journals);
const calendar = require("./routes/api/Calendar");
app.use("/calendar", calendar);

const port = process.env.PORT || 8082;

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});

// Users will have many but the many will only have one user
// Budget obj, Tasks (Now will change to Habit) Obj, Calendar Obj, Journal Obj

// What do you mean by that unamerican
