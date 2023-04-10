const express = require("express");
const connectDB = require("./config/db");

const app = express();

// Connect Database
connectDB();

app.get("/", (req, res) => res.send("Hello World"));

// Routes
const users = require("./routes/api/User");
app.use("/user", users);
const budgetEntries = require("./router/api/BudgetEntry");
app.use("/budget", budgetEntries);
const transactions = require("./routes/api/Transaction");
app.use("/transactions", transactions);
const journals = require("./routes/api/Journal");
app.use("/journal", journals);
const calendarEntries = require("./routes/api/CalendarEntry");
app.use("/calendar", calendarEntries);

const port = process.env.PORT || 8082;

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});

// Users will have many but the many will only have one user
// Budget obj, Tasks (Now will change to Habit) Obj, Calendar Obj, Journal Obj
