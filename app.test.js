/*
1. If login and password is valid - returns status code 200
2. Response object contains token
3. Response object contains object "user" with object {email: String, subscription: String}

*/

const { login } = require("./controllers/users");

describe("test login controller", () => {
  test("Valid login data - status code 200", () => {
    expect(
      login({ body: { email: "snoop@doggie.dog", password: "AEZAKMI" } })
    ).toBe({});
  });
});
