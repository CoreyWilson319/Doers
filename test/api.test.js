const app = require("../app");
const request = require("supertest");
const mongoose = require("mongoose");
const config = require("../config/default.json");
const connectDB = require("../config/db");

let correctLogin = {
	email: config.tempUserEmail,
	password: config.tempUserPassword,
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

	// test("Cannot edit another users budget", async () => {
	// 	let primaryUser = await request(app).post("/user/login").send(correctLogin);

	// 	primaryUser = await primaryUser.body.token;
	// 	let secondaryUser = await request(app)
	// 		.post("/user/login")
	// 		.send({ email: "notCorrect@email.com", password: "totallyWRONG" });
	// 	secondaryUser = await secondaryUser.body.token;
	// 	let allBudgets = await request(app)
	// 		.get("/budget/all")
	// 		.set("x-auth-token", primaryUser);

	// 	let budgetID = await allBudgets.body[0]._id;
	// 	let editBudget = await request(app)
	// 		.put("/budget/edit/" + budgetID)
	// 		.send({ account: "Haha", balance: 1 })
	// 		.set("x-auth-token", secondaryUser);
	// 	expect(editBudget.statusCode).toBe(500);
	// 	// expect(editBudget.body.msg).toMatch("Incorrect User");
	// });
});
// To Do List
// Still need to test budget edit and delete routes(5)
// After finishing Budget go right into transactions
// Start and Finish Task, Journal and Calendar test (3)
