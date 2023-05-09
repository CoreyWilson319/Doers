const app = require("../app");
const request = require("supertest");
const mongoose = require("mongoose");
const config = require("../config/default.json");
const connectDB = require("../config/db");

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
	describe("USER CRUD", () => {
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
