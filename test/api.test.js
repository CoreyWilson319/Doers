const request = require("supertest");
const app = require("../app");

describe("Entry Point Test", () => {
	it("Should touch the api", async () => {
		const res = await request(app)
			.get("/")
			.set("Content-Type", "application/json")
			.type("json");
		expect(res.statusCode).toEqual(200);
		expect(res.text).toBe("Hello World");
	});
});
