const app = require("../app");
const request = require("supertest");
const mongoose = require("mongoose");
const config = require("../config/default.json");
const connectDB = require("../config/db");

let correctLogin = {
	email: config.tempUserEmail,
	password: config.tempUserPassword,
};
let secondaryUser = {
	email: "notCorrect@email.com",
	password: "totallyWRONG",
};
let token;

async function login(cred) {
	let token = await request(app).post("/user/login").send(cred);
	token = await token.body.token;
	return token;
}
// let editID;

beforeAll(async () => {
	try {
		await connectDB();
	} catch {}
});

afterAll(async () => {
	try {
		await mongoose.connection.dropDatabase();
		await mongoose.connection.close();
	} catch {}
});

describe("USER CRUD", () => {
	let correctLogin = {
		email: config.tempUserEmail,
		password: config.tempUserPassword,
	};
	let badLogin = {
		email: "badUser@email.com",
		password: "badpassword",
	};
	describe("Test User Route", () => {
		test("Should Touch /user/test", async () => {
			let response = await request(app)
				.get("/")
				.set("Accept", "application/json")
				.expect(200);
			expect(response.statusCode).toBe(200);
		});
	});

	describe("POST /user/test, Register a new user", () => {
		test("Should register a new user", async () => {
			let response = await request(app)
				.post("/user/register")
				.send(correctLogin);
			expect(response.statusCode).toBe(200);
		});
		test("Should not register a new user if user already exist", async () => {
			let response = await request(app)
				.post("/user/register")
				.send(correctLogin);
			await request(app).post("/user/register").send(correctLogin);
			await request(app).post("/user/register").send(correctLogin);
			expect(response.statusCode).toBe(400);
		});
	});

	describe("POST /user/login", () => {
		test("Should login an existing user", async () => {
			await request(app).post("/user/register").send(correctLogin);
			let response = await request(app).post("/user/login").send(correctLogin);
			expect(response.statusCode).toBe(200);
		});
		test("Should fail to login an user whom does not exist", async () => {
			let response = await request(app)
				.post("/user/login")
				.send({ email: "email@email.com", password: "helloworld!" })
				.set("Accept", "application/json");

			expect(response.statusCode).toBe(400);
		});
		test("Should fail when non matching body is passed", async () => {
			let response = await request(app)
				.post("/user/login")
				.send(badLogin)
				.set("Accept", "application/json");

			expect(response.statusCode).toBe(400);
		});
	});

	describe("GET /user/info", () => {
		test("Should return user info if logged in", async () => {
			let login = await request(app).post("/user/login").send(correctLogin);
			let token = await login.body.token;
			let response = await request(app)
				.get("/user/info")
				.set("x-auth-token", token);

			expect(login.statusCode).toBe(200);
			expect(response.statusCode).toBe(200);
		});
	});
});

describe("Budget CRUD", () => {
	let correctLogin = {
		email: config.tempUserEmail,
		password: config.tempUserPassword,
	};
	describe("GET Test Budget Route", () => {
		test("Should Touch budget/test", async () => {
			let response = await request(app).get("/budget/test");
			expect(response.statusCode).toBe(200);
		});
	});
	describe("POST Create a new Budget", () => {
		test("Should Touch budget/test", async () => {
			token = await request(app).post("/user/login").send(correctLogin);
			token = await token.body.token;
			let newBudget = await request(app)
				.post("/budget/create")
				.set("x-auth-token", token)
				.send({ account: "CFCU", balance: 100 });

			expect(newBudget.statusCode).toBe(200);
			expect(await newBudget.body.foundUser.budget.length).toBe(1);
		});

		test("Should not allow creation of an existing budget", async () => {
			token = await request(app).post("/user/login").send(correctLogin);
			token = await token.body.token;
			let newBudget2 = await request(app)
				.post("/budget/create")
				.set("x-auth-token", token)
				.send({ account: "CFCU", balance: 100 });
			let newBudget3 = await request(app)
				.post("/budget/create")
				.set("x-auth-token", token)
				.send({ account: "CASH APP", balance: 100 });

			let lastCall = await newBudget3.body;
			expect(newBudget2.statusCode).toBe(500);
			expect(newBudget3.statusCode).toBe(200);
			expect(await lastCall.foundUser.budget.length).toBe(2);
		});
	});
	describe("GET fetch all user budgets and fetch a single budget by ID", () => {
		test("Should fetch all users budgets", async () => {
			token = await request(app).post("/user/login").send(correctLogin);
			token = await token.body.token;
			let newBudget4 = await request(app)
				.post("/budget/create")
				.set("x-auth-token", token)
				.send({ account: "CREDIT", balance: 100 });
			let budgetItems = await request(app)
				.get("/budget/all")
				.set("x-auth-token", token);
			expect(budgetItems.body.length).toBe(3);
		});
		test("Should fetch a single` user budget", async () => {
			token = await request(app).post("/user/login").send(correctLogin);
			token = await token.body.token;

			let allBudgets = await request(app)
				.get("/budget/all")
				.set("x-auth-token", token);

			let budgetID = await allBudgets.body[0]._id;
			let foundByID = await request(app)
				.get("/budget/" + budgetID)
				.set("x-auth-token", token);

			expect(foundByID.body.account).toMatch("CFCU");
		});
	});
	describe("PUT route", () => {
		test("Should edit a single budget", async () => {
			token = await login(correctLogin);

			let allBudgets = await request(app)
				.get("/budget/all")
				.set("x-auth-token", token);

			let budgetID = await allBudgets.body;
			let editBudget = await request(app)
				.put("/budget/edit/" + budgetID[0]._id)
				.set("x-auth-token", token)
				.send({ account: "Revolute", balance: 50 });
			expect(editBudget.statusCode).toBe(200);
			expect(editBudget.body.account).toMatch("Revolute");
			expect(editBudget.body.balance).toBe(50);
		});
	});

	test("Cannot edit another users budget", async () => {
		let primaryUser = await login(correctLogin);
		let secondaryUser = await request(app).post("/user/register").send({
			email: "notCorrect@email.com",
			password: "totallyWRONG",
		});
		expect(secondaryUser.statusCode).toBe(200);

		// console.log(primaryUser, "BODY");
		let allBudgets = await request(app)
			.get("/budget/all")
			.set("x-auth-token", primaryUser);
		let budgetID = await allBudgets.body[0]._id;
		let editBudget = await request(app)
			.put("/budget/edit/" + budgetID)
			.send({ account: "Haha", balance: 1 })
			.set("x-auth-token", secondaryUser.body.token);
		expect(editBudget.statusCode).toBe(500);
		expect(editBudget.body).toStrictEqual({ msg: "Incorrect User" });
	});

	describe("DELETE route", () => {
		test("Should delete a single budget", async () => {
			token = await login(correctLogin);

			let allBudgets = await request(app)
				.get("/budget/all")
				.set("x-auth-token", token);

			let getBudgetID = await allBudgets.body;
			let deleteBudget = await request(app)
				.delete("/budget/delete/" + getBudgetID[0]._id)
				.set("x-auth-token", token);

			expect(deleteBudget.statusCode).toBe(200);
			expect(deleteBudget.body.length).toBe(getBudgetID.length - 1);
		});
		test("Cannot delete another users budget", async () => {
			token = await login(correctLogin);

			let secondaryUser = await request(app).post("/user/login").send({
				email: "notCorrect@email.com",
				password: "totallyWRONG",
			});
			expect(secondaryUser.statusCode).toBe(200);

			let firstAllRequest = await request(app)
				.get("/budget/all")
				.set("x-auth-token", token);

			let getBudgetID = await firstAllRequest.body;
			let deleteBudget = await request(app)
				.delete("/budget/delete/" + getBudgetID[0]._id)
				.set("x-auth-token", secondaryUser.body.token);
			let secondAllRequest = await request(app)
				.get("/budget/all")
				.set("x-auth-token", token);

			expect(deleteBudget.statusCode).toBe(500);
			expect(secondAllRequest.body.length).toBe(getBudgetID.length);
		});
	});
});

describe("Transaction CRUD", () => {
	test("GET, /transactions/test", async () => {
		let getRequest = await request(app).get("/transactions/test");
		expect(getRequest.statusCode).toBe(200);
	});
	test("POST, /transactions", async () => {
		let token = await login(correctLogin);
		let budgetID = await request(app)
			.get("/budget/all")
			.set("x-auth-token", token);
		let postRequest = await request(app)
			.post(`/transactions/${budgetID.body[0]._id}/new`)
			.set("x-auth-token", token)
			.send({
				category: "transportation",
				label: "car",
				value: 386,
				frequency: 1,
				amountPaid: 0,
				paidForTheMonth: false,
			});
		let postRequest2 = await request(app)
			.post(`/transactions/${budgetID.body[0]._id}/new`)
			.set("x-auth-token", token)
			.send({
				category: "transportation",
				label: "gas",
				value: 60,
				frequency: 2,
				amountPaid: 0,
				paidForTheMonth: false,
			});
		let postRequest3 = await request(app)
			.post(`/transactions/${budgetID.body[0]._id}/new`)
			.set("x-auth-token", token)
			.send({
				category: "transportation",
				label: "food",
				value: 100,
				frequency: 2,
				amountPaid: 0,
				paidForTheMonth: false,
			});
		expect(postRequest.statusCode).toBe(200);
		expect(postRequest.body.transactions.length).toBe(1);
		expect(postRequest2.body.transactions.length).toBe(2);
		expect(postRequest3.body.transactions.length).toBe(3);
	});

	test("GET /transaction get all user transactions", async () => {
		let token = await login(correctLogin);
		let getRequest = await request(app)
			.get("/transactions/")
			.set("x-auth-token", token);
		expect(getRequest.statusCode).toBe(200);
		expect(getRequest.body.length).toBe(3);
	});
	test("PUT /transactions/edit/:id Edit a transaction", async () => {
		let token = await login(correctLogin);
		let getRequest = await request(app)
			.get("/transactions/")
			.set("x-auth-token", token);

		let transactionID = await getRequest.body[0]._id;
		let putRequest = await request(app)
			.put(`/transactions/edit/${transactionID}/`)
			.set("x-auth-token", token)
			.send({
				category: "entertainment",
				label: "games",
				frequency: 2,
				amountPaid: 0,
				paidForTheMonth: false,
			});

		let getRequestAfter = await request(app)
			.get("/transactions/")
			.set("x-auth-token", token);

		let secondToken = await login(secondaryUser);
		let badAttempt = await request(app)
			.put(`/transactions/edit/${transactionID}/`)
			.set("x-auth-token", secondToken)
			.send({
				category: "NOFUN",
				label: "NOT GAMES",
				value: 100,
				frequency: 4,
				amountPaid: 1,
				paidForTheMonth: true,
			});
		expect(putRequest.statusCode).toBe(200);
		expect(putRequest.body.category).toMatch("entertainment");
		expect(getRequestAfter.statusCode).toBe(200);
		expect(getRequestAfter.body.length).toBe(3);
		expect(badAttempt.statusCode).toBe(400);
		expect(badAttempt.body.msg).toMatch("Incorrect User");
	});

	test("GET /transactions/:id get a transaction via it's ID", async () => {
		let token = await login(correctLogin);
		let idGetRequest = await request(app)
			.get("/transactions/")
			.set("x-auth-token", token);
		let transactionID = await idGetRequest.body[1]._id;
		let getRequest = await request(app)
			.get(`/transactions/${transactionID}`)
			.set("x-auth-token", token);
		expect(getRequest.statusCode).toBe(200);
		expect(getRequest.body[0].category).toMatch("transportation");
	});
	test("DELETE /transactions/:id delete a transaction", async () => {
		let token = await login(correctLogin);
		let secondToken = await login(secondaryUser);
		let idGetRequest = await request(app)
			.get("/transactions/")
			.set("x-auth-token", token);
		let transactionID2 = await idGetRequest.body[1]._id;
		let transactionID = await idGetRequest.body[2]._id;
		console.log(transactionID);
		let deleteRequest = await request(app)
			.delete("/transactions/delete/" + transactionID)
			.set("x-auth-token", token);

		let getAllRequest = await request(app)
			.get("/transactions")
			.set("x-auth-token", token);

		let secondDeleteRequest = await request(app)
			.delete("/transactions/delete/" + transactionID2)
			.set("x-auth-token", secondToken);

		expect(secondDeleteRequest.statusCode).toBe(400);
		expect(deleteRequest.statusCode).toBe(200);
		expect(getAllRequest.statusCode).toBe(200);
		expect(getAllRequest.body.length).toBe(2);
	});
});

describe("Task CRUD", () => {
	test("Test", async () => {
		let getTest = await request(app).get("/task/test");
		expect(getTest.statusCode).toBe(200);
		expect(getTest.text).toMatch("Hello from /Task/test");
	});
	test("Create", async () => {
		let token = await login(correctLogin);
		let postRequest = await request(app)
			.post("/task/new")
			.set("x-auth-token", token)
			.send({
				title: "Work",
				context: "Get that money today sir",
				hidden: false,
			});
		let postRequest2 = await request(app)
			.post("/task/new")
			.set("x-auth-token", token)
			.send({
				title: "Clean",
				context: "Make that house clean sir",
				hidden: false,
			});
		let postRequest3 = await request(app)
			.post("/task/new")
			.set("x-auth-token", token)
			.send({
				title: "Wash Car",
				context: "Make that car very clean sir",
				hidden: false,
			});

		expect(postRequest.statusCode).toBe(200);
		expect(postRequest2.statusCode).toBe(200);
		expect(postRequest3.statusCode).toBe(200);
	});
	test("Read", async () => {
		let token = await login(correctLogin);
		let getRequest = await request(app)
			.get("/task/")
			.set("x-auth-token", token);

		expect(getRequest.body.length).toBe(3);
	});
	test("ReadByID", async () => {
		let token = await login(correctLogin);
		let idRequest = await request(app).get("/task/").set("x-auth-token", token);
		let id = await idRequest.body[0]._id;

		let getIDRequest = await request(app)
			.get("/task/" + id)
			.set("x-auth-token", token);

		expect(getIDRequest.statusCode).toBe(200);
		expect(getIDRequest.body[0].title).toMatch("Work");
	});
	test("Edit", async () => {
		let token = await login(correctLogin);
		let idRequest = await request(app).get("/task/").set("x-auth-token", token);
		let id = await idRequest.body[0]._id;

		let putRequest = await request(app)
			.put("/task/" + id)
			.set("x-auth-token", token)
			.send({
				context: "Changed to something more fitting",
				title: "CHANGED",
				hidden: true,
			});

		console.log(putRequest.body, "BODY");

		expect(putRequest.statusCode).toBe(200);
		expect(putRequest.body.context).toMatch(
			"Changed to something more fitting"
		);
	});
	test("Delete", async () => {
		let token = await login(correctLogin);
		let idRequest = await request(app).get("/task/").set("x-auth-token", token);
		let id = await idRequest.body[0]._id;

		let deleteRequest = await request(app)
			.delete("/task/" + id)
			.set("x-auth-token", token);

		let getRequest = await request(app).get("/task").set("x-auth-token", token);

		expect(deleteRequest.statusCode).toBe(200);
		expect(getRequest.statusCode).toBe(200);
		expect(getRequest.body.length).toBe(2);
	});
});
// describe("Journal CRUD", () => {
// 	test("Test", async () => {
// 		let getTest = await request(app).get("/journal/test");
// 		expect(getTest.statusCode).toBe(200);
// 		expect(getTest.text).toMatch("Hello from /Journal/test");
// 	});
// 	test("Create", async () => {});
// 	test("Read", async () => {});
// 	test("ReadByID", async () => {});
// 	test("Edit", async () => {});
// 	test("Delete", async () => {});
// });
// describe("Calendar CRUD", () => {
// 	test("Test", async () => {
// 		let getTest = await request(app).get("/calendar/test");
// 		expect(getTest.statusCode).toBe(200);
// 		expect(getTest.text).toMatch("Hello from /Calendar/test");
// 	});
// 	test("Create", async () => {});
// 	test("Read", async () => {});
// 	test("ReadByID", async () => {});
// 	test("Edit", async () => {});
// 	test("Delete", async () => {});
// });

// To Do List
// Start and Finish Task, Journal and Calendar test (3)
