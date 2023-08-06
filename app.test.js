/*
1. If login and password is valid - returns status code 200
2. Response object contains token
3. Response object contains object "user" with object {email: String, subscription: String}

*/

const usersRouter = require("./routes/api/users");
const app = require("./app");
const request = require("supertest");

describe("test login controller", () => {
  test("Valid login data - status code 200", async () => {
    const res = await request(app)
      .post("/users/login")
      .send({ email: "scu02511@omeie.com", password: "AEZAKMI" });

    console.log(res);
    expect(res.statusCode).toBe(200);
  });
});
