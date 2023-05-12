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
afterAll(() => setTimeout(() => process.exit(0), 500));


describe("SERVER REACHABILITY TEST", () => {
  test("GET /", (done) => {
    request(app)
      .get("/")
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        return done();
      });
  });
  test("GET /wrongendpoint", (done) => {
    request(app)
      .get("/wrongendpoint")
      .send()
      .expect(404)
      .then((res) => {
        done();
      })
      .catch(done);
  });

});
