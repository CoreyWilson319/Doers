const request = require("supertest");
const app = require("../app");
const baseURL = "localhost:8082/";

describe("Entry Point Test", () => {
	it("Should touch the api", async () => {
		const res = await request(app).get(baseURL);
		expect(res.statusCode).toEqual(200);
	});
});
