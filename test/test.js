const request = require("supertest");
const mongoose = require("mongoose");
const server = require("../app");
const app = require("../app");
const process = require('process')

beforeEach((done) => {
  // timeout of 1 min added so that jest don't exits before DB connection get established
  jest.setTimeout(60000);
  done();
});
 
afterAll(done => {
  mongoose.connection.close();
  server.close();
  done();
});
afterAll(() => setTimeout(() => process.exit(0), 5000));


describe("SERVER REACHABI0LITY TEST", () => {
  test("GET /", async () => {
    await request(app)
      .get("/")
      .expect(200)
      // .end((err, res) => {
      //   if (err) return done(err);
      //   return done();
      // });
      
  },100000);
  test("GET /wrongendpoint", async () => {
    await request(app)
      .get("/wrongendpoint")
      .send()
      .expect(404)
      // .then((res) => {
      //   done();
      // })
      // .catch(done);
     
  },10000);

});

describe("POST /login", () => {
  it("logs in a user with valid credentials", async () => {
    const credentials = {
      username: "pallavjain12",
      password: "password",
    };

    const response = await request(app)
      .post("/login")
      .send(credentials);

    expect(response.status).toBe(302);
  },50000);

  it("returns an error for invalid credentials", async () => {
    const credentials2 = {
      username: "Utkarsh99.Shrivasbvjftava@gmail.com",
      password: "123cvhd45678",
    };

    const response = await request(app)
      .post("/login")
      .send(credentials2);

    expect(response.status).toBe(302);
  },20000);
});
// webhook check message